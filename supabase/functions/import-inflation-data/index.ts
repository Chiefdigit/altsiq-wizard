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
    console.log('Received request for CSV analysis ID:', csvAnalysisId)

    if (!csvAnalysisId) {
      return new Response(
        JSON.stringify({ error: 'CSV analysis ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
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
      return new Response(
        JSON.stringify({ error: 'Failed to fetch CSV analysis', details: analysisError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Analysis result:', analysisData.analysis_result)

    if (!analysisData.analysis_result?.data || !Array.isArray(analysisData.analysis_result.data)) {
      console.error('Invalid analysis result format:', analysisData.analysis_result)
      return new Response(
        JSON.stringify({ error: 'Invalid analysis result format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Transform and insert the data
    const inflationData = analysisData.analysis_result.data.map((row: any) => {
      // Parse date string to ensure valid date format
      const dateStr = row.date || row.Date
      let date
      try {
        date = new Date(dateStr)
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date')
        }
      } catch (e) {
        console.error('Error parsing date:', dateStr)
        throw new Error(`Invalid date format: ${dateStr}`)
      }

      // Parse inflation rate to ensure valid number
      const rateStr = row.rate || row.Rate || row.inflation_rate || '0'
      const rate = parseFloat(rateStr)
      if (isNaN(rate)) {
        console.error('Error parsing rate:', rateStr)
        throw new Error(`Invalid rate format: ${rateStr}`)
      }

      return {
        date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        inflation_rate: rate,
        category: row.category || row.Category || 'CPI',
        region: row.region || row.Region || 'US',
        source: row.source || row.Source || 'CSV Import',
        notes: row.notes || row.Notes || null
      }
    })

    console.log('Transformed data:', inflationData)

    const { error: insertError } = await supabase
      .from('inflation_data')
      .insert(inflationData)

    if (insertError) {
      console.error('Failed to insert inflation data:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to insert inflation data', details: insertError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Update the analysis status
    await supabase
      .from('csv_analysis')
      .update({ analysis_status: 'imported' })
      .eq('id', csvAnalysisId)

    return new Response(
      JSON.stringify({ 
        message: 'Data imported successfully', 
        recordsImported: inflationData.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})