import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KpiCard({ title, value, sub, trend, trendVal, icon: Icon, color = '#F59E0B' }) {
  const isUp = trend === 'up';
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
          {trendVal && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
              {isUp ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
              {trendVal}
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: color + '22', color }}>
            <Icon size={24} />
          </div>
        )}
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full opacity-5" style={{ background: color, transform: 'translate(30%, 30%)' }} />
    </div>
  );
}
