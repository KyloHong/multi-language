import express, { type Request, type Response } from 'express';
import { translate } from '@vitalets/google-translate-api';

const router = express.Router();

router.post('/translate', async (req: Request, res: Response) => {
  try {
    const { texts, targetLang, sourceLang = 'en' } = req.body;

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({
        success: false,
        error: 'texts is required and should be an array'
      });
    }

    if (!targetLang) {
      return res.status(400).json({
        success: false,
        error: 'targetLang is required'
      });
    }

    console.log(`[Google Translate] Translating ${texts.length} texts to ${targetLang}`);

    const translations: Record<string, string> = {};

    for (const text of texts) {
      try {
        const result = await translate(text, { from: sourceLang, to: targetLang });
        translations[text] = result.text;
      } catch (err) {
        console.error(`[Google Translate] Error translating text: "${text}"`, err);
        translations[text] = text;
      }
    }

    res.json({
      success: true,
      translations
    });
  } catch (error) {
    console.error('[Google Translate] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Translation failed'
    });
  }
});

export default router;
