import { HintResponse } from '../types/index.js';
import { analyzeHintWithAI, isAIEnabled } from './aiService.js';

export interface HintServiceOptions {
  problemDescription: string;
  userCode: string;
  hintLevel: 1 | 2 | 3;
  patterns: string[];
}

class HintService {
  async generateHint(options: HintServiceOptions): Promise<HintResponse> {
    const { hintLevel, patterns, problemDescription, userCode } = options;

    if (isAIEnabled()) {
      const aiResult = await analyzeHintWithAI({
        problemDescription,
        userCode,
        hintLevel
      });

      if (aiResult) {
        return aiResult;
      }
    }

    const primaryPattern = patterns[0] ?? 'array processing';

    const hints: Record<1 | 2 | 3, string> = {
      1: `Recommended data structure: ${primaryPattern}. Aim for a linear pass when possible and avoid nested scans unless required.`,
      2: `Try this high-level approach: track what you have seen so far and make each step answerable using constant-time lookup. This problem usually follows a ${primaryPattern} pattern.`,
      3: `Step strategy:\n1) Initialize the main helper structure.\n2) Iterate once through the input.\n3) At each step, compute what counterpart/value/state would complete the answer.\n4) Check helper structure first, then update it.\n5) Return immediately when condition is met.`
    };

    return {
      level: hintLevel,
      hint: hints[hintLevel],
      nextLevelAvailable: hintLevel < 3
    };
  }
}

export default new HintService();
