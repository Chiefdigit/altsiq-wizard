import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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

    // Get the analysis data
    const { data: analysis, error: analysisError } = await supabase
      .from('csv_analysis')
      .select('*')
      .eq('id', csvAnalysisId)
      .single()

    if (analysisError || !analysis) {
      console.error('Analysis fetch error:', analysisError)
      throw new Error(`Analysis not found: ${analysisError?.message}`)
    }

    console.log('Analysis found:', analysis.file_name)

    // Validate analysis result structure
    if (!analysis.analysis_result?.columnStats || !analysis.analysis_result?.sampleRows) {
      throw new Error('Invalid analysis result structure')
    }

    // Get column names from the analysis result
    const columns = analysis.analysis_result.columnStats.map(col => 
      col.column.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/^_+|_+$/g, '')
    ).filter(Boolean)

    console.log('Columns:', columns)

    if (columns.length === 0) {
      throw new Error('No valid columns found in analysis')
    }

    // Download the CSV file to get all rows
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('csv_uploads')
      .download(analysis.file_path)

    if (downloadError || !fileData) {
      console.error('Download error:', downloadError)
      throw new Error(`Failed to download CSV: ${downloadError?.message}`)
    }

    // Parse CSV content using the file content
    const text = await fileData.text()
    const lines = text.split('\n')
      .filter(line => line.trim() !== '') // Remove empty lines
      .slice(1) // Skip header row

    console.log(`Processing ${lines.length} data rows`)

    // Helper function to clean numeric values
    const cleanNumericValue = (value: string): number | null => {
      if (!value || value.trim() === '') return null;
      // Remove % symbol and any other non-numeric characters except . and -
      const cleaned = value.replace('%', '').trim();
      const num = parseFloat(cleaned);
      return isNaN(num) ? null : num;
    };

    // Process each line into a record
    const records = lines.map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/['"]/g, ''))
      const record: Record<string, any> = {}
      let hasRequiredFields = true

      columns.forEach((col, colIndex) => {
        let value = values[colIndex]
        
        // Handle numeric values
        if (analysis.analysis_result.columnStats[colIndex].suggestedType === 'numeric') {
          value = cleanNumericValue(value);
        } else {
          // Convert empty strings to null for text fields
          value = (value === '' || value === undefined) ? null : value
        }
        
        record[col] = value

        // For required fields, ensure they are present
        if ((col === 'country_name' || col === 'country_code') && !value) {
          console.log(`Row ${index + 2}: Missing required field ${col}`)
          hasRequiredFields = false
        }
      })

      if (!hasRequiredFields) {
        console.log(`Skipping row ${index + 2} due to missing required fields`)
        return null
      }

      return record
    }).filter(Boolean) // Remove invalid records

    console.log(`Prepared ${records.length} valid records for import`)

    if (records.length === 0) {
      throw new Error('No valid records to import')
    }

    // Insert data in batches of 1000 rows
    const batchSize = 1000
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      console.log(`Importing batch ${Math.floor(i/batchSize) + 1}, size: ${batch.length}`)
      
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(batch)

      if (insertError) {
        console.error('Insert error:', insertError)
        throw new Error(`Failed to insert batch: ${insertError.message}`)
      }

      console.log(`Successfully imported batch ${Math.floor(i/batchSize) + 1}`)
    }

    // Update analysis status
    const { error: updateError } = await supabase
      .from('csv_analysis')
      .update({ analysis_status: 'imported' })
      .eq('id', csvAnalysisId)

    if (updateError) {
      console.error('Status update error:', updateError)
      // Don't throw here as the import was successful
    }

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