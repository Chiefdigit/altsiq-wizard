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
    const { fileId, analysisId } = await req.json()
    console.log('Starting analysis for file ID:', fileId)

    if (!fileId) {
      throw new Error('File ID is required')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the file data
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('csv_uploads')
      .download(fileId)

    if (fileError) {
      console.error('Failed to fetch file:', fileError)
      throw new Error('Failed to fetch file')
    }

    // Parse CSV content
    const csvText = await fileData.text()
    const lines = csvText.split('\n')
    if (lines.length < 2) {
      throw new Error('CSV file is empty or invalid')
    }

    // Parse headers and clean them
    const headers = lines[0].split(',').map(header => 
      header.trim().toLowerCase().replace(/['"]/g, '')
    )
    console.log('CSV Headers:', headers)

    // Process each data row
    const importBatchId = crypto.randomUUID()
    const dataRows = lines.slice(1)
      .filter(line => line.trim() !== '')
      .map(line => {
        const values = line.split(',').map(v => v.trim().replace(/['"]/g, ''))
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] || null
          return obj
        }, {} as Record<string, string | null>)
      })

    console.log(`Processing ${dataRows.length} rows with import batch ID: ${importBatchId}`)

    // Get sample rows for analysis (first 5 rows)
    const sampleRows = dataRows.slice(0, 5)

    // Calculate column statistics
    const columnStats = headers.map(header => {
      const values = dataRows.map(row => row[header]).filter(v => v !== null)
      return {
        column: header,
        nonNullCount: values.length,
        sampleValues: values.slice(0, 3) // Show first 3 distinct values
      }
    })

    // Insert raw data into inflation_data table
    for (const row of dataRows) {
      const entries = Object.entries(row)
      for (const [columnName, value] of entries) {
        if (value === null || value.trim() === '') continue

        const { error: insertError } = await supabase
          .from('inflation_data')
          .insert({
            raw_date: row[headers[0]] || '', // Assuming first column is always date
            raw_value: value,
            column_name: columnName,
            source_file: fileId,
            import_batch_id: importBatchId
          })

        if (insertError) {
          console.error('Error inserting row:', insertError)
          throw insertError
        }
      }
    }

    // Update analysis record with comprehensive results
    const { error: updateError } = await supabase
      .from('csv_analysis')
      .update({
        analysis_status: 'completed',
        analysis_result: {
          headers,
          rowCount: dataRows.length,
          importBatchId,
          sampleRows,
          columnStats,
          processedAt: new Date().toISOString()
        }
      })
      .eq('id', analysisId)

    if (updateError) {
      console.error('Error updating analysis record:', updateError)
      throw updateError
    }

    return new Response(
      JSON.stringify({ 
        message: 'Analysis completed successfully',
        rowsProcessed: dataRows.length,
        importBatchId,
        sampleData: sampleRows
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
    console.error('Analysis error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})