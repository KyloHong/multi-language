import React, { useState } from 'react';
import { Globe, Building2, ChevronLeft, ChevronRight, ChevronDown, Languages } from 'lucide-react';
import { useWorkflowStore } from '../store';
import { BRANDS, LANGUAGE_NAMES } from '../config/brands';

interface ExpandedLang {
  platformId: string;
  languages: string[];
}

export const BrandPlatformPage: React.FC = () => {
  const {
    selectedBrand,
    selectedPlatform,
    setSelectedBrand,
    setSelectedPlatform,
    goToNextStep,
    goToPreviousStep,
  } = useWorkflowStore();

  const [expandedLanguages, setExpandedLanguages] = useState<ExpandedLang | null>(null);

  const toggleLanguageExpand = (platformId: string, languages: string[]) => {
    if (expandedLanguages?.platformId === platformId) {
      setExpandedLanguages(null);
    } else {
      setExpandedLanguages({ platformId, languages });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">选择品牌和平台</h1>
        <p className="text-gray-600">为您的多语言文档选择对应的品牌和目标平台</p>
      </div>

      <div className="space-y-8">
        {/* Brand Selection */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Globe className="w-6 h-6 text-blue-800" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">选择品牌</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BRANDS.map((brand) => (
              <button
                key={brand.id}
                onClick={() => {
                  setSelectedBrand(brand);
                  setSelectedPlatform(null);
                }}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedBrand?.id === brand.id
                    ? 'border-blue-800 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{brand.name}</h3>
                <p className="text-sm text-gray-500">
                  {brand.platforms.length} 个平台可用
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Platform Selection */}
        {selectedBrand && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-cyan-100 rounded-xl">
                <Building2 className="w-6 h-6 text-cyan-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">选择平台</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedBrand.platforms.map((platform) => {
                const languages = platform.languages;
                const isExpanded = expandedLanguages?.platformId === platform.id;
                const langCount = languages.length;

                return (
                  <div key={platform.id} className="relative">
                    <button
                      onClick={() => setSelectedPlatform(platform)}
                      className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                        selectedPlatform?.id === platform.id
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-200 hover:border-cyan-300 hover:bg-gray-50'
                      }`}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{platform.name}</h3>
                      {langCount > 0 && (
                        <div 
                          className="flex items-center gap-2 text-sm text-cyan-600 font-medium cursor-pointer hover:text-cyan-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLanguageExpand(platform.id, languages);
                          }}
                        >
                          <Languages className="w-4 h-4" />
                          <span>共 {langCount} 种语言</span>
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                          />
                        </div>
                      )}
                    </button>

                    {/* Expanded Language List */}
                    {isExpanded && expandedLanguages?.platformId === platform.id && (
                      <div className="absolute left-0 right-0 mt-2 p-4 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-10">
                        <div className="flex flex-wrap gap-2">
                          {expandedLanguages.languages.map((lang) => (
                            <span
                              key={lang}
                              className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                            >
                              {LANGUAGE_NAMES[lang] || lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousStep}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            返回
          </button>
          <button
            onClick={goToNextStep}
            disabled={!selectedBrand || !selectedPlatform}
            className="px-8 py-3 bg-gradient-to-r from-blue-800 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-900 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            下一步
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
