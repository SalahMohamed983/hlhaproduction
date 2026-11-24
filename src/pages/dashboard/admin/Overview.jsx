import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DollarSign, ShoppingCart, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import KpiCard from '@/components/dashboard/ui/KpiCard';
import { fetchOverview } from '@/store/slices/dashboardSlice';

const fmt = n => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(n ?? 0);

export default function Overview() {
  const dispatch = useDispatch();
  const data = useSelector((s) => s.dashboard.overview);

  useEffect(() => {
    dispatch(fetchOverview());
  }, [dispatch]);

  if (!data) {
    return <div className="py-10 text-center text-slate-500">جاري تحميل البيانات...</div>;
  }

  const {
    monthRevenue = 0,
    monthExpenses = 0,
    netProfit = 0,
    margin = 0,
    activeOrderCount = 0,
    totalOrders = 0,
    onTimeRate = 0,
    monthlySeries = [],
    ordersByServiceKind = [],
    alerts = []
  } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">نظرة عامة</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">مرحباً بك في لوحة تحكم هالة ميديا</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="إيرادات الشهر" value={fmt(monthRevenue)} sub="الشهر الحالي" trend="up" trendVal="محدث" icon={DollarSign} color="#F59E0B"/>
        <KpiCard title="صافي الربح" value={fmt(netProfit)} sub={`هامش ${Math.round(margin)}%`} trend="up" trendVal="محدث" icon={TrendingUp} color="#10B981"/>
        <KpiCard title="الطلبات النشطة" value={activeOrderCount} sub={`من أصل ${totalOrders} طلبات`} icon={ShoppingCart} color="#3B82F6"/>
        <KpiCard title="معدل التسليم بالوقت" value={`${Math.round(onTimeRate)}%`} sub="من الطلبات المكتملة" trend={onTimeRate >= 80 ? 'up' : 'down'} trendVal="محدث" icon={Clock} color="#8B5CF6"/>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4">الإيرادات والمصاريف</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlySeries} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="grad-rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="grad-exp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5}/>
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => (v/1000)+'k'}/>
              <Tooltip formatter={(v, n) => [fmt(v), n === 'revenue' ? 'الإيرادات' : n === 'expenses' ? 'المصاريف' : 'الربح']} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#f8fafc' }}/>
              <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} fill="url(#grad-rev)"/>
              <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} fill="url(#grad-exp)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4">توزيع الطلبات بالخدمة</h2>
          {ordersByServiceKind.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={ordersByServiceKind} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {ordersByServiceKind.map((e, i) => <Cell key={i} fill={e.color || '#3B82F6'}/>)}
                  </Pie>
                  <Tooltip formatter={(v) => v} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#f8fafc' }}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {ordersByServiceKind.map(e => (
                  <div key={e.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: e.color || '#3B82F6' }}/>
                      <span className="text-slate-600 dark:text-slate-300">{e.name}</span>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{e.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-slate-400 text-sm text-center py-10">لا توجد طلبات</p>
          )}
        </div>
      </div>

      {/* Urgent Alerts */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-amber-500" size={20}/>
          <h2 className="text-base font-bold text-amber-800 dark:text-amber-300">تنبيهات عاجلة</h2>
        </div>
        <div className="space-y-3">
          {alerts.map((o, idx) => (
            <div key={o.id || idx} className="flex items-center justify-between bg-white dark:bg-slate-800/80 rounded-xl px-4 py-3 shadow-sm">
              <div>
                <p className="font-semibold text-slate-800 dark:text-white text-sm">{o.clientName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{o.service} · استحقاق {o.dueDate}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${o.priority === 'urgent' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300'}`}>
                {o.priority === 'urgent' ? 'عاجل' : o.status === 'new_lead' ? 'غير مُعيَّن' : o.priority}
              </span>
            </div>
          ))}
          {alerts.length === 0 && (
            <p className="text-sm text-amber-600/70 dark:text-amber-400/50">لا توجد تنبيهات عاجلة في الوقت الحالي.</p>
          )}
        </div>
      </div>
    </div>
  );
}
