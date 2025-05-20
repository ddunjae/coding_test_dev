import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { problemsApi } from '../../api/services';

export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  acceptance: string;
  description?: string;
  testCases?: TestCase[];
}

interface TestCase {
  input: string;
  output: string;
}

interface ProblemsState {
  problems: Problem[];
  selectedProblem: Problem | null;
  loading: boolean;
  error: string | null;
  filters: {
    category: string;
    difficulty: string;
  };
}

const initialState: ProblemsState = {
  problems: [],
  selectedProblem: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    difficulty: ''
  }
};

// Async thunks
export const fetchProblems = createAsyncThunk(
  'problems/fetchProblems',
  async (params?: { category?: string; difficulty?: string }) => {
    const response = await problemsApi.getProblems(params);
    return response.data.problems;
  }
);

export const fetchProblem = createAsyncThunk(
  'problems/fetchProblem',
  async (id: number) => {
    const response = await problemsApi.getProblem(id);
    return response.data.problem;
  }
);

const problemsSlice = createSlice({
  name: 'problems',
  initialState,
  reducers: {
    setSelectedProblem: (state, action: PayloadAction<Problem | null>) => {
      state.selectedProblem = action.payload;
    },
    setFilters: (state, action: PayloadAction<{ category: string; difficulty: string }>) => {
      state.filters = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchProblems
      .addCase(fetchProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = action.payload;
      })
      .addCase(fetchProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch problems';
      })
      // fetchProblem
      .addCase(fetchProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProblem = action.payload;
      })
      .addCase(fetchProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch problem';
      });
  }
});

export const {
  setSelectedProblem,
  setFilters
} = problemsSlice.actions;

export default problemsSlice.reducer; 