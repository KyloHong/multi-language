import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, from, to } = req.body;

    if (!text || !to) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 模拟翻译，因为外部翻译 API 在 Vercel 中可能有访问限制
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

    const langMock = mockTranslations[to] || {};
    const result = langMock[text] || text;

    return res.json({ translatedText: result });
  } catch (error) {
    console.error('Translation API error:', error);
    return res.status(500).json({ error: 'Translation failed' });
  }
}
