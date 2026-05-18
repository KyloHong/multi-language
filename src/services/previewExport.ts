import * as XLSX from 'xlsx';
import { FigmaTextNode } from '../types';

export async function exportPreviewToXlsx(
  extractedTexts: FigmaTextNode[],
  brandName: string = 'Brand'
): Promise<void> {
  try {
    const uniqueTextsMap = new Map<string, FigmaTextNode>();
    extractedTexts.forEach((text) => {
      if (!uniqueTextsMap.has(text.characters)) {
        uniqueTextsMap.set(text.characters, text);
      }
    });

    const uniqueTexts = Array.from(uniqueTextsMap.values());

    const headers = ['序号', '原文', 'Frame', '区域'];
    
    const rows: (string | number)[][] = [headers];
    
    uniqueTexts.forEach((text, index) => {
      const row: (string | number)[] = [
        index + 1,
        text.characters || '',
        text.frameName || '',
        text.area || '',
      ];
      rows.push(row);
    });

    const sheet = XLSX.utils.aoa_to_sheet(rows);
    
    sheet['!cols'] = [
      { wch: 6 },   // 序号
      { wch: 50 },  // 原文
      { wch: 30 },  // Frame
      { wch: 20 },  // 区域
    ];
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, '文案预览');

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const filename = `${brandName}_文案预览_${dateStr}.xlsx`;
    
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('[Export] Preview exported successfully:', filename);
  } catch (error) {
    console.error('[Export] Preview export failed:', error);
    throw error;
  }
}
