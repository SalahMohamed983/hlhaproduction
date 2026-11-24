import { ClipboardList, Globe, Smartphone } from 'lucide-react';
import { SectionLabel } from '@/components/SectionLabel';
import { QtyStepper } from '@/components/QtyStepper';
import { formatMoney, useOrder } from '@/context/OrderContext';
import { useSiteContent } from '@/context/SiteContentContext';

const icons = {
  app: Smartphone,
  website: Globe,
  menu: ClipboardList,
};

export function DigitalOrderSection() {
  const { digitalCatalog } = useSiteContent();
  const { digital, toggleDigital, setDigitalQty } = useOrder();

  return (
    <section id="digital-order" className="section-pad bg-[var(--site-bloggers-bg)]">
      <div className="container-wide">
        <div className="reveal text-center md:text-right">
          <SectionLabel>برمجة وتطبيقات</SectionLabel>
          <h2 className="section-title">برمجة وتطبيقات</h2>
          <p className="section-copy mt-3">عايز تطبيق، موقع إلكتروني، ولا منيو إلكتروني؟</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {digitalCatalog.map((product) => {
            const Icon = icons[product.icon] || icons[product.id] || Globe;
            const item = digital[product.id];
            return (
              <div key={product.id} className={`order-service-card group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${item?.on ? 'is-on shadow-lg ring-2 ring-[var(--site-gold)]' : ''}`}>
                <div className="absolute -right-20 -top-20 z-0 h-40 w-40 rounded-full bg-[var(--site-gold)] opacity-10 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-20" />
                
                <label className="order-check relative z-10 mb-5 flex w-max cursor-pointer items-center gap-3 rounded-full bg-white/40 dark:bg-black/20 px-4 py-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/60 dark:hover:bg-black/40">
                  <input
                    type="checkbox"
                    checked={Boolean(item?.on)}
                    onChange={() => toggleDigital(product.id)}
                    className="h-4 w-4 accent-[var(--site-rust)]"
                  />
                  <span className="font-bold text-[var(--site-text-dark)]">اختيار {product.title}</span>
                </label>

                <div className="relative z-10 flex flex-col items-center">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-2xl shadow-inner transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-110 group-hover:rotate-3 ${item?.on ? 'bg-gradient-to-br from-[var(--site-gold-light)] to-[var(--site-gold)] text-[#321d24] shadow-[0_8px_16px_rgba(227,183,92,0.3)]' : 'bg-white/50 dark:bg-black/30 text-[var(--site-text-dark)]'}`}>
                    <Icon className="h-9 w-9" strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="mt-6 font-display text-2xl font-bold text-[var(--site-text-dark)] transition-colors group-hover:text-[var(--site-rust)]">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-center text-sm font-medium leading-relaxed text-[var(--site-muted-text)]">
                    {product.hint}
                  </p>
                </div>

                <div className="order-service-foot relative z-10 mt-6 flex items-center justify-between border-t border-[var(--site-about-stat-border)] pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--site-muted-text)]">السعر</span>
                    <span className="text-sm font-black text-[var(--site-rust)]">
                      {product.price > 0 ? `${formatMoney(product.price)} ج.م` : '—'}
                    </span>
                  </div>
                  <QtyStepper
                    label={`عدد ${product.title}`}
                    value={item?.qty || 0}
                    disabled={!item?.on}
                    onChange={(n) => setDigitalQty(product.id, n)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
