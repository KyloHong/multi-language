import React, { useState } from 'react';
import { Search, Edit2, Trash2, FileText, ChevronLeft, ChevronRight, Hash, Tag, Download } from 'lucide-react';
import { useWorkflowStore } from '../store';
import { exportPreviewToXlsx } from '../services/previewExport';

export const PreviewPage: React.FC = () => {
  const { extractedTexts, setExtractedTexts, goToNextStep, goToPreviousStep } = useWorkflowStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [downloading, setDownloading] = useState(false);

  const uniqueTextsMap = new Map<string, typeof extractedTexts[0]>();
  extractedTexts.forEach((text) => {
    if (!uniqueTextsMap.has(text.characters)) {
      uniqueTextsMap.set(text.characters, text);
    }
  });

  let uniqueTexts = Array.from(uniqueTextsMap.values());

  const groupedByTopFrame = uniqueTexts.reduce((acc, text) => {
    const topFrame = text.frameName || '无 Frame';
    
    if (!acc[topFrame]) {
      acc[topFrame] = [];
    }
    
    acc[topFrame].push(text);
    
    return acc;
  }, {} as Record<string, typeof uniqueTexts>);

  const topFrames = Object.keys(groupedByTopFrame).sort((a, b) => {
    if (a === '无 Frame' && b !== '无 Frame') return 1;
    if (a !== '无 Frame' && b === '无 Frame') return -1;
    return a.localeCompare(b);
  });

  const filteredTexts = uniqueTexts.filter((text) =>
    text.characters.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (text.frameName && text.frameName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (text.name && text.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    setExtractedTexts(extractedTexts.filter((t) => t.id !== id));
  };

  const handleEditStart = (id: string, currentText: string) => {
    setEditingId(id);
    setEditValue(currentText);
  };

  const handleEditSave = (id: string) => {
    setExtractedTexts(
      extractedTexts.map((t) => (t.id === id ? { ...t, characters: editValue } : t))
    );
    setEditingId(null);
  };

  const handleDownload = async () => {
    if (uniqueTexts.length === 0) {
      alert('没有可下载的文案');
      return;
    }
    
    setDownloading(true);
    try {
      await exportPreviewToXlsx(extractedTexts, 'Figma');
      alert('下载成功！');
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请重试');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-gray-900">文案预览</h1>
          <button
            onClick={handleDownload}
            disabled={downloading || uniqueTexts.length === 0}
            className="px-4 py-2 text-sm font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {downloading ? '下载中...' : '下载 XLSX'}
          </button>
        </div>
        <p className="text-sm text-gray-500">
          共 {uniqueTexts.length} 条文案
          {uniqueTexts.length !== extractedTexts.length && (
            <span className="ml-2 text-gray-400">
              （已过滤 {extractedTexts.length - uniqueTexts.length} 条重复）
            </span>
          )}
          <span className="ml-2 text-gray-400">
            · {topFrames.length} 个 Frame
          </span>
        </p>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索文案、节点名称或 Frame..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredTexts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">没有找到匹配的文案</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filteredTexts.map((text, index) => (
              <div
                key={text.id}
                className="p-3 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {editingId === text.id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleEditSave(text.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEditSave(text.id)}
                        className="w-full px-2 py-1 text-sm border-2 border-blue-500 rounded focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      <p className="text-sm text-gray-800">{text.characters}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {text.area && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                        <Tag className="w-3 h-3" />
                        {text.area}
                      </span>
                    )}
                    {text.frameName && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                        <Hash className="w-3 h-3" />
                        {text.frameName}
                      </span>
                    )}
                    {editingId !== text.id && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditStart(text.id, text.characters)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(text.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={goToPreviousStep}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          返回
        </button>
        <button
          onClick={goToNextStep}
          disabled={uniqueTexts.length === 0}
          className="px-6 py-2 text-sm bg-gradient-to-r from-blue-800 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-900 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center gap-1.5"
        >
          下一步
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
