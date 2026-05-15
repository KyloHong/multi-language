export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
}

export interface PlatformTemplate {
  platformId: string;
  fileName: string;
  languages: LanguageConfig[];
}

export const PLATFORM_TEMPLATES: Record<string, PlatformTemplate> = {
  'au-prod-ib': {
    platformId: 'au-prod-ib',
    fileName: 'au-prod-ib.xlsx',
    languages: [
      { code: 'en', name: '英文', nativeName: 'English' },
      { code: 'ar', name: '阿拉伯语', nativeName: 'العربية' },
      { code: 'de', name: '德语', nativeName: 'Deutsch' },
      { code: 'es', name: '西班牙语', nativeName: 'Español' },
      { code: 'fa', name: '波斯语', nativeName: 'فارسی' },
      { code: 'fr', name: '法语', nativeName: 'Français' },
      { code: 'hi', name: '印地语', nativeName: 'हिन्दी' },
      { code: 'id', name: '印度尼西亚语', nativeName: 'Bahasa Indonesia' },
      { code: 'it', name: '意大利语', nativeName: 'Italiano' },
      { code: 'ja', name: '日语', nativeName: '日本語' },
      { code: 'kk', name: '哈萨克语', nativeName: 'Қазақ тілі' },
      { code: 'km', name: '柬埔寨语', nativeName: 'ភាសាខ្មែរ' },
      { code: 'ko', name: '韩语', nativeName: '한국어' },
      { code: 'mn', name: '蒙古语', nativeName: 'Монгол' },
      { code: 'my', name: '马来西亚语', nativeName: 'Bahasa Melayu' },
      { code: 'nl', name: '荷兰语', nativeName: 'Nederlands' },
      { code: 'pl', name: '波兰语', nativeName: 'Polski' },
      { code: 'pt', name: '葡萄牙语', nativeName: 'Português' },
      { code: 'ru', name: '俄语', nativeName: 'Русский' },
      { code: 'th', name: '泰语', nativeName: 'ไทย' },
      { code: 'tl', name: '菲律宾语', nativeName: 'Filipino' },
      { code: 'uz', name: '乌兹别克斯坦语', nativeName: 'Oʻzbekcha' },
      { code: 'vn', name: '越南语', nativeName: 'Tiếng Việt' },
      { code: 'zh-CN', name: '简体中文', nativeName: '简体中文' },
      { code: 'zh-TW', name: '繁体中文', nativeName: '繁體中文' },
      { code: 'tr', name: '土耳其语', nativeName: 'Türkçe' },
      { code: 'es-BR', name: '拉美西班牙语', nativeName: 'Español (Latinoamérica)' },
      { code: 'pt-BR', name: '拉美葡萄牙语', nativeName: 'Português (Brasil)' },
    ],
  },
  'au-prod-cp': {
    platformId: 'au-prod-cp',
    fileName: 'au-prod-cp.xlsx',
    languages: [
      { code: 'en', name: '英文', nativeName: 'English' },
      { code: 'ar', name: '阿拉伯语', nativeName: 'العربية' },
      { code: 'de', name: '德语', nativeName: 'Deutsch' },
      { code: 'es', name: '西班牙语', nativeName: 'Español' },
      { code: 'fa', name: '波斯语', nativeName: 'فارسی' },
      { code: 'fr', name: '法语', nativeName: 'Français' },
      { code: 'hi', name: '印地语', nativeName: 'हिन्दी' },
      { code: 'id', name: '印度尼西亚语', nativeName: 'Bahasa Indonesia' },
      { code: 'it', name: '意大利语', nativeName: 'Italiano' },
      { code: 'ja', name: '日语', nativeName: '日本語' },
      { code: 'kk', name: '哈萨克语', nativeName: 'Қазақ тілі' },
      { code: 'km', name: '柬埔寨语', nativeName: 'ភាសាខ្មែរ' },
      { code: 'ko', name: '韩语', nativeName: '한국어' },
      { code: 'mn', name: '蒙古语', nativeName: 'Монгол' },
      { code: 'my', name: '马来西亚语', nativeName: 'Bahasa Melayu' },
      { code: 'nl', name: '荷兰语', nativeName: 'Nederlands' },
      { code: 'pl', name: '波兰语', nativeName: 'Polski' },
      { code: 'pt', name: '葡萄牙语', nativeName: 'Português' },
      { code: 'ru', name: '俄语', nativeName: 'Русский' },
      { code: 'th', name: '泰语', nativeName: 'ไทย' },
      { code: 'tl', name: '菲律宾语', nativeName: 'Filipino' },
      { code: 'uz', name: '乌兹别克斯坦语', nativeName: 'Oʻzbekcha' },
      { code: 'vn', name: '越南语', nativeName: 'Tiếng Việt' },
      { code: 'zh-CN', name: '简体中文', nativeName: '简体中文' },
      { code: 'zh-TW', name: '繁体中文', nativeName: '繁體中文' },
      { code: 'tr', name: '土耳其语', nativeName: 'Türkçe' },
      { code: 'es-BR', name: '拉美西班牙语', nativeName: 'Español (Latinoamérica)' },
      { code: 'pt-BR', name: '拉美葡萄牙语', nativeName: 'Português (Brasil)' },
    ],
  },
};

export const getLanguagesByPlatform = (platformId: string): LanguageConfig[] => {
  return PLATFORM_TEMPLATES[platformId]?.languages || [];
};

export const getLanguageCode = (platformId: string): string[] => {
  return PLATFORM_TEMPLATES[platformId]?.languages.map(l => l.code) || [];
};
