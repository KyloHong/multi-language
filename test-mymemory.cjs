async function testMyMemory() {
  console.log('🧪 Testing MyMemory Translate API\n');

  const testCases = [
    { text: 'Welcome', to: 'zh-CN', from: 'en' },
    { text: 'Get Started', to: 'ja', from: 'en' },
    { text: 'Secure Platform', to: 'ko', from: 'en' },
  ];

  for (const testCase of testCases) {
    try {
      console.log(`📝 Testing: "${testCase.text}" -> ${testCase.to}`);
      const langPair = `${testCase.from}|${testCase.to}`;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(testCase.text)}&langpair=${langPair}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData) {
        console.log(`✅ Result: "${data.responseData.translatedText}"\n`);
      } else {
        console.log(`❌ Failed:`, data.responseDetails, '\n');
      }
    } catch (error) {
      console.error(`❌ Error:`, error, '\n');
    }
  }
}

testMyMemory();
