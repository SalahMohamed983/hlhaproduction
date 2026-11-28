import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '@/api/orders';
import { asList } from '../helpers';

export const fetchOrders = createAsyncThunk('orders/fetch', (params) => api.getOrders(params || {}));
export const fetchOrder = createAsyncThunk('orders/fetchOne', (id) => api.getOrder(id));
export const createOrder = createAsyncThunk('orders/create', (body) => api.createOrder(body));
export const updateOrder = createAsyncThunk('orders/update', ({ id, data }) => api.updateOrder(id, data));
export const updateOrderStatus = createAsyncThunk('orders/status', ({ id, status }) => api.updateOrderStatus(id, status));
export const assignOrderEmployee = createAsyncThunk('orders/assign', ({ id, employeeId, assign }) =>
  api.assignOrderEmployee(id, employeeId, assign)
);
export const recordOrderPayment = createAsyncThunk('orders/payment', ({ id, data }) =>
  api.recordOrderPayment(id, data)
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { items: [], current: null, status: 'idle' },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.items = asList(action.payload);
        state.status = 'succeeded';
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  },
});

export default ordersSlice.reducer;
