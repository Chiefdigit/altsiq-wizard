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
    const { csvAnalysisId, tableName } = await req.json()
    
    if (!csvAnalysisId) {
      throw new Error('CSV analysis ID is required')
    }
    
    if (!tableName) {
      throw new Error('Table name is required')
    }

    // Validate table name (basic SQL injection prevention)
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(tableName)) {
      throw new Error('Invalid table name. Use only letters, numbers, and underscores, starting with a letter.')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the analysis record with the file path
    const { data: analysis, error: analysisError } = await supabase
      .from('csv_analysis')
      .select('*')
      .eq('id', csvAnalysisId)
      .single()

    if (analysisError || !analysis) {
      console.error('Failed to fetch analysis:', analysisError)
      throw new Error('Failed to fetch analysis record')
    }

    // Download the CSV file
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('csv_uploads')
      .download(analysis.file_path)

    if (fileError) {
      console.error('Failed to fetch file:', fileError)
      throw new Error('Failed to fetch file')
    }

    const csvText = await fileData.text()
    const lines = csvText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    if (lines.length < 2) {
      throw new Error('CSV file must contain headers and at least one data row')
    }

    console.log(`Processing CSV with ${lines.length} lines (including header)`)

    // Process headers
    const headers = lines[0].split(',').map(header => header.trim().replace(/['"]/g, ''))
    
    // Map CSV headers to database column names for can_hf_performance table
    const columnMap = headers.map(header => {
      // Convert header to snake_case and handle special cases
      let columnName = header.toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
      
      // Special handling for monthly columns and YTD
      if (columnName.match(/^jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec$/)) {
        columnName = `2024___${columnName}`
      } else if (columnName === 'ytd') {
        columnName = '2024_ytd'
      } else if (columnName === 'fund_name' || columnName === 'fundname') {
        columnName = 'fund_name'
      }
      
      return columnName
    })

    console.log('Mapped columns:', columnMap)

    const cleanNumericValue = (value: string): number | null => {
      if (!value || value === '') return null;
      
      // Remove percentage sign and convert to decimal
      if (value.endsWith('%')) {
        const numericValue = parseFloat(value.replace('%', '')) / 100;
        return isNaN(numericValue) ? null : numericValue;
      }
      
      const numericValue = parseFloat(value);
      return isNaN(numericValue) ? null : numericValue;
    };

    // Process data rows
    const records = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/['"]/g, ''))
      const record: Record<string, any> = {}

      columnMap.forEach((col, colIndex) => {
        if (!col) return; // Skip empty column names
        
        let value = values[colIndex]
        
        // Handle numeric columns (monthly returns and YTD)
        if (col.startsWith('2024___') || col === '2024_ytd') {
          value = cleanNumericValue(value)
        } else {
          value = value === '' ? null : value
        }
        
        record[col] = value
      })

      return record
    }).filter(record => Object.keys(record).length > 0) // Remove empty records

    console.log(`Prepared ${records.length} valid records for import`)
    console.log('First 3 records:', JSON.stringify(records.slice(0, 3), null, 2))
    console.log('Last 3 records:', JSON.stringify(records.slice(-3), null, 2))

    if (records.length === 0) {
      throw new Error('No valid records to import')
    }

    // Insert records in batches
    const batchSize = 100
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      console.log(`Inserting batch ${i / batchSize + 1} of ${Math.ceil(records.length / batchSize)}`)
      
      const { error: insertError } = await supabase
        .from('can_hf_performance')  // Use the correct table name
        .insert(batch)

      if (insertError) {
        console.error('Failed to insert batch:', insertError)
        throw new Error(`Failed to insert batch: ${insertError.message}`)
      }
    }

    // Update analysis status
    const { error: updateError } = await supabase
      .from('csv_analysis')
      .update({ analysis_status: 'imported' })
      .eq('id', csvAnalysisId)

    if (updateError) {
      console.error('Failed to update analysis status:', updateError)
      // Don't throw here as the import was successful
    }

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