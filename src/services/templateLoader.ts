import * as XLSX from 'xlsx';
import { LANGUAGE_NAMES } from '../config/brands';

const TEMPLATE_BASE_PATH = '/workspace/template';

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
}

let cachedLanguages: Record<string, LanguageInfo[]> = {};

export function loadLanguagesFromTemplateSync(platformId: string, brandShortName: string): LanguageInfo[] {
  const cacheKey = `${brandShortName}/${platformId}`;
  
  if (cachedLanguages[cacheKey]) {
    return cachedLanguages[cacheKey];
  }

  try {
    const filePath = `${TEMPLATE_BASE_PATH}/${brandShortName}/${platformId}.xlsx`;
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets['Sheet1'];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
    
    if (!data || data.length === 0 || !data[0]) {
      console.warn(`Empty template file: ${filePath}`);
      return [];
    }

    const headers = data[0];
    const languages: LanguageInfo[] = [];
    
    for (let i = 3; i < headers.length; i++) {
      const header = headers[i];
      if (header && typeof header === 'string') {
        const parts = header.split('_');
        if (parts.length >= 2) {
          const code = parts[0];
          const name = parts.slice(1).join('_');
          const chineseName = LANGUAGE_NAMES[code] || name;
          
          languages.push({
            code,
            name: chineseName,
            nativeName: name,
          });
        }
      }
    }
    
    cachedLanguages[cacheKey] = languages;
    return languages;
  } catch (error) {
    console.error(`Error loading template ${platformId}:`, error);
    return [];
  }
}

export function getLanguageHeader(langCode: string): string {
  const chineseName = LANGUAGE_NAMES[langCode] || langCode;
  return `${langCode}_${chineseName}`;
}

export function clearLanguageCache(): void {
  cachedLanguages = {};
}
