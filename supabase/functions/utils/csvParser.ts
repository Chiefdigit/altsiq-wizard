export function parseCSVLine(line: string): string[] {
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

export function sanitizeColumnName(header: string): string {
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

export function validateRecord(record: Record<string, any>, tableName: string): boolean {
  if (tableName === 'performance_hedgefunds') {
    return !!record.hedge_fund_name;
  }
  return true;
}