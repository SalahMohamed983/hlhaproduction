import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { fetchMyHistory } from '@/store/slices/meSlice';

const STATUS_DISPLAY = {
  completed:     { label: 'مكتمل',           cls: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300' },
  client_review: { label: 'مراجعة العميل',  cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  internal_qa:   { label: 'مراجعة داخلية',  cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
};

const DELIVERABLE_LABELS = { drive: 'Drive', figma: 'Figma', github: 'GitHub', other: 'رابط' };

export default function EmployeeHistory() {
  const dispatch = useDispatch();
  const tasks = useSelector((s) => s.me.history);
  const loading = useSelector((s) => s.me.loading);

  useEffect(() => {
    dispatch(fetchMyHistory());
  }, [dispatch]);

  if (loading) return <div className="text-center py-16 text-slate-400">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">سجل الأعمال</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{tasks.length} طلب مكتمل أو قيد المراجعة</p>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <CheckCircle size={48} className="mx-auto mb-4 opacity-20" />
          <p>لا يوجد سجل أعمال بعد</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  {['المهمة', 'الخدمة', 'الحالة', 'الاستحقاق', 'رابط التسليم'].map(h => (
                    <th key={h} className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {tasks.map(t => {
                  const stInfo = STATUS_DISPLAY[t.status] ?? { label: t.status, cls: 'bg-slate-100 text-slate-500' };
                  const dlLabel = DELIVERABLE_LABELS[t.deliverableType] ?? 'رابط';
                  return (
                    <tr key={t.orderId} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-white max-w-xs">
                        <p className="truncate">{t.title}</p>
                        {t.employeeNotes && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{t.employeeNotes}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{t.serviceNameAr}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stInfo.cls}`}>
                          {stInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{t.dueDate?.split('T')[0]}</td>
                      <td className="px-4 py-3">
                        {t.deliverableLink ? (
                          <a href={t.deliverableLink} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-400 text-xs font-semibold">
                            <ExternalLink size={13} /> {dlLabel}
                          </a>
                        ) : <span className="text-slate-400 text-xs">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
