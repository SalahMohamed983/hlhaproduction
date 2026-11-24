import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX, X } from 'lucide-react';

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function ProjectModal({ project, onClose }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.play().catch(() => {
        video.muted = true;
        setMuted(true);
        video.play().catch(() => {});
      });
    }

    function onKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'ArrowLeft') seekBy(-5);
      if (e.key === 'ArrowRight') seekBy(5);
    }

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  function seekBy(amount) {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.min(Math.max(video.currentTime + amount, 0), video.duration);
  }

  function handleSeek(e) {
    const video = videoRef.current;
    if (!video || !duration) return;
    const next = Number(e.target.value);
    video.currentTime = (next / 100) * duration;
    setProgress(next);
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setCurrentTime(video.currentTime);
    setDuration(video.duration);
    setProgress((video.currentTime / video.duration) * 100);
  }

  return (
    <div
      className="video-popup fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="تشغيل العمل"
      onClick={onClose}
    >
      <div className="video-popup-backdrop" />
      <div
        className="video-popup-card relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.6rem] bg-[#0c090a] text-[#fff4df] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
          <video
            ref={videoRef}
            className="modal-work-video"
            src={project.src}
            poster={project.image || undefined}
            playsInline
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
            onClick={togglePlay}
          />

          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-[#fff4df]/20 bg-[#321d24]/70 text-[#fff4df] backdrop-blur-sm transition hover:border-[#e6bb66] hover:text-[#e6bb66]"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="video-popup-caption">
            <span className="text-[11px] font-bold tracking-[.2em] text-[#e6bb66]">من أرشيف هلها</span>
            <p className="mt-1 font-display text-xl font-bold md:text-2xl">{project.title || 'شاهد العمل'}</p>
            {project.details && <p className="mt-1 text-xs text-[#fff4df]/70">{project.details}</p>}
          </div>
        </div>

        <div className="video-seek-bar z-20 px-4 py-4 md:px-6">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            className="video-seek"
            aria-label="شريط التقديم"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-[#fff4df]/70" dir="ltr">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#fff4df]/20 text-[#fff4df] transition hover:border-[#e6bb66]"
                aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e6bb66] text-[#321d24] shadow-lg transition hover:scale-105"
                aria-label={playing ? 'إيقاف' : 'تشغيل'}
              >
                {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="mr-[-2px] h-5 w-5 fill-current" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
