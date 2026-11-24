import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getServices } from '@/api/services';
import { asList } from '../helpers';

export const fetchServices = createAsyncThunk('services/fetch', () => getServices());

const servicesSlice = createSlice({
  name: 'services',
  initialState: { items: [] },
  extraReducers: (builder) => {
    builder.addCase(fetchServices.fulfilled, (state, action) => {
      state.items = asList(action.payload);
    });
  },
});

export default servicesSlice.reducer;
