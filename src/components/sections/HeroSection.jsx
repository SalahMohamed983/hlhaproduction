import { ArrowLeft, Play } from 'lucide-react';
import { Header } from '@/components/Header';

const heroBanners = [
  '/Banner/1788225988626_WhatsApp_Image_2026_08_31_at_8.53.12_PM.webp',
  '/Banner/1788226020155_WhatsApp_Image_2026_08_31_at_8.53.12_PM__2_.webp',
];

export function HeroSection({ onMenu, menuOpen, onContact, onWork }) {
  return (
    <section id="top" className="relative min-h-[760px] overflow-hidden bg-[var(--site-hero-bg)] text-[#fff4df]">
      <Header onMenu={onMenu} menuOpen={menuOpen} />
      <div className="hero-grid absolute inset-0 opacity-60" />
      <div className="container-wide relative grid min-h-[760px] items-center gap-14 pb-16 pt-32 lg:grid-cols-[1fr_.85fr] lg:gap-20 lg:pt-20">
        <div className="relative z-10 max-w-2xl">
          <div className="reveal visible flex items-center gap-3 text-xs font-bold tracking-[.2em] text-[#e8c46e]">
            <span className="h-px w-10 bg-[#e8c46e]" />  مع هلها سرك فارغ
          </div>
          <h1 className="reveal visible reveal-delay-1 mt-7 font-display text-[clamp(3.7rem,7vw,8rem)] font-bold leading-[1.08] tracking-[-.1em]">
            نحوّل<br />
            <span className="text-[#e6bb66]">الفكرة</span>
            <br />
            إلى أثر.
          </h1>
          <p className="reveal visible reveal-delay-2 mt-8 max-w-md text-base leading-[2] text-[#fff4df]/65 md:text-lg">
            نقدّم محتوى فيديو احترافي، وحلول برمجية من تطبيقات ومواقع ومنيوهات إلكترونية — نحوّل فكرتك لتجربة رقمية تعكس علامتك وتصل لجمهورك.
          </p>
          <div className="reveal visible reveal-delay-3 mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onContact}
              className="group flex items-center gap-4 rounded-full bg-[#e1b75f] px-6 py-3.5 text-sm font-bold text-[#321d24] transition hover:bg-[#f1d38b]"
            >
              احكِ لنا فكرتك <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            </button>
            <button
              type="button"
              onClick={onWork}
              className="flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-[#fff4df]/75 transition hover:text-[#e1b75f]"
            >
              <Play className="h-4 w-4 fill-current" /> شاهد أعمالنا
            </button>
          </div>
        </div>

        <div className="hero-art hero-art--photos relative mx-auto h-[440px] w-full max-w-[480px] overflow-hidden rounded-[46%_46%_9%_9%] border border-[#e6bb66]/35 lg:h-[590px]">
          <div className="hero-banner" aria-hidden="true">
            {heroBanners.map((src, index) => (
              <div key={src} className={`hero-banner-slide hero-banner-slide--${index + 1}`}>
                <img src={src} alt="" className="hero-banner-img" />
              </div>
            ))}
          </div>
          <div className="hero-banner-veil" />
          <div className="absolute bottom-9 right-8 z-10 max-w-[170px] text-right text-xs leading-7 text-[#fff4df]/80">
            كل مشروع رحلة.
            <br />
            <span className="text-[#e7c36f]">نحن نعرف كيف نرويها.</span>
          </div>
          <div className="absolute bottom-0 left-0 z-10 h-28 w-28 rounded-tr-[100%] border-r border-t border-[#e6bb66]/45" />
          <span className="absolute left-7 top-8 z-10 font-mono text-[10px] tracking-[.2em] text-[#fff4df]/60" dir="ltr">
            30°02′N / 31°14′E
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 border-t border-[#fff4df]/10">
        <div className="container-wide flex items-center justify-between py-4 text-[10px] font-bold tracking-[.18em] text-[#fff4df]/45">
          <span dir="ltr">HALHA MEDIA / 2024</span>
          <span>
            اسحب للأسفل <span className="mr-2 text-[#e6bb66]">↓</span>
          </span>
        </div>
      </div>
    </section>
  );
}
