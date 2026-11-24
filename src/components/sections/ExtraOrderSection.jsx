import { SectionLabel } from '@/components/SectionLabel';
import { QtyStepper } from '@/components/QtyStepper';
import { contentWriterMin, orderPrices } from '@/data/content';
import { formatMoney, useOrder } from '@/context/OrderContext';
import { useSiteContent } from '@/context/SiteContentContext';

export function ExtraOrderSection() {
  const { photoPackages } = useSiteContent();
  const {
    photoPicks,
    contentWriter,
    pageManagement,
    togglePhotoPackage,
    setPhotoPackageQty,
    toggleContentWriter,
    setContentWriterQty,
    togglePageManagement,
    setPageManagementQty,
  } = useOrder();

  return (
    <section className="section-pad bg-[var(--site-work-bg)]">
      <div className="container-wide space-y-12">
        <div className="reveal">
          <SectionLabel>جلسة تصوير فوتوغرافي</SectionLabel>
          <h2 className="section-title">جلسة تصوير فوتوغرافي</h2>
          <p className="section-copy mt-3">جلسة تصوير احترافية للمنتجات والمحل أو المطعم أو المكان.</p>
          <div className="mt-6 space-y-3">
            {photoPackages.map((pack) => {
              const item = photoPicks[pack.id];
              return (
                <div key={pack.id} className={`order-row ${item?.on ? 'is-on' : ''}`}>
                  <label className="order-check text-base">
                    <input type="checkbox" checked={Boolean(item?.on)} onChange={() => togglePhotoPackage(pack.id)} />
                    <span>
                      <strong className="block">{pack.name}</strong>
                      {pack.details && <span className="text-sm text-[var(--site-muted-text)]">{pack.details}</span>}
                    </span>
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {pack.image && <img src={pack.image} alt="" className="h-12 w-12 rounded-lg object-cover" />}
                    <span className="text-xs text-[var(--site-muted-text)]">
                      {pack.price > 0 ? `${formatMoney(pack.price)} جنيه / جلسة` : '—'}
                    </span>
                    <QtyStepper
                      label={`عدد ${pack.name}`}
                      value={item?.qty || 0}
                      disabled={!item?.on}
                      onChange={(n) => setPhotoPackageQty(pack.id, n)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="reveal">
          <SectionLabel>إدارة الصفحات</SectionLabel>
          <h2 className="section-title">إدارة الصفحات (شهري)</h2>
          <p className="section-copy mt-3">إدارة صفحات التواصل الاجتماعي، والرد على الرسائل، وتصميم البوستات والصور وكتابة المنشورات.</p>

          <div className={`order-row mt-6 ${contentWriter.on ? 'is-on' : ''}`}>
            <label className="order-check text-base">
              <input type="checkbox" checked={contentWriter.on} onChange={toggleContentWriter} />
              <span>
                <strong className="block"> كاتب محتوى ومصمم</strong>
                <span className="text-sm text-[var(--site-muted-text)]">مسؤول عن كتابة المحتوى والنصوص والتصميم</span>
              </span>
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-[var(--site-muted-text)]">
                عدد التصميمات الشهرية (الحد الأدنى {contentWriterMin})
              </span>
              <QtyStepper
                label="عدد التصميمات"
                min={contentWriterMin}
                value={contentWriter.qty}
                disabled={!contentWriter.on}
                onChange={setContentWriterQty}
              />
            </div>
          </div>

          <div className={`order-row mt-4 ${pageManagement.on ? 'is-on' : ''}`}>
            <label className="order-check text-base">
              <input type="checkbox" checked={pageManagement.on} onChange={togglePageManagement} />
              <span>
                <strong className="block">إدارة صفحة (اختياري)</strong>
                <span className="text-sm text-[var(--site-muted-text)]">مسؤول عن متابعة الصفحات والرد على التعليقات</span>
              </span>
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-[var(--site-muted-text)]">
                {formatMoney(orderPrices.pageManagement)} جنيه / صفحة
              </span>
              <QtyStepper
                label="عدد الصفحات"
                value={pageManagement.qty}
                disabled={!pageManagement.on}
                onChange={setPageManagementQty}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
