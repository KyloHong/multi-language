import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, Upload, Key, Info, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useWorkflowStore } from '../store';
import { createFigmaService } from '../services/figma';
import { FigmaTextNode } from '../types';

const MOCK_TEXTS: FigmaTextNode[] = [
  { id: '1', name: 'Home Link', characters: '首页', pageName: 'Landing Page', frameName: 'Navigation Bar', area: '导航栏' },
  { id: '2', name: 'About Link', characters: '关于我们', pageName: 'Landing Page', frameName: 'Navigation Bar', area: '导航栏' },
  { id: '3', name: 'Hero Title', characters: 'Welcome to IB Portal', pageName: 'Landing Page', frameName: 'Hero Section', area: '页头' },
  { id: '4', name: 'Hero Subtitle', characters: 'Manage your investments with ease', pageName: 'Landing Page', frameName: 'Hero Section', area: '页头' },
  { id: '5', name: 'CTA Button', characters: 'Get Started', pageName: 'Landing Page', frameName: 'Hero Section', area: '按钮区' },
  { id: '6', name: 'Features Title', characters: 'Why Choose Us', pageName: 'Landing Page', frameName: 'Features Section', area: '主体内容' },
  { id: '7', name: 'Feature 1', characters: 'Real-time Updates', pageName: 'Landing Page', frameName: 'Features Card', area: '卡片' },
  { id: '8', name: 'Feature 2', characters: 'Secure Platform', pageName: 'Landing Page', frameName: 'Features Card', area: '卡片' },
  { id: '9', name: 'Contact', characters: '联系我们', pageName: 'Landing Page', frameName: 'Footer', area: '页脚' },
  { id: '10', name: 'Copyright', characters: '© 2024 All Rights Reserved', pageName: 'Landing Page', frameName: 'Footer', area: '页脚' },
  { id: '11', name: 'Search Input', characters: '搜索...', pageName: 'Dashboard', frameName: 'Search Bar', area: '搜索' },
  { id: '12', name: 'Profile', characters: '个人中心', pageName: 'Dashboard', frameName: 'Sidebar', area: '侧边栏' },
];

const TOKEN_STORAGE_KEY = 'figma-access-token';
const DEEPL_KEY_STORAGE_KEY = 'deepl-api-key';

export const UploadPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [showDeeplKey, setShowDeeplKey] = useState(false);
  const { 
    figmaUrl, setFigmaUrl, 
    accessToken, setAccessToken, 
    deeplApiKey, setDeeplApiKey,
    setExtractedTexts, goToNextStep 
  } = useWorkflowStore();

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (savedToken && !accessToken) setAccessToken(savedToken);
    const savedDeeplKey = localStorage.getItem(DEEPL_KEY_STORAGE_KEY);
    if (savedDeeplKey && !deeplApiKey) setDeeplApiKey(savedDeeplKey);
  }, []);

  useEffect(() => {
    if (accessToken) localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (deeplApiKey) localStorage.setItem(DEEPL_KEY_STORAGE_KEY, deeplApiKey);
  }, [deeplApiKey]);

  const handleExtract = async () => {
    if (!figmaUrl) return;
    setIsLoading(true);
    setError(null);

    try {
      let extractedTexts: FigmaTextNode[];

      if (accessToken) {
        const figmaService = createFigmaService(accessToken);
        extractedTexts = await figmaService.extractAllTextNodes(figmaUrl);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        extractedTexts = MOCK_TEXTS;
      }

      if (extractedTexts.length === 0) {
        setError('No text found in the Figma file');
        setIsLoading(false);
        return;
      }

      setExtractedTexts(extractedTexts);
      setIsLoading(false);
      goToNextStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract text');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-800 to-cyan-500 rounded-2xl mb-6 shadow-lg">
          <LinkIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Figma 多语言工作流</h1>
        <p className="text-xl text-gray-600">
          从 Figma 设计稿中自动提取文案，生成多语言文档
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Figma 文件链接
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={figmaUrl}
                onChange={(e) => setFigmaUrl(e.target.value)}
                placeholder="https://www.figma.com/file/..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-800 focus:ring-4 focus:ring-blue-50 transition-all text-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Figma Access Token
              <span className="text-gray-400 font-normal ml-2">(可选)</span>
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showToken ? 'text' : 'password'}
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="figd_..."
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-800 focus:ring-4 focus:ring-blue-50 transition-all"
              />
              <button type="button" onClick={() => setShowToken(!showToken)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">使用说明</p>
              <p>
                • 无 Access Token：使用模拟数据进行演示<br/>
                • 翻译服务：使用 DeepLX 公共代理（自动切换可用代理）<br/>
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">错误</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleExtract}
            disabled={!figmaUrl || isLoading}
            className="w-full py-4 bg-gradient-to-r from-blue-800 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-900 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                提取文案中...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                提取文案
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
