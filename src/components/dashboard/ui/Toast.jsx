import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const icons = { success: CheckCircle, error: XCircle, info: Info };
const colors = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

export default function ToastContainer({ toasts, dismiss }) {
  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => {
        const Icon = icons[t.type] ?? Info;
        return (
          <div key={t.id}
            className="pointer-events-auto flex items-center gap-3 rounded-xl shadow-2xl px-4 py-3 text-white animate-slide-up"
            style={{ background: t.type === 'success' ? '#059669' : t.type === 'error' ? '#DC2626' : '#2563EB', minWidth: 240 }}
          >
            <Icon size={18} />
            <span className="flex-1 text-sm font-medium">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="opacity-70 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
