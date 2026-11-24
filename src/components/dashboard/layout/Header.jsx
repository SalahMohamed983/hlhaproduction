import { useState } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { NOTIFICATIONS } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

const roleLabels = { ADMIN: 'أدمن', EMPLOYEE: 'موظف' };
const roleBg = { ADMIN: '#F59E0B', EMPLOYEE: '#10B981' };

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unread = notifs.filter(n => !n.read).length;

  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const notifColors = { warning: '#F59E0B', info: '#3B82F6', success: '#10B981', error: '#EF4444' };

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 gap-4">
      {/* Mobile menu */}
      <button onClick={onMenuClick} className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
        <Menu size={20}/>
      </button>

      {/* Search */}
      <div className="flex-1 max-w-sm hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2">
        <Search size={16} className="text-slate-400"/>
        <input className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none flex-1" placeholder="بحث في الطلبات والمهام..." />
      </div>

      <span className="hidden sm:inline text-xs font-semibold px-3 py-1.5 rounded-lg text-white" style={{ background: roleBg[user?.role] || '#64748b' }}>
        {roleLabels[user?.role] || user?.role}
      </span>

      {/* Notifications */}
      <div className="relative">
        <button onClick={() => setShowNotif(!showNotif)}
          className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Bell size={20}/>
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unread}</span>
          )}
        </button>
        {showNotif && (
          <div className="absolute left-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">الإشعارات</h3>
              {unread > 0 && <span className="text-xs text-amber-500 font-medium">{unread} غير مقروء</span>}
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-80 overflow-y-auto">
              {notifs.map(n => (
                <div key={n.id} onClick={() => markRead(n.id)}
                  className={`px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!n.read ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: notifColors[n.type] }}/>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{n.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1.5"/>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-sm font-bold text-slate-900">
          {user?.name?.charAt(0) ?? 'م'}
        </div>
      </div>
    </header>
  );
}
