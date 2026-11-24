import { configureStore } from '@reduxjs/toolkit';
import orders from './slices/ordersSlice';
import services from './slices/servicesSlice';
import employees from './slices/employeesSlice';
import clients from './slices/clientsSlice';
import finance from './slices/financeSlice';
import dashboard from './slices/dashboardSlice';
import attendance from './slices/attendanceSlice';
import equipment from './slices/equipmentSlice';
import cms from './slices/cmsSlice';
import me from './slices/meSlice';
import publicContent from './slices/publicSlice';

export const store = configureStore({
  reducer: {
    orders,
    services,
    employees,
    clients,
    finance,
    dashboard,
    attendance,
    equipment,
    cms,
    me,
    publicContent,
  },
});
