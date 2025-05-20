import { Problem } from '../store/slices/problemsSlice';
import { Submission } from '../store/slices/submissionsSlice';

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface GetProblemsResponse {
  problems: Problem[];
  total: number;
}

export interface GetProblemResponse {
  problem: Problem;
}

export interface GetSubmissionsResponse {
  submissions: Submission[];
  total: number;
}

export interface SubmitCodeRequest {
  problemId: number;
  code: string;
  language: string;
}

export interface SubmitCodeResponse {
  submission: Submission;
} 