export async function translateWithMyMemory(text: string, targetLang: string, sourceLang = 'en'): Promise<string> {
  console.log('[MyMemory Translate] 翻译到', targetLang);
  
  try {
    const langPair = `${sourceLang}|${targetLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData) {
      console.log(`[MyMemory] "${text}" -> "${data.responseData.translatedText}"`);
      return data.responseData.translatedText;
    } else {
      console.warn(`[MyMemory] 翻译失败:`, data.responseDetails);
      return text;
    }
  } catch (error) {
    console.error('[MyMemory Translate] 错误:', error);
    throw error;
  }
}

export async function translateBatchWithAPI(texts: string[], targetLang: string, sourceLang = 'en'): Promise<Record<string, string>> {
  console.log('[API Translate] 翻译', texts.length, '条文本到', targetLang);
  
  const results: Record<string, string> = {};
  
  for (const text of texts) {
    let result: string;
    try {
      // 尝试使用 MyMemory
      result = await translateWithMyMemory(text, targetLang, sourceLang);
    } catch (e) {
      // 失败时使用模拟翻译
      console.log('[API] MyMemory失败，使用模拟翻译');
      result = mockTranslateSingle(text, targetLang);
    }
    results[text] = result;
  }
  
  console.log('[API Translate] 翻译完成');
  return results;
}

function mockTranslateSingle(text: string, targetLang: string): string {
  const mockTranslations: Record<string, Record<string, string>> = {
    'zh-CN': {
      'Welcome': '欢迎',
      'Welcome to': '欢迎来到',
      'IB Portal': 'IB 门户',
      'Manage your investments with ease': '轻松管理您的投资',
      'Get Started': '开始使用',
      'Why Choose Us': '为什么选择我们',
      'Real-time Updates': '实时更新',
      '首页': '首页',
      '关于我们': '关于我们',
      '联系我们': '联系我们',
      '搜索...': '搜索...',
      '个人中心': '个人中心',
      'Secure Platform': '安全平台',
      '© 2024 All Rights Reserved': '© 2024 保留所有权利',
    },
    'ja': {
      'Welcome': 'ようこそ',
      'Welcome to': 'へようこそ',
      'IB Portal': 'IB ポータル',
      'Manage your investments with ease': '投資を簡単に管理',
      'Get Started': '始める',
      'Why Choose Us': 'なぜ私たちを選ぶのか',
      'Real-time Updates': 'リアルタイム更新',
      'Secure Platform': '安全なプラットフォーム',
    },
    'ko': {
      'Welcome': '환영',
      'Welcome to': '에 오신 것을 환영합니다',
      'IB Portal': 'IB 포털',
      'Manage your investments with ease': '투자 관리 쉽게',
      'Get Started': '시작하기',
      'Why Choose Us': '왜 우리를 선택하는가',
      'Real-time Updates': '실시간 업데이트',
      'Secure Platform': '안전한 플랫폼',
    },
    'de': {
      'Welcome': 'Willkommen',
      'Welcome to': 'Willkommen bei',
      'IB Portal': 'IB Portal',
      'Manage your investments with ease': 'Verwalten Sie Ihre Investitionen leicht',
      'Get Started': 'Loslegen',
      'Why Choose Us': 'Warum uns wählen',
      'Real-time Updates': 'Echtzeit-Updates',
      'Secure Platform': 'Sichere Plattform',
    },
    'fr': {
      'Welcome': 'Bienvenue',
      'Welcome to': 'Bienvenue sur',
      'IB Portal': 'IB Portal',
      'Manage your investments with ease': 'Gérez vos investissements facilement',
      'Get Started': 'Commencer',
      'Why Choose Us': 'Pourquoi nous choisir',
      'Real-time Updates': 'Mises à jour en temps réel',
      'Secure Platform': 'Plateforme sécurisée',
    },
    'es': {
      'Welcome': 'Bienvenido',
      'Welcome to': 'Bienvenido a',
      'IB Portal': 'IB Portal',
      'Manage your investments with ease': 'Gestiona tus inversiones fácilmente',
      'Get Started': 'Empezar',
      'Why Choose Us': '¿Por qué elegirnos',
      'Real-time Updates': 'Actualizaciones en tiempo real',
      'Secure Platform': 'Plataforma segura',
    },
  };

  const langMock = mockTranslations[targetLang] || {};
  return langMock[text] || text;
}

export function mockTranslate(texts: string[], targetLang: string): Record<string, string> {
  console.log('[mockTranslate] 被调用, 目标语言:', targetLang, '文本数:', texts.length);
  
  const results: Record<string, string> = {};
  texts.forEach((text) => {
    results[text] = mockTranslateSingle(text, targetLang);
  });
  
  console.log('[mockTranslate] 翻译结果:', results);
  return results;
}

export async function translateWithAPI(texts: string[], targetLang: string, sourceLang = 'en'): Promise<Record<string, string>> {
  return await translateBatchWithAPI(texts, targetLang, sourceLang);
}
