
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus, Edit2, TrendingUp, Calendar, DollarSign, Award,
  UserCheck, UserX, Save, X, ChevronUp, ChevronDown, Printer, Eye, EyeOff,
} from 'lucide-react';
import Modal from '@/components/dashboard/ui/Modal';
import Badge from '@/components/dashboard/ui/Badge';
import {
  fetchSpecialties, createSpecialty, updateSpecialty, fetchEmployees, createEmployee, updateEmployee,
  fetchPayrollSettings, savePayrollSettings, fetchEmployeePayroll, saveEmployeePayroll, fetchPayrollReport,
} from '@/store/slices/employeesSlice';
import { asList } from '@/store/helpers';

function specLabel(member) {
  return member.specialtyNameAr || member.specialty || '—';
}

function activeCount(member) {
  return member.workload?.activeAssignmentCount ?? 0;
}

function loadOf(member) {
  return member.workload?.load || 'active';
}
const statusColors = { active: '#10B981', busy: '#F59E0B', overloaded: '#EF4444' };
const MONTHS = [
  { v: 1, l: 'يناير' }, { v: 2, l: 'فبراير' }, { v: 3, l: 'مارس' }, { v: 4, l: 'أبريل' },
  { v: 5, l: 'مايو' }, { v: 6, l: 'يونيو' }, { v: 7, l: 'يوليو' }, { v: 8, l: 'أغسطس' },
  { v: 9, l: 'سبتمبر' }, { v: 10, l: 'أكتوبر' }, { v: 11, l: 'نوفمبر' }, { v: 12, l: 'ديسمبر' },
];
const YEARS = [2025, 2026, 2027];

const fmt = n =>
  new Intl.NumberFormat('ar-SA', {
    style: 'currency', currency: 'SAR', maximumFractionDigits: 0,
  }).format(n);

const ymKey = (year, month) => `${year}-${String(month).padStart(2, '0')}`;

function monthRecord(member, ym) {
  const rec = member.payrollByMonth?.[ym] || {};
  const isDefault = ym === '2026-09';
  return {
    attendanceDays: rec.attendanceDays ?? (isDefault ? (member.attendanceDays ?? 0) : 0),
    absenceDays: rec.absenceDays ?? (isDefault ? (member.absenceDays ?? 0) : 0),
    extraDeductions: rec.extraDeductions ?? 0,
    extraAdditions: rec.extraAdditions ?? 0,
  };
}

function computePay(base, absenceDays, extra, workDays, additions = 0) {
  const daily = workDays > 0 ? base / workDays : 0;
  const absenceDeduction = Math.round(daily * absenceDays);
  const extraN = extra || 0;
  const addN = additions || 0;
  const net = Math.max(0, Math.round(base - absenceDeduction - extraN + addN));
  return { daily, absenceDeduction, extraN, addN, net };
}

function DayStepper({ value, onChange, colorClass, max = 31 }) {
  return (
    <div className="flex items-center gap-1">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
        <ChevronDown size={12} />
      </button>
      <span className={`text-sm font-black w-6 text-center ${colorClass}`}>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
        <ChevronUp size={12} />
      </button>
    </div>
  );
}

function PayrollRow({ member, rec, workDays, onUpdateMonth, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draftAttend, setDraftAttend] = useState(rec.attendanceDays);

  const memberTasksCount = activeCount(member);
  const base = member.baseSalary ?? 0;
  const derivedAbsent = Math.max(0, workDays - (rec.attendanceDays || 0));
  const draftAbsent = Math.max(0, workDays - (draftAttend || 0));
  const pay = computePay(base, derivedAbsent, rec.extraDeductions, workDays, rec.extraAdditions);
  const attendancePct = workDays > 0 ? Math.round((rec.attendanceDays / workDays) * 100) : 0;
  const draftPay = computePay(base, draftAbsent, rec.extraDeductions, workDays, rec.extraAdditions);
  const draftPct = workDays > 0 ? Math.round((draftAttend / workDays) * 100) : 0;

  const handleSave = () => {
    onUpdateMonth({ attendanceDays: draftAttend, absenceDays: draftAbsent });
    setEditing(false);
  };

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 text-sm font-bold flex-shrink-0">
            {member.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-white text-sm">{member.name}</p>
            <p className="text-xs text-slate-400">{specLabel(member)}{member.username ? ` · @${member.username}` : ''}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        {editing ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 w-10">حضور</span>
              <DayStepper value={draftAttend} onChange={setDraftAttend} colorClass="text-emerald-600 dark:text-emerald-400" max={workDays} />
            </div>
            <p className="text-xs text-slate-400">غياب {draftAbsent} · {draftPct}% · صافي {fmt(draftPay.net)}</p>
            <div className="flex gap-1.5 mt-1">
              <button type="button" onClick={handleSave} className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-xs font-bold">
                <Save size={11} /> حفظ
              </button>
              <button type="button" onClick={() => { setDraftAttend(rec.attendanceDays); setEditing(false); }} className="flex items-center gap-1 px-2.5 py-1 bg-slate-200 dark:bg-slate-600 rounded-lg text-xs font-semibold">
                <X size={11} /> إلغاء
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <UserCheck size={13} /> {rec.attendanceDays}
              </span>
              <span className="text-slate-300">/</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-red-500">
                <UserX size={13} /> {derivedAbsent}
              </span>
              <button type="button" onClick={() => setEditing(true)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-amber-500" title="تعديل الحضور">
                <Edit2 size={12} />
              </button>
            </div>
            <div className="mt-1.5 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full w-24 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: Math.min(100, attendancePct) + '%' }} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{attendancePct}% من {workDays} يوم عمل</p>
          </div>
        )}
      </td>
      <td className="px-4 py-4 font-bold text-amber-500 text-sm">{fmt(base)}</td>
      <td className="px-4 py-4">
        <span className={`text-sm font-black ${pay.net < base ? 'text-red-400' : 'text-emerald-500'}`}>{fmt(pay.net)}</span>
        {pay.absenceDeduction > 0 && <p className="text-xs text-red-400 mt-0.5">- {fmt(pay.absenceDeduction)} خصم غياب</p>}
        {pay.extraN > 0 && <p className="text-xs text-orange-500 mt-0.5">- {fmt(pay.extraN)} خصم إضافي</p>}
      </td>
      <td className="px-4 py-4">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{memberTasksCount}</span>
        <p className="text-xs text-slate-400">مهمة نشطة</p>
      </td>
      <td className="px-4 py-4">
        <button type="button" onClick={() => onEdit(member)} className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg text-slate-400 hover:text-amber-500" title="تعديل بيانات الموظف">
          <Edit2 size={14} />
        </button>
      </td>
    </tr>
  );
}

function EmployeeModal({ member, fromHr, team, specialties, onClose, onSave, ym, monthLabel, workDays }) {
  const isEdit = !!member;
  const rec = member ? monthRecord(member, ym) : { attendanceDays: workDays, absenceDays: 0, extraDeductions: 0, extraAdditions: 0 };
  const [showPass, setShowPass] = useState(false);
  const defaultSpec = member?.specialtyId ?? specialties[0]?.id ?? '';
  const [form, setForm] = useState({
    name: member?.name ?? member?.nameAr ?? '',
    email: member?.email ?? '',
    username: member?.username ?? '',
    password: '',
    specialtyId: defaultSpec,
    baseSalary: member?.baseSalary ?? '',
    employment: member?.employment ?? member?.employmentStatus ?? 'working',
    attendanceDays: rec.attendanceDays,
    absenceDays: rec.absenceDays,
    extraDeductions: rec.extraDeductions,
    extraAdditions: rec.extraAdditions,
    workDaysPerMonth: member?.workDaysPerMonth ?? '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
    if (serverError) setServerError('');
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'الاسم الكامل مطلوب';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }
    const username = form.username.trim().toLowerCase();
    if (!username) e.username = 'اسم المستخدم مطلوب';
    else if (!/^[a-z0-9._-]{3,30}$/i.test(username)) {
      e.username = 'اسم المستخدم يجب أن يتكون من 3-30 حرفاً (حروف إنجليزية أو أرقام)';
    } else if ((team || []).some(m => m.id !== member?.id && (m.username || '').toLowerCase() === username)) {
      e.username = 'اسم المستخدم مستخدم مسبقاً';
    }
    if (!isEdit && !form.password) {
      e.password = 'كلمة المرور مطلوبة';
    } else if (form.password && form.password.length < 8) {
      e.password = 'كلمة المرور يجب ألا تقل عن 8 أحرف';
    }
    if (form.baseSalary === '' || isNaN(+form.baseSalary) || +form.baseSalary < 0) {
      e.baseSalary = 'أدخل قيمة صحيحة للراتب الأساسي';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');
    try {
      const base = +form.baseSalary || 0;
      if (!isEdit) {
        await onSave({
          name: form.name.trim(),
          nameAr: form.name.trim(),
          email: form.email.trim() || null,
          username: form.username.trim().toLowerCase(),
          password: form.password,
          specialtyId: form.specialtyId === '' ? null : +form.specialtyId,
          baseSalary: base,
          employmentStatus: 'working',
          joinDate: new Date().toISOString().split('T')[0],
          workDaysPerMonth: form.workDaysPerMonth !== '' ? +form.workDaysPerMonth : null,
        });
      } else {
        const days = form.workDaysPerMonth !== '' ? +form.workDaysPerMonth : workDays;
        const attend = +form.attendanceDays || 0;
        const absent = Math.max(0, days - attend);
        const extra = +form.extraDeductions || 0;
        const additions = +form.extraAdditions || 0;
        const { net } = computePay(base, absent, extra, days, additions);
        await onSave({
          ...(member ?? {}),
          id: member?.id,
          name: form.name.trim(),
          nameAr: form.name.trim(),
          email: form.email.trim() || null,
          username: form.username.trim().toLowerCase(),
          password: form.password,
          specialtyId: form.specialtyId === '' ? null : +form.specialtyId,
          baseSalary: base,
          employment: form.employment,
          employmentStatus: form.employment,
          ...(fromHr ? { attendanceDays: attend, absenceDays: absent, extraDeductions: extra, extraAdditions: additions } : {}),
          netSalary: net,
          joinDate: member?.joinDate ?? new Date().toISOString().split('T')[0],
          workDaysPerMonth: form.workDaysPerMonth !== '' ? +form.workDaysPerMonth : null,
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
      const firstValError = err?.errors
        ? (Array.isArray(err.errors) ? err.errors[0] : Object.values(err.errors).flat()[0])
        : null;
      const msg = firstValError || err?.detail || err?.title || err?.message || 'حدث خطأ أثناء حفظ البيانات';
      setServerError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (err) =>
    `w-full bg-slate-100 dark:bg-slate-700 border ${err ? 'border-red-400' : 'border-slate-200 dark:border-slate-600'} rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-amber-400 transition-colors`;

  const previewDays = form.workDaysPerMonth !== '' ? +form.workDaysPerMonth : workDays;
  const previewAbsent = Math.max(0, previewDays - (+form.attendanceDays || 0));
  const preview = computePay(+form.baseSalary || 0, previewAbsent, +form.extraDeductions || 0, previewDays, +form.extraAdditions || 0);

  return (
    <Modal open onClose={onClose} title={isEdit ? `تعديل بيانات — ${member.name}` : 'إضافة موظف جديد'}>
      <div className="space-y-4">
        {serverError && (
          <div className="p-3 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-800">
            {serverError}
          </div>
        )}
        {isEdit && fromHr ? (
          <p className="text-xs text-slate-400">بيانات الراتب والخصومات لشهر <span className="font-bold text-amber-600">{monthLabel}</span> · أيام العمل {workDays}</p>
        ) : (
          <p className="text-xs text-slate-400">أدخل البيانات الأساسية لإضافة الموظف {isEdit ? '' : 'الجديد '}إلى النظام</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">الاسم الكامل *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} className={inputCls(errors.name)} placeholder="مثال: أحمد محمد" />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">البريد الإلكتروني <span className="text-slate-400 text-[11px]">(اختياري)</span></label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls(errors.email)} dir="ltr" placeholder="example@domain.com" />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">اسم المستخدم *</label>
            <input value={form.username} onChange={e => set('username', e.target.value)} className={inputCls(errors.username)} dir="ltr" placeholder="ahmed" autoComplete="off" />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{isEdit ? 'كلمة المرور (اتركها فارغة للإبقاء)' : 'كلمة المرور *'}</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} className={`${inputCls(errors.password)} pl-10`} dir="ltr" autoComplete="new-password" placeholder={isEdit ? '••••••••' : ''} />
              <button type="button" onClick={() => setShowPass(s => !s)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">التخصص</label>
            <select value={form.specialtyId} onChange={e => set('specialtyId', e.target.value)} className={inputCls()}>
              {specialties.map(s => (
                <option key={s.id} value={s.id}>{s.nameAr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">الراتب الأساسي (ر.س) *</label>
            <input type="number" value={form.baseSalary} onChange={e => set('baseSalary', e.target.value)} className={inputCls(errors.baseSalary)} min="0" placeholder="مثال: 5000" />
            {errors.baseSalary && <p className="text-red-400 text-xs mt-1">{errors.baseSalary}</p>}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">أيام العمل في الشهر <span className="text-slate-400 text-[11px]">(اتركه فارغاً للإعداد الافتراضي {workDays} يوم)</span></label>
            <input type="number" value={form.workDaysPerMonth} onChange={e => set('workDaysPerMonth', e.target.value)} className={inputCls()} min="1" max="31" placeholder={`مثال: ${workDays}`} />
          </div>

          {isEdit && (
            <>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">حالة التوظيف</label>
                <select value={form.employment} onChange={e => set('employment', e.target.value)} className={inputCls()}>
                  <option value="working">شغال</option>
                  <option value="dismissed">مفصول</option>
                </select>
              </div>
              {fromHr && (
                <>
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block">أيام الحضور</label>
                    <input type="number" value={form.attendanceDays} onChange={e => set('attendanceDays', e.target.value)} className={inputCls()} min="0" max={previewDays} />
                    <p className="text-xs text-slate-400 mt-1">الغياب يُحسب تلقائياً: {previewAbsent} يوم</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block">خصومات إضافية (ر.س) — {monthLabel}</label>
                    <input type="number" value={form.extraDeductions} onChange={e => set('extraDeductions', e.target.value)} className={inputCls()} min="0" placeholder="سلفة، جزاء، خصم آخر..." />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block">إضافي للراتب (ر.س) — {monthLabel}</label>
                    <input type="number" value={form.extraAdditions} onChange={e => set('extraAdditions', e.target.value)} className={inputCls()} min="0" placeholder="بونص، حافز، مكافأة..." />
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {isEdit && fromHr && form.baseSalary ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm dark:border-emerald-800/40 dark:bg-emerald-900/20">
            <div className="flex justify-between"><span>خصم الغياب</span><span className="font-bold text-red-500">- {fmt(preview.absenceDeduction)}</span></div>
            <div className="mt-1 flex justify-between"><span>خصم إضافي</span><span className="font-bold text-orange-500">- {fmt(preview.extraN)}</span></div>
            {preview.addN > 0 && <div className="mt-1 flex justify-between"><span>إضافي للراتب</span><span className="font-bold text-emerald-500">+ {fmt(preview.addN)}</span></div>}
            <div className="mt-2 flex justify-between border-t border-emerald-200 pt-2 dark:border-emerald-800"><span>صافي الراتب</span><span className="font-black text-emerald-600">{fmt(preview.net)}</span></div>
          </div>
        ) : null}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            disabled={submitting}
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-400 text-slate-900 font-bold text-sm hover:bg-amber-300 disabled:opacity-50"
          >
            <Save size={15} /> {submitting ? 'جارٍ الحفظ...' : (isEdit ? 'حفظ التغييرات' : 'إضافة الموظف')}
          </button>
          <button type="button" onClick={onClose} disabled={submitting} className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 font-semibold text-sm">إلغاء</button>
        </div>
      </div>
    </Modal>
  );
}

function printAttendanceReport({ monthLabel, workDays, rows }) {
  const body = rows.map(r => `
    <tr>
      <td>${r.name}</td>
      <td>${r.specialty}</td>
      <td>${r.attend}</td>
      <td>${r.absent}</td>
      <td>${r.workDays}</td>
      <td>${fmt(r.base)}</td>
      <td>${fmt(r.absenceDeduction)}</td>
      <td>${fmt(r.extra)}</td>
      <td>${fmt(r.net)}</td>
    </tr>`).join('');
  const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"/>
    <title>تقرير حضور وغياب — ${monthLabel}</title>
    <style>
      body { font-family: Cairo, Tahoma, sans-serif; padding: 28px; color: #1e293b; }
      h1 { margin: 0 0 6px; } p { color: #64748b; margin: 0 0 18px; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: right; }
      th { background: #f8fafc; }
      tfoot td { font-weight: 800; background: #fffbeb; }
    </style></head><body>
    <h1>هالة ميديا — تقرير حضور وغياب</h1>
    <p>${monthLabel} · أيام العمل المعتمدة: ${workDays}</p>
    <table>
      <thead><tr>
        <th>الموظف</th><th>التخصص</th><th>حضور</th><th>غياب</th><th>أيام العمل</th>
        <th>الراتب الأساسي</th><th>خصم الغياب</th><th>خصم إضافي</th><th>الصافي</th>
      </tr></thead>
      <tbody>${body}</tbody>
    </table>
    </body></html>`;
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
}

function mapEmployee(e, payroll) {
  const rec = payroll
    ? { attendanceDays: payroll.attendanceDays, absenceDays: payroll.absenceDays, extraDeductions: payroll.extraDeductions, extraAdditions: payroll.extraAdditions ?? 0 }
    : { attendanceDays: 0, absenceDays: 0, extraDeductions: 0, extraAdditions: 0 };
  return {
    ...e,
    name: e.nameAr || e.name,
    employment: e.employmentStatus || e.employment,
    specialtyNameAr: e.specialtyNameAr,
    workDaysPerMonth: e.workDaysPerMonth ?? null,
    payrollByMonth: payroll ? { [payroll.yearMonth]: rec } : {},
    attendanceDays: rec.attendanceDays,
    absenceDays: rec.absenceDays,
  };
}

export default function Team() {
  const dispatch = useDispatch();
  const specialties = useSelector((s) => s.employees.specialties);
  const workDaysMap = useSelector((s) => s.employees.workDaysByYm);
  const [team, setTeam] = useState([]);
  const [hrView, setHrView] = useState(false);
  const [employeeModal, setEmployeeModal] = useState(null);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [employmentFilter, setEmploymentFilter] = useState('working');
  const [specOpen, setSpecOpen] = useState(false);
  const [newSpec, setNewSpec] = useState('');
  const [editingSpec, setEditingSpec] = useState(null);
  const [specError, setSpecError] = useState('');

  const ym = ymKey(year, month);
  const monthLabel = `${MONTHS.find(m => m.v === month)?.l || ''} ${year}`;
  const workDays = workDaysMap[ym] ?? 22;

  const reload = async () => {
    const [emps] = await Promise.all([
      dispatch(fetchEmployees('all')).unwrap(),
      dispatch(fetchPayrollSettings(ym)).unwrap(),
    ]);
    const list = asList(emps);
    const payrolls = await Promise.all(list.map(e => dispatch(fetchEmployeePayroll({ id: e.id, yearMonth: ym })).unwrap().catch(() => null)));
    const byId = {};
    list.forEach((e, i) => { byId[e.id] = payrolls[i]; });
    setTeam(list.map(e => mapEmployee(e, byId[e.id])));
  };

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  useEffect(() => {
    reload().catch(console.error);
  }, [ym]);

  const workingTeam = team.filter(m => (m.employment || 'working') !== 'dismissed');
  const payrollTeam = useMemo(() => {
    if (employmentFilter === 'dismissed') return team.filter(m => m.employment === 'dismissed');
    return team.filter(m => (m.employment || 'working') !== 'dismissed');
  }, [team, employmentFilter]);

  const payrollRows = payrollTeam.map(m => {
    const rec = monthRecord(m, ym);
    const effectiveWorkDays = m.workDaysPerMonth ?? workDays;
    const pay = computePay(m.baseSalary ?? 0, rec.absenceDays, rec.extraDeductions, effectiveWorkDays, rec.extraAdditions);
    return { member: m, rec, pay, effectiveWorkDays };
  });

  const totalPayroll = payrollRows.reduce((a, r) => a + r.pay.net, 0);
  const totalAbsences = payrollRows.reduce((a, r) => a + r.rec.absenceDays, 0);
  const totalBase = payrollRows.reduce((a, r) => a + (r.member.baseSalary ?? 0), 0);

  const handleSaveEmployee = async data => {
    const isNew = !data.id;
    const isDismissed = data.employmentStatus === 'dismissed' || data.employment === 'dismissed' || data.employmentStatus === 1;
    const body = {
      nameAr: (data.nameAr || data.name || '').trim(),
      nameEn: data.nameEn?.trim() || null,
      email: data.email?.trim() || null,
      username: (data.username || '').trim().toLowerCase(),
      specialtyId: data.specialtyId ? +data.specialtyId : null,
      dailyRate: data.dailyRate !== undefined && data.dailyRate !== '' && data.dailyRate !== null ? +data.dailyRate : null,
      baseSalary: +data.baseSalary || 0,
      employmentStatus: isDismissed ? 1 : 0,
      joinDate: data.joinDate || new Date().toISOString().split('T')[0],
      workDaysPerMonth: data.workDaysPerMonth != null && data.workDaysPerMonth !== '' ? +data.workDaysPerMonth : null,
    };
    if (data.password) body.password = data.password;

    if (isNew) {
      if (!data.password) return;
      await dispatch(createEmployee(body)).unwrap();
    } else {
      await dispatch(updateEmployee({ id: data.id, body })).unwrap();
      if (data.attendanceDays !== undefined) {
        await dispatch(saveEmployeePayroll({
          id: data.id,
          yearMonth: ym,
          body: {
            attendanceDays: data.attendanceDays,
            absenceDays: data.absenceDays,
            extraDeductions: data.extraDeductions || 0,
            extraAdditions: data.extraAdditions || 0,
          },
        })).unwrap();
      }
    }
    await reload();
  };

  const updateMonth = async (member, patch) => {
    const rec = { ...monthRecord(member, ym), ...patch };
    try {
      await dispatch(saveEmployeePayroll({
        id: member.id,
        yearMonth: ym,
        body: {
          attendanceDays: rec.attendanceDays,
          absenceDays: rec.absenceDays,
          extraDeductions: rec.extraDeductions || 0,
          extraAdditions: rec.extraAdditions || 0,
        },
      })).unwrap();
      await reload();
    } catch (err) {
      console.error(err);
    }
  };

  const persistWorkDays = (value) => {
    const days = Math.max(1, Math.min(31, +value || 1));
    dispatch(savePayrollSettings({ yearMonth: ym, workDays: days }));
  };

  const handlePrint = async () => {
    try {
      const report = await dispatch(fetchPayrollReport(ym)).unwrap();
      printAttendanceReport({
        monthLabel,
        workDays: report.workDays ?? workDays,
        rows: (report.rows || []).map(r => ({
          name: r.name,
          specialty: r.specialty || '',
          attend: r.attend,
          absent: r.absent,
          workDays: r.workDays,
          base: r.base,
          absenceDeduction: r.absenceDeduction,
          extra: r.extra,
          net: r.net,
        })),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">إدارة الفريق</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{workingTeam.length} موظفون شغّالون</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
            <button type="button" onClick={() => setHrView(false)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${!hrView ? 'bg-white dark:bg-slate-600 shadow-sm text-amber-500' : 'text-slate-400'}`}>حمل العمل</button>
            <button type="button" onClick={() => setHrView(true)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${hrView ? 'bg-white dark:bg-slate-600 shadow-sm text-amber-500' : 'text-slate-400'}`}>الرواتب والحضور</button>
          </div>
          <button type="button" onClick={() => setSpecOpen(v => !v)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold dark:border-slate-600">التخصصات</button>
          <button type="button" onClick={() => setEmployeeModal('new')} className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-slate-900 rounded-xl text-sm font-bold hover:bg-amber-300">
            <Plus size={16} /> إضافة موظف
          </button>
        </div>
      </div>

      {specOpen && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex gap-2">
            <input value={newSpec} onChange={e => setNewSpec(e.target.value)} placeholder="اسم التخصص" className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700" />
            <button type="button" onClick={async () => {
              const nameAr = newSpec.trim();
              if (!nameAr) return;
              try {
                await dispatch(createSpecialty(nameAr)).unwrap();
                setNewSpec('');
                setSpecError('');
              } catch (err) {
                setSpecError(err?.detail || 'تعذر إضافة التخصص');
              }
            }} className="px-4 py-2 bg-amber-400 text-slate-900 rounded-xl text-sm font-bold">إضافة</button>
          </div>
          {specError && <p className="text-xs text-red-500">{specError}</p>}
          <div className="space-y-2">
            {specialties.map(s => (
              <div key={s.id} className="flex items-center gap-2">
                {editingSpec?.id === s.id ? (
                  <input value={editingSpec.nameAr} onChange={e => setEditingSpec({ ...editingSpec, nameAr: e.target.value })} className="flex-1 rounded-xl border px-3 py-2 text-sm dark:bg-slate-700" />
                ) : (
                  <span className="flex-1 text-sm">{s.nameAr}</span>
                )}
                {editingSpec?.id === s.id ? (
                  <button type="button" onClick={async () => {
                    const nameAr = editingSpec.nameAr.trim();
                    if (!nameAr) return;
                    try {
                      await dispatch(updateSpecialty({ id: s.id, nameAr })).unwrap();
                      setEditingSpec(null);
                      setSpecError('');
                      await reload();
                    } catch (err) {
                      setSpecError(err?.detail || 'تعذر تعديل التخصص');
                    }
                  }} className="text-xs font-bold text-emerald-600">حفظ</button>
                ) : (
                  <button type="button" onClick={() => { setEditingSpec({ id: s.id, nameAr: s.nameAr }); setSpecError(''); }} className="text-xs font-bold text-amber-600">تعديل</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {hrView ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div>
              <label className="mb-1.5 block text-xs text-slate-400">السنة</label>
              <select value={year} onChange={e => setYear(+e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-slate-400">الشهر</label>
              <select value={month} onChange={e => setMonth(+e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                {MONTHS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-slate-400">عرض</label>
              <select value={employmentFilter} onChange={e => setEmploymentFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                <option value="working">شغال</option>
                <option value="dismissed">مفصول</option>
              </select>
            </div>
            <button type="button" onClick={handlePrint} className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700">
              <Printer size={15} /> طباعة تقرير الحضور والغياب
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20">
              <div className="flex items-center gap-2 mb-3"><DollarSign size={18} className="opacity-80" /><p className="text-sm font-semibold opacity-90">إجمالي الرواتب المستحقة</p></div>
              <p className="text-2xl font-black">{fmt(totalPayroll)}</p>
              <p className="text-xs opacity-70 mt-1">{monthLabel}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg shadow-amber-500/20">
              <div className="flex items-center gap-2 mb-3"><TrendingUp size={18} className="opacity-80" /><p className="text-sm font-semibold opacity-90">إجمالي الرواتب الأساسية</p></div>
              <p className="text-2xl font-black">{fmt(totalBase)}</p>
              <p className="text-xs opacity-70 mt-1">قبل الخصومات</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white shadow-lg shadow-red-500/20">
              <div className="flex items-center gap-2 mb-3"><Calendar size={18} className="opacity-80" /><p className="text-sm font-semibold opacity-90">إجمالي أيام الغياب</p></div>
              <p className="text-2xl font-black">{totalAbsences} يوم</p>
              <p className="text-xs opacity-70 mt-1">من أصل {workDays} يوم عمل</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <Award size={16} className="text-amber-500" />
              <h2 className="font-bold text-slate-800 dark:text-white">كشف الرواتب والحضور — {monthLabel}</h2>
              {employmentFilter === 'dismissed' && <span className="text-xs font-bold text-red-500">المفصولون فقط</span>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    {['الموظف', 'الحضور / الغياب', 'الراتب الأساسي', 'صافي المستحق', 'المهام النشطة', ''].map(h => (
                      <th key={h} className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {payrollRows.map(r => (
                    <PayrollRow
                      key={r.member.id}
                      member={r.member}
                      rec={r.rec}
                      workDays={r.effectiveWorkDays}
                      onUpdateMonth={patch => updateMonth(r.member, patch)}
                      onEdit={m => setEmployeeModal({ member: m, fromHr: true })}
                    />
                  ))}
                  {payrollRows.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">لا يوجد موظفون في هذا العرض</td></tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/60">
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-white text-sm">الإجمالي</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{payrollRows.reduce((a, r) => a + r.rec.attendanceDays, 0)} / {totalAbsences} يوم</td>
                    <td className="px-4 py-3 font-bold text-amber-500">{fmt(totalBase)}</td>
                    <td className="px-4 py-3 font-black text-emerald-500 text-base">{fmt(totalPayroll)}</td>
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4">المهام النشطة لكل موظف</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workingTeam.map(member => {
                const n = activeCount(member);
                const load = loadOf(member);
                return (
                  <div key={member.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 text-sm font-bold flex-shrink-0">{member.name.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{member.name}</p>
                        <p className="text-xs text-slate-400">{specLabel(member)}</p>
                      </div>
                      <Badge type={load} />
                    </div>
                    {n > 0 ? (
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg px-2 py-2"><p className="text-base font-black text-emerald-600">{n}</p><p className="text-xs text-slate-400">جاري</p></div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg px-2 py-2"><p className="text-base font-black text-purple-600">0</p><p className="text-xs text-slate-400">مراجعة</p></div>
                        <div className="bg-slate-100 dark:bg-slate-600/50 rounded-lg px-2 py-2"><p className="text-base font-black text-slate-600">0</p><p className="text-xs text-slate-400">معلق</p></div>
                      </div>
                    ) : <p className="text-xs text-slate-400 text-center py-2">لا توجد مهام نشطة</p>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4">خريطة حمل العمل</h2>
            <div className="space-y-3">
              {workingTeam.map(member => {
                const n = activeCount(member);
                const load = loadOf(member);
                const pct = Math.min(100, (n / 5) * 100);
                return (
                  <div key={member.id} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 text-sm font-bold flex-shrink-0">{member.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-slate-800 dark:text-white">{member.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{n} مهام نشطة</span>
                          <Badge type={load} />
                        </div>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: pct + '%', background: statusColors[load] }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-bold text-slate-800 dark:text-white">جدول الموظفين</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    {['الموظف', 'اسم المستخدم', 'التخصص', 'الراتب الأساسي', 'تاريخ الانضمام', ''].map(h => (
                      <th key={h} className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {workingTeam.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 text-xs font-bold">{m.name.charAt(0)}</div>
                          <span className="font-medium text-slate-800 dark:text-white">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500" dir="ltr">{m.username || '—'}</td>
                      <td className="px-4 py-3 text-slate-500">{specLabel(m)}</td>
                      <td className="px-4 py-3 font-semibold">{m.baseSalary ? fmt(m.baseSalary) : '—'}</td>
                      <td className="px-4 py-3 text-slate-500">{m.joinDate}</td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => setEmployeeModal({ member: m, fromHr: false })} className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg text-slate-400 hover:text-amber-500">
                          <Edit2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {employeeModal !== null && (
        <EmployeeModal
          member={employeeModal === 'new' ? null : (employeeModal.member ?? employeeModal)}
          fromHr={employeeModal?.fromHr ?? false}
          team={team}
          specialties={specialties}
          onClose={() => setEmployeeModal(null)}
          onSave={handleSaveEmployee}
          ym={ym}
          monthLabel={monthLabel}
          workDays={workDays}
        />
      )}
    </div>
  );
}
