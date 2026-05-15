import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Sparkles, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useWorkflowStore } from '../store';
import { DuplicateGroup, QualityScore, Suggestion, ProofreadResult } from '../types';

export const ProofreadPage: React.FC = () => {
  const {
    extractedTexts,
    translations,
    selectedBrand,
    selectedPlatform,
    proofreadResult,
    setProofreadResult,
    goToNextStep,
    goToPreviousStep,
  } = useWorkflowStore();
  const [isProofreading, setIsProofreading] = useState(false);

  useEffect(() => {
    if (!proofreadResult && extractedTexts.length > 0) {
      handleProofread();
    }
  }, [extractedTexts, translations]);

  const handleProofread = async () => {
    setIsProofreading(true);

    // Simulate proofreading
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Find duplicates
    const textMap = new Map<string, Array<{ nodeId: string; pageName: string; frameName?: string }>>();
    extractedTexts.forEach((text) => {
      const existing = textMap.get(text.characters) || [];
      textMap.set(text.characters, [...existing, { nodeId: text.id, pageName: text.pageName, frameName: text.frameName }]);
    });

    const duplicates: DuplicateGroup[] = [];
    textMap.forEach((occurrences, text) => {
      if (occurrences.length > 1) {
        duplicates.push({
          text,
          occurrences,
          sameScene: occurrences.every((o) => o.pageName === occurrences[0].pageName),
        });
      }
    });

    // Mock quality scores
    const qualityScores: QualityScore[] = extractedTexts.map((text, index) => ({
      nodeId: text.id,
      text: text.characters,
      score: index === 0 ? 75 : 95,
      issues: index === 0 ? ['翻译可能需要进一步优化'] : [],
    }));

    // Mock suggestions
    const suggestions: Suggestion[] = extractedTexts.length > 0 ? [
      {
        original: extractedTexts[0].characters,
        suggested: extractedTexts[0].characters,
        reason: '翻译质量良好，无需修改',
      },
    ] : [];

    setProofreadResult({ duplicates, qualityScores, suggestions });
    setIsProofreading(false);
  };

  const handleExportJSON = () => {
    const data = {
      brand: selectedBrand?.name,
      platform: selectedPlatform?.name,
      translations,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'i18n-translations.json';
    a.click();
  };

  const handleExportCSV = () => {
    if (!selectedPlatform) return;
    const headers = ['Key', 'English', ...selectedPlatform.languages.filter((l) => l !== 'en')];
    const rows = extractedTexts.map((text) => {
      const row = [text.name, text.characters];
      selectedPlatform.languages.filter((l) => l !== 'en').forEach((lang) => {
        row.push(translations[text.id]?.[lang] || '');
      });
      return row;
    });
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'i18n-translations.csv';
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI 校对</h1>
        <p className="text-gray-600">检查翻译质量、重复项并获取优化建议</p>
      </div>

      <div className="space-y-6">
        {isProofreading ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-800 to-cyan-500 rounded-2xl mb-6 shadow-lg animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI 正在校对...</h2>
            <p className="text-gray-600">正在检查重复项、评估翻译质量</p>
          </div>
        ) : proofreadResult ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    proofreadResult.duplicates.length > 0 ? 'bg-amber-100' : 'bg-green-100'
                  }`}>
                    {proofreadResult.duplicates.length > 0 ? (
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">重复文案</p>
                    <p className="text-2xl font-bold text-gray-900">{proofreadResult.duplicates.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">平均质量</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(
                        proofreadResult.qualityScores.reduce((sum, s) => sum + s.score, 0) /
                          proofreadResult.qualityScores.length
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-100 rounded-xl">
                    <Sparkles className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">优化建议</p>
                    <p className="text-2xl font-bold text-gray-900">{proofreadResult.suggestions.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Duplicates Section */}
            {proofreadResult.duplicates.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                    <h2 className="text-xl font-bold text-gray-900">重复文案</h2>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {proofreadResult.duplicates.map((group, index) => (
                    <div key={index} className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <p className="text-lg font-semibold text-gray-900 mb-2">{group.text}</p>
                          <div className="flex items-center gap-2">
                            {group.sameScene ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                                <AlertTriangle className="w-3 h-3" />
                                相同场景，建议去重
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                不同场景，可能需要保留
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {group.occurrences.map((occ, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                            {occ.pageName}
                            {occ.frameName && <span className="text-gray-400">· {occ.frameName}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quality Scores */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-800" />
                  <h2 className="text-xl font-bold text-gray-900">翻译质量评估</h2>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {proofreadResult.qualityScores.map((score, index) => (
                  <div key={index} className="p-6">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium truncate">{score.text}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${
                          score.score >= 90 ? 'text-green-600' :
                          score.score >= 70 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {score.score}%
                        </span>
                        {score.score >= 90 ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          score.score >= 90 ? 'bg-green-500' :
                          score.score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score.score}%` }}
                      ></div>
                    </div>
                    {score.issues.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {score.issues.map((issue, i) => (
                          <p key={i} className="text-sm text-amber-700 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {issue}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Export Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-800 to-cyan-500 rounded-2xl mb-6 shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">校对完成！</h2>
                <p className="text-gray-600 mb-8">您的多语言翻译文档已准备好导出</p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handleExportJSON}
                    className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    导出 JSON
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="px-6 py-3 bg-gradient-to-r from-blue-800 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-900 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    导出 CSV
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousStep}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            返回
          </button>
          {proofreadResult && (
            <button
              onClick={goToNextStep}
              className="px-8 py-3 bg-gradient-to-r from-blue-800 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-900 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              完成
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
