import { DebugResponse, DebugIssue } from '../types/index.js';
import { analyzeDebugWithAI, isAIEnabled } from './aiService.js';

export interface DebugServiceOptions {
  problemDescription: string;
  userCode: string;
}

class DebugService {
  async analyzeCode(options: DebugServiceOptions): Promise<DebugResponse> {
    const { userCode, problemDescription } = options;

    if (isAIEnabled()) {
      const aiResult = await analyzeDebugWithAI({ problemDescription, userCode });
      if (aiResult) {
        return aiResult;
      }
    }

    const issues: DebugIssue[] = [];

    const hasNestedLoop = /for\s*\(.*\)\s*\{[\s\S]*for\s*\(/m.test(userCode)
      || /for\s+\w+\s+in\s+.*:[\s\S]*for\s+\w+\s+in\s+/m.test(userCode);

    const usesSort = /\.sort\s*\(/.test(userCode) || /sorted\s*\(/.test(userCode);
    const hasReturn = /\breturn\b/.test(userCode);

    if (!hasReturn) {
      issues.push({
        summary: 'Missing return value',
        location: 'Function body',
        logicExplanation: 'The solution does not return any output for the caller.',
        exampleFailingInput: 'nums = [2,7,11,15], target = 9',
        stepByStepFailure: [
          'The function runs its internal logic.',
          'No return statement is executed.',
          'The caller receives undefined/None instead of an answer.'
        ]
      });
    }

    if (hasNestedLoop) {
      issues.push({
        summary: 'Potential quadratic time complexity',
        location: 'Nested loop section',
        logicExplanation: 'Nested loops can cause O(n^2) behavior and may time out on large inputs.',
        exampleFailingInput: 'nums length near 10^4',
        stepByStepFailure: [
          'Outer loop iterates through most elements.',
          'Inner loop iterates again for each outer iteration.',
          'Total comparisons grow quadratically as input size increases.'
        ]
      });
    }

    if (usesSort && !/\bcopy\b|slice\s*\(/.test(userCode)) {
      issues.push({
        summary: 'Potential mutation side effect',
        location: 'Sorting step',
        logicExplanation: 'Sorting in-place can mutate the original input and break index-based expectations.',
        exampleFailingInput: 'nums = [3,2,4], target = 6',
        stepByStepFailure: [
          'Input array is reordered by sort.',
          'Original indices are lost or shifted.',
          'Returned index pair may not match the original array positions.'
        ]
      });
    }

    return {
      issueFound: issues.length > 0,
      issues,
      overallAnalysis: issues.length > 0
        ? 'Static checks found possible correctness or performance issues.'
        : 'No obvious static issues found. Run test cases to validate edge cases.'
    };
  }
}

export default new DebugService();
