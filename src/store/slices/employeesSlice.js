import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '@/api/employees';
import { asList } from '../helpers';

export const fetchEmployees = createAsyncThunk('employees/fetch', (arg) => {
  if (arg && typeof arg === 'object') {
    return api.getEmployees(arg.employmentStatus ?? 'all', arg.search ?? '');
  }
  return api.getEmployees(arg ?? 'all');
});
export const fetchSpecialties = createAsyncThunk('employees/specialties', () => api.getSpecialties());
export const createSpecialty = createAsyncThunk('employees/createSpecialty', async (nameAr, { rejectWithValue }) => {
  try {
    return await api.createSpecialty(nameAr);
  } catch (err) {
    return rejectWithValue(err);
  }
});
export const updateSpecialty = createAsyncThunk('employees/updateSpecialty', async ({ id, nameAr }, { rejectWithValue }) => {
  try {
    return await api.updateSpecialty(id, nameAr);
  } catch (err) {
    return rejectWithValue(err);
  }
});
export const createEmployee = createAsyncThunk('employees/create', async (body, { rejectWithValue }) => {
  try {
    return await api.createEmployee(body);
  } catch (err) {
    return rejectWithValue(err);
  }
});
export const updateEmployee = createAsyncThunk('employees/update', async ({ id, body }, { rejectWithValue }) => {
  try {
    return await api.updateEmployee(id, body);
  } catch (err) {
    return rejectWithValue(err);
  }
});
export const fetchPayrollSettings = createAsyncThunk('employees/payrollSettings', (yearMonth) => api.getPayrollSettings(yearMonth));
export const savePayrollSettings = createAsyncThunk('employees/putPayrollSettings', ({ yearMonth, workDays }) =>
  api.putPayrollSettings(yearMonth, workDays)
);
export const fetchEmployeePayroll = createAsyncThunk('employees/payroll', ({ id, yearMonth }) =>
  api.getEmployeePayroll(id, yearMonth)
);
export const saveEmployeePayroll = createAsyncThunk('employees/putPayroll', ({ id, yearMonth, body }) =>
  api.putEmployeePayroll(id, yearMonth, body)
);
export const fetchPayrollReport = createAsyncThunk('employees/payrollReport', (yearMonth) => api.getPayrollReport(yearMonth));

const employeesSlice = createSlice({
  name: 'employees',
  initialState: {
    items: [],
    specialties: [],
    workDaysByYm: { '2026-09': 22 },
    payrollByKey: {},
    report: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.items = asList(action.payload);
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.push(action.payload);
        }
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.items.findIndex(e => e.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      })
      .addCase(fetchSpecialties.fulfilled, (state, action) => {
        state.specialties = asList(action.payload);
      })
      .addCase(createSpecialty.fulfilled, (state, action) => {
        if (action.payload) state.specialties.push(action.payload);
      })
      .addCase(updateSpecialty.fulfilled, (state, action) => {
        const row = action.payload;
        if (!row) return;
        const i = state.specialties.findIndex(s => s.id === row.id);
        if (i !== -1) state.specialties[i] = row;
      })
      .addCase(fetchPayrollSettings.fulfilled, (state, action) => {
        const ym = action.meta.arg;
        state.workDaysByYm[ym] = action.payload?.workDays ?? 22;
      })
      .addCase(savePayrollSettings.fulfilled, (state, action) => {
        const { yearMonth, workDays } = action.meta.arg;
        state.workDaysByYm[yearMonth] = workDays;
      })
      .addCase(fetchEmployeePayroll.fulfilled, (state, action) => {
        const { id, yearMonth } = action.meta.arg;
        state.payrollByKey[`${id}:${yearMonth}`] = action.payload;
      })
      .addCase(fetchPayrollReport.fulfilled, (state, action) => {
        state.report = action.payload;
      });
  },
});

export default employeesSlice.reducer;
