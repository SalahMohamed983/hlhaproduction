import { Facebook, MoveUpLeft, Phone } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-[#fff4df]/10 bg-[var(--site-footer-bg)] text-[#fff4df]/60">
      <div className="container-wide py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          
          {/* Intro Section */}
          <div className="flex flex-col items-start gap-6">
            <Logo variant="footer" />
          </div>

          {/* Contact Numbers */}
          <div className="flex flex-col gap-5">
            <h4 className="font-display text-lg font-bold text-[#fff4df]">أرقام التواصل</h4>
            <div className="flex flex-col gap-4 text-sm font-bold">
              <a href="tel:01227282506" className="flex w-fit items-center gap-3 transition-colors hover:text-[#e3b75c]" dir="ltr">
                <Phone className="h-4 w-4 text-[#e3b75c]" />
                012 2728 2506
              </a>
              <a href="tel:01222179588" className="flex w-fit items-center gap-3 transition-colors hover:text-[#e3b75c]" dir="ltr">
                <Phone className="h-4 w-4 text-[#e3b75c]" />
                012 2217 9588
              </a>
            </div>
          </div>

          {/* Socials & Actions */}
          <div className="flex flex-col gap-5 md:items-end">
            <h4 className="font-display text-lg font-bold text-[#fff4df]">تابعنا</h4>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/share/1GNjGKZfw2/"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4df]/10 transition-colors hover:bg-[#e3b75c] hover:text-[#321d24]"
                aria-label="فيسبوك"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
            
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#fff4df]/10 pt-8 text-xs md:flex-row">
          <span>مطروح - مصر</span>
          <span dir="ltr">© 2026 Halha Production</span>
        </div>
      </div>
    </footer>
  );
}
