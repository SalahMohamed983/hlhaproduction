import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import KpiCard from '@/components/dashboard/ui/KpiCard';
import { Gauge, Timer, CheckCircle2, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import { fetchAnalytics } from '@/store/slices/dashboardSlice';

const fmt = n => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(n ?? 0);

const loadLabels = {
  active: { text: 'متاح', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  busy: { text: 'مشغول', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  overloaded: { text: 'ضغط مهام', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
};

export default function Analytics() {
  const dispatch = useDispatch();
  const data = useSelector((s) => s.dashboard.analytics);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const employeeKPIs = useMemo(() => {
    return (data?.employeeKPIs || data?.employeeKpis || []).map(e => ({
      employeeId: e.employeeId,
      name: e.name || e.nameAr || 'موظف',
      completedTasks: e.completedTasks ?? e.completedOrders ?? 0,
      activeAssignments: e.activeAssignments ?? 0,
      onTimeRate: e.onTimeRate ?? 100,
      avgTurnaround: e.avgTurnaround ?? 2.0,
      load: e.load || 'active'
    }));
  }, [data]);

  const serviceProfitability = useMemo(() => {
    return (data?.serviceProfitability || data?.profitability || []).map(s => ({
      name: s.name || s.kind || 'خدمة',
      sales: s.sales ?? s.orderCount ?? 0,
      totalRevenue: s.totalRevenue ?? 0,
      margin: s.margin ?? 35
    }));
  }, [data]);

  const monthlyStats = useMemo(() => {
    return (data?.monthlyStats || data?.monthlySeries || []).map(m => ({
      month: m.month,
      revenue: m.revenue ?? 0,
      expenses: m.expenses ?? 0,
      profit: m.profit ?? m.net ?? (m.revenue - m.expenses)
    }));
  }, [data]);

  const totalCompleted = useMemo(() => {
    return employeeKPIs.reduce((s, e) => s + (e.completedTasks || 0), 0);
  }, [employeeKPIs]);

  const avgOnTime = useMemo(() => {
    return employeeKPIs.length ? Math.round(employeeKPIs.reduce((s, e) => s + (e.onTimeRate || 0), 0) / employeeKPIs.length) : 100;
  }, [employeeKPIs]);

  const avgTurn = useMemo(() => {
    return employeeKPIs.length ? (employeeKPIs.reduce((s, e) => s + (e.avgTurnaround || 0), 0) / employeeKPIs.length).toFixed(1) : '2.0';
  }, [employeeKPIs]);

  const totalServiceSales = useMemo(() => {
    return serviceProfitability.reduce((s, e) => s + (e.sales || 0), 0);
  }, [serviceProfitability]);

  const totalServiceRevenue = useMemo(() => {
    return serviceProfitability.reduce((s, e) => s + (e.totalRevenue || 0), 0);
  }, [serviceProfitability]);

  const topService = useMemo(() => {
    return [...serviceProfitability].sort((a, b) => (b.sales || 0) - (a.sales || 0))[0] || { name: '—', sales: 0, margin: 0 };
  }, [serviceProfitability]);

  if (!data) {
    return <div className="py-10 text-center text-slate-500">جاري تحميل التحليلات...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">التحليلات ومؤشرات الأداء</h1>
        <p className="mt-1 text-sm text-slate-500">أداء الفريق، حجم مبيعات الخدمات، ومقارنة الإيرادات والأرباح</p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="المهام المكتملة" value={totalCompleted} sub="إجمالي إنجاز الفريق" icon={CheckCircle2} color="#10B981" />
        <KpiCard title="الالتزام بالموعد" value={`${avgOnTime}%`} sub="متوسط دقة التسليم" icon={Gauge} color="#6366F1" />
        <KpiCard title="متوسط زمن التسليم" value={`${avgTurn} يوم`} sub="معدل سرعة الإنجاز" icon={Timer} color="#F59E0B" />
        <KpiCard title="إجمالي مبيعات الخدمات" value={totalServiceSales} sub={fmt(totalServiceRevenue)} icon={ShoppingBag} color="#06B6D4" />
      </div>

      {/* Employee Performance */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-indigo-600" />
            <h2 className="font-bold text-slate-800 dark:text-white">أداء الموظفين وحمل العمل</h2>
          </div>
          <span className="text-xs text-slate-400">{employeeKPIs.length} موظف</span>
        </div>
        <div className="space-y-4">
          {employeeKPIs.map(e => {
            const badge = loadLabels[e.load] || loadLabels.active;
            return (
              <div key={e.employeeId || e.name} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700/60">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-white">{e.name}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${badge.color}`}>{badge.text}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span><b>{e.completedTasks}</b> مكتملة</span>
                    <span>·</span>
                    <span><b>{e.activeAssignments}</b> جارية</span>
                    <span>·</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{Math.round(e.onTimeRate)}% في الوقت</span>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${Math.max(5, Math.min(100, e.onTimeRate))}%` }} />
                </div>
              </div>
            );
          })}
          {employeeKPIs.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-6">لا توجد بيانات موظفين مسجلة.</p>
          )}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Sales by Service BarChart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-slate-800 dark:text-white">المبيعات حسب الخدمة</h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">
              الأعلى: {topService.name} ({topService.sales} طلب)
            </span>
          </div>
          <p className="mb-4 text-xs text-slate-400">إجمالي المبيعات وعدد الطلبات المنفذة لكل خدمة</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={serviceProfitability}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                formatter={(v, name) => [name === 'sales' ? `${v} طلب` : fmt(v), name === 'sales' ? 'عدد الطلبات' : 'الإيراد']}
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="sales" name="عدد الطلبات" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Revenue vs Expenses vs Profit LineChart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-slate-800 dark:text-white">الإيرادات مقابل المصروف والربح</h2>
            <span className="text-xs text-slate-400">آخر 12 شهراً</span>
          </div>
          <p className="mb-4 text-xs text-slate-400">تتبع الأداء المالي الصافي شهرياً</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tickFormatter={v => `${v / 1000}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip formatter={v => [fmt(v), '']} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, color: '#f8fafc' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" name="إيراد" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="expenses" name="مصروف" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="profit" name="صافي ربح" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
