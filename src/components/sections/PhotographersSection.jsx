import { SectionLabel } from '@/components/SectionLabel';

export function PhotographersSection() {
  return (
    <section id="photographers" className="section-pad bg-[var(--site-bloggers-bg)]">
      <div className="container-wide">
        <div className="reveal flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <SectionLabel>اختار المصورين المطلوبين</SectionLabel>
            <h2 className="section-title">
              خدمة المصورين
            </h2>
            <p className="mt-4 max-w-lg text-[var(--site-muted-text)] font-medium leading-relaxed">
              خدمات تصوير احترافية للفيديوهات والريلز والمنتجات والمحلات والإعلانات.
            </p>
          </div>
        </div>

        <div className="mt-14 reveal">
          <div className="flex min-h-[160px] items-center justify-center rounded-2xl border-2 border-dashed border-[var(--site-about-stat-border)] bg-white/30 dark:bg-black/20 p-8 text-center text-lg font-semibold text-[var(--site-muted-text)]">
            لا يوجد مصورين متاحين حالياً
          </div>
        </div>
      </div>
    </section>
  );
}
