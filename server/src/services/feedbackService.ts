import { FeedbackResponse } from '../types/index.js';
import { analyzeFeedbackWithAI, isAIEnabled } from './aiService.js';

export interface FeedbackServiceOptions {
  problemDescription: string;
  userCode: string;
  expectedTimeComplexity: string;
  expectedSpaceComplexity: string;
}

class FeedbackService {
  async evaluateSolution(options: FeedbackServiceOptions): Promise<FeedbackResponse> {
    const { problemDescription, userCode, expectedTimeComplexity, expectedSpaceComplexity } = options;

    if (isAIEnabled()) {
      const aiResult = await analyzeFeedbackWithAI({
        problemDescription,
        userCode,
        expectedTimeComplexity,
        expectedSpaceComplexity
      });

      if (aiResult) {
        return aiResult;
      }
    }

    const hasNestedLoop = /for\s*\(.*\)\s*\{[\s\S]*for\s*\(/m.test(userCode)
      || /for\s+\w+\s+in\s+.*:[\s\S]*for\s+\w+\s+in\s+/m.test(userCode);
    const usesMapOrSet = /Map\s*\(|Set\s*\(|\{\s*\}|new\s+Map|new\s+Set|dict\s*\(|\{\}/.test(userCode);
    const hasReturn = /\breturn\b/.test(userCode);

    const detectedTime = hasNestedLoop ? 'O(n^2)' : (usesMapOrSet ? 'O(n)' : 'O(n) to O(n log n)');
    const detectedSpace = usesMapOrSet ? 'O(n)' : 'O(1) to O(n)';
    const timeOptimal = detectedTime === expectedTimeComplexity;
    const spaceOptimal = detectedSpace === expectedSpaceComplexity;

    const optimizationSuggestions: string[] = [];
    if (hasNestedLoop) {
      optimizationSuggestions.push('Try a hash map / set approach to remove nested loops when possible.');
    }
    if (!usesMapOrSet) {
      optimizationSuggestions.push('Consider whether a dictionary/set can reduce repeated searches.');
    }

    const codeQualityNotes: string[] = [];
    if (!hasReturn) {
      codeQualityNotes.push('The function appears to miss a return path for expected output.');
    }
    if (!/\bclass\s+Solution\b/.test(userCode)) {
      codeQualityNotes.push('If targeting LeetCode style, keep the Solution class wrapper for consistency.');
    }

    return {
      correctness: {
        status: hasReturn ? 'pass' : 'issues',
        details: hasReturn
          ? 'No obvious missing-return issue found in static checks.'
          : 'Missing return statement was detected in static checks.'
      },
      timeComplexity: {
        detected: detectedTime,
        expected: expectedTimeComplexity,
        isOptimal: timeOptimal,
        explanation: timeOptimal
          ? 'Detected structure appears aligned with expected target complexity.'
          : 'Detected structure may be slower than the expected target complexity.'
      },
      spaceComplexity: {
        detected: detectedSpace,
        expected: expectedSpaceComplexity,
        isOptimal: spaceOptimal,
        explanation: spaceOptimal
          ? 'Detected space usage appears aligned with expected target.'
          : 'Detected space usage may exceed the expected target.'
      },
      optimizationSuggestions,
      codeQualityNotes,
      comparison: `Expected: time ${expectedTimeComplexity}, space ${expectedSpaceComplexity}. Detected: time ${detectedTime}, space ${detectedSpace}.`
    };
  }
}

export default new FeedbackService();
