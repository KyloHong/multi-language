import * as alimt20181012 from '@alicloud/alimt20181012';
import * as $OpenApi from '@alicloud/openapi-client';
import * as Util from '@alicloud/tea-util';

export interface AliyunConfig {
  accessKeyId: string;
  accessKeySecret: string;
  region?: string;
}

let cachedClient: alimt20181012.default | null = null;
let cachedConfig: AliyunConfig | null = null;

export function createAliyunClient(config: AliyunConfig): alimt20181012.default {
  const openApiConfig = new $OpenApi.Config({
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
  });
  
  const region = config.region || 'cn-hangzhou';
  openApiConfig.endpoint = `mt.${region}.aliyuncs.com`;
  
  return new alimt20181012.default(openApiConfig);
}

export async function translateWithAliyun(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  config: AliyunConfig
): Promise<string> {
  try {
    const client = createAliyunClient(config);
    
    const request = new alimt20181012.TranslateGeneralRequest({
      formatType: 'text',
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
      sourceText: text,
      scene: 'general',
    });
    
    const runtime = new Util.RuntimeOptions({});
    const result = await client.translateGeneralWithOptions(request, runtime);
    
    return result.body.data?.translated || text;
  } catch (error) {
    console.error('[Aliyun Translate] Error:', error);
    throw error;
  }
}

export async function translateBatchWithAliyun(
  texts: string[],
  sourceLanguage: string,
  targetLanguage: string,
  config: AliyunConfig
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};
  
  for (const text of texts) {
    try {
      results[text] = await translateWithAliyun(text, sourceLanguage, targetLanguage, config);
    } catch (error) {
      console.warn(`[Aliyun Translate] Failed to translate: "${text}"`);
      results[text] = text;
    }
  }
  
  return results;
}

export const ALIYUN_TRANSLATE_CONFIG = {
  name: '阿里云翻译',
  description: '使用阿里云机器翻译API，高质量翻译支持119种语言',
  supportedLanguages: [
    'zh', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'pt', 'it', 'ru',
    'ar', 'th', 'vi', 'id', 'ms', 'hi', 'bn', 'ur', 'ta', 'te',
    'mr', 'ml', 'kn', 'gu', 'pa', 'ne', 'si', 'my', 'km', 'lo',
    'bg', 'cs', 'da', 'el', 'fi', 'hu', 'no', 'pl', 'ro', 'sv',
    'uk', 'hr', 'sk', 'sl', 'sr', 'et', 'lv', 'lt', 'tr', 'he',
    'fa', 'ps', 'uz', 'kk', 'tg', 'ky', 'mn', 'hy', 'az', 'ka',
    'tl', 'jw', 'su', 'eu', 'gl', 'ca', 'eu', 'cy', 'mk', 'sq',
    'bs', 'ba', 'sr', 'mk', 'be', 'uk', 'uz', 'kk', 'ky', 'tg',
    'mn', 'fa', 'ps', 'pa', 'bn', 'mr', 'ne', 'si', 'ta', 'te',
    'ml', 'kn', 'or', 'as', 'gu', 'pa', 'ks', 'sd', 'ur', 'ps'
  ],
};
