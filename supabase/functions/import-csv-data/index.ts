import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { parse } from 'https://deno.land/std@0.181.0/csv/parse.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { csvAnalysisId, tableName } = await req.json()

    if (!csvAnalysisId || !tableName) {
      throw new Error('Missing required parameters')
    }

    console.log(`Starting import for analysis ${csvAnalysisId} into table ${tableName}`)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the CSV file data
    const { data: analysis } = await supabase
      .from('csv_analysis')
      .select('*')
      .eq('id', csvAnalysisId)
      .single()

    if (!analysis) {
      throw new Error('Analysis not found')
    }

    console.log('Analysis found:', analysis.file_name)

    // Download the CSV file from storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('csv_uploads')
      .download(analysis.file_path)

    if (downloadError) {
      throw new Error(`Failed to download CSV: ${downloadError.message}`)
    }

    // Parse CSV content
    const text = await fileData.text()
    const rows = parse(text, { skipFirstRow: true })
    
    // Get column names from the analysis result
    const columns = analysis.analysis_result.columnStats.map(col => 
      col.column.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/^_+|_+$/g, '')
    ).filter(Boolean)

    console.log('Columns:', columns)

    // Prepare data for insertion with validation
    const records = rows.map((row, index) => {
      const record: Record<string, any> = {}
      let hasRequiredFields = true

      columns.forEach((col, colIndex) => {
        const value = row[colIndex]
        // Convert empty strings to null
        record[col] = value?.trim() === '' ? null : value

        // For inflation_rates table, ensure required fields are present
        if (tableName === 'inflation_rates' && 
            (col === 'country_name' || col === 'country_code') && 
            !record[col]) {
          console.log(`Row ${index + 2}: Missing required field ${col}`)
          hasRequiredFields = false
        }
      })

      return hasRequiredFields ? record : null
    }).filter(Boolean) // Remove invalid records

    if (records.length === 0) {
      throw new Error('No valid records to import')
    }

    console.log(`Prepared ${records.length} valid records for import`)

    // Insert data in batches of 1000 rows
    const batchSize = 1000
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(batch)

      if (insertError) {
        console.error('Insert error:', insertError)
        throw new Error(`Failed to insert batch: ${insertError.message}`)
      }

      console.log(`Imported rows ${i + 1} to ${Math.min(i + batchSize, records.length)}`)
    }

    // Update analysis status
    await supabase
      .from('csv_analysis')
      .update({ analysis_status: 'imported' })
      .eq('id', csvAnalysisId)

    return new Response(
      JSON.stringify({ 
        message: 'Data imported successfully',
        rowCount: records.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Import error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})