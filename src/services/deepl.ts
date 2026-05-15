export async function translateWithMyMemory(texts: string[], targetLang: string, sourceLang = 'en'): Promise<Record<string, string>> {
  console.log('[MyMemory Translate] 翻译', texts.length, '条文本到', targetLang);
  
  const results: Record<string, string> = {};
  
  try {
    // MyMemory使用不同的语言代码格式
    const langPair = `${sourceLang}|${targetLang}`;
    
    for (const text of texts) {
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData) {
          results[text] = data.responseData.translatedText;
          console.log(`[MyMemory] "${text}" -> "${data.responseData.translatedText}"`);
        } else {
          console.warn(`[MyMemory] 翻译失败:`, data.responseDetails);
          results[text] = text;
        }
      } catch (err) {
        console.error(`[MyMemory] Error translating "${text}":`, err);
        results[text] = text;
      }
    }
    
    console.log('[MyMemory Translate] 翻译完成');
    return results;
  } catch (error) {
    console.error('[MyMemory Translate] 错误:', error);
    throw error;
  }
}

export async function translateWithGoogle(texts: string[], targetLang: string, sourceLang = 'en'): Promise<Record<string, string>> {
  console.log('[Google Translate] 翻译', texts.length, '条文本到', targetLang);
  
  const results: Record<string, string> = {};
  
  try {
    const response = await fetch('/api/translate/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts,
        targetLang,
        sourceLang,
      }),
    });

    if (!response.ok) {
      throw new Error(`翻译API请求失败: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      console.log('[Google Translate] 翻译成功');
      return data.translations;
    } else {
      throw new Error(data.error || '翻译失败');
    }
  } catch (error) {
    console.error('[Google Translate] 翻译错误:', error);
    // 失败时尝试使用MyMemory
    try {
      console.log('[Google Translate] 尝试使用MyMemory...');
      return await translateWithMyMemory(texts, targetLang, sourceLang);
    } catch (myMemoryError) {
      console.error('[MyMemory] 也失败了，使用模拟翻译');
      // MyMemory也失败时使用模拟翻译
      return mockTranslate(texts, targetLang);
    }
  }
}

export function mockTranslate(texts: string[], targetLang: string): Record<string, string> {
  console.log('[mockTranslate] 被调用, 目标语言:', targetLang, '文本数:', texts.length);
  
  const results: Record<string, string> = {};
  
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
    'en': {
      'Welcome': 'Welcome',
      'Welcome to': 'Welcome to',
      'IB Portal': 'IB Portal',
      'Manage your investments with ease': 'Manage your investments with ease',
      'Get Started': 'Get Started',
      'Why Choose Us': 'Why Choose Us',
      'Real-time Updates': 'Real-time Updates',
      'Secure Platform': 'Secure Platform',
    },
  };

  const langMock = mockTranslations[targetLang] || {};
  
  texts.forEach((text) => {
    if (langMock[text]) {
      results[text] = langMock[text];
    } else {
      results[text] = text;
    }
  });

  console.log('[mockTranslate] 翻译结果:', results);
  return results;
}
