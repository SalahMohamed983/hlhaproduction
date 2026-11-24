import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { darkMode, setDarkMode } = useTheme();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const path = window.location.pathname;
    if (user.role === 'EMPLOYEE' && !path.includes('/employee')) {
      navigate('/dashboard/employee/tasks');
    }
    if (user.role === 'ADMIN' && path.includes('/employee')) {
      navigate('/dashboard/admin/overview');
    }
  }, [user?.role]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 font-cairo" dir="rtl">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} darkMode={darkMode} setDarkMode={setDarkMode}/>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)}/>
          <div className="absolute right-0 top-0 h-full w-64 flex">
            <Sidebar mobile onClose={() => setMobileOpen(false)} darkMode={darkMode} setDarkMode={setDarkMode}/>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileOpen(true)}/>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}
