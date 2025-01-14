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
    
    if (!csvAnalysisId) {
      throw new Error('CSV analysis ID is required')
    }
    
    if (!tableName) {
      throw new Error('Table name is required')
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

    // Create SQL for the new table based on analysis
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ${analysis.analysis_result.columnStats.map(col => {
          let type = 'TEXT'
          if (col.suggestedType === 'date') {
            type = 'TIMESTAMP'
          } else if (col.suggestedType === 'numeric') {
            type = 'NUMERIC'
          }
          return `${col.column} ${type}`
        }).join(',\n        ')},
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `

    console.log('Creating table with SQL:', createTableSQL)

    // Execute the create table SQL
    const { error: createError } = await supabase
      .rpc('execute_sql', { sql_query: createTableSQL })

    if (createError) {
      console.error('Error creating table:', createError)
      throw new Error(`Failed to create table: ${createError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Table structure created successfully',
        tableName,
        sql: createTableSQL
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 200 
      }
    )

  } catch (error) {
    console.error('Import error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})