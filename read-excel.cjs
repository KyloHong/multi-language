const XLSX = require('xlsx');

console.log('=== au-prod-ib.xlsx ===\n');
const workbook1 = XLSX.readFile('/workspace/au-prod-ib.xlsx');
console.log('Sheet names:', workbook1.SheetNames);

workbook1.SheetNames.forEach(sheetName => {
  console.log(`\n--- Sheet: ${sheetName} ---`);
  const sheet = workbook1.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  // 打印前 20 行
  data.slice(0, 20).forEach((row, index) => {
    console.log(`Row ${index + 1}:`, JSON.stringify(row));
  });
  
  if (data.length > 20) {
    console.log(`... (total ${data.length} rows)`);
  }
});

console.log('\n\n=== au-prod-cp.xlsx ===\n');
const workbook2 = XLSX.readFile('/workspace/au-prod-cp.xlsx');
console.log('Sheet names:', workbook2.SheetNames);

workbook2.SheetNames.forEach(sheetName => {
  console.log(`\n--- Sheet: ${sheetName} ---`);
  const sheet = workbook2.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  // 打印前 20 行
  data.slice(0, 20).forEach((row, index) => {
    console.log(`Row ${index + 1}:`, JSON.stringify(row));
  });
  
  if (data.length > 20) {
    console.log(`... (total ${data.length} rows)`);
  }
});
