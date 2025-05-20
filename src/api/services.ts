import client from './client';
import {
  GetProblemsResponse,
  GetProblemResponse,
  GetSubmissionsResponse,
  SubmitCodeRequest,
  SubmitCodeResponse,
  ApiResponse
} from './types';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const problemsApi = {
  getProblems: async (params?: { category?: string; difficulty?: string }) => {
    const response = await axios.get<ApiResponse<GetProblemsResponse>>(`${API_BASE_URL}/problems`, { params });
    return response.data;
  },

  getProblem: async (id: number) => {
    const response = await axios.get<ApiResponse<GetProblemResponse>>(`${API_BASE_URL}/problems/${id}`);
    return response.data;
  },

  submitCode: async (data: SubmitCodeRequest) => {
    const response = await axios.post<ApiResponse<SubmitCodeResponse>>(`${API_BASE_URL}/submissions`, data);
    return response.data;
  },

  runTestCase: async (data: { problemId: number; code: string; language: string; input: string }) => {
    const response = await axios.post<ApiResponse<{ output: string }>>(`${API_BASE_URL}/problems/${data.problemId}/run`, data);
    return response.data;
  }
};

export const submissionsApi = {
  getSubmissions: async () => {
    const response = await client.get<ApiResponse<GetSubmissionsResponse>>('/submissions');
    return response.data;
  },

  getSubmission: async (id: number) => {
    const response = await client.get<ApiResponse<SubmitCodeResponse>>(`/submissions/${id}`);
    return response.data;
  }
}; 