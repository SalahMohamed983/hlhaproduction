import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOverview, getAnalytics } from '@/api/dashboard';

export const fetchOverview = createAsyncThunk('dashboard/overview', (yearMonth) => getOverview(yearMonth || ''));
export const fetchAnalytics = createAsyncThunk('dashboard/analytics', () => getAnalytics());

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { overview: null, analytics: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.overview = action.payload;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
