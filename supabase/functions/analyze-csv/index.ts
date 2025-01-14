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
    console.log('Starting CSV analysis...')
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { id } = await req.json()
    console.log('Analyzing CSV file with ID:', id)

    // Get the file record
    const { data: fileRecord, error: fileError } = await supabase
      .from('csv_analysis')
      .select('*')
      .eq('id', id)
      .single()

    if (fileError || !fileRecord) {
      console.error('File record not found:', fileError)
      throw new Error('File record not found')
    }

    console.log('Retrieved file record:', fileRecord.file_name)

    // Download the file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('csv_uploads')
      .download(fileRecord.file_path)

    if (downloadError) {
      console.error('Error downloading file:', downloadError)
      throw new Error('Error downloading file')
    }

    // Read the file content
    const text = await fileData.text()
    const lines = text.split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    
    console.log('CSV Headers:', headers)

    // Transform only the data rows (excluding header)
    const data = lines.slice(1)
      .filter(line => line.trim()) // Remove empty lines
      .map((line, index) => {
        const values = line.split(',').map(v => v.trim())
        const row: Record<string, string> = {}
        headers.forEach((header, i) => {
          row[header] = values[i] || ''
        })
        
        // Validate required fields
        if (!row.date || !row.rate) {
          console.warn(`Warning: Row ${index + 2} missing required fields:`, row)
        }
        
        return row
      })

    console.log(`Processed ${data.length} rows of data`)

    // Create a more focused analysis result
    const analysis = {
      totalRows: data.length,
      headers: headers,
      data: data, // This will be the actual data rows
    }

    console.log('Analysis completed, updating record...')

    // Update the analysis result
    const { error: updateError } = await supabase
      .from('csv_analysis')
      .update({
        analysis_status: 'completed',
        analysis_result: analysis,
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error updating analysis results:', updateError)
      throw new Error('Error updating analysis results')
    }

    console.log('Analysis successfully saved')

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