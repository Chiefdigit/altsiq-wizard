import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        currentValue += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  values.push(currentValue.trim());
  return values;
}

function sanitizeColumnName(header: string): string {
  let cleanHeader = header.trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/^(\d)/, 'col_$1')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
    
  if (!cleanHeader) {
    cleanHeader = 'column_' + Math.random().toString(36).substring(2, 7);
  }
  
  return cleanHeader;
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
    console.log('DEBUG: Raw CSV content:')
    console.log('------------------------')
    console.log(csvText)
    console.log('------------------------')

    const lines = csvText.split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0)

    console.log('DEBUG: Total lines found:', lines.length)

    if (lines.length < 2) {
      throw new Error('CSV file must contain headers and at least one data row')
    }

    const headers = parseCSVLine(lines[0]).map(sanitizeColumnName)
    console.log('DEBUG: CSV Headers (sanitized):', headers)
    console.log('DEBUG: Expected columns for performance_hedgefunds:', [
      'hedge_fund_name', 'jan_24', 'feb_24', 'mar_24', 'apr_24', 'may_24',
      'jun_24', 'jul_24', 'aug_24', 'sep_24', 'oct_24', 'nov_24', 'ytd_2024'
    ])

    const uniqueHeaders = new Set(headers)
    if (uniqueHeaders.size !== headers.length) {
      throw new Error('Duplicate column names detected after sanitization')
    }

    const records = lines.slice(1)
      .map((line, index) => {
        const values = parseCSVLine(line)
        console.log(`\nDEBUG: Processing row ${index + 1}/${lines.length - 1}`)
        console.log('DEBUG: Raw values:', values)
        
        if (values.length !== headers.length) {
          console.warn(`Skipping row ${index + 1}: column count mismatch`)
          return null
        }
        
        const record: Record<string, any> = {}
        
        headers.forEach((header, i) => {
          let value = values[i]?.trim() || null
          
          if (value === '') {
            console.log(`*************************** EMPTY VALUE FOUND in row ${index + 1}, column "${header}" ***************************`)
            value = null
          }
          
          if (value !== null && !isNaN(Number(value.replace('%', '')))) {
            value = value.endsWith('%') 
              ? Number(value.replace('%', '')) / 100 
              : Number(value)
          }
          
          record[header] = value
          if (value === null) {
            console.log(`DEBUG: Null value in column "${header}" for row ${index + 1}`)
          }
        })

        // Validate required fields based on table name
        if (tableName === 'performance_hedgefunds') {
          if (!record.hedge_fund_name) {
            console.log(`*************************** MISSING HEDGE FUND NAME in row ${index + 1} ***************************`)
            console.log('DEBUG: Full record:', record)
            return null
          }
        }

        return record
      })
      .filter(Boolean)

    console.log('\nDEBUG: Final records to import:', records)
    if (records.length > 0) {
      console.log('DEBUG: Sample record:', records[0])
    }

    if (records.length === 0) {
      throw new Error('No valid records to import')
    }

    // Clear existing data
    console.log('DEBUG: Clearing existing data from table...')
    const { error: clearError } = await supabase
      .from(tableName)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (clearError) {
      console.error('Failed to clear existing data:', clearError)
      throw new Error(`Failed to clear existing data: ${clearError.message}`)
    }

    // Insert records in batches
    const batchSize = 100
    console.log(`DEBUG: Will insert records in batches of ${batchSize}`)
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      console.log(`DEBUG: Inserting batch ${i / batchSize + 1} of ${Math.ceil(records.length / batchSize)}`)
      console.log('DEBUG: First record in batch:', batch[0])
      
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(batch)

      if (insertError) {
        console.error('Failed to insert batch:', insertError)
        throw new Error(`Failed to insert batch: ${insertError.message}`)
      }
      console.log(`Successfully inserted batch ${i / batchSize + 1}`)
    }

    // Update analysis status
    console.log('DEBUG: Updating analysis status...')
    const { error: updateError } = await supabase
      .from('csv_analysis')
      .update({ analysis_status: 'imported' })
      .eq('id', csvAnalysisId)

    if (updateError) {
      console.error('Failed to update analysis status:', updateError)
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