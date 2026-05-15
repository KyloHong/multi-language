const XLSX = require('xlsx');

console.log('=== au-prod-ib.xlsx 完整内容 ===\n');
const workbook1 = XLSX.readFile('/workspace/au-prod-ib.xlsx');
const sheet1 = workbook1.Sheets['Sheet1'];
// 使用 header: 1 获取原始数组格式
const data1 = XLSX.utils.sheet_to_json(sheet1, { header: 1 });

console.log('总行数:', data1.length);

// 打印表头
console.log('\n表头:', data1[0]);

// 打印数据行
console.log('\n数据 (前30行):');
data1.slice(1, 31).forEach((row, index) => {
  if (row && row.length > 0) {
    console.log(`\n${index + 1}. key: ${row[0]}`);
    console.log(`   team: ${row[1]}`);
    console.log(`   version: ${row[2]}`);
    console.log(`   en_英文: ${row[4]}`);
    console.log(`   zh-CN_简体中文: ${row[27]}`);
  }
});

console.log('\n\n=== au-prod-cp.xlsx 完整内容 ===\n');
const workbook2 = XLSX.readFile('/workspace/au-prod-cp.xlsx');
const sheet2 = workbook2.Sheets['Sheet1'];
const data2 = XLSX.utils.sheet_to_json(sheet2, { header: 1 });

console.log('总行数:', data2.length);
console.log('\n表头:', data2[0]);

console.log('\n数据 (前30行):');
data2.slice(1, 31).forEach((row, index) => {
  if (row && row.length > 0) {
    console.log(`\n${index + 1}. key: ${row[0]}`);
    console.log(`   team: ${row[1]}`);
    console.log(`   version: ${row[2]}`);
    console.log(`   en_英文: ${row[4]}`);
    console.log(`   zh-CN_简体中文: ${row[27]}`);
  }
});
