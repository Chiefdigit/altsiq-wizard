import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { parseCSVLine, sanitizeColumnName } from '../utils/csvParser.ts'
import { parseCSVContent } from '../utils/dataTransformer.ts'

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

    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('csv_uploads')
      .download(fileId)

    if (fileError) {
      console.error('Failed to fetch file:', fileError)
      throw new Error('Failed to fetch file')
    }

    const csvText = await fileData.text()
    const lines = parseCSVContent(csvText)

    console.log('Total non-empty lines found:', lines.length)

    if (lines.length < 2) {
      throw new Error('CSV file is empty or invalid')
    }

    const headers = parseCSVLine(lines[0]).map(sanitizeColumnName)
    console.log('CSV Headers:', headers)

    const dataRows = lines.slice(1)
      .filter(line => {
        const values = parseCSVLine(line)
        return values.some(v => v.trim().length > 0)
      })
      .map(line => {
        const values = parseCSVLine(line)
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index]?.trim() || null
          return obj
        }, {} as Record<string, string | null>)
      })

    console.log('Valid data rows found:', dataRows.length)

    const columnStats = headers.map(header => {
      const values = dataRows.map(row => row[header]).filter(v => v !== null)
      const numericValues = values.map(v => parseFloat(v as string)).filter(n => !isNaN(n))
      const isNumeric = numericValues.length > 0 && numericValues.length === values.length
      const dateValues = values.map(v => new Date(v as string)).filter(d => !isNaN(d.getTime()))
      const isDate = dateValues.length > 0 && dateValues.length === values.length

      return {
        column: header,
        nonNullCount: values.length,
        suggestedType: isDate ? 'date' : isNumeric ? 'numeric' : 'text',
        totalRows: dataRows.length
      }
    })

    const { error: updateError } = await supabase
      .from('csv_analysis')
      .update({
        analysis_status: 'completed',
        analysis_result: {
          headers,
          rowCount: dataRows.length,
          sampleRows: dataRows,
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
        rowCount: dataRows.length,
        headers,
        columnStats,
        sampleRows: dataRows
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