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

    // Get the CSV analysis result
    const { data: analysisData, error: analysisError } = await supabase
      .from('csv_analysis')
      .select('*')
      .eq('id', csvAnalysisId)
      .single()

    if (analysisError || !analysisData) {
      console.error('Failed to fetch CSV analysis:', analysisError)
      throw new Error('Failed to fetch CSV analysis')
    }

    console.log('Retrieved analysis data:', {
      fileName: analysisData.file_name,
      status: analysisData.analysis_status,
      resultStructure: analysisData.analysis_result ? Object.keys(analysisData.analysis_result) : null
    })

    if (!analysisData.analysis_result?.data || !Array.isArray(analysisData.analysis_result.data)) {
      console.error('Invalid analysis result format:', analysisData.analysis_result)
      throw new Error('Invalid analysis result format')
    }

    // Transform and validate the data
    const inflationData = analysisData.analysis_result.data.map((row: any, index: number) => {
      console.log(`Processing row ${index + 1}:`, row)
      
      // Parse date
      const dateStr = row.date || row.Date
      let date
      try {
        date = new Date(dateStr)
        if (isNaN(date.getTime())) {
          throw new Error(`Invalid date format: ${dateStr}`)
        }
      } catch (e) {
        console.error(`Error parsing date in row ${index + 1}:`, dateStr)
        throw new Error(`Invalid date format in row ${index + 1}: ${dateStr}`)
      }

      // Parse inflation rate
      const rateStr = row.rate || row.Rate || row.inflation_rate || '0'
      const rate = parseFloat(rateStr)
      if (isNaN(rate)) {
        console.error(`Error parsing rate in row ${index + 1}:`, rateStr)
        throw new Error(`Invalid rate format in row ${index + 1}: ${rateStr}`)
      }

      const transformedRow = {
        date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        inflation_rate: rate,
        category: row.category || row.Category || 'CPI',
        region: row.region || row.Region || 'US',
        source: row.source || row.Source || 'CSV Import',
        notes: row.notes || row.Notes || null
      }

      console.log(`Transformed row ${index + 1}:`, transformedRow)
      return transformedRow
    })

    console.log(`Attempting to insert ${inflationData.length} records`)

    // Insert the data in smaller batches to avoid potential size limits
    const BATCH_SIZE = 100
    for (let i = 0; i < inflationData.length; i += BATCH_SIZE) {
      const batch = inflationData.slice(i, i + BATCH_SIZE)
      const { error: insertError } = await supabase
        .from('inflation_data')
        .insert(batch)

      if (insertError) {
        console.error(`Failed to insert batch ${i / BATCH_SIZE + 1}:`, insertError)
        throw new Error(`Failed to insert inflation data batch ${i / BATCH_SIZE + 1}: ${insertError.message}`)
      }
      console.log(`Successfully inserted batch ${i / BATCH_SIZE + 1}`)
    }

    // Update the analysis status
    const { error: updateError } = await supabase
      .from('csv_analysis')
      .update({ analysis_status: 'imported' })
      .eq('id', csvAnalysisId)

    if (updateError) {
      console.error('Error updating analysis status:', updateError)
      throw new Error('Failed to update analysis status')
    }

    console.log('Import completed successfully')

    return new Response(
      JSON.stringify({ 
        message: 'Data imported successfully', 
        recordsImported: inflationData.length 
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