export function SectionLabel({ children, light = false }) {
  return (
    <div className={`eyebrow mb-5 flex items-center gap-3 ${light ? 'eyebrow-light' : ''}`}>
      <span className="h-px w-8 bg-current" />
      {children}
    </div>
  );
}




