import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Submission {
  id: number;
  problemId: number;
  problemTitle: string;
  status: string;
  language: string;
  runtime: string;
  memory: string;
  submittedAt: string;
}

interface SubmissionsState {
  submissions: Submission[];
  loading: boolean;
  error: string | null;
}

const initialState: SubmissionsState = {
  submissions: [],
  loading: false,
  error: null,
};

export const fetchSubmissions = createAsyncThunk(
  'submissions/fetchSubmissions',
  async () => {
    const response = await axios.get('/api/submissions');
    return response.data;
  }
);

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch submissions';
      });
  },
});

export default submissionsSlice.reducer; 