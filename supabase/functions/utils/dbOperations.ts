import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

export async function clearExistingData(supabase: any, tableName: string) {
  console.log('DEBUG: Clearing existing data from table...')
  const { error: clearError } = await supabase
    .from(tableName)
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (clearError) {
    console.error('Failed to clear existing data:', clearError)
    throw new Error(`Failed to clear existing data: ${clearError.message}`)
  }
}

export async function insertDataBatch(supabase: any, tableName: string, records: Record<string, any>[], batchSize: number = 100) {
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
}

export async function updateAnalysisStatus(supabase: any, analysisId: string, status: string) {
  console.log('DEBUG: Updating analysis status...')
  const { error: updateError } = await supabase
    .from('csv_analysis')
    .update({ analysis_status: status })
    .eq('id', analysisId)

  if (updateError) {
    console.error('Failed to update analysis status:', updateError)
  }
}