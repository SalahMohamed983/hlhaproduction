const variants = {
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  busy: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  overloaded: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  todo: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  review: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const labels = {
  urgent: 'عاجل', high: 'عالي', medium: 'متوسط', low: 'منخفض',
  available: 'متاح', busy: 'مشغول', overloaded: 'مثقل',
  active: 'نشط', completed: 'مكتمل', in_progress: 'قيد التنفيذ',
  todo: 'لم يبدأ', review: 'مراجعة', done: 'منجز',
};

export default function Badge({ type, children, className = '' }) {
  const cls = variants[type] ?? 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls} ${className}`}>
      {children ?? labels[type] ?? type}
    </span>
  );
}
