export interface Brand {
  id: string;
  name: string;
  shortName: string;
  platforms: Platform[];
}

export interface Platform {
  id: string;
  name: string;
  languages: string[];
}

export const LANGUAGE_NAMES: Record<string, string> = {
  'ar': '阿拉伯语',
  'de': '德语',
  'en': '英文',
  'es': '西班牙语',
  'es-BR': '拉美西班牙语',
  'fa': '波斯语',
  'fr': '法语',
  'hi': '印地语',
  'id': '印度尼西亚语',
  'it': '意大利语',
  'ja': '日语',
  'kk': '哈萨克语',
  'km': '柬埔寨语',
  'ko': '韩语',
  'mn': '蒙古语',
  'my': '马来西亚语',
  'nl': '荷兰语',
  'pl': '波兰语',
  'pt': '葡萄牙语',
  'pt-BR': '拉美葡萄牙语',
  'ru': '俄语',
  'th': '泰语',
  'tl': '菲律宾语',
  'uz': '乌兹别克斯坦语',
  'vn': '越南语',
  'zh-CN': '简体中文',
  'zh-TW': '繁体中文',
  'tr': '土耳其语',
};

export const DEFAULT_LANGUAGES: string[] = [
  'ar', 'de', 'en', 'es', 'fa', 'fr', 'hi', 'id', 'it', 'ja',
  'kk', 'km', 'ko', 'mn', 'my', 'nl', 'pl', 'pt', 'ru', 'th',
  'tl', 'uz', 'vn', 'zh-CN', 'zh-TW', 'tr', 'es-BR', 'pt-BR'
];

export const getBrandById = (id: string): Brand | undefined => {
  return BRANDS.find(b => b.id === id);
};

export const getPlatformById = (brandId: string, platformId: string): Platform | undefined => {
  const brand = getBrandById(brandId);
  return brand?.platforms.find(p => p.id === platformId);
};

export const getAllPlatforms = (): Platform[] => {
  return BRANDS.flatMap(b => b.platforms);
};

export const BRANDS: Brand[] = [
  {
    id: 'vantage',
    name: 'Vantage',
    shortName: 'AU',
    platforms: [
      { id: 'au-prod-ib', name: 'au-prod-ib', languages: [...DEFAULT_LANGUAGES] },
      { id: 'au-prod-cp', name: 'au-prod-cp', languages: [...DEFAULT_LANGUAGES] },
    ],
  },
  {
    id: 'vt-market',
    name: 'VT Market',
    shortName: 'VT',
    platforms: [],
  },
];

export const updateBrandPlatforms = (brands: Brand[]) => {
  // This function is kept for compatibility
};
