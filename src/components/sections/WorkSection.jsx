import { useRef } from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { SectionLabel } from '@/components/SectionLabel';
import { useSiteContent } from '@/context/SiteContentContext';

function VideoWorkCard({ project, index, onOpen }) {
  const videoRef = useRef(null);
  const number = String(index + 1).padStart(2, '0');

  function previewStart() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }

  function previewStop() {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  }

  return (
    <button
      type="button"
      className={`video-card group reveal reveal-delay-${(index % 3) + 1} shrink-0 snap-start text-right`}
      onClick={() => onOpen(project)}
      onMouseEnter={previewStart}
      onMouseLeave={previewStop}
      aria-label="تشغيل العمل"
    >
      <div className={`video-art video-art--clip relative overflow-hidden rounded-[1.6rem] ${project.className}`}>
        {project.src ? (
          <video
            ref={videoRef}
            className="work-video"
            src={project.src}
            poster={project.image || undefined}
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : project.image ? (
          <img src={project.image} alt="" className="work-video h-full w-full object-cover" />
        ) : null}
        <div className="work-video-overlay">
          <span className="flex items-center justify-between text-[11px] font-bold tracking-[.18em]">
            <span className="text-[#e6bb66]">من الأرشيف</span>
            <span dir="ltr" className="font-mono opacity-80">
              {number}
            </span>
          </span>
          <span>
            <span className="play-button mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#e6bb66] text-[#321d24] shadow-lg transition group-hover:scale-110">
              <Play className="mr-[-2px] h-4 w-4 fill-current" />
            </span>
            <span className="block font-display text-2xl font-bold leading-tight">{project.title || 'شاهد العمل'}</span>
            <span className="mt-2 block text-xs tracking-wide text-[#fff4df]/70">اضغط للتشغيل</span>
          </span>
        </div>
      </div>
    </button>
  );
}

export function WorkSection({ onSelectProject, onContact }) {
  const { works } = useSiteContent();
  return (
    <section id="work" className="section-pad bg-[var(--site-work-bg)]">
      <div className="container-wide">
        <div className="reveal flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionLabel>من الأرشيف</SectionLabel>
            <h2 className="section-title">
              أعمالنا
              <br />
              <span className="text-[var(--site-rust)]">بالفيديو.</span>
            </h2>
          </div>
          <div className="flex items-end justify-between gap-8 md:block">
            <p className="section-copy">لقطات قصيرة، أفلام هوية وحكايات تستحق أن تُرى على مهل.</p>
            <span className="mt-5 hidden items-center gap-2 text-xs font-bold text-[var(--site-rust)] md:flex">
              <span className="h-px w-8 bg-current" /> اسحب للمزيد
            </span>
          </div>
        </div>

        <div className="horizontal-rail mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pb-5">
          {works.map((project, index) => (
            <VideoWorkCard
              key={project.id}
              project={project}
              index={index}
              onOpen={onSelectProject}
            />
          ))}
        </div>

        <div
          className="reveal mt-6 flex items-center justify-between pt-7"
          style={{ borderTop: '1px solid var(--site-about-stat-border)' }}
        >
          <button
            type="button"
            onClick={onContact}
            className="group flex items-center gap-3 text-sm font-bold text-[var(--site-rust)] transition hover:opacity-75"
          >
            لديك مشروع يشبه هذه الحكايات؟ <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
          </button>
          <span className="flex items-center gap-2 text-xs font-bold text-[var(--site-muted-text)] md:hidden">
            <span className="h-px w-6 bg-[var(--site-rust)]" /> اسحب للمزيد
          </span>
        </div>
      </div>
    </section>
  );
}
