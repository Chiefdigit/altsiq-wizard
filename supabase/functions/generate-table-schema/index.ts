import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { csvAnalysisId, tableName } = await req.json()
    console.log('Generating schema for analysis:', csvAnalysisId)
    
    if (!csvAnalysisId || !tableName) {
      throw new Error('CSV analysis ID and table name are required')
    }

    // Validate table name (basic SQL injection prevention)
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(tableName)) {
      throw new Error('Invalid table name. Use only letters, numbers, and underscores, starting with a letter.')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the analysis record
    const { data: analysis, error: analysisError } = await supabase
      .from('csv_analysis')
      .select('*')
      .eq('id', csvAnalysisId)
      .single()

    if (analysisError || !analysis) {
      console.error('Failed to fetch analysis:', analysisError)
      throw new Error('Failed to fetch analysis record')
    }

    if (!analysis.analysis_result) {
      throw new Error('No analysis results found')
    }

    // Generate optimal column definitions
    const columnDefinitions = analysis.analysis_result.columnStats.map(col => {
      let type = 'TEXT'
      let constraints = ''
      
      // Determine optimal type based on analysis
      if (col.suggestedType === 'date') {
        type = 'TIMESTAMP WITH TIME ZONE'
      } else if (col.suggestedType === 'numeric') {
        // Check if we need decimal places
        type = 'NUMERIC'
      }

      // Add NOT NULL if no nulls found in data
      if (col.nonNullCount === col.totalRows) {
        constraints = 'NOT NULL'
      }

      return `${col.column} ${type}${constraints ? ' ' + constraints : ''}`
    })

    // Create the complete table schema
    const schema = {
      tableName,
      sql: `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          ${columnDefinitions.join(',\n          ')},
          imported_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        -- Add updated_at trigger
        CREATE TRIGGER update_${tableName}_updated_at
          BEFORE UPDATE ON ${tableName}
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `
    }

    // Store the generated schema in the analysis record
    const { error: updateError } = await supabase
      .from('csv_analysis')
      .update({
        analysis_result: {
          ...analysis.analysis_result,
          generatedSchema: schema
        }
      })
      .eq('id', csvAnalysisId)

    if (updateError) {
      console.error('Error updating analysis record:', updateError)
      throw updateError
    }

    return new Response(
      JSON.stringify(schema),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 200 
      }
    )

  } catch (error) {
    console.error('Schema generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})