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

    // Basic SQL injection prevention - only allow letters, numbers, underscores
    if (!/^[a-z][a-z0-9_]*$/.test(tableName)) {
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

    console.log('Column stats:', analysis.analysis_result.columnStats)

    // Generate optimal column definitions
    const columnDefinitions = analysis.analysis_result.columnStats
      .map(col => {
        // Handle column names that start with numbers by prefixing with 'year_'
        let columnName = col.column
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, '_')
          .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
        
        // If column name starts with a number, prefix it with 'year_'
        if (/^\d/.test(columnName)) {
          columnName = `year_${columnName}`
        }
          
        // Skip if column name would be empty
        if (!columnName) {
          console.warn('Skipping invalid column name:', col.column)
          return null
        }

        let sqlType = 'text'
        
        // Determine optimal type based on analysis
        if (col.suggestedType === 'date') {
          sqlType = 'timestamp with time zone'
        } else if (col.suggestedType === 'numeric') {
          sqlType = 'numeric'
        }

        // Add NOT NULL if no nulls found in data
        const nullable = col.nonNullCount < col.totalRows ? '' : ' not null'
        
        return `${columnName} ${sqlType}${nullable}`
      })
      .filter(Boolean) // Remove null entries
      .join(',\n    ')

    if (!columnDefinitions) {
      throw new Error('No valid columns found in analysis')
    }

    // Create the complete table schema
    const schema = {
      tableName,
      sql: `create table if not exists ${tableName} (
    id uuid primary key default gen_random_uuid(),
    ${columnDefinitions},
    imported_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add updated_at trigger
create trigger ${tableName}_updated_at
    before update on ${tableName}
    for each row
    execute function update_updated_at_column();`
    }

    console.log('Generated SQL:', schema.sql)

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