import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '@/api/equipment';
import { asList } from '../helpers';

export const fetchEquipmentCategories = createAsyncThunk('equipment/categories', () => api.getEquipmentCategories());
export const createEquipmentCategory  = createAsyncThunk('equipment/createCategory', (body) => api.createEquipmentCategory(body));
export const deleteEquipmentCategory  = createAsyncThunk('equipment/deleteCategory', (id) => api.deleteEquipmentCategory(id));

export const fetchEquipment    = createAsyncThunk('equipment/list',   (categoryId) => api.getEquipment(categoryId || ''));
export const createEquipment   = createAsyncThunk('equipment/create', (body) => api.createEquipment(body));
export const updateEquipment   = createAsyncThunk('equipment/update', ({ id, body }) => api.updateEquipment(id, body));
export const deleteEquipment   = createAsyncThunk('equipment/delete', (id) => api.deleteEquipment(id));

export const fetchEquipmentReservations  = createAsyncThunk('equipment/reservations', (params) => api.getEquipmentReservations(params || {}));
export const createEquipmentReservation  = createAsyncThunk('equipment/reserve', ({ id, body }) => api.createEquipmentReservation(id, body));

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState: {
    categories: [],
    items: [],
    reservations: [],
    reservationsMeta: { totalCount: 0, page: 1, pageSize: 15, totalPages: 1 },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEquipmentCategories.fulfilled, (state, action) => {
        state.categories = asList(action.payload);
      })
      .addCase(fetchEquipment.fulfilled, (state, action) => {
        state.items = asList(action.payload);
      })
      .addCase(fetchEquipmentReservations.fulfilled, (state, action) => {
        const payload = action.payload;
        if (payload && typeof payload === 'object' && 'items' in payload) {
          state.reservations = payload.items;
          state.reservationsMeta = {
            totalCount: payload.totalCount,
            page: payload.page,
            pageSize: payload.pageSize,
            totalPages: payload.totalPages,
          };
        } else {
          state.reservations = asList(payload);
        }
      });
  },
});

export default equipmentSlice.reducer;
