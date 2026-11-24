import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getClients, getClient } from '@/api/clients';
import { asList } from '../helpers';

export const fetchClients = createAsyncThunk('clients/fetch', (params) => getClients(params || {}));
export const fetchClient = createAsyncThunk('clients/fetchOne', (id) => getClient(id));

const clientsSlice = createSlice({
  name: 'clients',
  initialState: { items: [], current: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.items = asList(action.payload);
      })
      .addCase(fetchClient.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  },
  reducers: {
    clearClient(state) {
      state.current = null;
    },
  },
});

export const { clearClient } = clientsSlice.actions;
export default clientsSlice.reducer;
