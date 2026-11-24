import { SectionLabel } from '@/components/SectionLabel';

export function AboutSection() {
  return (
    <section id="about" className="section-pad bg-[var(--site-bg)]">
      <div className="container-wide grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div className="reveal">
          <SectionLabel>عن هلها برودكشن</SectionLabel>
          <h2 className="section-title max-w-md">
            لسنا وكالة.
            <br />
            <span className="text-[var(--site-rust)]">نحن رفيق الحكاية.</span>
          </h2>
        </div>
        <div className="reveal reveal-delay-1">
          <p className="section-copy text-lg leading-[2.1]">
            نؤمن في «هلها» أن الفكرة الجيدة تحتاج من يمنحها شكلها وصوتها. نجمع بين الإبداع والتقنية لنقدم محتوى فيديو احترافي وحلولاً برمجية مبتكرة من تطبيقات، مواقع، ومنيو إلكتروني. غايتنا هي تحويل رؤيتك إلى تجربة رقمية شاملة تعكس هوية علامتك وتصل بها لجمهورك بأفضل صورة.
          </p>
        </div>
      </div>

      <div className="container-wide mt-20 overflow-hidden rounded-[2rem] bg-[var(--site-marquee-bg)]">
        <div className="marquee flex min-w-max items-center gap-10 py-6 text-sm font-bold text-[var(--site-marquee-text)]">
          <span>فكرة — صورة — حركة — أثر</span>
          <span className="text-[var(--site-rust)]">/</span>
          <span>فكرة — صورة — حركة — أثر</span>
          <span className="text-[var(--site-rust)]">/</span>
          <span>فكرة — صورة — حركة — أثر</span>
          <span className="text-[var(--site-rust)]">/</span>
        </div>
      </div>
    </section>
  );
}
