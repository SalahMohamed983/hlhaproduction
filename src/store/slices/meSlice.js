import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '@/api/me';
import { asList } from '../helpers';

export const fetchMyTasks = createAsyncThunk('me/tasks', (includeCompleted) => api.getMyTasks(includeCompleted ?? false));
export const fetchMyHistory = createAsyncThunk('me/history', () => api.getMyHistory());
export const updateMyOrderStatus = createAsyncThunk('me/status', ({ orderId, status }) =>
  api.updateMyOrderStatus(orderId, status)
);
export const updateMyAssignment = createAsyncThunk('me/assignment', ({ orderId, payload }) =>
  api.updateMyAssignment(orderId, payload)
);

const meSlice = createSlice({
  name: 'me',
  initialState: { tasks: [], history: [], loading: true },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyTasks.pending, (state) => { state.loading = true; })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.tasks = asList(action.payload);
        state.loading = false;
      })
      .addCase(fetchMyTasks.rejected, (state) => { state.loading = false; })
      .addCase(fetchMyHistory.pending, (state) => { state.loading = true; })
      .addCase(fetchMyHistory.fulfilled, (state, action) => {
        state.history = asList(action.payload);
        state.loading = false;
      })
      .addCase(fetchMyHistory.rejected, (state) => { state.loading = false; });
  },
});

export default meSlice.reducer;
