import { ArrowLeft } from 'lucide-react';
import { SectionLabel } from '@/components/SectionLabel';
import { services } from '@/data/content';

export function ServicesSection({ activeService, onSelectService }) {
  const activeDetail = services.find((s) => s.id === activeService);
  const activeIndex = services.findIndex((s) => s.id === activeService);

  return (
    <section id="services" className="section-pad bg-[var(--site-services-bg)] text-[#fff4df]">
      <div className="container-wide">
        <div className="reveal flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <SectionLabel light>ماذا نصنع</SectionLabel>
            <h2 className="section-title max-w-2xl">
              أدوات كثيرة.
              <br />
              <span className="text-[#e3b75c]">نية واحدة.</span>
            </h2>
          </div>
          <p className="max-w-sm leading-8 text-[#fff4df]/60">
            نضع الفريق المناسب حول كل فكرة: عين فنية، عقل استراتيجي، ويد تعرف أن التفاصيل الصغيرة تصنع الفرق.
          </p>
        </div>

        <div className="mt-16 grid gap-3 md:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isActive = activeService === service.id;
            return (
              <div key={service.id} className={`reveal reveal-delay-${(index % 3) + 1}`}>
                <button
                  type="button"
                  onClick={() => onSelectService(service.id)}
                  className={`service-card w-full rounded-2xl border border-[#fff4df]/15 p-5 text-right ${
                    isActive ? 'active' : 'bg-[#fff4df]/[.04] text-[#fff4df]'
                  }`}
                  aria-pressed={isActive}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs opacity-60" dir="ltr">
                      {service.number}
                    </span>
                    <Icon className="h-6 w-6 text-[#e3b75c]" />
                  </div>
                  <h3 className="mt-14 font-display text-xl font-bold leading-relaxed">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#fff4df]/55">{service.short}</p>
                </button>
              </div>
            );
          })}
        </div>

        <div className="reveal mt-4 min-h-[170px] rounded-2xl border border-[#e3b75c]/50 bg-[#fff4df]/[.05] p-6 md:flex md:items-center md:justify-between md:p-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#e3b75c]">0{activeIndex + 1} / تفاصيل الخدمة</span>
            <p className="mt-3 leading-8 text-[#fff4df]/75">{activeDetail?.detail}</p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
