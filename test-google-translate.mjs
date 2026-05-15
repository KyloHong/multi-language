import express from 'express';
import { translate } from '@vitalets/google-translate-api';

async function testGoogleTranslate() {
  console.log('🧪 Testing Google Translate API\n');

  const testCases = [
    { text: 'Welcome', to: 'zh-CN', from: 'en' },
    { text: 'Get Started', to: 'ja', from: 'en' },
    { text: 'Secure Platform', to: 'ko', from: 'en' },
  ];

  for (const testCase of testCases) {
    try {
      console.log(`📝 Testing: "${testCase.text}" -> ${testCase.to}`);
      const result = await translate(testCase.text, {
        from: testCase.from,
        to: testCase.to,
      });
      console.log(`✅ Result: "${result.text}"\n`);
    } catch (error) {
      console.error(`❌ Error:`, error);
    }
  }
}

testGoogleTranslate();
