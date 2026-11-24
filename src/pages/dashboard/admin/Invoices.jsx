import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download, MessageCircle, Printer, Send } from 'lucide-react';
import Modal from '@/components/dashboard/ui/Modal';
import { fetchInvoices, fetchInvoice, fetchOverdueInvoices, fetchInvoiceReminderText, clearInvoiceDetails } from '@/store/slices/financeSlice';

const fmt = n => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(n ?? 0);

export default function Invoices() {
  const dispatch = useDispatch();
  const invoices = useSelector((s) => s.finance.invoices);
  const overdue = useSelector((s) => s.finance.overdue);
  const previewDetails = useSelector((s) => s.finance.invoiceDetails);
  const [preview, setPreview] = useState(null);
  const [hint, setHint] = useState('');

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchOverdueInvoices());
  }, [dispatch]);

  const handlePreview = async (inv) => {
    setPreview(inv);
    dispatch(clearInvoiceDetails());
    try {
      await dispatch(fetchInvoice(inv.id)).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const sendReminder = async (inv) => {
    try {
      const response = await dispatch(fetchInvoiceReminderText(inv.id)).unwrap();
      const text = encodeURIComponent(response.text || response);
      window.open(`https://wa.me/?text=${text}`, '_blank');
      setHint(`تم تجهيز تذكير ${inv.clientName}`);
    } catch (err) {
      const text = encodeURIComponent(`تذكير سداد فاتورة ${inv.id} — المتبقي ${fmt(inv.remainingAmount)} حتى ${inv.dueDate}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
      setHint(`تم تجهيز تذكير ${inv.clientName}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">الفواتير</h1>
        <p className="mt-1 text-sm text-slate-500">معاينة الفواتير والمتأخرات</p>
      </div>

      {overdue.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">
          <h2 className="mb-3 font-bold text-red-800 dark:text-red-200">مدفوعات متأخرة</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-red-700/80">
                  <th className="px-2 py-1 text-right">العميل</th>
                  <th className="px-2 py-1 text-right">المتبقي</th>
                  <th className="px-2 py-1 text-right">الاستحقاق</th>
                  <th className="px-2 py-1 text-right">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {overdue.map(inv => (
                  <tr key={inv.id} className="border-t border-red-100">
                    <td className="px-2 py-2">{inv.clientName}</td>
                    <td className="px-2 py-2 font-bold">{fmt(inv.remainingAmount)}</td>
                    <td className="px-2 py-2">{inv.dueDate}</td>
                    <td className="px-2 py-2">
                      <button type="button" onClick={() => sendReminder(inv)} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white">
                        <Send size={12} /> تذكير سداد
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hint && <p className="text-sm text-emerald-600">{hint}</p>}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/40">
            <tr>
              <th className="px-4 py-3 text-right">رقم</th>
              <th className="px-4 py-3 text-right">العميل</th>
              <th className="px-4 py-3 text-right">الإجمالي</th>
              <th className="px-4 py-3 text-right">المدفوع</th>
              <th className="px-4 py-3 text-right">المتبقي</th>
              <th className="px-4 py-3 text-right">الحالة</th>
              <th className="px-4 py-3 text-right" />
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} className="border-t border-slate-100 dark:border-slate-700">
                <td className="px-4 py-3 font-mono text-xs">{inv.invoiceNumber || inv.id}</td>
                <td className="px-4 py-3 font-semibold">{inv.clientName}</td>
                <td className="px-4 py-3">{fmt(inv.amount)}</td>
                <td className="px-4 py-3 text-emerald-600">{fmt(inv.paidAmount)}</td>
                <td className="px-4 py-3 text-amber-600">{fmt(inv.remainingAmount)}</td>
                <td className="px-4 py-3">{inv.paymentStatus === 'paid' ? 'مدفوعة' : inv.paymentStatus === 'overdue' ? 'متأخرة' : 'جزئية'}</td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => handlePreview(inv)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white">معاينة</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={Boolean(preview)} onClose={() => setPreview(null)} title="معاينة الفاتورة" size="lg">
        {preview && (
          <div>
            <div id="invoice-print" className="rounded-xl border border-slate-200 bg-white p-6 text-slate-800">
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400 font-black">ه</div>
                  <p className="font-black">هالة ميديا</p>
                  <p className="text-xs text-slate-500">فاتورة رقم {preview.invoiceNumber || preview.id}</p>
                </div>
                <div className="text-left text-sm">
                  <p>التاريخ: {preview.dueDate}</p>
                  <p>الحالة: {preview.paymentStatus === 'paid' ? 'مدفوعة' : preview.paymentStatus === 'overdue' ? 'متأخرة' : 'جزئية'}</p>
                </div>
              </div>
              <p className="mt-4 text-sm">فاتورة إلى: <strong>{preview.clientName}</strong></p>
              <table className="mt-4 w-full text-sm">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="py-2 text-right">البند</th>
                    <th className="py-2 text-right">الكمية</th>
                    <th className="py-2 text-right">السعر</th>
                  </tr>
                </thead>
                <tbody>
                  {previewDetails ? (previewDetails.items || []).map((it, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{it.desc || it.serviceNameAr || '—'}</td>
                      <td className="py-2">{it.qty || 1}</td>
                      <td className="py-2">{fmt(it.price || it.amount)}</td>
                    </tr>
                  )) : (
                    <tr className="border-b">
                      <td colSpan="3" className="py-4 text-center text-slate-400">جاري تحميل البنود...</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="mt-4 space-y-1 text-sm">
                <p>المجموع الفرعي: {fmt(preview.amount)}</p>
                <p>خصم / ضريبة: —</p>
                <p className="text-lg font-black">المبلغ النهائي: {fmt(preview.amount)}</p>
                <p>المدفوع {fmt(preview.paidAmount)} · المتبقي {fmt(preview.remainingAmount)}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white">
                <Printer size={16} /> طباعة / PDF
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`فاتورة ${preview.invoiceNumber || preview.id} بمبلغ ${fmt(preview.amount)} — المتبقي ${fmt(preview.remainingAmount)}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white"
              >
                <MessageCircle size={16} /> إرسال واتساب
              </a>
              <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold">
                <Download size={16} /> تنزيل
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
