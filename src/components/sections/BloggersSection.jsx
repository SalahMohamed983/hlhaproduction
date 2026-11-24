import { SectionLabel } from '@/components/SectionLabel';
import { QtyStepper } from '@/components/QtyStepper';

import { formatMoney, useOrder } from '@/context/OrderContext';
import { useSiteContent } from '@/context/SiteContentContext';

export function BloggersSection({ onSelectCreator }) {
  const { siteCreators } = useSiteContent();
  const { bloggers, toggleBlogger, setBloggerCount } = useOrder();

  return (
    <section id="bloggers" className="section-pad bg-[var(--site-bloggers-bg)]">
      <div className="container-wide">
        <div className="reveal flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <SectionLabel>اختار البلوجرز المطلوبين</SectionLabel>
            <h2 className="section-title">
              خدمة البلوجرز
            </h2>
            <p className="mt-4 max-w-lg text-[var(--site-muted-text)] font-medium leading-relaxed">
              يصور لك البلوجر إعلان فيديو احترافيًا للمحل أو المطعم أو المكان.
            </p>
          </div>
        </div>

        <div className="horizontal-rail mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden pb-5">
          {siteCreators.map((creator, index) => {
            const item = bloggers[creator.id];
            return (
              <article
                key={creator.id}
                className={`creator-card reveal reveal-delay-${(index % 3) + 1} shrink-0 snap-start text-center`}
              >
                <div className={`creator-board ${item?.video ? 'is-picked' : ''}`}>
                  <button
                    type="button"
                    className="creator-photo"
                    onClick={() => onSelectCreator(creator)}
                    aria-label={`تفاصيل ${creator.name}`}
                  >
                    <img src={creator.image} alt={creator.name} />
                  </button>
                  <div className="creator-board-meta">
                    <h3 className="font-display text-xl font-bold text-[var(--site-text-dark)]">{creator.name}</h3>
                    <div className="creator-options">
                      <label className="order-check">
                        <input
                          type="checkbox"
                          checked={Boolean(item?.video)}
                          onChange={() => toggleBlogger(creator.id)}
                        />
                        <span>فيديو</span>
                      </label>
                      <span className="text-[11px] font-bold text-[var(--site-muted-text)]">
                        {creator.videoPrice > 0 ? `${formatMoney(creator.videoPrice)} ج.م` : '—'}
                      </span>
                      <QtyStepper
                        label={`عدد الفيديو لـ ${creator.name}`}
                        value={item?.videoCount || 0}
                        disabled={!item?.video}
                        onChange={(n) => setBloggerCount(creator.id, n)}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
