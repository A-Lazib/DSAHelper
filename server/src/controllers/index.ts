import { Request, Response } from 'express';
import debugService from '../services/debugService.js';
import feedbackService from '../services/feedbackService.js';
import hintService from '../services/hintService.js';
import { getProblemById } from '../data/problems.js';
import { APIError } from '../types/index.js';

export class ProblemController {
  async getProblem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const problem = getProblemById(id);

      if (!problem) {
        return res.status(404).json({
          error: 'Problem not found'
        } as APIError);
      }

      res.json(problem);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as APIError);
    }
  }

  async getAllProblems(req: Request, res: Response) {
    try {
      const { getAllProblems } = await import('../data/problems.js');
      const problems = getAllProblems();
      res.json(problems);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as APIError);
    }
  }
}

export class DebugController {
  async debug(req: Request, res: Response) {
    try {
      const { problemId, code } = req.body;

      if (!problemId || !code) {
        return res.status(400).json({
          error: 'Missing required fields: problemId, code'
        } as APIError);
      }

      const problem = getProblemById(problemId);
      if (!problem) {
        return res.status(404).json({
          error: 'Problem not found'
        } as APIError);
      }

      const problemDescription = `${problem.title}\n\n${problem.description}\n\nExamples:\n${problem.examples
        .map((ex) => `Input: ${ex.input}\nOutput: ${ex.output}`)
        .join('\n\n')}`;

      const result = await debugService.analyzeCode({
        problemDescription,
        userCode: code
      });

      res.json(result);
    } catch (error) {
      console.error('Debug error:', error);
      res.status(500).json({
        error: 'Failed to analyze code',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as APIError);
    }
  }
}

export class FeedbackController {
  async feedback(req: Request, res: Response) {
    try {
      const { problemId, code } = req.body;

      if (!problemId || !code) {
        return res.status(400).json({
          error: 'Missing required fields: problemId, code'
        } as APIError);
      }

      const problem = getProblemById(problemId);
      if (!problem) {
        return res.status(404).json({
          error: 'Problem not found'
        } as APIError);
      }

      const problemDescription = `${problem.title}\n\n${problem.description}\n\nExamples:\n${problem.examples
        .map((ex) => `Input: ${ex.input}\nOutput: ${ex.output}`)
        .join('\n\n')}`;

      const result = await feedbackService.evaluateSolution({
        problemDescription,
        userCode: code,
        expectedTimeComplexity: problem.expectedTimeComplexity,
        expectedSpaceComplexity: problem.expectedSpaceComplexity
      });

      res.json(result);
    } catch (error) {
      console.error('Feedback error:', error);
      res.status(500).json({
        error: 'Failed to evaluate solution',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as APIError);
    }
  }
}

export class HintController {
  async hint(req: Request, res: Response) {
    try {
      const { problemId, hintLevel, code } = req.body;

      if (!problemId || !hintLevel) {
        return res.status(400).json({
          error: 'Missing required fields: problemId, hintLevel'
        } as APIError);
      }

      if (hintLevel < 1 || hintLevel > 3) {
        return res.status(400).json({
          error: 'hintLevel must be 1, 2, or 3'
        } as APIError);
      }

      const problem = getProblemById(problemId);
      if (!problem) {
        return res.status(404).json({
          error: 'Problem not found'
        } as APIError);
      }

      const problemDescription = `${problem.title}\n\n${problem.description}\n\nExamples:\n${problem.examples
        .map((ex) => `Input: ${ex.input}\nOutput: ${ex.output}`)
        .join('\n\n')}`;

      const result = await hintService.generateHint({
        problemDescription,
        userCode: code || '',
        hintLevel: hintLevel as 1 | 2 | 3,
        patterns: problem.patterns
      });

      res.json(result);
    } catch (error) {
      console.error('Hint error:', error);
      res.status(500).json({
        error: 'Failed to generate hint',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as APIError);
    }
  }
}
