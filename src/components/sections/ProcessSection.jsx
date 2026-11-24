import { SectionLabel } from '@/components/SectionLabel';

export function ProcessSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--site-process-bg)] py-20 text-[var(--site-text-dark)]">
      <div className="container-wide relative z-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <SectionLabel>طريقة هلها</SectionLabel>
          <h2 className="font-display text-3xl font-bold leading-relaxed md:text-5xl">
            نسأل كثيراً.
            <br />
            نصنع بهدوء.
          </h2>
        </div>
        <div className="flex gap-8 text-sm font-bold">
          <span>
            <b className="font-display text-4xl">01</b>
            <small className="mt-2 block">نسمع</small>
          </span>
          <span>
            <b className="font-display text-4xl">02</b>
            <small className="mt-2 block">نصوّر</small>
          </span>
          <span>
            <b className="font-display text-4xl">03</b>
            <small className="mt-2 block">نطلق</small>
          </span>
        </div>
      </div>
      <div className="absolute -left-20 -top-36 h-96 w-96 rounded-full border-[30px] border-[var(--site-text-dark)]/10" />
    </section>
  );
}
