import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { OrderProvider } from '@/context/OrderContext';
import { AuthProvider } from '@/context/AuthContext';
import { DashboardProvider } from '@/context/DashboardContext';
import { SiteContentProvider } from '@/context/SiteContentContext';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import ProtectedRoute from '@/router/ProtectedRoute';
import Overview from '@/pages/dashboard/admin/Overview';
import Orders from '@/pages/dashboard/admin/Orders';
import Team from '@/pages/dashboard/admin/Team';
import Financials from '@/pages/dashboard/admin/Financials';
import Attendance from '@/pages/dashboard/admin/Attendance';
import Clients from '@/pages/dashboard/admin/Clients';
import Equipment from '@/pages/dashboard/admin/Equipment';
import EquipmentReservations from '@/pages/dashboard/admin/EquipmentReservations';
import Analytics from '@/pages/dashboard/admin/Analytics';
import Invoices from '@/pages/dashboard/admin/Invoices';
import SiteContent from '@/pages/dashboard/admin/SiteContent';
import EmployeeTasks from '@/pages/dashboard/employee/Tasks';
import EmployeeHistory from '@/pages/dashboard/employee/History';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DashboardProvider>
          <SiteContentProvider>
          <ThemeProvider>
            <OrderProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="admin/overview" replace />} />
                  <Route path="admin/*" element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <Routes>
                        <Route path="overview" element={<Overview />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="attendance" element={<Attendance />} />
                        <Route path="clients" element={<Clients />} />
                        <Route path="clients/:id" element={<Clients />} />
                        <Route path="equipment" element={<Equipment />} />
                        <Route path="equipment/reservations" element={<EquipmentReservations />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="invoices" element={<Invoices />} />
                        <Route path="site-content" element={<SiteContent />} />
                        <Route path="team" element={<Team />} />
                        <Route path="financials" element={<Financials />} />
                        <Route path="*" element={<Navigate to="overview" replace />} />
                      </Routes>
                    </ProtectedRoute>
                  } />
                  <Route path="employee/*" element={
                    <ProtectedRoute roles={['EMPLOYEE']}>
                      <Routes>
                        <Route path="tasks" element={<EmployeeTasks />} />
                        <Route path="history" element={<EmployeeHistory />} />
                        <Route path="*" element={<Navigate to="tasks" replace />} />
                      </Routes>
                    </ProtectedRoute>
                  } />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </OrderProvider>
          </ThemeProvider>
          </SiteContentProvider>
        </DashboardProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
