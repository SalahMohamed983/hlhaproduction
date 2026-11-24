import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CheckSquare, AlertTriangle, ExternalLink,
  Eye, ChevronDown, ChevronUp, FileText,
  Zap, ArrowUp, Minus, RefreshCw, Play,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchMyTasks, updateMyOrderStatus, updateMyAssignment } from '@/store/slices/meSlice';

// قيم الحالة الحقيقية فقط (لا todo/in_progress/in_review)
const STATUS_DISPLAY = {
  new_lead:      { label: 'طلب جديد',        color: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' },
  in_production: { label: 'قيد التنفيذ',     color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  internal_qa:   { label: 'مراجعة داخلية',   color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  client_review: { label: 'مراجعة العميل',   color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  completed:     { label: 'مكتمل',            color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
  cancelled:     { label: 'ملغى',             color: 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-300' },
};

// الانتقالات المسموحة للموظف
const EMPLOYEE_TRANSITIONS = {
  new_lead:      { target: 'in_production', label: 'بدء التنفيذ',               icon: Play,      cls: 'bg-emerald-500 hover:bg-emerald-400 text-white' },
  in_production: { target: 'internal_qa',   label: 'إرسال للمراجعة الداخلية',   icon: Eye,       cls: 'bg-purple-500 hover:bg-purple-400 text-white' },
  internal_qa:   { target: 'in_production', label: 'إعادة للتنفيذ',             icon: RefreshCw, cls: 'bg-emerald-500 hover:bg-emerald-400 text-white' },
};

const DELIVERABLE_TYPES = [
  { value: '', label: '— نوع الرابط —' },
  { value: 'drive',  label: 'Google Drive' },
  { value: 'figma',  label: 'Figma' },
  { value: 'github', label: 'GitHub' },
  { value: 'other',  label: 'أخرى' },
];

const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
const priorityConfig = {
  urgent: { label: 'عاجل جداً', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300', icon: Zap },
  high:   { label: 'عالي',      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300', icon: ArrowUp },
  medium: { label: 'متوسط',     color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300', icon: Minus },
  low:    { label: 'منخفض',     color: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400', icon: Minus },
};

function getDaysRemaining(dueDate) {
  return Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
}

function TaskCard({ task, onRefresh }) {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [deliverableType, setDeliverableType] = useState(task.deliverableType || '');
  const [deliverableLink, setDeliverableLink] = useState(task.deliverableLink || '');
  const [employeeNotes, setEmployeeNotes] = useState(task.employeeNotes || '');
  const [saving, setSaving] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const daysLeft = getDaysRemaining(task.dueDate);
  const isOverdue = daysLeft < 0;
  const isUrgentDeadline = daysLeft >= 0 && daysLeft <= 2;

  const statusInfo = STATUS_DISPLAY[task.status] ?? { label: task.status, color: 'bg-slate-100 text-slate-500' };
  const pConfig = priorityConfig[task.priority] ?? priorityConfig.medium;
  const PIcon = pConfig.icon;
  const transition = EMPLOYEE_TRANSITIONS[task.status];

  const deadlineCls = isOverdue
    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'
    : isUrgentDeadline
    ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
    : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400';

  const handleStatusChange = async () => {
    if (!transition || transitioning) return;
    setTransitioning(true);
    try {
      await dispatch(updateMyOrderStatus({ orderId: task.orderId, status: transition.target })).unwrap();
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setTransitioning(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await dispatch(updateMyAssignment({
        orderId: task.orderId,
        payload: { deliverableType, deliverableLink, employeeNotes },
      })).unwrap();
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border shadow-sm transition-all duration-200
      ${task.priority === 'urgent' ? 'border-red-200 dark:border-red-800/60' :
        task.priority === 'high'   ? 'border-orange-200 dark:border-orange-800/40' :
        'border-slate-200 dark:border-slate-700'}`}
    >
      <div className="p-5">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${pConfig.color}`}>
            <PIcon size={11} /> {pConfig.label}
          </span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          {(isOverdue || isUrgentDeadline) && (
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${deadlineCls}`}>
              <AlertTriangle size={11} />
              {isOverdue ? `متأخر ${Math.abs(daysLeft)} يوم` : `${daysLeft} أيام متبقية`}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1 leading-relaxed">{task.title}</h3>
        {/* Client name */}
        {task.clientNameAr && (
          <p className="text-xs text-slate-400 mb-1">👤 {task.clientNameAr}</p>
        )}
        <p className="text-xs text-slate-400 mb-4">استحقاق: {task.dueDate?.split('T')[0]}</p>

        {/* Order description (read-only) */}
        {task.description && (
          <p className="text-xs text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2 mb-3 leading-relaxed">
            📄 {task.description}
          </p>
        )}

        {/* Admin notes (read-only) */}
        {task.adminNotes && (
          <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 rounded-xl px-3 py-2 mb-3">
            📌 {task.adminNotes}
          </p>
        )}

        {/* Status transition button */}
        {transition && (
          <button
            onClick={handleStatusChange}
            disabled={transitioning}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 mb-3 ${transition.cls} disabled:opacity-60`}
          >
            <transition.icon size={13} />
            {transitioning ? 'جاري...' : transition.label}
          </button>
        )}

        {/* Deliverable link (read-only display) */}
        {task.deliverableLink && (
          <a href={task.deliverableLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-400 font-semibold mb-3">
            <ExternalLink size={13} /> فتح رابط التسليم
          </a>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <FileText size={13} />
          {expanded ? 'إخفاء التفاصيل' : 'تحديث الرابط والملاحظات'}
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Expanded: deliverableType + link + notes */}
      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-700 px-5 py-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/60 rounded-b-2xl">
          {/* Deliverable type */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">نوع الرابط</label>
            <select
              value={deliverableType}
              onChange={e => setDeliverableType(e.target.value)}
              className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400"
            >
              {DELIVERABLE_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>

          {/* Deliverable link */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">رابط التسليم</label>
            <input
              value={deliverableLink}
              onChange={e => setDeliverableLink(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Employee notes */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">ملاحظات التنفيذ</label>
            <textarea
              value={employeeNotes}
              onChange={e => setEmployeeNotes(e.target.value)}
              rows={3}
              placeholder="ملاحظاتك حول هذه المهمة..."
              className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-900 disabled:opacity-60 transition-all"
            >
              {saving ? '✓ تم الحفظ' : 'حفظ'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmployeeTasks() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const tasks = useSelector((s) => s.me.tasks);
  const loading = useSelector((s) => s.me.loading);
  const [stamp, setStamp] = useState(0);

  useEffect(() => {
    dispatch(fetchMyTasks(false));
  }, [dispatch, stamp]);

  const refresh = () => setStamp(s => s + 1);

  const sorted = [...tasks].sort((a, b) =>
    (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3) ||
    new Date(a.dueDate) - new Date(b.dueDate)
  );

  const urgentCount = sorted.filter(t => t.priority === 'urgent').length;
  const qaCount     = sorted.filter(t => t.status === 'internal_qa').length;

  const specialtyLabels = { VIDEO_EDITOR: 'مونتير فيديو', GRAPHIC_DESIGNER: 'مصمم جرافيك', WEB_DEVELOPER: 'مطور مواقع' };
  const specialtyLabel = specialtyLabels[user?.specialtyId] ?? specialtyLabels[user?.specialty] ?? 'متخصص';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white border border-amber-400/20 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-48 bg-amber-400/10 rounded-full -translate-x-16 -translate-y-16 blur-2xl pointer-events-none" />
        <div className="relative">
          <h1 className="text-xl font-bold mb-0.5">مرحباً، {(user?.nameAr ?? user?.name ?? '').split(' ')[0]} 👋</h1>
          <p className="text-sm text-slate-400 mb-5">{specialtyLabel} · هالة ميديا</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-3 text-center">
              <p className="text-2xl font-black text-amber-400">{sorted.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">مهمة نشطة</p>
            </div>
            <div className="bg-slate-800/80 border border-red-800/50 rounded-xl px-3 py-3 text-center">
              <p className="text-2xl font-black text-red-400">{urgentCount}</p>
              <p className="text-xs text-slate-400 mt-0.5">عاجلة</p>
            </div>
            <div className="bg-slate-800/80 border border-purple-800/50 rounded-xl px-3 py-3 text-center">
              <p className="text-2xl font-black text-purple-400">{qaCount}</p>
              <p className="text-xs text-slate-400 mt-0.5">قيد المراجعة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Priority hint */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3">
        <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
          💡 المهام مرتبة من الأعلى أولوية — الانتقال المتاح لك: طلب جديد → قيد التنفيذ ↔ مراجعة داخلية
        </p>
      </div>

      {/* Tasks */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
          مهامي النشطة
          <span className="mr-2 text-sm font-normal text-slate-400">({sorted.length})</span>
        </h2>

        {loading ? (
          <div className="text-center py-16 text-slate-400">جاري التحميل...</div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <CheckSquare size={44} className="mx-auto mb-3 text-emerald-400 opacity-60" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">لا توجد مهام نشطة 🎉</p>
            <p className="text-slate-400 text-sm mt-1">رائع! لقد أنجزت جميع مهامك</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map(t => <TaskCard key={t.orderId} task={t} onRefresh={refresh} />)}
          </div>
        )}
      </div>
    </div>
  );
}
