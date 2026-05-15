export interface FigmaTextNode {
  id: string;
  name: string;
  characters: string;
  pageName: string;
  frameName?: string;
  area?: string;
}

export interface Brand {
  id: string;
  name: string;
  shortName: string;
  platforms: Platform[];
}

export interface Platform {
  id: string;
  name: string;
  languages: string[];
}

export interface TranslationResult {
  [key: string]: {
    [lang: string]: string;
  };
}

export interface DuplicateGroup {
  text: string;
  occurrences: {
    nodeId: string;
    pageName: string;
    frameName?: string;
  }[];
  sameScene: boolean;
}

export interface QualityScore {
  nodeId: string;
  text: string;
  score: number;
  issues: string[];
}

export interface Suggestion {
  original: string;
  suggested: string;
  reason: string;
}

export interface ProofreadResult {
  duplicates: DuplicateGroup[];
  qualityScores: QualityScore[];
  suggestions: Suggestion[];
}

export interface ExtractTextsRequest {
  figmaUrl: string;
  accessToken: string;
}

export interface ExtractTextsResponse {
  success: boolean;
  nodes: FigmaTextNode[];
}

export interface TranslateRequest {
  texts: string[];
  sourceLang: string;
  targetLangs: string[];
}

export interface TranslateResponse {
  translations: TranslationResult;
}

export type WorkflowStep = 'upload' | 'preview' | 'brand' | 'translate' | 'proofread' | 'complete';
