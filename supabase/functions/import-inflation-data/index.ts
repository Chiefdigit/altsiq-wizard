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
    const { csvAnalysisId } = await req.json()
    console.log('Starting import for CSV analysis ID:', csvAnalysisId)

    if (!csvAnalysisId) {
      throw new Error('CSV analysis ID is required')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the analysis record to find the import batch ID
    const { data: analysis, error: analysisError } = await supabase
      .from('csv_analysis')
      .select('*')
      .eq('id', csvAnalysisId)
      .single()

    if (analysisError || !analysis) {
      console.error('Failed to fetch analysis:', analysisError)
      throw new Error('Failed to fetch analysis record')
    }

    const importBatchId = analysis.analysis_result.importBatchId

    // Get all raw data for this import batch
    const { data: rawData, error: rawDataError } = await supabase
      .from('inflation_data')
      .select('*')
      .eq('import_batch_id', importBatchId)
      .eq('validation_status', 'pending')

    if (rawDataError) {
      console.error('Failed to fetch raw data:', rawDataError)
      throw new Error('Failed to fetch raw data')
    }

    console.log(`Processing ${rawData.length} records for import batch ${importBatchId}`)

    // Process each record
    let processedCount = 0
    for (const record of rawData) {
      try {
        // Parse date
        const dateValue = new Date(record.raw_date)
        if (isNaN(dateValue.getTime())) {
          throw new Error(`Invalid date format: ${record.raw_date}`)
        }

        // Parse numeric value
        const numericValue = parseFloat(record.raw_value.replace(/[^0-9.-]/g, ''))
        if (isNaN(numericValue)) {
          throw new Error(`Invalid numeric value: ${record.raw_value}`)
        }

        // Update record with processed values
        const { error: updateError } = await supabase
          .from('inflation_data')
          .update({
            processed_date: dateValue.toISOString().split('T')[0],
            processed_value: numericValue,
            validation_status: 'validated',
            validation_notes: 'Successfully processed'
          })
          .eq('id', record.id)

        if (updateError) {
          throw updateError
        }

        processedCount++
      } catch (error) {
        console.error(`Error processing record ${record.id}:`, error)
        
        // Mark record as failed
        await supabase
          .from('inflation_data')
          .update({
            validation_status: 'failed',
            validation_notes: error.message
          })
          .eq('id', record.id)
      }
    }

    // Update analysis status
    const { error: updateError } = await supabase
      .from('csv_analysis')
      .update({ analysis_status: 'imported' })
      .eq('id', csvAnalysisId)

    if (updateError) {
      console.error('Error updating analysis status:', updateError)
      throw new Error('Failed to update analysis status')
    }

    return new Response(
      JSON.stringify({ 
        message: 'Import completed successfully',
        recordsProcessed: rawData.length,
        recordsValidated: processedCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Import error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})