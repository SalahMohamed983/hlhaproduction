import { ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';

export function Splash({ onSkip }) {
  return (
    <div
      className="splash-cover fixed inset-0 z-50 flex items-center justify-center bg-[#321d24] text-[#fff4df]"
      role="dialog"
      aria-label="مقدمة هلها ميديا"
    >
      <div className="absolute inset-0 opacity-20 hero-grid" />
      <div className="relative px-6 text-center">
        <div className="splash-logo-stage mx-auto">
          <span className="splash-logo-glow" aria-hidden="true" />
          <span className="splash-logo-ring splash-logo-ring--fast" aria-hidden="true" />
          <span className="splash-logo-ring splash-logo-ring--slow" aria-hidden="true" />
          <span className="splash-spark splash-spark-1" aria-hidden="true" />
          <span className="splash-spark splash-spark-2" aria-hidden="true" />
          <span className="splash-spark splash-spark-3" aria-hidden="true" />
          <span className="splash-logo-shine" aria-hidden="true" />
          <Logo variant="splash" className="relative z-10" />
        </div>
        <div className="splash-line mx-auto mt-8 h-px w-20 origin-center bg-[#d9ae57]" />
        <p className="splash-kicker mt-5 text-sm font-bold tracking-[.22em] text-[#e7c98d]">
          من الفكرة تبدأ الحكاية
        </p>
      </div>
      <button
        type="button"
        onClick={onSkip}
        className="absolute bottom-8 left-8 flex items-center gap-2 rounded-full border border-[#fff4df]/30 px-4 py-2 text-xs text-[#fff4df]/75 transition hover:border-[#e5bb68] hover:text-[#e5bb68]"
      >
        تخطي المقدمة <ArrowLeft className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
