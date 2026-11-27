import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Phone, Building2, Calendar, Printer, FileText, X, ChevronDown } from 'lucide-react';
import Modal from '@/components/dashboard/ui/Modal';
import Badge from '@/components/dashboard/ui/Badge';
import { fetchClients, fetchClient, clearClient } from '@/store/slices/clientsSlice';

const fmt = n => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(n ?? 0);

const orderStatus = {
  completed: 'مكتمل', in_production: 'إنتاج', client_review: 'مراجعة عميل',
  new_lead: 'طلب جديد', internal_qa: 'مراجعة الجودة',
  cancelled: 'ملغى',
};

// ─── مكوّن تقرير الطباعة الداخلي ─────────────────────────────────────────────
function PrintReport({ clients, reportTitle, dateFrom, dateTo, onClose }) {
  const printRef = useRef(null);

  const totalPaid = clients.reduce((s, c) => s + (c.totalPaid ?? 0), 0);
  const totalRemaining = clients.reduce((s, c) => s + (c.remainingBalance ?? 0), 0);
  const totalOrders = clients.reduce((s, c) => s + (c.totalOrders ?? 0), 0);
  const totalAgreed = clients.reduce((s, c) => {
    const ordersTotal = (c.orders || []).reduce((os, o) => os + (o.agreedPrice ?? 0), 0);
    return s + (ordersTotal || ((c.totalPaid ?? 0) + (c.remainingBalance ?? 0)));
  }, 0);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8"/>
  <title>${reportTitle}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
      direction: rtl;
      color: #1e293b;
      background: #fff;
      padding: 16px;
      font-size: 12px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; font-size: 11px; vertical-align: middle; }
    th { background: #1e293b !important; color: #ffffff !important; font-weight: 700; text-align: right; }
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; }
    .subtotal-row td { background: #fefce8 !important; font-weight: 700; }
    .grandtotal-row td { background: #1e293b !important; color: #ffffff !important; font-weight: 800; font-size: 12px; }
    @media print {
      @page { size: A4 landscape; margin: 10mm; }
      body { padding: 0; }
      tr { page-break-inside: avoid; }
    }
  </style>
</head>
<body>${content}</body>
</html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  };

  const statusBadge = (st) => {
    const label = orderStatus[st] || st || '—';
    let bg = '#f1f5f9';
    let text = '#475569';
    if (st === 'completed') { bg = '#dcfce7'; text = '#15803d'; }
    else if (st === 'in_production') { bg = '#fef3c7'; text = '#b45309'; }
    else if (st === 'cancelled') { bg = '#fee2e2'; text = '#b91c1c'; }
    else if (st === 'client_review' || st === 'internal_qa') { bg = '#e0e7ff'; text = '#4338ca'; }
    else if (st === 'new_lead') { bg = '#f3e8ff'; text = '#7e22ce'; }
    return (
      <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: '9999px', fontSize: '10px', fontWeight: '700', backgroundColor: bg, color: text }}>
        {label}
      </span>
    );
  };

  let rowCounter = 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900">
      {/* ── شريط التحكم العلوي ── */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800 print:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/20 dark:text-amber-400">
            <FileText size={20} />
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-white">{reportTitle}</span>
            {(dateFrom || dateTo) && (
              <span className="mr-2 text-xs text-slate-500 dark:text-slate-400">
                ({dateFrom && `من: ${dateFrom}`} {dateTo && `إلى: ${dateTo}`})
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-amber-500"
          >
            <Printer size={16} /> طباعة التقرير / PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <X size={16} /> إغلاق
          </button>
        </div>
      </div>

      {/* ── مساحة المعاينة ── */}
      <div className="flex-1 overflow-auto bg-slate-100 p-6 dark:bg-slate-950">
        <div
          ref={printRef}
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '28px',
            maxWidth: '1200px',
            margin: '0 auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            color: '#1e293b',
            fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
            direction: 'rtl',
          }}
        >
          {/* ── رأس التقرير ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #f59e0b', paddingBottom: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: '#f59e0b', color: '#1e293b', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', fontSize: '24px', fontWeight: '900' }}>
                ه
              </div>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: 0 }}>هالة ميديا — تقرير بيانات وخدمات العملاء</h1>
                <p style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>{reportTitle}</p>
              </div>
            </div>
            <div style={{ textAlign: 'left', color: '#64748b', fontSize: '11px', lineHeight: '1.8' }}>
              <div><b>تاريخ التقرير:</b> {new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              {dateFrom && <div><b>الفترة من:</b> {dateFrom}</div>}
              {dateTo && <div><b>إلى:</b> {dateTo}</div>}
              <div><b>إجمالي العملاء:</b> {clients.length}</div>
            </div>
          </div>

          {/* ── كروت الإحصائيات السريعة ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '22px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '600' }}>عدد العملاء المشمولين</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>{clients.length}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '600' }}>إجمالي الطلبات والخدمات</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#b45309', marginTop: '4px' }}>{totalOrders}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '600' }}>إجمالي المبالغ المدفوعة</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#15803d', marginTop: '4px' }}>{fmt(totalPaid)}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '600' }}>إجمالي المبالغ المتبقية</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: totalRemaining > 0 ? '#b91c1c' : '#0f172a', marginTop: '4px' }}>{fmt(totalRemaining)}</div>
            </div>
          </div>

          {/* ── الجدول الموحّد الشامل ── */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: '#1e293b', color: '#ffffff' }}>
                <th style={{ width: '3%', padding: '10px 4px', textAlign: 'center', border: '1px solid #334155' }}>#</th>
                <th style={{ width: '14%', padding: '10px 8px', border: '1px solid #334155' }}>العميل</th>
                <th style={{ width: '14%', padding: '10px 8px', border: '1px solid #334155' }}>الشركة / الهاتف</th>
                <th style={{ width: '13%', padding: '10px 8px', textAlign: 'center', border: '1px solid #334155' }}>فترة الاشتراك</th>
                <th style={{ width: '15%', padding: '10px 8px', border: '1px solid #334155' }}>الخدمة المقدمة</th>
                <th style={{ width: '9%', padding: '10px 8px', textAlign: 'center', border: '1px solid #334155' }}>التاريخ</th>
                <th style={{ width: '10%', padding: '10px 8px', textAlign: 'center', border: '1px solid #334155' }}>المبلغ الإجمالي</th>
                <th style={{ width: '10%', padding: '10px 8px', textAlign: 'center', border: '1px solid #334155' }}>المدفوع</th>
                <th style={{ width: '10%', padding: '10px 8px', textAlign: 'center', border: '1px solid #334155' }}>المتبقي</th>
                <th style={{ width: '8%', padding: '10px 8px', textAlign: 'center', border: '1px solid #334155' }}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c, ci) => {
                const orders = c.orders || [];
                const clientAgreedTotal = orders.reduce((s, o) => s + (o.agreedPrice ?? 0), 0);

                if (orders.length === 0) {
                  rowCounter++;
                  return (
                    <tr key={`no-ord-${c.id}`} style={{ background: ci % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ textAlign: 'center', padding: '8px 4px', border: '1px solid #e2e8f0', color: '#64748b' }}>{rowCounter}</td>
                      <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', fontWeight: '700', color: '#0f172a' }}>
                        {c.nameAr}
                        {c.email && <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '400' }}>{c.email}</div>}
                      </td>
                      <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', color: '#475569' }}>
                        {c.company && <div style={{ fontWeight: '600' }}>{c.company}</div>}
                        {c.phone && <div style={{ fontSize: '10px', color: '#64748b' }}>{c.phone}</div>}
                        {!c.company && !c.phone && '—'}
                      </td>
                      <td style={{ padding: '8px 8px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '10px', color: '#475569' }}>
                        {c.subscriptionStart ? `${c.subscriptionStart} إلى ${c.subscriptionEnd || '—'}` : '—'}
                      </td>
                      <td colSpan={2} style={{ padding: '8px 10px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                        لا توجد طلبات مفصّلة مسجلة
                      </td>
                      <td style={{ padding: '8px 8px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: '600' }}>
                        {fmt((c.totalPaid ?? 0) + (c.remainingBalance ?? 0))}
                      </td>
                      <td style={{ padding: '8px 8px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#15803d', fontWeight: '700' }}>
                        {fmt(c.totalPaid)}
                      </td>
                      <td style={{ padding: '8px 8px', border: '1px solid #e2e8f0', textAlign: 'center', color: (c.remainingBalance ?? 0) > 0 ? '#b45309' : '#64748b', fontWeight: '700' }}>
                        {fmt(c.remainingBalance)}
                      </td>
                      <td style={{ padding: '8px 8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '9999px', fontSize: '10px', fontWeight: '700', background: c.status === 'Active' ? '#dcfce7' : '#f1f5f9', color: c.status === 'Active' ? '#15803d' : '#64748b' }}>
                          {c.status === 'Active' ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                    </tr>
                  );
                }

                return (
                  <React.Fragment key={`client-grp-${c.id}`}>
                    {orders.map((o, oi) => {
                      rowCounter++;
                      return (
                        <tr
                          key={`ord-${o.orderId || oi}`}
                          style={{
                            background: ci % 2 === 0 ? '#ffffff' : '#fcfcfd',
                            borderBottom: oi === orders.length - 1 && orders.length === 1 ? '1px solid #cbd5e1' : '1px solid #f1f5f9',
                          }}
                        >
                          <td style={{ textAlign: 'center', padding: '8px 4px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                            {rowCounter}
                          </td>
                          <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', verticalAlign: 'middle' }}>
                            <div style={{ fontWeight: '700', color: '#0f172a' }}>{c.nameAr}</div>
                            {c.email && <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '400' }}>{c.email}</div>}
                          </td>
                          <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', verticalAlign: 'middle' }}>
                            {c.company && <div style={{ fontWeight: '600', color: '#334155' }}>{c.company}</div>}
                            {c.phone && <div style={{ fontSize: '10px', color: '#64748b' }}>{c.phone}</div>}
                            {!c.company && !c.phone && <span style={{ color: '#94a3b8' }}>—</span>}
                          </td>
                          <td style={{ padding: '8px 8px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '10px', color: '#475569' }}>
                            {c.subscriptionStart ? `${c.subscriptionStart} إلى ${c.subscriptionEnd || '—'}` : '—'}
                          </td>
                          <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', fontWeight: '600', color: '#1e293b' }}>
                            {o.serviceNameAr || 'خدمة غير محددة'}
                          </td>
                          <td style={{ padding: '8px 8px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b', fontSize: '11px' }}>
                            {o.createdAt || '—'}
                          </td>
                          <td style={{ padding: '8px 8px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: '700', color: '#0f172a' }}>
                            {fmt(o.agreedPrice)}
                          </td>
                          <td style={{ padding: '8px 8px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#15803d', fontWeight: '700' }}>
                            {fmt(o.paidAmount)}
                          </td>
                          <td style={{ padding: '8px 8px', border: '1px solid #e2e8f0', textAlign: 'center', color: (o.remainingAmount ?? 0) > 0 ? '#b45309' : '#64748b', fontWeight: '700' }}>
                            {fmt(o.remainingAmount)}
                          </td>
                          <td style={{ padding: '8px 8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            {statusBadge(o.status)}
                          </td>
                        </tr>
                      );
                    })}

                    {/* صف المجموع الفرعي للعميل إذا كان لديه أكثر من طلب واحد */}
                    {orders.length > 1 && (
                      <tr key={`subtotal-${c.id}`} style={{ background: '#fefce8', borderTop: '1px solid #fef08a', borderBottom: '2px solid #cbd5e1' }}>
                        <td colSpan={6} style={{ padding: '7px 12px', border: '1px solid #e2e8f0', fontWeight: '700', color: '#854d0e', textAlign: 'left' }}>
                          مجموع العميل ({c.nameAr}) — {orders.length} طلبات:
                        </td>
                        <td style={{ padding: '7px 8px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: '800', color: '#854d0e' }}>
                          {fmt(clientAgreedTotal)}
                        </td>
                        <td style={{ padding: '7px 8px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: '800', color: '#15803d' }}>
                          {fmt(c.totalPaid)}
                        </td>
                        <td style={{ padding: '7px 8px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: '800', color: (c.remainingBalance ?? 0) > 0 ? '#b45309' : '#854d0e' }}>
                          {fmt(c.remainingBalance)}
                        </td>
                        <td style={{ padding: '7px 8px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '10px', color: '#854d0e', fontWeight: '600' }}>
                          {c.status === 'Active' ? 'نشط' : 'غير نشط'}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>

            {/* ── صف الإجمالي الكلي للتقرير ── */}
            <tfoot>
              <tr style={{ background: '#0f172a', color: '#ffffff', fontWeight: '800', fontSize: '12px' }}>
                <td colSpan={6} style={{ padding: '12px 14px', border: '1px solid #334155', textAlign: 'left' }}>
                  الإجمالي الكلي للتقرير ({clients.length} عميل · {totalOrders} طلب):
                </td>
                <td style={{ padding: '12px 8px', border: '1px solid #334155', textAlign: 'center', color: '#fef08a', fontSize: '13px' }}>
                  {fmt(totalAgreed)}
                </td>
                <td style={{ padding: '12px 8px', border: '1px solid #334155', textAlign: 'center', color: '#86efac', fontSize: '13px' }}>
                  {fmt(totalPaid)}
                </td>
                <td style={{ padding: '12px 8px', border: '1px solid #334155', textAlign: 'center', color: totalRemaining > 0 ? '#fca5a5' : '#ffffff', fontSize: '13px' }}>
                  {fmt(totalRemaining)}
                </td>
                <td style={{ padding: '12px 8px', border: '1px solid #334155', textAlign: 'center', fontSize: '10px', color: '#94a3b8' }}>
                  —
                </td>
              </tr>
            </tfoot>
          </table>

          {/* ── تذييل التقرير ── */}
          <div style={{ marginTop: '24px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '10px' }}>
            <div>تم استخراج هذا التقرير آلياً عبر نظام هالة ميديا لإدارة الإنتاج والعملاء</div>
            <div>صفحة التقرير الرسمي · جميع الحقوق محفوظة © {new Date().getFullYear()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── الصفحة الرئيسية ──────────────────────────────────────────────────────────
export default function Clients() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clients = useSelector((s) => s.clients.items);
  const selectedClient = useSelector((s) => s.clients.current);
  const [status, setStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // حالة التقرير
  const [showReport, setShowReport] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set()); // IDs المحددة للتقرير
  const [selectionMode, setSelectionMode] = useState(false);  // وضع الاختيار
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [reportClients, setReportClients] = useState([]);

  useEffect(() => {
    dispatch(fetchClients({ status, from: dateFrom, to: dateTo }));
  }, [dispatch, status, dateFrom, dateTo]);

  useEffect(() => {
    if (id) dispatch(fetchClient(id));
    else dispatch(clearClient());
  }, [dispatch, id]);

  // إعادة تعيين التحديد عند تغيير الفلتر
  useEffect(() => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  }, [status, dateFrom, dateTo]);

  const hasFilters = status !== 'all' || dateFrom || dateTo;

  const toggleSelect = (cId) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(cId)) next.delete(cId);
      else next.add(cId);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === clients.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(clients.map(c => c.id)));
  };

  // طباعة عميل واحد (من بطاقته)
  const printSingle = async (client) => {
    setLoadingDetails(true);
    try {
      const result = await dispatch(fetchClient(client.id)).unwrap();
      setReportClients([result]);
      setShowReport(true);
    } catch {
      setReportClients([client]);
      setShowReport(true);
    } finally {
      setLoadingDetails(false);
    }
  };

  // طباعة العملاء المحددين (أو الكل)
  const printSelected = async () => {
    const toPrint = selectedIds.size > 0
      ? clients.filter(c => selectedIds.has(c.id))
      : clients;

    setLoadingDetails(true);
    try {
      // تحميل تفاصيل كل عميل بالتوازي
      const details = await Promise.all(
        toPrint.map(c => dispatch(fetchClient(c.id)).unwrap().catch(() => c))
      );
      setReportClients(details);
      setShowReport(true);
    } finally {
      setLoadingDetails(false);
    }
  };

  const reportTitle = selectedIds.size > 0
    ? `تقرير ${selectedIds.size} عميل`
    : `تقرير جميع العملاء (${clients.length})`;

  if (showReport) {
    return (
      <PrintReport
        clients={reportClients}
        reportTitle={reportTitle}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onClose={() => setShowReport(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">العملاء</h1>
          <p className="mt-1 text-sm text-slate-500">أصحاب الطلبات فقط — نشط أو غير نشط حسب الطلبات المفتوحة</p>
        </div>

        {/* أزرار التقرير */}
        <div className="flex shrink-0 items-center gap-2">
          {selectionMode && (
            <button
              type="button"
              onClick={selectAll}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
            >
              {selectedIds.size === clients.length ? 'إلغاء الكل' : 'تحديد الكل'}
            </button>
          )}
          {selectionMode && selectedIds.size > 0 && (
            <button
              type="button"
              onClick={printSelected}
              disabled={loadingDetails}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-amber-500 disabled:opacity-60"
            >
              <Printer size={16} />
              {loadingDetails ? 'جاري التحميل...' : `طباعة (${selectedIds.size})`}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (selectionMode) {
                setSelectionMode(false);
                setSelectedIds(new Set());
              } else if (clients.length > 0) {
                printSelected();
              }
            }}
            disabled={loadingDetails || clients.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            <Printer size={16} />
            {loadingDetails ? 'جاري...' : 'طباعة الكل'}
          </button>
          <button
            type="button"
            onClick={() => { setSelectionMode(!selectionMode); setSelectedIds(new Set()); }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              selectionMode
                ? 'bg-indigo-600 text-white'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'
            }`}
          >
            <FileText size={16} />
            {selectionMode ? 'إلغاء التحديد' : 'تحديد للتقرير'}
          </button>
        </div>
      </div>

      {/* الفلاتر */}
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

      {/* رسالة وضع التحديد */}
      {selectionMode && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300">
          وضع تحديد التقرير — اضغط على العملاء لتحديدهم ثم اضغط "طباعة"
          {selectedIds.size > 0 && ` · تم تحديد ${selectedIds.size} عميل`}
        </div>
      )}

      {/* بطاقات العملاء */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {clients.map(c => {
          const isSelected = selectedIds.has(c.id);
          return (
            <div key={c.id} className="relative">
              {/* زر الطباعة الفردية */}
              {!selectionMode && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); printSingle(c); }}
                  title="طباعة تقرير هذا العميل"
                  className="absolute left-3 top-3 z-10 rounded-lg p-1.5 text-slate-400 hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/30"
                >
                  <Printer size={15} />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (selectionMode) toggleSelect(c.id);
                  else navigate(`/dashboard/admin/clients/${encodeURIComponent(c.id)}`);
                }}
                className={`w-full rounded-2xl border p-5 text-right shadow-sm transition ${
                  isSelected
                    ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-900/30'
                    : 'border-slate-200 bg-white hover:border-amber-300 dark:border-slate-700 dark:bg-slate-800'
                }`}
              >
                {/* مؤشر التحديد */}
                {selectionMode && (
                  <div className={`mb-2 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    isSelected ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300'
                  }`}>
                    {isSelected && '✓'}
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">{c.nameAr}</h3>
                    {c.company && <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><Building2 size={14} /> {c.company}</p>}
                    {c.phone && <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><Phone size={14} /> {c.phone}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge type={c.status === 'Active' ? 'active' : 'low'}>{c.status === 'Active' ? 'نشط' : 'غير نشط'}</Badge>
                    {c.subscriptionStatus === 'active' && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                        اشتراك سارٍ
                      </span>
                    )}
                    {c.subscriptionStatus === 'expired' && (
                      <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold">
                        اشتراك منتهٍ
                      </span>
                    )}
                  </div>
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

                {/* تاريخ بداية ونهاية الاشتراك على كارت العميل */}
                {(c.subscriptionStart || c.subscriptionEnd) && (
                  <div className="mt-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl px-3 py-1.5 flex items-center justify-between text-slate-500 border border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1 text-[11px]"><Calendar size={12} className="text-amber-500" /> الاشتراك:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                      {c.subscriptionStart || '—'} إلى {c.subscriptionEnd || '—'}
                    </span>
                  </div>
                )}
              </button>
            </div>
          );
        })}
        {clients.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-slate-400">لا يوجد عملاء مطابقون للفلتر</p>
        )}
      </div>

      {/* مودال تفاصيل العميل */}
      <Modal open={Boolean(selectedClient)} onClose={() => navigate('/dashboard/admin/clients')} title={selectedClient ? selectedClient.nameAr : ''} size="lg">
        {selectedClient && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{[selectedClient.company, selectedClient.phone].filter(Boolean).join(' · ')}</p>
              <button
                type="button"
                onClick={() => printSingle(selectedClient)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-amber-500"
              >
                <Printer size={14} /> طباعة التقرير
              </button>
            </div>

            {/* بطاقة بيانات الاشتراك الشهري في صفحة تفاصيل العميل */}
            <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3.5 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 text-sm">
                  <Calendar size={15} className="text-amber-600" />
                  بيانات الاشتراك الشهري
                </span>
                {selectedClient.subscriptionStatus === 'active' && (
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                    اشتراك نشط
                  </span>
                )}
                {selectedClient.subscriptionStatus === 'expired' && (
                  <span className="text-[11px] bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 px-2.5 py-0.5 rounded-full font-bold">
                    اشتراك منتهٍ
                  </span>
                )}
                {(!selectedClient.subscriptionStatus || selectedClient.subscriptionStatus === 'new') && (
                  <span className="text-[11px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-2.5 py-0.5 rounded-full font-semibold">
                    عميل جديد
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-lg border border-amber-100 dark:border-slate-700">
                  <span className="text-slate-400 block text-[11px] mb-0.5">تاريخ بداية الاشتراك:</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-white">{selectedClient.subscriptionStart || '—'}</span>
                </div>
                <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-lg border border-amber-100 dark:border-slate-700">
                  <span className="text-slate-400 block text-[11px] mb-0.5">تاريخ نهاية الاشتراك:</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-white">{selectedClient.subscriptionEnd || '—'}</span>
                </div>
              </div>
            </div>
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
