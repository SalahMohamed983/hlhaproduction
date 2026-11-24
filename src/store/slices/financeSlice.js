import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '@/api/finance';
import { asList } from '../helpers';

export const fetchInvoices = createAsyncThunk('finance/invoices', () => api.getInvoices());
export const fetchInvoice = createAsyncThunk('finance/invoice', (id) => api.getInvoice(id));
export const fetchOverdueInvoices = createAsyncThunk('finance/overdue', () => api.getOverdueInvoices());
export const fetchInvoiceReminderText = createAsyncThunk('finance/reminder', (id) => api.getInvoiceReminderText(id));
export const fetchOrderPayments = createAsyncThunk('finance/orderPayments', () => api.getOrderPayments());
export const fetchExpenses = createAsyncThunk('finance/expenses', (params) => api.getExpenses(params || {}));
export const createExpense = createAsyncThunk('finance/createExpense', (body) => api.createExpense(body));

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    invoices: [],
    overdue: [],
    invoiceDetails: null,
    orderPayments: [],
    expenses: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoices = asList(action.payload);
      })
      .addCase(fetchOverdueInvoices.fulfilled, (state, action) => {
        state.overdue = asList(action.payload);
      })
      .addCase(fetchInvoice.fulfilled, (state, action) => {
        state.invoiceDetails = action.payload;
      })
      .addCase(fetchOrderPayments.fulfilled, (state, action) => {
        state.orderPayments = asList(action.payload);
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.expenses = asList(action.payload);
      });
  },
  reducers: {
    clearInvoiceDetails(state) {
      state.invoiceDetails = null;
    },
  },
});

export const { clearInvoiceDetails } = financeSlice.actions;
export default financeSlice.reducer;
