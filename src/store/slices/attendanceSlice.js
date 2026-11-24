import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '@/api/attendance';

export const fetchAttendance = createAsyncThunk('attendance/fetch', (date) => api.getAttendance(date));
export const saveAttendance = createAsyncThunk('attendance/put', ({ date, employeeId, body }) =>
  api.putAttendance(date, employeeId, body)
);
export const markAllPresent = createAsyncThunk('attendance/markAll', (date) => api.markAllPresent(date));
export const syncAttendanceMonth = createAsyncThunk('attendance/syncMonth', (date) => api.syncAttendanceMonth(date));

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: { day: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.day = action.payload;
      })
      .addCase(markAllPresent.fulfilled, (state, action) => {
        state.day = action.payload;
      })
      .addCase(saveAttendance.fulfilled, (state, action) => {
        if (!state.day?.rows || !action.payload) return;
        const row = action.payload;
        state.day.rows = state.day.rows.map((r) => (r.employeeId === row.employeeId ? row : r));
      });
  },
});

export default attendanceSlice.reducer;
