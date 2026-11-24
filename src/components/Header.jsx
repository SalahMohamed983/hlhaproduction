import { Menu, Moon, Sun, X } from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '@/context/ThemeContext';

const navLinks = [
  ['about', 'عن هلها'],
  ['services', 'ماذا نصنع'],
  ['work', 'أعمالنا بالفيديو'],
  ['bloggers', 'طلب الخدمه'],
  ['contact', 'تواصل معنا'],
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export function Header({ onMenu, menuOpen }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="container-wide flex h-24 items-center justify-between">
        <button type="button" onClick={() => scrollTo('top')} aria-label="العودة إلى بداية الصفحة">
          <Logo variant="header" />
        </button>

        <nav className="hidden items-center gap-9 text-md text-[#fff4df]/75 md:flex" aria-label="التنقل الرئيسي">
          {navLinks.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className="transition hover:text-[#e7c36f]"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#fff4df]/25 text-[#fff4df] transition hover:border-[#e7c36f] hover:text-[#e7c36f]"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onMenu}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#fff4df]/25 text-[#fff4df] transition hover:border-[#e7c36f] md:hidden"
            aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="mobile-menu mx-4 rounded-2xl border border-[#fff4df]/15 bg-[#40212a]/95 p-3 text-right shadow-2xl md:hidden"
          aria-label="التنقل على الهاتف"
        >
          {navLinks.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                scrollTo(id);
                onMenu();
              }}
              className="block w-full rounded-xl px-4 py-3 text-sm text-[#fff4df]/85 transition hover:bg-[#fff4df]/10 hover:text-[#e7c36f]"
            >
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
