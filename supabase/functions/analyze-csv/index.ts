import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { id } = await req.json()

    // Get the file record
    const { data: fileRecord, error: fileError } = await supabase
      .from('csv_analysis')
      .select('*')
      .eq('id', id)
      .single()

    if (fileError || !fileRecord) {
      throw new Error('File record not found')
    }

    // Download the file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('csv_uploads')
      .download(fileRecord.file_path)

    if (downloadError) {
      throw new Error('Error downloading file')
    }

    // Read the file content
    const text = await fileData.text()
    const lines = text.split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    
    // Basic analysis of the CSV structure
    const analysis = {
      totalRows: lines.length - 1, // Excluding header
      columns: headers.map(header => ({
        name: header,
        sample: lines.slice(1, 4).map(line => line.split(',')[headers.indexOf(header)]?.trim() || ''),
      })),
    }

    // Update the analysis result
    const { error: updateError } = await supabase
      .from('csv_analysis')
      .update({
        analysis_status: 'completed',
        analysis_result: analysis,
      })
      .eq('id', id)

    if (updateError) {
      throw new Error('Error updating analysis results')
    }

    return new Response(
      JSON.stringify({ message: 'Analysis completed', analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Analysis error:', error)

    // Update status to error if we can
    try {
      const { id } = await req.json()
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )
      
      await supabase
        .from('csv_analysis')
        .update({
          analysis_status: 'error',
          analysis_result: { error: error.message },
        })
        .eq('id', id)
    } catch (e) {
      console.error('Error updating error status:', e)
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})