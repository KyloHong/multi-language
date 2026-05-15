import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { WorkflowStep } from '../types';

interface WorkflowStepsProps {
  currentStep: WorkflowStep;
}

const steps: { id: WorkflowStep; label: string }[] = [
  { id: 'upload', label: 'Figma 链接' },
  { id: 'preview', label: '文案预览' },
  { id: 'brand', label: '品牌平台' },
  { id: 'translate', label: '多语言翻译' },
];

export const WorkflowSteps: React.FC<WorkflowStepsProps> = ({ currentStep }) => {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-cyan-500 text-white'
                      : isCurrent
                      ? 'bg-blue-800 text-white scale-110'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-medium transition-colors ${
                    isCurrent ? 'text-blue-800' : isCompleted ? 'text-cyan-600' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`flex-1 h-1 mx-4 transition-colors ${
                    index < currentIndex ? 'bg-cyan-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
