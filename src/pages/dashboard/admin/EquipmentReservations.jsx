import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Printer, ChevronLeft, ChevronRight, Calendar, CheckCircle, Clock } from 'lucide-react';
import { fetchEquipmentReservations } from '@/store/slices/equipmentSlice';

export default function EquipmentReservations() {
  const dispatch = useDispatch();
  const reservations = useSelector((s) => s.equipment.reservations);
  const meta = useSelector((s) => s.equipment.reservationsMeta);
  const printRef = useRef(null);

  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo]   = useState('');
  const [page, setPage] = useState(1);

  const pageSize = 15;

  const load = (pg = page) => {
    dispatch(fetchEquipmentReservations({
      search: search || undefined,
      from: from || undefined,
      to: to || undefined,
      page: pg,
      pageSize,
    }));
  };

  useEffect(() => { load(1); setPage(1); }, [search, from, to]);
  useEffect(() => { load(page); }, [page]);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <html dir="rtl"><head><title>سجل حجوزات المعدات</title>
      <style>
        body { font-family: Tahoma, Arial, sans-serif; font-size: 12px; padding: 20px; }
        h1 { font-size: 18px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: right; }
        th { background: #f1f5f9; font-weight: bold; }
        .active { color: #059669; font-weight: bold; }
        .ended  { color: #64748b; }
        @media print { button { display: none; } }
      </style></head><body>
      <h1>سجل حجوزات المعدات — هالة ميديا</h1>
      <p style="color:#888">طُبع في: ${new Date().toLocaleString('ar-EG')}</p>
      ${printContent}
      </body></html>`);
    win.document.close();
    win.print();
  };

  const totalPages = meta?.totalPages || 1;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">سجل حجوزات المعدات</h1>
          <p className="mt-1 text-sm text-slate-500">جميع الحجوزات مع تفاصيل الطلب والموظف</p>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-600"
        >
          <Printer size={16} /> طباعة التقرير
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالمعدة، العميل، الموظف..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-9 pl-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar size={14} /> من
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-500">
          إلى
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
        </label>
        {(search || from || to) && (
          <button onClick={() => { setSearch(''); setFrom(''); setTo(''); }}
            className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100">
            مسح الفلتر
          </button>
        )}
      </div>

      {/* Stats bar */}
      <div className="text-sm text-slate-500">
        إجمالي النتائج: <span className="font-bold text-slate-800 dark:text-white">{meta?.totalCount ?? 0}</span> حجز
      </div>

      {/* Table */}
      <div ref={printRef} className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">المعدة</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">التصنيف</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">الطلب / العميل</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">الموظف المسؤول</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">تاريخ الخروج</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">تاريخ العودة</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-slate-400">لا توجد حجوزات</td>
              </tr>
            ) : reservations.map((r) => (
              <tr key={r.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">{r.equipmentName}</td>
                <td className="px-4 py-3 text-slate-500">{r.categoryNameAr || '—'}</td>
                <td className="px-4 py-3">
                  {r.orderId ? (
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-200 text-xs line-clamp-1">{r.orderTitle || `طلب #${r.orderId}`}</p>
                      {r.clientName && <p className="text-xs text-slate-400">{r.clientName}</p>}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs">بدون طلب</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {r.assignedEmployeeName || (r.assignedEmployeeId ? `موظف #${r.assignedEmployeeId}` : '—')}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300 tabular-nums">{r.checkoutDate}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300 tabular-nums">{r.returnDate || '—'}</td>
                <td className="px-4 py-3">
                  {r.isActive ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      <Clock size={10} /> نشط
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                      <CheckCircle size={10} /> منتهي
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-700">
            <ChevronRight size={18} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === '…' ? (
                <span key={`ellipsis-${i}`} className="px-2 text-slate-400">…</span>
              ) : (
                <button key={p} onClick={() => setPage(p)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${p === page ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
                  {p}
                </button>
              )
            )}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-700">
            <ChevronLeft size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

