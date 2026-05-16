import React, { useState, useEffect } from 'react';
import { Languages, Edit2, Loader2, ChevronLeft, AlertCircle, FileSpreadsheet, CheckCircle2, Settings, Globe } from 'lucide-react';
import { useWorkflowStore } from '../store';
import { getLanguageHeader } from '../services/templateLoader';
import { translateWithAPI, TRANSLATION_CONFIG, translateWithGoogle, translateWithMyMemory, mockTranslate } from '../services/deepl';
import { exportToXlsx } from '../services/xlsxExport';
import { TranslationResult } from '../types';

export const TranslatePage: React.FC = () => {
  const {
    extractedTexts,
    selectedPlatform,
    translations,
    setTranslations,
    selectedBrand,
    goToPreviousStep,
    resetWorkflow,
  } = useWorkflowStore();
  const [isTranslating, setIsTranslating] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editLang, setEditLang] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [exporting, setExporting] = useState(false);
  const [selectedService, setSelectedService] = useState<'google' | 'mymemory' | 'mock'>('mymemory');
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState<string>('zh-CN');

  useEffect(() => {
    if (selectedPlatform && extractedTexts.length > 0 && Object.keys(translations).length === 0) {
      handleTranslate();
    }
  }, [selectedPlatform, extractedTexts]);

  const handleTranslate = async () => {
    console.log('[TranslatePage] handleTranslate 开始执行');
    if (!selectedPlatform) {
      console.log('[TranslatePage] 没有选择平台');
      return;
    }
    console.log('[TranslatePage] 选中平台:', selectedPlatform);
    console.log('[TranslatePage] 提取的文本:', extractedTexts);
    console.log('[TranslatePage] 使用翻译服务:', selectedService);
    
    setIsTranslating(true);
    setError(null);

    const targetLanguages = selectedPlatform.languages;
    console.log('[TranslatePage] 目标语言:', targetLanguages);
    
    const totalTranslations = extractedTexts.length * targetLanguages.length;
    let completedTranslations = 0;

    const newTranslations: TranslationResult = {};

    try {
      for (const lang of targetLanguages) {
        const textsToTranslate = extractedTexts.map((t) => t.characters);
        let results: Record<string, string> = {};
        
        if (selectedService === 'google') {
          // 逐个翻译文本
          for (const text of textsToTranslate) {
            try {
              results[text] = await translateWithGoogle(text, lang, sourceLanguage);
            } catch (e) {
              console.warn(`[Google] 翻译失败: "${text}", 尝试 MyMemory`);
              try {
                results[text] = await translateWithMyMemory(text, lang, sourceLanguage);
              } catch (e2) {
                console.warn(`[MyMemory] 也失败: "${text}", 使用模拟翻译`);
                results[text] = mockTranslate([text], lang)[text];
              }
            }
            completedTranslations++;
            setProgress({ current: completedTranslations, total: totalTranslations });
          }
        } else if (selectedService === 'mymemory') {
          // 使用 MyMemory
          for (const text of textsToTranslate) {
            try {
              results[text] = await translateWithMyMemory(text, lang, sourceLanguage);
            } catch (e) {
              console.warn(`[MyMemory] 翻译失败: "${text}", 使用模拟翻译`);
              results[text] = mockTranslate([text], lang)[text];
            }
            completedTranslations++;
            setProgress({ current: completedTranslations, total: totalTranslations });
          }
        } else {
          // 使用模拟翻译
          results = mockTranslate(textsToTranslate, lang);
          completedTranslations += textsToTranslate.length;
          setProgress({ current: completedTranslations, total: totalTranslations });
        }

        extractedTexts.forEach((text) => {
          if (!newTranslations[text.id]) {
            newTranslations[text.id] = {};
          }
          newTranslations[text.id][lang] = results[text.characters] || text.characters;
        });
      }

      console.log('[TranslatePage] 最终翻译结果:', newTranslations);
      setTranslations(newTranslations);
    } catch (err) {
      console.error('[TranslatePage] 翻译错误:', err);
      setError(err instanceof Error ? err.message : '翻译失败');
    } finally {
      setIsTranslating(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  const handleExportXlsx = async () => {
    if (!selectedPlatform || !selectedBrand) return;
    setExporting(true);
    try {
      await exportToXlsx(extractedTexts, translations, selectedPlatform, selectedBrand);
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请检查控制台');
    } finally {
      setExporting(false);
    }
  };

  const handleEditStart = (key: string, lang: string, value: string) => {
    setEditingKey(key);
    setEditLang(lang);
    setEditValue(value);
  };

  const handleEditSave = (key: string, lang: string) => {
    setTranslations({
      ...translations,
      [key]: {
        ...translations[key],
        [lang]: editValue,
      },
    });
    setEditingKey(null);
    setEditLang(null);
  };

  if (!selectedPlatform) return null;

  const languages = selectedPlatform.languages;
  const totalTranslations = extractedTexts.length * languages.length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">多语言翻译</h1>
          <button
            onClick={() => setShowServiceSelector(!showServiceSelector)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            <Settings className="w-4 h-4" />
            翻译设置
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">
          为 <span className="font-semibold text-blue-800">{selectedPlatform.name}</span> 生成
          <span className="font-semibold text-cyan-600"> {languages.length} </span>
          种语言的翻译
          <span className="ml-2 text-yellow-600 text-sm">
            (源语言: {sourceLanguage === 'zh-CN' ? '简体中文' : sourceLanguage === 'zh-TW' ? '繁体中文' : sourceLanguage === 'en' ? 'English' : '自动检测'} | 
            当前使用: {selectedService === 'google' ? 'Google 翻译' : selectedService === 'mymemory' ? 'MyMemory' : '模拟翻译'})
          </span>
        </p>
        
        {showServiceSelector && (
          <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">源语言 (要翻译的语言)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSourceLanguage('zh-CN')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    sourceLanguage === 'zh-CN'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white border border-gray-300 hover:border-green-400'
                  }`}
                >
                  简体中文
                </button>
                <button
                  onClick={() => setSourceLanguage('zh-TW')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    sourceLanguage === 'zh-TW'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white border border-gray-300 hover:border-green-400'
                  }`}
                >
                  繁体中文
                </button>
                <button
                  onClick={() => setSourceLanguage('en')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    sourceLanguage === 'en'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white border border-gray-300 hover:border-green-400'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setSourceLanguage('auto')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    sourceLanguage === 'auto'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white border border-gray-300 hover:border-green-400'
                  }`}
                >
                  自动检测
                </button>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">选择翻译服务</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedService('google')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedService === 'google'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white border border-gray-300 hover:border-blue-400'
                  }`}
                >
                  Google 翻译
                </button>
                <button
                  onClick={() => setSelectedService('mymemory')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedService === 'mymemory'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white border border-gray-300 hover:border-blue-400'
                  }`}
                >
                  MyMemory
                </button>
                <button
                  onClick={() => setSelectedService('mock')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedService === 'mock'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white border border-gray-300 hover:border-blue-400'
                  }`}
                >
                  模拟翻译
                </button>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              提示: Google 翻译质量更高，但可能有访问限制。MyMemory 更稳定但翻译质量稍差。
            </p>
          </div>
        )}
        
        {Object.keys(translations).length > 0 && (
          <div className="mt-3 flex items-center gap-6 text-sm">
            <span className="text-gray-600">
              原文条数: <span className="font-semibold text-gray-900">{extractedTexts.length}</span>
            </span>
            <span className="text-gray-600">
              翻译语言: <span className="font-semibold text-gray-900">{languages.length}</span> 种
            </span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {isTranslating ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-800 to-cyan-500 rounded-2xl mb-6 shadow-lg">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">正在翻译...</h2>
            <p className="text-gray-600 mb-4">
              {progress.total > 0
                ? `已完成 ${progress.current} / ${progress.total}`
                : 'AI 正在为您生成多语言翻译'}
            </p>
            {progress.total > 0 && (
              <div className="w-64 mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-800 to-cyan-500 transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            )}
          </div>
        ) : Object.keys(translations).length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6">
              <Languages className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">尚未生成翻译</h2>
            <p className="text-gray-600 mb-6">
              点击下方按钮使用 Google 翻译开始翻译
            </p>
            <button
              onClick={handleTranslate}
              className="px-6 py-3 bg-gradient-to-r from-blue-800 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-900 hover:to-cyan-700 transition-all shadow-lg"
            >
              开始翻译
            </button>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Languages className="w-6 h-6 text-blue-800" />
                <span className="font-semibold text-gray-900">翻译结果</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportXlsx}
                  disabled={exporting}
                  className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  {exporting ? '导出中...' : '导出 XLSX'}
                </button>
                <button
                  onClick={handleTranslate}
                  className="px-4 py-2 text-sm font-medium text-blue-800 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  重新翻译
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 min-w-[200px] sticky left-0 bg-gray-50 z-10">
                      原文
                    </th>
                    {languages.map((lang) => (
                      <th
                        key={lang}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-600 min-w-[150px]"
                      >
                        {getLanguageHeader(lang)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {extractedTexts.map((text) => (
                    <tr key={text.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 sticky left-0 bg-white z-10">
                        <p className="text-sm text-gray-500 italic">{text.characters}</p>
                      </td>
                      {languages.map((lang) => (
                        <td key={lang} className="px-4 py-3">
                          {editingKey === text.id && editLang === lang ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={() => handleEditSave(text.id, lang)}
                              onKeyDown={(e) => e.key === 'Enter' && handleEditSave(text.id, lang)}
                              className="w-full px-2 py-1 text-sm border-2 border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                          ) : (
                            <div className="flex items-center justify-between group">
                              <p className="text-sm text-gray-700">{translations[text.id]?.[lang]}</p>
                              <button
                                onClick={() =>
                                  handleEditStart(text.id, lang, translations[text.id]?.[lang] || '')
                                }
                                className="p-1 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={goToPreviousStep}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  返回
                </button>
                <button
                  onClick={resetWorkflow}
                  className="px-8 py-3 bg-gradient-to-r from-blue-800 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-900 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  完成并关闭
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
