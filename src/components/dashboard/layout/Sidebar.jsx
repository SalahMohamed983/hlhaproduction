import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Users, DollarSign,
  CheckSquare, History, LogOut, ChevronRight, Sun, Moon, X,
  CalendarCheck, Contact, Camera, BarChart3, FileText, Clapperboard, BookOpen,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const adminNav = [
  { to: '/dashboard/admin/overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { to: '/dashboard/admin/orders', label: 'الطلبات', icon: ShoppingCart },
  { to: '/dashboard/admin/attendance', label: 'الحضور اليومي', icon: CalendarCheck },
  { to: '/dashboard/admin/clients', label: 'العملاء', icon: Contact },
  { to: '/dashboard/admin/equipment', label: 'المعدات', icon: Camera },
  { to: '/dashboard/admin/equipment/reservations', label: 'سجل الحجوزات', icon: BookOpen },
  { to: '/dashboard/admin/analytics', label: 'التحليلات', icon: BarChart3 },
  { to: '/dashboard/admin/invoices', label: 'الفواتير', icon: FileText },
  { to: '/dashboard/admin/site-content', label: 'محتوى الموقع', icon: Clapperboard },
  { to: '/dashboard/admin/team', label: 'الفريق', icon: Users },
  { to: '/dashboard/admin/financials', label: 'الماليات', icon: DollarSign },
];

const empNav = [
  { to: '/dashboard/employee/tasks', label: 'مهامي', icon: CheckSquare },
  { to: '/dashboard/employee/history', label: 'سجل الأعمال', icon: History },
];

const roleLabels = { ADMIN: 'مدير النظام', EMPLOYEE: 'متخصص' };

export default function Sidebar({ collapsed, setCollapsed, darkMode: propDarkMode, setDarkMode: propSetDarkMode, mobile, onClose }) {
  const { user, logout } = useAuth();
  const themeCtx = useTheme();
  const darkMode = propDarkMode !== undefined ? propDarkMode : themeCtx.darkMode;
  const setDarkMode = propSetDarkMode !== undefined ? propSetDarkMode : themeCtx.setDarkMode;
  const location = useLocation();
  const nav = user?.role === 'ADMIN' ? adminNav : empNav;

  return (
    <aside className={`flex flex-col h-full bg-slate-900 text-white transition-all duration-300 ${collapsed && !mobile ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700">
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-900 font-black text-sm">ه</div>
            <span className="font-bold text-lg">هلها برودكشن</span>
          </div>
        )}
        {mobile ? (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700"><X size={18}/></button>
        ) : (
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-slate-700">
            <ChevronRight size={18} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* User profile */}
      {(!collapsed || mobile) && user && (
        <div className="px-4 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 font-bold text-sm flex-shrink-0">
              {user.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300">{roleLabels[user.role]}</span>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(item => {
          const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
          return (
            <Link key={item.to} to={item.to}
              onClick={mobile ? onClose : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${active ? 'bg-amber-400 text-slate-900 font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'} ${collapsed && !mobile ? 'justify-center' : ''}`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {(!collapsed || mobile) && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-700 space-y-1">
        <button onClick={() => setDarkMode(!darkMode)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${collapsed && !mobile ? 'justify-center' : ''}`}
        >
          {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
          {(!collapsed || mobile) && <span className="text-sm">{darkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}</span>}
        </button>
        <button onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-900/30 transition-colors ${collapsed && !mobile ? 'justify-center' : ''}`}
        >
          <LogOut size={20}/>
          {(!collapsed || mobile) && <span className="text-sm">تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}
