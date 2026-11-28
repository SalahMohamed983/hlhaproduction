import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, CheckCheck, Save } from 'lucide-react';
import KpiCard from '@/components/dashboard/ui/KpiCard';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import { fetchAttendance, saveAttendance, markAllPresent, syncAttendanceMonth } from '@/store/slices/attendanceSlice';

const STATUSES = [
  { id: 'present', label: 'حضور', color: 'bg-emerald-500 text-white', idle: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  { id: 'absent', label: 'غياب', color: 'bg-red-500 text-white', idle: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  { id: 'late', label: 'تأخير', color: 'bg-amber-500 text-white', idle: 'bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  { id: 'on_leave', label: 'إجازة', color: 'bg-blue-500 text-white', idle: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
];

function formatDate(iso) {
  return new Intl.DateTimeFormat('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso + 'T12:00:00'));
}

function shiftDate(iso, days) {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function mapRows(apiRows) {
  return (apiRows || []).map(r => ({
    member: { id: r.employeeId, name: r.nameAr || '' },
    specialtyNameAr: r.specialtyNameAr || '—',
    status: r.status || 'present',
    checkInTime: (r.checkInTime || '').slice(0, 5),
    notes: r.notes || '',
    monthSummary: r.monthSummary || { present: 0, absent: 0, total: 0 },
  }));
}

export default function Attendance() {
  const dispatch = useDispatch();
  const day = useSelector((s) => s.attendance.day);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [savedHint, setSavedHint] = useState('');
  const [rows, setRows] = useState([]);

  useEffect(() => { dispatch(fetchAttendance(date)); }, [dispatch, date]);
  useEffect(() => { setRows(mapRows(day?.rows)); }, [day]);

  const kpis = useMemo(() => ({
    total: rows.length,
    present: rows.filter(r => r.status === 'present').length,
    absent: rows.filter(r => r.status === 'absent').length,
    lateLeave: rows.filter(r => r.status === 'late' || r.status === 'on_leave').length,
  }), [rows]);

  function applyRow(rowDto) {
    if (!rowDto) return;
    const mapped = mapRows([rowDto])[0];
    setRows(prev => prev.map(r => r.member.id === mapped.member.id ? mapped : r));
  }

  function setField(employeeId, updates) {
    const current = rows.find(r => r.member.id === employeeId);
    const next = {
      status: updates.status ?? current?.status ?? 'present',
      checkInTime: updates.checkInTime !== undefined ? updates.checkInTime : (current?.checkInTime || ''),
      notes: updates.notes !== undefined ? updates.notes : (current?.notes || ''),
    };
    setRows(prev => prev.map(r => r.member.id === employeeId ? { ...r, ...next } : r));
    dispatch(saveAttendance({
      date,
      employeeId,
      body: {
        status: next.status,
        checkInTime: next.status === 'absent' || next.status === 'on_leave' ? null : (next.checkInTime || null),
        notes: next.notes || null,
      },
    })).unwrap().then(applyRow).catch(console.error);
  }

  function handleMarkAll() {
    dispatch(markAllPresent(date)).unwrap().then(d => setRows(mapRows(d?.rows))).catch(console.error);
  }

  function handleSave() {
    dispatch(syncAttendanceMonth(date)).unwrap().then(() => {
      setSavedHint('تم حفظ حضور اليوم وتحديث الملخص الشهري');
      setTimeout(() => setSavedHint(''), 2500);
      dispatch(fetchAttendance(date));
    }).catch(console.error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">الحضور اليومي</h1>
          <p className="mt-1 text-sm text-slate-500">{formatDate(date)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setDate(d => shiftDate(d, -1))} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
            <ChevronRight size={16} /> اليوم السابق
          </button>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
          <button type="button" onClick={() => setDate(d => shiftDate(d, 1))} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
            اليوم التالي <ChevronLeft size={16} />
          </button>
          <button type="button" onClick={handleMarkAll} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">
            <CheckCheck size={16} /> تعليم الكل حضور
          </button>
          <button type="button" onClick={handleSave} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">
            <Save size={16} /> حفظ حضور اليوم
          </button>
        </div>
      </div>

      {savedHint && <p className="rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">{savedHint}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="إجمالي الموظفين" value={kpis.total} icon={Users} color="#6366F1" />
        <KpiCard title="حضور اليوم" value={kpis.present} icon={UserCheck} color="#10B981" />
        <KpiCard title="غياب اليوم" value={kpis.absent} icon={UserX} color="#EF4444" />
        <KpiCard title="تأخير / إجازة" value={kpis.lateLeave} icon={Clock} color="#F59E0B" />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 text-right font-semibold">الموظف</th>
              <th className="px-4 py-3 text-right font-semibold">المسمى</th>
              <th className="px-4 py-3 text-right font-semibold">الحالة</th>
              <th className="px-4 py-3 text-right font-semibold">وقت الحضور</th>
              <th className="px-4 py-3 text-right font-semibold">ملاحظة</th>
              <th className="px-4 py-3 text-right font-semibold">ملخص الشهر</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const badge = row.monthSummary || { present: 0, absent: 0 };
              return (
                <tr key={row.member.id} className="border-t border-slate-100 dark:border-slate-700">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">{row.member.name.charAt(0)}</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{row.member.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{row.specialtyNameAr || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {STATUSES.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setField(row.member.id, { status: s.id, checkInTime: s.id === 'present' || s.id === 'late' ? (row.checkInTime || '09:00') : '' })}
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${row.status === s.id ? s.color : s.idle}`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="time"
                      disabled={row.status === 'absent' || row.status === 'on_leave'}
                      value={row.checkInTime}
                      onChange={e => setField(row.member.id, { checkInTime: e.target.value })}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-900"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      value={row.notes}
                      onChange={e => setField(row.member.id, { notes: e.target.value })}
                      placeholder="سبب / ملاحظة"
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                      حضور {badge.present} · غياب {badge.absent}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
