import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { parseCSVLine, sanitizeColumnName, validateRecord } from '../utils/csvParser.ts'
import { processCSVData, parseCSVContent } from '../utils/dataTransformer.ts'
import { clearExistingData, insertDataBatch, updateAnalysisStatus } from '../utils/dbOperations.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { csvAnalysisId, tableName } = await req.json()
    console.log('DEBUG: Starting import process')
    console.log('DEBUG: Analysis ID:', csvAnalysisId)
    console.log('DEBUG: Target table:', tableName)
    
    if (!csvAnalysisId || !tableName) {
      throw new Error('CSV analysis ID and table name are required')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('DEBUG: Fetching analysis record...')
    const { data: analysis, error: analysisError } = await supabase
      .from('csv_analysis')
      .select('*')
      .eq('id', csvAnalysisId)
      .single()

    if (analysisError || !analysis) {
      console.error('Failed to fetch analysis:', analysisError)
      throw new Error('Failed to fetch analysis record')
    }

    console.log('DEBUG: Downloading CSV file...')
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('csv_uploads')
      .download(analysis.file_path)

    if (fileError) {
      console.error('Failed to fetch file:', fileError)
      throw new Error('Failed to fetch file')
    }

    const csvText = await fileData.text()
    console.log('\n\nDEBUG: COMPLETE CSV CONTENT:')
    console.log('============================')
    console.log(csvText)
    console.log('============================\n\n')

    const lines = parseCSVContent(csvText)
    console.log('DEBUG: Total lines found:', lines.length)

    if (lines.length < 2) {
      throw new Error('CSV file must contain headers and at least one data row')
    }

    const headers = parseCSVLine(lines[0]).map(sanitizeColumnName)
    console.log('DEBUG: CSV Headers (sanitized):', headers)

    const uniqueHeaders = new Set(headers)
    if (uniqueHeaders.size !== headers.length) {
      throw new Error('Duplicate column names detected after sanitization')
    }

    const records = processCSVData(lines, headers)
      .filter(record => validateRecord(record, tableName))

    if (records.length === 0) {
      throw new Error('No valid records to import')
    }

    await clearExistingData(supabase, tableName)
    await insertDataBatch(supabase, tableName, records)
    await updateAnalysisStatus(supabase, csvAnalysisId, 'imported')

    return new Response(
      JSON.stringify({ 
        message: `Successfully imported ${records.length} records`,
        recordCount: records.length
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
    console.error('Import error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})