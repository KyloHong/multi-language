import { create } from 'zustand';
import {
  FigmaTextNode,
  Brand,
  Platform,
  TranslationResult,
  ProofreadResult,
  WorkflowStep,
} from '../types';

interface WorkflowStore {
  currentStep: WorkflowStep;
  figmaUrl: string;
  accessToken: string;
  deeplApiKey: string;
  extractedTexts: FigmaTextNode[];
  selectedBrand: Brand | null;
  selectedPlatform: Platform | null;
  translations: TranslationResult;
  proofreadResult: ProofreadResult | null;
  setCurrentStep: (step: WorkflowStep) => void;
  setFigmaUrl: (url: string) => void;
  setAccessToken: (token: string) => void;
  setDeeplApiKey: (key: string) => void;
  setExtractedTexts: (texts: FigmaTextNode[]) => void;
  setSelectedBrand: (brand: Brand | null) => void;
  setSelectedPlatform: (platform: Platform | null) => void;
  setTranslations: (translations: TranslationResult) => void;
  setProofreadResult: (result: ProofreadResult | null) => void;
  resetWorkflow: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const stepOrder: WorkflowStep[] = ['upload', 'preview', 'brand', 'translate'];

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  currentStep: 'upload',
  figmaUrl: '',
  accessToken: '',
  deeplApiKey: '',
  extractedTexts: [],
  selectedBrand: null,
  selectedPlatform: null,
  translations: {},
  proofreadResult: null,

  setCurrentStep: (step) => set({ currentStep: step }),
  setFigmaUrl: (url) => set({ figmaUrl: url }),
  setAccessToken: (token) => set({ accessToken: token }),
  setDeeplApiKey: (key) => set({ deeplApiKey: key }),
  setExtractedTexts: (texts) => set({ extractedTexts: texts }),
  setSelectedBrand: (brand) => set({ selectedBrand: brand }),
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
  setTranslations: (translations) => set({ translations }),
  setProofreadResult: (result) => set({ proofreadResult: result }),

  resetWorkflow: () =>
    set({
      currentStep: 'upload',
      figmaUrl: '',
      accessToken: '',
      deeplApiKey: '',
      extractedTexts: [],
      selectedBrand: null,
      selectedPlatform: null,
      translations: {},
      proofreadResult: null,
    }),

  goToNextStep: () => {
    const { currentStep } = get();
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      set({ currentStep: stepOrder[currentIndex + 1] });
    }
  },

  goToPreviousStep: () => {
    const { currentStep } = get();
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      set({ currentStep: stepOrder[currentIndex - 1] });
    }
  },
}));
