import React from 'react';
import { WorkflowSteps } from './components/WorkflowSteps';
import { UploadPage } from './pages/UploadPage';
import { PreviewPage } from './pages/PreviewPage';
import { BrandPlatformPage } from './pages/BrandPlatformPage';
import { TranslatePage } from './pages/TranslatePage';
import { useWorkflowStore } from './store';

export default function App() {
  const { currentStep } = useWorkflowStore();

  const renderPage = () => {
    switch (currentStep) {
      case 'upload':
        return <UploadPage />;
      case 'preview':
        return <PreviewPage />;
      case 'brand':
        return <BrandPlatformPage />;
      case 'translate':
        return <TranslatePage />;
      default:
        return <UploadPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-800 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 3.807 10.14 3 8.25 3 6.087 3 4.25 4.794 4.25 7s1.837 4 4.001 4c.56 0 1.1-.11 1.6-.314m2.298-3.424c.247.25.483.509.706.774" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Figma 多语言工作流</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Workflow Steps */}
        {currentStep !== 'complete' && <WorkflowSteps currentStep={currentStep} />}

        {/* Page Content */}
        <div className={currentStep !== 'complete' ? 'mt-8' : ''}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
