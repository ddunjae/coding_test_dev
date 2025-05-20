import client from './client';
import {
  GetProblemsResponse,
  GetProblemResponse,
  GetSubmissionsResponse,
  SubmitCodeRequest,
  SubmitCodeResponse,
  ApiResponse
} from './types';

export const problemsApi = {
  getProblems: async (params?: { category?: string; difficulty?: string }) => {
    const response = await client.get<ApiResponse<GetProblemsResponse>>('/problems', { params });
    return response.data;
  },

  getProblem: async (id: number) => {
    const response = await client.get<ApiResponse<GetProblemResponse>>(`/problems/${id}`);
    return response.data;
  },

  submitCode: async (data: SubmitCodeRequest) => {
    const response = await client.post<ApiResponse<SubmitCodeResponse>>('/submissions', data);
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