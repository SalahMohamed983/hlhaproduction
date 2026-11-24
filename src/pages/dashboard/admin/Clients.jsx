import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Phone, Building2, Calendar } from 'lucide-react';
import Modal from '@/components/dashboard/ui/Modal';
import Badge from '@/components/dashboard/ui/Badge';
import { fetchClients, fetchClient, clearClient } from '@/store/slices/clientsSlice';

const fmt = n => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(n ?? 0);

const orderStatus = {
  completed: 'مكتمل', in_production: 'إنتاج', client_review: 'مراجعة عميل',
  new_lead: 'طلب جديد', internal_qa: 'مراجعة الجودة',
  cancelled: 'ملغى',
};

export default function Clients() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clients = useSelector((s) => s.clients.items);
  const selectedClient = useSelector((s) => s.clients.current);
  const [status, setStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    dispatch(fetchClients({ status, from: dateFrom, to: dateTo }));
  }, [dispatch, status, dateFrom, dateTo]);

  useEffect(() => {
    if (id) dispatch(fetchClient(id));
    else dispatch(clearClient());
  }, [dispatch, id]);

  const hasFilters = status !== 'all' || dateFrom || dateTo;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">العملاء</h1>
        <p className="mt-1 text-sm text-slate-500">أصحاب الطلبات فقط — نشط أو غير نشط حسب الطلبات المفتوحة</p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {['all', 'Active', 'Inactive'].map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${status === s ? 'bg-amber-400 text-slate-900' : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
          >
            {s === 'all' ? 'الكل' : s === 'Active' ? 'نشط' : 'غير نشط'}
          </button>
        ))}
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-xs text-slate-400"><Calendar size={11} /> من تاريخ</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-xs text-slate-400"><Calendar size={11} /> إلى تاريخ</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
        </div>
        {hasFilters && (
          <button type="button" onClick={() => { setStatus('all'); setDateFrom(''); setDateTo(''); }} className="rounded-xl px-3 py-2 text-xs font-semibold text-red-500">مسح الفلاتر</button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {clients.map(c => (
          <button
            key={c.id}
            type="button"
            onClick={() => navigate(`/dashboard/admin/clients/${encodeURIComponent(c.id)}`)}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-right shadow-sm transition hover:border-amber-300 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">{c.nameAr}</h3>
                {c.company && <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><Building2 size={14} /> {c.company}</p>}
                {c.phone && <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><Phone size={14} /> {c.phone}</p>}
              </div>
              <Badge type={c.status === 'Active' ? 'active' : 'low'}>{c.status === 'Active' ? 'نشط' : 'غير نشط'}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-900">
                <p className="text-[11px] text-slate-400">تم دفع</p>
                <p className="text-xs font-bold text-emerald-600">{fmt(c.totalPaid)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-900">
                <p className="text-[11px] text-slate-400">الطلبات</p>
                <p className="text-xs font-bold text-amber-600">{c.totalOrders}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-900">
                <p className="text-[11px] text-slate-400">المتبقي</p>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{fmt(c.remainingBalance)}</p>
              </div>
            </div>
          </button>
        ))}
        {clients.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-slate-400">لا يوجد عملاء مطابقون للفلتر</p>
        )}
      </div>

      <Modal open={Boolean(selectedClient)} onClose={() => navigate('/dashboard/admin/clients')} title={selectedClient ? selectedClient.nameAr : ''} size="lg">
        {selectedClient && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">{[selectedClient.company, selectedClient.phone].filter(Boolean).join(' · ')}</p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/40">
                  <tr>
                    {['الطلب', 'التاريخ', 'الإجمالي', 'تم دفع', 'المتبقي', 'الحالة'].map(h => (
                      <th key={h} className="px-3 py-2 text-right text-xs font-semibold text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {(selectedClient.orders || []).map(o => (
                    <tr key={o.orderId}>
                      <td className="px-3 py-2 font-medium">{o.serviceNameAr}</td>
                      <td className="px-3 py-2 text-slate-500">{o.createdAt}</td>
                      <td className="px-3 py-2">{fmt(o.agreedPrice)}</td>
                      <td className="px-3 py-2 font-bold text-emerald-600">{fmt(o.paidAmount)}</td>
                      <td className="px-3 py-2 text-amber-600">{fmt(o.remainingAmount)}</td>
                      <td className="px-3 py-2 text-xs">{orderStatus[o.status] || o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
