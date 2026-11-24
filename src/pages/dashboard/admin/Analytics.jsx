import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import KpiCard from '@/components/dashboard/ui/KpiCard';
import { Gauge, Timer, CheckCircle2 } from 'lucide-react';
import { fetchAnalytics } from '@/store/slices/dashboardSlice';

const fmt = n => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(n ?? 0);

export default function Analytics() {
  const dispatch = useDispatch();
  const data = useSelector((s) => s.dashboard.analytics);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  if (!data) {
    return <div className="py-10 text-center text-slate-500">جاري تحميل التحليلات...</div>;
  }

  const { employeeKPIs = [], serviceProfitability = [], monthlyStats = [] } = data;

  const avgOnTime = employeeKPIs.length ? Math.round(employeeKPIs.reduce((s, e) => s + (e.onTimeRate || 0), 0) / employeeKPIs.length) : 0;
  const avgTurn = employeeKPIs.length ? (employeeKPIs.reduce((s, e) => s + (e.avgTurnaround || 0), 0) / employeeKPIs.length).toFixed(1) : 0;
  const done = employeeKPIs.reduce((s, e) => s + (e.completedTasks || 0), 0);
  const top = [...serviceProfitability].sort((a, b) => (b.margin || 0) - (a.margin || 0))[0] || { name: '—', margin: 0 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">التحليلات ومؤشرات الأداء</h1>
        <p className="mt-1 text-sm text-slate-500">أداء الفريق، ربحية الخدمات، ومقارنة الأشهر</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard title="مهام مكتملة" value={done} icon={CheckCircle2} color="#10B981" />
        <KpiCard title="الالتزام بالموعد" value={`${avgOnTime}%`} icon={Gauge} color="#6366F1" />
        <KpiCard title="متوسط زمن التسليم" value={`${avgTurn} يوم`} icon={Timer} color="#F59E0B" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-4 font-bold text-slate-800 dark:text-white">أداء الموظفين</h2>
        <div className="space-y-4">
          {employeeKPIs.map(e => (
            <div key={e.employeeId || e.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-semibold text-slate-800 dark:text-white">{e.name}</span>
                <span className="text-slate-400">{e.completedTasks} مهام · {Math.round(e.onTimeRate || 0)}% في الوقت · {e.avgTurnaround} يوم</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.max(0, Math.min(100, e.onTimeRate || 0))}%` }} />
              </div>
            </div>
          ))}
          {employeeKPIs.length === 0 && (
            <p className="text-sm text-slate-400 text-center">لا يوجد بيانات أداء متوفرة.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-1 font-bold text-slate-800 dark:text-white">المبيعات حسب الخدمة</h2>
          <p className="mb-4 text-xs text-slate-400">أعلى هامش: {top.name} ({Math.round(top.margin || 0)}%)</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={serviceProfitability}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="sales" name="عدد المبيعات" fill="#6366F1" radius={6} />
              <Bar dataKey="margin" name="الهامش %" fill="#10B981" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 font-bold text-slate-800 dark:text-white">الإيرادات مقابل المصروف والربح</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tickFormatter={v => `${v / 1000}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip formatter={v => fmt(v)} contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" name="إيراد" stroke="#6366F1" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" name="مصروف" stroke="#F43F5E" strokeWidth={2} />
              <Line type="monotone" dataKey="profit" name="صافي" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
