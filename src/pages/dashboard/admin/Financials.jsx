import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, X, Tag, Calendar, DollarSign, FileText } from 'lucide-react';
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

// ── Add Expense Modal ─────────────────────────────────────────────────────────
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
        {/* Name */}
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

        {/* Category */}
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
          {/* Amount */}
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

          {/* Date */}
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

        {/* Recurring toggle */}
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

        {/* Preview */}
        {form.amount && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3 flex items-center justify-between border border-red-200 dark:border-red-800/40">
            <span className="text-sm text-slate-600 dark:text-slate-300">المبلغ الذي سيُخصم</span>
            <span className="text-base font-black text-red-500">- {fmt(+form.amount || 0)}</span>
          </div>
        )}

        {/* Actions */}
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

// ── Main Financials Page ───────────────────────────────────────────────────────
export default function Financials() {
  const dispatch = useDispatch();
  const orderPayments = useSelector((s) => s.finance.orderPayments);
  const expenses = useSelector((s) => s.finance.expenses);
  const [showAddExpense, setShowAddExpense] = useState(false);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">الماليات والربحية</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">نظرة مفصّلة على الأرباح والمصاريف</p>
      </div>

      {/* Profitability Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-bold text-slate-800 dark:text-white">مدفوعات الطلبات</h2>
          <p className="text-xs text-slate-400 mt-0.5">كل طلب والمبلغ المدفوع والمتبقي</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                {['العميل','الخدمة','الإجمالي','تم دفع','المتبقي'].map(h => (
                  <th key={h} className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {orderPayments.map((o, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{o.clientName}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{o.serviceNameAr}</td>
                  <td className="px-4 py-3 font-bold text-amber-500">{fmt(o.agreedPrice)}</td>
                  <td className="px-4 py-3 font-bold text-emerald-500">{fmt(o.paidAmount)}</td>
                  <td className="px-4 py-3 font-bold text-slate-600 dark:text-slate-300">{fmt(o.remainingAmount)}</td>
                </tr>
              ))}
              {orderPayments.length === 0 && (
                <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-400 text-sm">لا يوجد مدفوعات طلبات</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 dark:text-white">سجل المصاريف</h2>
          <button
            onClick={() => setShowAddExpense(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-slate-900 rounded-lg text-xs font-bold hover:bg-amber-300 transition-colors"
          >
            <Plus size={13} /> إضافة مصروف جديد +
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {expenses.map(e => (
            <div key={e.id} className="flex items-center justify-between px-6 py-3">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">{e.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400">{e.category}</span>
                  {e.isRecurring && <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 rounded">متكرر</span>}
                  <span className="text-xs text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-xs text-slate-400">{e.expenseDate}</span>
                </div>
              </div>
              <span className="font-bold text-red-400 text-sm">{fmt(e.amount)}</span>
            </div>
          ))}
          {expenses.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-8">لا توجد مصاريف مسجّلة بعد</p>
          )}
        </div>
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-between">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">الإجمالي</span>
          <span className="font-bold text-red-400">{fmt(totalExpenses)}</span>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <AddExpenseModal
          onClose={() => setShowAddExpense(false)}
          onSave={handleAddExpense}
        />
      )}
    </div>
  );
}
