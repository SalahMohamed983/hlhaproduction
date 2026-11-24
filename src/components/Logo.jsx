/** شعار أفقي — يُخدم من مجلد public */
export const LOGO_HORIZONTAL_DARK = '/Logo/Horizontal/Halha_horizontal logo light.png';

const sizeClasses = {
  header: 'h-20 w-auto ',
  footer: 'h-20 w-auto ',
  splash: 'splash-logo-img h-auto w-[min(88vw,440px)] max-w-full',
};

export function Logo({ variant = 'header', className = '' }) {
  const isSplash = variant === 'splash';

  return (
    <img
      src={LOGO_HORIZONTAL_DARK}
      alt="هلها — مع هلها سرك فارغ"
      className={`object-contain object-right ${sizeClasses[variant] ?? sizeClasses.header} ${className}`}
      decoding={isSplash ? 'sync' : 'async'}
      fetchPriority={isSplash ? 'high' : 'auto'}
    />
  );
}
