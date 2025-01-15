export function processCSVData(lines: string[], headers: string[]): Record<string, any>[] {
  return lines.slice(1)
    .map((line, index) => {
      const values = parseCSVLine(line);
      console.log(`\nRecord ${index + 1}/${lines.length - 1}:`)
      console.log('Raw values:', values)
      
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
        console.log(`Column "${header}": ${value === null ? '*************************** NULL ***************************' : value}`)
      })

      return record
    })
    .filter(Boolean)
}

export function parseCSVContent(csvText: string): string[] {
  return csvText.split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
}