const XLSX = require('xlsx');

console.log('=== au-prod-ib.xlsx 完整内容 ===\n');
const workbook1 = XLSX.readFile('/workspace/au-prod-ib.xlsx');
const sheet1 = workbook1.Sheets['Sheet1'];
const data1 = XLSX.utils.sheet_to_json(sheet1);

console.log('总行数:', data1.length);
console.log('\n前 30 条数据:');
data1.slice(0, 30).forEach((row, index) => {
  console.log(`\n${index + 1}. key: ${row.key}`);
  console.log(`   team: ${row.team}`);
  console.log(`   en_英文: ${row['en_英文']}`);
  console.log(`   zh-CN_简体中文: ${row['zh-CN_简体中文']}`);
  console.log(`   zh-TW_繁体中文: ${row['zh-TW_繁体中文']}`);
  console.log(`   ja_日语: ${row['ja_日语']}`);
  console.log(`   ko_韩语: ${row['ko_韩语']}`);
});

console.log('\n\n=== au-prod-cp.xlsx 完整内容 ===\n');
const workbook2 = XLSX.readFile('/workspace/au-prod-cp.xlsx');
const sheet2 = workbook2.Sheets['Sheet2'] || workbook2.Sheets['Sheet1'];
const data2 = XLSX.utils.sheet_to_json(sheet2);

console.log('总行数:', data2.length);
console.log('\n前 30 条数据:');
data2.slice(0, 30).forEach((row, index) => {
  console.log(`\n${index + 1}. key: ${row.key}`);
  console.log(`   team: ${row.team}`);
  console.log(`   en_英文: ${row['en_英文']}`);
  console.log(`   zh-CN_简体中文: ${row['zh-CN_简体中文']}`);
  console.log(`   zh-TW_繁体中文: ${row['zh-TW_繁体中文']}`);
  console.log(`   ja_日语: ${row['ja_日语']}`);
  console.log(`   ko_韩语: ${row['ko_韩语']}`);
});
