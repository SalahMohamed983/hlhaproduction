import { useDashboard } from '@/context/DashboardContext';
import { Settings as SettingsIcon, Video, Palette, Code, Users, Briefcase, FileText } from 'lucide-react';

const iconMap = { Video, Palette, Code, Users, Briefcase, FileText };
const fmt = n => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(n);

export default function Settings() {
  const { services, toggleService } = useDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">الإعدادات</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">إدارة الخدمات والأسعار والأذونات</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map(svc => {
          const Icon = iconMap[svc.icon] ?? SettingsIcon;
          return (
            <div key={svc.id} className={`bg-white dark:bg-slate-800 rounded-2xl border ${svc.enabled ? 'border-amber-300 dark:border-amber-700/50' : 'border-slate-200 dark:border-slate-700'} p-5 shadow-sm transition-all`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${svc.enabled ? 'bg-amber-400/20 text-amber-500' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                    <Icon size={22}/>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">{svc.name}</h3>
                    <p className="text-xs text-slate-400">{svc.nameEn}</p>
                  </div>
                </div>
                <button onClick={() => toggleService(svc.id)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${svc.enabled ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${svc.enabled ? 'right-1' : 'left-1'}`}/>
                </button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">السعر الأساسي</span>
                <span className="font-bold text-amber-500">{fmt(svc.basePrice)}</span>
              </div>

              <div className={`transition-all ${svc.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">حقول نموذج الطلب:</p>
                <div className="space-y-1.5">
                  {svc.fields.map(f => (
                    <div key={f.key} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-lg px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"/>
                      <span className="text-xs text-slate-600 dark:text-slate-300">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
