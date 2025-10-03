export function generateCSV(data: any[], filename: string): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  // UTF-8 BOM ile Türkçe karakter desteği
  const BOM = '\uFEFF';
  return `data:text/csv;charset=utf-8,${BOM}${encodeURIComponent(csvContent)}`;
}

export function downloadCSV(data: any[], filename: string) {
  const csv = generateCSV(data, filename);
  const link = document.createElement('a');
  link.href = csv;
  link.download = `${filename}.csv`;
  link.click();
}
