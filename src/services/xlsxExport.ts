import * as XLSX from 'xlsx';
import { FigmaTextNode, TranslationResult } from '../types';
import { Platform, Brand, LANGUAGE_NAMES } from '../config/brands';

export async function exportToXlsx(
  extractedTexts: FigmaTextNode[],
  translations: TranslationResult,
  selectedPlatform: Platform,
  selectedBrand: Brand
): Promise<void> {
  try {
    const langHeaders: string[] = selectedPlatform.languages.map(lang => {
      const chineseName = LANGUAGE_NAMES[lang] || lang;
      return `${lang}_${chineseName}`;
    });
    
    const headers = ['key', 'team', 'version', ...langHeaders];
    
    const rows: (string | number)[][] = [headers];
    
    extractedTexts.forEach((text, index) => {
      const row: (string | number)[] = [
        '',
        '',
        '',
      ];
      selectedPlatform.languages.forEach((lang) => {
        row.push(translations[text.id]?.[lang] || text.characters || '');
      });
      rows.push(row);
    });

    const sheet = XLSX.utils.aoa_to_sheet(rows);
    
    sheet['!cols'] = headers.map((_, i) => ({ wch: i === 0 ? 40 : 15 }));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`;
    const filename = `${selectedBrand.shortName}_${selectedPlatform.id}_${dateStr}.xlsx`;
    
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
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}
