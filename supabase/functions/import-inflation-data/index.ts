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
      return new Response(
        JSON.stringify({ error: 'Failed to fetch CSV analysis', details: analysisError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const analysisResult = analysisData.analysis_result

    if (!analysisResult || !Array.isArray(analysisResult.data)) {
      return new Response(
        JSON.stringify({ error: 'Invalid analysis result format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Transform and insert the data
    const inflationData = analysisResult.data.map((row: any) => ({
      date: new Date(row.Date || row.date),
      inflation_rate: parseFloat(row.Rate || row.rate || row.inflation_rate || 0),
      category: row.Category || row.category || 'CPI',
      region: row.Region || row.region || 'US',
      source: row.Source || row.source || 'CSV Import',
      notes: row.Notes || row.notes || null
    }))

    const { error: insertError } = await supabase
      .from('inflation_data')
      .insert(inflationData)

    if (insertError) {
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
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})