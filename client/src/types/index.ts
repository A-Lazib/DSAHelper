// Type definitions for frontend

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  patterns: string[];
  expectedTimeComplexity: string;
  expectedSpaceComplexity: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints?: string[];
}

export interface DebugIssue {
  summary: string;
  location: string;
  logicExplanation: string;
  exampleFailingInput: string;
  stepByStepFailure: string[];
}

export interface DebugResponse {
  issueFound: boolean;
  issues: DebugIssue[];
  overallAnalysis: string;
}

export interface FeedbackResponse {
  correctness: {
    status: 'pass' | 'issues';
    details: string;
  };
  timeComplexity: {
    detected: string;
    expected: string;
    isOptimal: boolean;
    explanation: string;
  };
  spaceComplexity: {
    detected: string;
    expected: string;
    isOptimal: boolean;
    explanation: string;
  };
  optimizationSuggestions: string[];
  codeQualityNotes: string[];
  comparison: string;
}

export interface HintResponse {
  level: 1 | 2 | 3;
  hint: string;
  nextLevelAvailable: boolean;
}
