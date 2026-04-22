import axios from 'axios';
import type { Problem, DebugResponse, FeedbackResponse, HintResponse } from '../types/index';

const API = axios.create({
  baseURL: '/api'
});

export const problemAPI = {
  getAll: async (): Promise<Problem[]> => {
    const response = await API.get('/problems');
    return response.data;
  },

  getById: async (id: string): Promise<Problem> => {
    const response = await API.get(`/problems/${id}`);
    return response.data;
  }
};

export const debugAPI = {
  analyze: async (problemId: string, code: string): Promise<DebugResponse> => {
    const response = await API.post('/debug', { problemId, code });
    return response.data;
  }
};

export const feedbackAPI = {
  evaluate: async (problemId: string, code: string): Promise<FeedbackResponse> => {
    const response = await API.post('/feedback', { problemId, code });
    return response.data;
  }
};

export const hintAPI = {
  getHint: async (problemId: string, hintLevel: 1 | 2 | 3, code: string = ''): Promise<HintResponse> => {
    const response = await API.post('/hint', { problemId, hintLevel, code });
    return response.data;
  }
};
