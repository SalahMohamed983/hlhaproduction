import { ArrowLeft, X } from 'lucide-react';

export function CreatorModal({ creator, onClose, onContact, onAddToOrder }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--site-modal-overlay)] p-2 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`تفاصيل صانع المحتوى ${creator.name}`}
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-3xl bg-[var(--site-modal-bg)] text-[var(--site-text-dark)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <div className="relative aspect-[1.15] overflow-hidden bg-[#24191c]">
          <img src={creator.image} alt={creator.name} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={onClose}
            className="absolute left-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#321d24]/70 text-[#fff4df]"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute inset-x-7 bottom-7 z-10 text-[#fff4df]">
            <span className="text-xs">{creator.niche}</span>
            <h3 className="mt-2 font-display text-3xl font-bold">{creator.name}</h3>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#24191c]/90 via-transparent to-[#24191c]/10" />
        </div>
        <div className="p-7 md:p-9">
          <p className="text-sm font-bold text-[var(--site-rust)]">{creator.label}</p>
          <p className="mt-4 leading-8 text-[var(--site-muted-text)]">{creator.description}</p>
          {creator.sampleVideo ? (
            <video
              src={creator.sampleVideo}
              poster={creator.image || undefined}
              className="mt-5 w-full rounded-2xl"
              controls
              playsInline
            />
          ) : null}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onAddToOrder) {
                onAddToOrder();
              } else {
                onContact();
              }
            }}
            className="group mt-7 flex items-center gap-3 text-sm font-bold text-[var(--site-rust)]"
          >
            نصنع معاً قصة تشبهك <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
