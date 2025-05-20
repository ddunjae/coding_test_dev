import { configureStore } from '@reduxjs/toolkit';
import problemsReducer from './slices/problemsSlice';
import submissionsReducer from './slices/submissionsSlice';

export const store = configureStore({
  reducer: {
    problems: problemsReducer,
    submissions: submissionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 