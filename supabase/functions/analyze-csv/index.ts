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
    const { fileId } = await req.json()
    console.log('Starting analysis for file ID:', fileId)

    if (!fileId) {
      throw new Error('File ID is required')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the file data
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('csv_uploads')
      .download(fileId)

    if (fileError) {
      console.error('Failed to fetch file:', fileError)
      throw new Error('Failed to fetch file')
    }

    // Parse CSV content
    const csvText = await fileData.text()
    const lines = csvText.split('\n')
    if (lines.length < 2) {
      throw new Error('CSV file is empty or invalid')
    }

    // Parse headers (first line) and clean them
    const headers = lines[0].split(',').map(header => 
      header.trim().toLowerCase().replace(/['"]/g, '')
    )
    console.log('CSV Headers:', headers)

    // More flexible column detection
    const dateColumnIndex = headers.findIndex(h => 
      h.includes('date') || 
      h.includes('period') || 
      h.includes('time')
    )
    
    const rateColumnIndex = headers.findIndex(h => 
      h.includes('rate') || 
      h.includes('inflation') || 
      h.includes('value') || 
      h.includes('cpi') ||
      h.includes('percentage') ||
      h.includes('change')
    )

    console.log('Date column index:', dateColumnIndex, 'Rate column index:', rateColumnIndex)

    if (dateColumnIndex === -1 || rateColumnIndex === -1) {
      console.error('Required columns not found. Headers:', headers)
      throw new Error('CSV must contain date and rate/inflation columns. Found headers: ' + headers.join(', '))
    }

    // Process data rows
    const data = lines.slice(1)
      .filter(line => line.trim() !== '') // Skip empty lines
      .map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/['"]/g, ''))
        
        // Validate and transform date
        let dateStr = values[dateColumnIndex]
        if (!dateStr) {
          console.warn(`Empty date in row ${index + 1}, skipping`)
          return null
        }

        // Try to parse and standardize the date format
        let date: Date | null = null
        try {
          // First try parsing as ISO date
          date = new Date(dateStr)
          if (isNaN(date.getTime())) {
            // Try parsing MM/DD/YYYY or DD/MM/YYYY format
            const parts = dateStr.split(/[-/]/)
            if (parts.length === 3) {
              // Assume American format MM/DD/YYYY if month ≤ 12
              const month = parseInt(parts[0])
              if (month <= 12) {
                date = new Date(
                  parseInt(parts[2]), // year
                  month - 1, // month (0-based)
                  parseInt(parts[1]) // day
                )
              } else {
                // Try European format DD/MM/YYYY
                date = new Date(
                  parseInt(parts[2]), // year
                  parseInt(parts[1]) - 1, // month (0-based)
                  parseInt(parts[0]) // day
                )
              }
            }
          }
        } catch (e) {
          console.warn(`Invalid date format in row ${index + 1}: ${dateStr}`)
          return null
        }

        if (!date || isNaN(date.getTime())) {
          console.warn(`Could not parse date in row ${index + 1}: ${dateStr}`)
          return null
        }

        // Transform to YYYY-MM-DD format
        const formattedDate = date.toISOString().split('T')[0]

        // Parse and validate rate
        const rateStr = values[rateColumnIndex]
        const rate = parseFloat(rateStr)
        if (isNaN(rate)) {
          console.warn(`Invalid rate in row ${index + 1}: ${rateStr}`)
          return null
        }

        return {
          date: formattedDate,
          rate: rate,
          category: values[headers.indexOf('category')] || 'CPI',
          region: values[headers.indexOf('region')] || 'US',
          source: values[headers.indexOf('source')] || 'CSV Import',
          notes: values[headers.indexOf('notes')] || null
        }
      })
      .filter(row => row !== null) // Remove invalid rows

    if (data.length === 0) {
      throw new Error('No valid data rows found in CSV')
    }

    console.log(`Successfully processed ${data.length} valid rows`)

    // Update analysis record
    const { error: updateError } = await supabase
      .from('csv_analysis')
      .update({
        analysis_status: 'completed',
        analysis_result: {
          headers,
          data,
          totalRows: data.length,
          processedAt: new Date().toISOString()
        }
      })
      .eq('file_path', fileId)

    if (updateError) {
      console.error('Error updating analysis record:', updateError)
      throw new Error('Failed to update analysis record')
    }

    return new Response(
      JSON.stringify({ 
        message: 'Analysis completed successfully',
        rowsProcessed: data.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Analysis error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})