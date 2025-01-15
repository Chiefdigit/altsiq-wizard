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
      values.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  values.push(currentValue);
  return values.map(v => v.trim());
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { csvAnalysisId, tableName } = await req.json()
    console.log('Starting import for analysis ID:', csvAnalysisId)
    console.log('Target table:', tableName)
    
    if (!csvAnalysisId) {
      throw new Error('CSV analysis ID is required')
    }
    
    if (!tableName) {
      throw new Error('Table name is required')
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(tableName)) {
      throw new Error('Invalid table name. Use only letters, numbers, and underscores, starting with a letter.')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Fetching analysis record...')
    const { data: analysis, error: analysisError } = await supabase
      .from('csv_analysis')
      .select('*')
      .eq('id', csvAnalysisId)
      .single()

    if (analysisError || !analysis) {
      console.error('Failed to fetch analysis:', analysisError)
      throw new Error('Failed to fetch analysis record')
    }
    console.log('Analysis record found:', analysis.file_path)

    console.log('Downloading CSV file...')
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('csv_uploads')
      .download(analysis.file_path)

    if (fileError) {
      console.error('Failed to fetch file:', fileError)
      throw new Error('Failed to fetch file')
    }
    console.log('File downloaded successfully')

    const csvText = await fileData.text()
    const lines = csvText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    if (lines.length < 2) {
      throw new Error('CSV file must contain headers and at least one data row')
    }

    console.log(`Processing CSV with ${lines.length} lines (including header)`)

    const headers = parseCSVLine(lines[0])
    console.log('Parsed headers:', headers)
    
    const columnMap = headers.map(header => {
      let columnName = header
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/^_+|_+$/g, '')
      
      // Special handling for fund_name column to preserve it exactly as is
      if (columnName === 'fund_name') {
        return 'fund_name';
      }
      
      if (/^\d+$/.test(columnName)) {
        columnName = `year_${columnName}`
      }
      
      return columnName
    })

    console.log('Mapped columns:', columnMap)

    const cleanNumericValue = (value: string): number | null => {
      if (!value || value.trim() === '') return null;
      
      // Remove any percentage signs and convert to decimal
      if (value.endsWith('%')) {
        const numericValue = parseFloat(value.replace('%', '')) / 100;
        return isNaN(numericValue) ? null : numericValue;
      }
      
      const numericValue = parseFloat(value);
      return isNaN(numericValue) ? null : numericValue;
    };

    const records = lines.slice(1).map((line, index) => {
      const values = parseCSVLine(line)
      console.log(`Row ${index + 1} values:`, values)
      
      const record: Record<string, any> = {}

      columnMap.forEach((col, colIndex) => {
        if (!col) return;
        
        const value = values[colIndex]?.trim() || null;
        
        // Special handling for fund_name to preserve it exactly
        if (col === 'fund_name') {
          record[col] = value;
          console.log(`Fund name for row ${index + 1}:`, value);
        } else {
          record[col] = cleanNumericValue(value);
        }
      })

      console.log(`Processed record for row ${index + 1}:`, record);
      return record;
    })

    console.log(`Prepared ${records.length} records for import`)
    console.log('Sample record:', records[0])

    if (records.length === 0) {
      throw new Error('No valid records to import')
    }

    const batchSize = 100
    console.log(`Will insert records in batches of ${batchSize}`)
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      console.log(`Inserting batch ${i / batchSize + 1} of ${Math.ceil(records.length / batchSize)}`)
      console.log('First record in batch:', batch[0])
      
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(batch)

      if (insertError) {
        console.error('Failed to insert batch:', insertError)
        throw new Error(`Failed to insert batch: ${insertError.message}`)
      }
      console.log(`Successfully inserted batch ${i / batchSize + 1}`)
    }

    console.log('Updating analysis status...')
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