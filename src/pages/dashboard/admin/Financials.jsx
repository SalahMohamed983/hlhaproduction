import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, X, Tag, Calendar, DollarSign, FileText, Printer, ChevronLeft, TrendingDown, TrendingUp, ReceiptText } from 'lucide-react';
import Modal from '@/components/dashboard/ui/Modal';
import { fetchOrderPayments, fetchExpenses, createExpense } from '@/store/slices/financeSlice';

const fmt = n => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(n ?? 0);

const EXPENSE_CATEGORIES = [
  'اشتراكات برامج',
  'إيجار',
  'مصاريف تشغيلية',
  'معدات',
  'صيانة',
  'تسويق',
  'أخرى',
];

const CATEGORY_COLORS = {
  'اشتراكات برامج': { bg: '#ede9fe', text: '#6d28d9' },
  'إيجار': { bg: '#fce7f3', text: '#be185d' },
  'مصاريف تشغيلية': { bg: '#fef3c7', text: '#b45309' },
  'معدات': { bg: '#dbeafe', text: '#1d4ed8' },
  'صيانة': { bg: '#d1fae5', text: '#065f46' },
  'تسويق': { bg: '#fee2e2', text: '#991b1b' },
  'أخرى': { bg: '#f1f5f9', text: '#475569' },
};

// ══════════════════════════════════════════════════════════════════════════════
// طباعة تقرير المصاريف
// ══════════════════════════════════════════════════════════════════════════════
function printExpenses(expenses, totalExpenses) {
  const catColors = {
    'اشتراكات برامج': '#ede9fe', 'إيجار': '#fce7f3', 'مصاريف تشغيلية': '#fef3c7',
    'معدات': '#dbeafe', 'صيانة': '#d1fae5', 'تسويق': '#fee2e2', 'أخرى': '#f1f5f9',
  };

  // تجميع حسب التصنيف
  const byCategory = expenses.reduce((acc, e) => {
    if (!acc[e.category]) acc[e.category] = { items: [], total: 0 };
    acc[e.category].items.push(e);
    acc[e.category].total += e.amount ?? 0;
    return acc;
  }, {});

  const rows = expenses.map((e, i) => `
    <tr style="background:${i % 2 === 0 ? '#fff' : '#f8fafc'}; border-bottom:1px solid #e2e8f0;">
      <td style="padding:8px 10px; font-size:11px; color:#64748b; text-align:center;">${i + 1}</td>
      <td style="padding:8px 10px; font-weight:600; color:#1e293b;">${e.title ?? '—'}</td>
      <td style="padding:8px 10px;">
        <span style="display:inline-block; padding:2px 8px; border-radius:9999px; font-size:10px; font-weight:700; background:${catColors[e.category] ?? '#f1f5f9'}; color:#374151;">
          ${e.category ?? '—'}
        </span>
      </td>
      <td style="padding:8px 10px; text-align:center; font-size:11px; color:#64748b;">${e.expenseDate ?? '—'}</td>
      <td style="padding:8px 10px; text-align:center;">
        ${e.isRecurring ? '<span style="display:inline-block;padding:2px 7px;border-radius:9999px;font-size:10px;font-weight:700;background:#dbeafe;color:#1d4ed8;">متكرر</span>' : '—'}
      </td>
      <td style="padding:8px 10px; text-align:center; font-weight:800; color:#dc2626; font-size:12px;">${fmt(e.amount)}</td>
    </tr>
  `).join('');

  const categoryRows = Object.entries(byCategory).map(([cat, { total, items }]) => `
    <tr>
      <td style="padding:7px 12px; color:#374151; font-weight:600;">
        <span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700;background:${catColors[cat] ?? '#f1f5f9'};">${cat}</span>
      </td>
      <td style="padding:7px 12px; text-align:center; color:#64748b; font-size:11px;">${items.length} مصروف</td>
      <td style="padding:7px 12px; text-align:center; font-weight:800; color:#dc2626;">${fmt(total)}</td>
    </tr>
  `).join('');

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8"/>
  <title>تقرير سجل المصاريف — هالة ميديا</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; color: #1e293b; padding: 20px; font-size: 12px; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { background: #1e293b !important; color: #fff !important; padding: 9px 10px; text-align: right; font-size: 11px; font-weight: 700; border: 1px solid #334155; }
    td { border: 1px solid #e2e8f0; vertical-align: middle; }
    .text-center { text-align: center; }
    @media print { @page { size: A4; margin: 10mm; } body { padding: 0; } tr { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <!-- رأس التقرير -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #f59e0b;padding-bottom:14px;margin-bottom:18px;">
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="background:#f59e0b;color:#1e293b;width:46px;height:46px;display:flex;align-items:center;justify-content:center;border-radius:10px;font-size:22px;font-weight:900;">ه</div>
      <div>
        <div style="font-size:18px;font-weight:900;color:#0f172a;">هالة ميديا — تقرير سجل المصاريف</div>
        <div style="color:#64748b;font-size:11px;margin-top:3px;">إجمالي ${expenses.length} مصروف مسجّل</div>
      </div>
    </div>
    <div style="text-align:left;color:#64748b;font-size:11px;line-height:1.9;">
      <div><b>تاريخ التقرير:</b> ${new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>
  </div>

  <!-- إجمالي سريع -->
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px;">
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:12px 14px;">
      <div style="color:#64748b;font-size:11px;font-weight:600;">إجمالي المصاريف</div>
      <div style="font-size:18px;font-weight:900;color:#dc2626;margin-top:4px;">${fmt(totalExpenses)}</div>
    </div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;">
      <div style="color:#64748b;font-size:11px;font-weight:600;">عدد المصاريف المسجلة</div>
      <div style="font-size:18px;font-weight:900;color:#0f172a;margin-top:4px;">${expenses.length}</div>
    </div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;">
      <div style="color:#64748b;font-size:11px;font-weight:600;">مصاريف متكررة</div>
      <div style="font-size:18px;font-weight:900;color:#1d4ed8;margin-top:4px;">${expenses.filter(e => e.isRecurring).length}</div>
    </div>
  </div>

  <!-- جدول المصاريف التفصيلي -->
  <div style="font-weight:700;font-size:13px;color:#1e293b;margin-bottom:6px;">تفاصيل المصاريف</div>
  <table>
    <thead>
      <tr>
        <th style="width:5%;text-align:center;">#</th>
        <th style="width:28%;">العنوان / الوصف</th>
        <th style="width:16%;">التصنيف</th>
        <th style="width:14%;text-align:center;">تاريخ الصرف</th>
        <th style="width:11%;text-align:center;">نوع</th>
        <th style="width:14%;text-align:center;">المبلغ</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr style="background:#0f172a !important;">
        <td colspan="5" style="padding:10px 12px;color:#fff;font-weight:800;font-size:12px;border:1px solid #334155;">الإجمالي الكلي للمصاريف (${expenses.length} مصروف)</td>
        <td style="padding:10px 8px;text-align:center;font-weight:900;font-size:14px;color:#fca5a5;border:1px solid #334155;">${fmt(totalExpenses)}</td>
      </tr>
    </tfoot>
  </table>

  <!-- ملخص التصنيفات -->
  <div style="margin-top:22px;font-weight:700;font-size:13px;color:#1e293b;margin-bottom:6px;">ملخص التصنيفات</div>
  <table style="width:60%;">
    <thead>
      <tr>
        <th style="width:50%;">التصنيف</th>
        <th style="width:25%;text-align:center;">عدد المصاريف</th>
        <th style="width:25%;text-align:center;">الإجمالي</th>
      </tr>
    </thead>
    <tbody>${categoryRows}</tbody>
  </table>

  <div style="margin-top:22px;padding-top:10px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;color:#94a3b8;font-size:10px;">
    <div>تم استخراجه آلياً من نظام هالة ميديا</div>
    <div>© ${new Date().getFullYear()} هالة ميديا — جميع الحقوق محفوظة</div>
  </div>
</body>
</html>`);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 400);
}

// ══════════════════════════════════════════════════════════════════════════════
// طباعة تقرير مدفوعات الطلبات
// ══════════════════════════════════════════════════════════════════════════════
function printOrderPayments(orderPayments) {
  const totalAgreed = orderPayments.reduce((s, o) => s + (o.agreedPrice ?? 0), 0);
  const totalPaid = orderPayments.reduce((s, o) => s + (o.paidAmount ?? 0), 0);
  const totalRemaining = orderPayments.reduce((s, o) => s + (o.remainingAmount ?? 0), 0);

  const rows = orderPayments.map((o, i) => `
    <tr style="background:${i % 2 === 0 ? '#fff' : '#f8fafc'};border-bottom:1px solid #e2e8f0;">
      <td style="padding:8px 6px;text-align:center;font-size:11px;color:#64748b;border:1px solid #e2e8f0;">${i + 1}</td>
      <td style="padding:8px 10px;font-weight:700;color:#0f172a;border:1px solid #e2e8f0;">${o.clientName ?? '—'}</td>
      <td style="padding:8px 10px;color:#374151;font-weight:600;border:1px solid #e2e8f0;">${o.serviceNameAr ?? '—'}</td>
      <td style="padding:8px 8px;text-align:center;font-weight:700;color:#b45309;border:1px solid #e2e8f0;">${fmt(o.agreedPrice)}</td>
      <td style="padding:8px 8px;text-align:center;font-weight:800;color:#15803d;border:1px solid #e2e8f0;">${fmt(o.paidAmount)}</td>
      <td style="padding:8px 8px;text-align:center;font-weight:800;color:${(o.remainingAmount ?? 0) > 0 ? '#b91c1c' : '#64748b'};border:1px solid #e2e8f0;">${fmt(o.remainingAmount)}</td>
    </tr>
  `).join('');

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8"/>
  <title>تقرير مدفوعات الطلبات — هالة ميديا</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; color: #1e293b; padding: 20px; font-size: 12px; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { background: #1e293b !important; color: #fff !important; padding: 9px 10px; text-align: right; font-size: 11px; font-weight: 700; border: 1px solid #334155; }
    @media print { @page { size: A4; margin: 10mm; } body { padding: 0; } tr { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #f59e0b;padding-bottom:14px;margin-bottom:18px;">
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="background:#f59e0b;color:#1e293b;width:46px;height:46px;display:flex;align-items:center;justify-content:center;border-radius:10px;font-size:22px;font-weight:900;">ه</div>
      <div>
        <div style="font-size:18px;font-weight:900;color:#0f172a;">هالة ميديا — تقرير مدفوعات الطلبات</div>
        <div style="color:#64748b;font-size:11px;margin-top:3px;">${orderPayments.length} طلب مسجّل</div>
      </div>
    </div>
    <div style="text-align:left;color:#64748b;font-size:11px;line-height:1.9;">
      <div><b>تاريخ التقرير:</b> ${new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px;">
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;">
      <div style="color:#64748b;font-size:11px;font-weight:600;">عدد الطلبات</div>
      <div style="font-size:18px;font-weight:900;color:#0f172a;margin-top:4px;">${orderPayments.length}</div>
    </div>
    <div style="background:#fefce8;border:1px solid #fef08a;border-radius:10px;padding:12px 14px;">
      <div style="color:#64748b;font-size:11px;font-weight:600;">إجمالي المتفق عليه</div>
      <div style="font-size:18px;font-weight:900;color:#b45309;margin-top:4px;">${fmt(totalAgreed)}</div>
    </div>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px 14px;">
      <div style="color:#64748b;font-size:11px;font-weight:600;">إجمالي المدفوع</div>
      <div style="font-size:18px;font-weight:900;color:#15803d;margin-top:4px;">${fmt(totalPaid)}</div>
    </div>
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:12px 14px;">
      <div style="color:#64748b;font-size:11px;font-weight:600;">إجمالي المتبقي</div>
      <div style="font-size:18px;font-weight:900;color:#b91c1c;margin-top:4px;">${fmt(totalRemaining)}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:5%;text-align:center;">#</th>
        <th style="width:25%;">العميل</th>
        <th style="width:30%;">الخدمة</th>
        <th style="width:14%;text-align:center;">المتفق عليه</th>
        <th style="width:13%;text-align:center;">المدفوع</th>
        <th style="width:13%;text-align:center;">المتبقي</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr style="background:#0f172a !important;">
        <td colspan="3" style="padding:10px 12px;color:#fff;font-weight:800;font-size:12px;border:1px solid #334155;">الإجمالي (${orderPayments.length} طلب)</td>
        <td style="padding:10px 8px;text-align:center;font-weight:900;font-size:13px;color:#fef08a;border:1px solid #334155;">${fmt(totalAgreed)}</td>
        <td style="padding:10px 8px;text-align:center;font-weight:900;font-size:13px;color:#86efac;border:1px solid #334155;">${fmt(totalPaid)}</td>
        <td style="padding:10px 8px;text-align:center;font-weight:900;font-size:13px;color:#fca5a5;border:1px solid #334155;">${fmt(totalRemaining)}</td>
      </tr>
    </tfoot>
  </table>

  <div style="margin-top:22px;padding-top:10px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;color:#94a3b8;font-size:10px;">
    <div>تم استخراجه آلياً من نظام هالة ميديا</div>
    <div>© ${new Date().getFullYear()} هالة ميديا — جميع الحقوق محفوظة</div>
  </div>
</body>
</html>`);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 400);
}

// ══════════════════════════════════════════════════════════════════════════════
// Add Expense Modal
// ══════════════════════════════════════════════════════════════════════════════
function AddExpenseModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    category: EXPENSE_CATEGORIES[0],
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    isRecurring: false,
  });
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'مطلوب';
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) e.amount = 'أدخل مبلغاً صحيحاً';
    if (!form.expenseDate) e.expenseDate = 'مطلوب';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      title: form.title.trim(),
      category: form.category,
      amount: +form.amount,
      expenseDate: form.expenseDate,
      isRecurring: form.isRecurring,
    });
    onClose();
  };

  const inputCls = (err) =>
    `w-full bg-slate-100 dark:bg-slate-700 border ${err ? 'border-red-400' : 'border-slate-200 dark:border-slate-600'} rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-amber-400 transition-colors`;

  return (
    <Modal open onClose={onClose} title="إضافة مصروف جديد">
      <div className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1 block">
            <FileText size={12} /> عنوان / وصف المصروف *
          </label>
          <input
            value={form.title}
            onChange={e => set('title', e.target.value)}
            className={inputCls(errors.title)}
            placeholder="مثال: اشتراك Adobe Creative Cloud، إيجار المكتب..."
          />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1 block">
            <Tag size={12} /> التصنيف
          </label>
          <select
            value={form.category}
            onChange={e => set('category', e.target.value)}
            className={inputCls()}
          >
            {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1 block">
              <DollarSign size={12} /> المبلغ (ر.س) *
            </label>
            <input
              type="number"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              className={inputCls(errors.amount)}
              placeholder="0"
              min="0"
            />
            {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1 block">
              <Calendar size={12} /> تاريخ الصرف *
            </label>
            <input
              type="date"
              value={form.expenseDate}
              onChange={e => set('expenseDate', e.target.value)}
              className={inputCls(errors.expenseDate)}
            />
            {errors.expenseDate && <p className="text-red-400 text-xs mt-1">{errors.expenseDate}</p>}
          </div>
        </div>

        <div
          onClick={() => set('isRecurring', !form.isRecurring)}
          className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all ${form.isRecurring
            ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700'
            : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40'
            }`}
        >
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">مصروف متكرر</p>
            <p className="text-xs text-slate-400">يتكرر شهرياً أو بشكل دوري</p>
          </div>
          <div className={`w-10 h-6 rounded-full relative transition-colors ${form.isRecurring ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow ${form.isRecurring ? 'left-5' : 'left-1'}`} />
          </div>
        </div>

        {form.amount && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3 flex items-center justify-between border border-red-200 dark:border-red-800/40">
            <span className="text-sm text-slate-600 dark:text-slate-300">المبلغ الذي سيُخصم</span>
            <span className="text-base font-black text-red-500">- {fmt(+form.amount || 0)}</span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-400 text-slate-900 font-bold text-sm hover:bg-amber-300 transition-colors"
          >
            <Plus size={15} /> إضافة المصروف
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Expense Detail Modal
// ══════════════════════════════════════════════════════════════════════════════
function ExpenseDetailModal({ expense, onClose }) {
  if (!expense) return null;
  const catStyle = CATEGORY_COLORS[expense.category] ?? { bg: '#f1f5f9', text: '#475569' };

  return (
    <Modal open onClose={onClose} title="تفاصيل المصروف">
      <div className="space-y-5">
        {/* العنوان والتصنيف */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-700/40 p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs text-slate-400 mb-1">عنوان المصروف</p>
              <p className="font-bold text-slate-800 dark:text-white text-base">{expense.title}</p>
            </div>
            <span
              className="mt-1 shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: catStyle.bg, color: catStyle.text }}
            >
              {expense.category}
            </span>
          </div>
        </div>

        {/* المبلغ والتاريخ */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 p-4 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-center gap-1">
              <TrendingDown size={12} /> المبلغ المدفوع
            </p>
            <p className="text-2xl font-black text-red-500">{fmt(expense.amount)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-4 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-center gap-1">
              <Calendar size={12} /> تاريخ الصرف
            </p>
            <p className="text-lg font-bold text-slate-800 dark:text-white">{expense.expenseDate ?? '—'}</p>
          </div>
        </div>

        {/* نوع المصروف */}
        <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${expense.isRecurring
            ? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
            : 'border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700/40'
          }`}>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">نوع المصروف</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {expense.isRecurring ? 'مصروف متكرر (شهري / دوري)' : 'مصروف لمرة واحدة'}
            </p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${expense.isRecurring
              ? 'bg-blue-500 text-white'
              : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
            }`}>
            {expense.isRecurring ? 'متكرر' : 'غير متكرر'}
          </span>
        </div>

        {/* معرّف المصروف */}
        {expense.id && (
          <p className="text-center text-xs text-slate-400">رقم المصروف: #{expense.id}</p>
        )}

        {/* أزرار */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={() => {
              onClose();
              printExpenses([expense], expense.amount ?? 0);
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-2.5 text-sm font-bold text-slate-900 hover:bg-amber-500 transition-colors"
          >
            <Printer size={15} /> طباعة هذا المصروف
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-600 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Financials Page
// ══════════════════════════════════════════════════════════════════════════════
export default function Financials() {
  const dispatch = useDispatch();
  const orderPayments = useSelector((s) => s.finance.orderPayments);
  const expenses = useSelector((s) => s.finance.expenses);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    dispatch(fetchOrderPayments());
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleAddExpense = async (body) => {
    try {
      await dispatch(createExpense(body)).unwrap();
      dispatch(fetchExpenses());
    } catch (err) {
      console.error(err);
    }
  };

  const totalExpenses = expenses.reduce((a, e) => a + (e.amount || 0), 0);
  const totalPaid = orderPayments.reduce((s, o) => s + (o.paidAmount ?? 0), 0);
  const totalRemaining = orderPayments.reduce((s, o) => s + (o.remainingAmount ?? 0), 0);
  const totalAgreed = orderPayments.reduce((s, o) => s + (o.agreedPrice ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* ── رأس الصفحة ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">الماليات والربحية</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">نظرة مفصّلة على الأرباح والمصاريف</p>
        </div>
      </div>

      {/* ══ مدفوعات الطلبات ══════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white">مدفوعات الطلبات</h2>
            <p className="text-xs text-slate-400 mt-0.5">كل طلب والمبلغ المدفوع والمتبقي</p>
          </div>
          <button
            onClick={() => printOrderPayments(orderPayments)}
            disabled={orderPayments.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 transition-colors"
          >
            <Printer size={13} /> طباعة التقرير
          </button>
        </div>

        {/* كروت إجمالي سريعة */}
        <div className="grid grid-cols-3 gap-px bg-slate-200 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-700">
          {[
            { label: 'إجمالي المتفق عليه', value: fmt(totalAgreed), color: 'text-amber-600' },
            { label: 'إجمالي المدفوع', value: fmt(totalPaid), color: 'text-emerald-600' },
            { label: 'إجمالي المتبقي', value: fmt(totalRemaining), color: totalRemaining > 0 ? 'text-red-500' : 'text-slate-500' },
          ].map(item => (
            <div key={item.label} className="bg-white dark:bg-slate-800 px-5 py-3">
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className={`font-bold text-sm mt-0.5 ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                {['#', 'العميل', 'الخدمة', 'المتفق عليه', 'تم دفع', 'المتبقي'].map(h => (
                  <th key={h} className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {orderPayments.map((o, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{o.clientName}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{o.serviceNameAr}</td>
                  <td className="px-4 py-3 font-bold text-amber-500">{fmt(o.agreedPrice)}</td>
                  <td className="px-4 py-3 font-bold text-emerald-500">{fmt(o.paidAmount)}</td>
                  <td className={`px-4 py-3 font-bold ${(o.remainingAmount ?? 0) > 0 ? 'text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {fmt(o.remainingAmount)}
                  </td>
                </tr>
              ))}
              {orderPayments.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-400 text-sm">لا يوجد مدفوعات طلبات</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ سجل المصاريف ══════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white">سجل المصاريف</h2>
            <p className="text-xs text-slate-400 mt-0.5">اضغط على أي مصروف لعرض تفاصيله</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => printExpenses(expenses, totalExpenses)}
              disabled={expenses.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 transition-colors"
            >
              <Printer size={13} /> طباعة التقرير
            </button>
            <button
              onClick={() => setShowAddExpense(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-slate-900 rounded-lg text-xs font-bold hover:bg-amber-300 transition-colors"
            >
              <Plus size={13} /> إضافة مصروف جديد +
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {expenses.map(e => {
            const catStyle = CATEGORY_COLORS[e.category] ?? { bg: '#f1f5f9', text: '#475569' };
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => setSelectedExpense(e)}
                className="w-full flex items-center justify-between px-6 py-3.5 text-right hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* أيقونة التصنيف */}
                  <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: catStyle.bg }}>
                    <ReceiptText size={16} style={{ color: catStyle.text }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate group-hover:text-amber-600 transition-colors">
                      {e.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: catStyle.bg, color: catStyle.text }}
                      >
                        {e.category}
                      </span>
                      {e.isRecurring && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 rounded font-semibold">
                          متكرر
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{e.expenseDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-red-400 text-sm">{fmt(e.amount)}</span>
                  <ChevronLeft size={16} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
                </div>
              </button>
            );
          })}
          {expenses.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-8">لا توجد مصاريف مسجّلة بعد</p>
          )}
        </div>

        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-between">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">الإجمالي الكلي للمصاريف</span>
          <span className="font-bold text-red-400">{fmt(totalExpenses)}</span>
        </div>
      </div>

      {/* ══ Modals ══════════════════════════════════════════════════════ */}
      {showAddExpense && (
        <AddExpenseModal
          onClose={() => setShowAddExpense(false)}
          onSave={handleAddExpense}
        />
      )}
      {selectedExpense && (
        <ExpenseDetailModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
        />
      )}
    </div>
  );
}

