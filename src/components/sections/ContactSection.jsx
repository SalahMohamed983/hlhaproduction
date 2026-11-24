import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Check, Send, AlertCircle, X, Loader2 } from 'lucide-react';
import { SectionLabel } from '@/components/SectionLabel';
import { formatMoney, useOrder } from '@/context/OrderContext';
import { createPublicOrder } from '@/store/slices/publicSlice';

const WHATSAPP = '201015024356';

export function ContactSection() {
  const dispatch = useDispatch();
  const { summary } = useOrder();
  const [sent, setSent] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    
    if (summary.payloadLines.length === 0) {
      setShowWarning(true);
      return;
    }
    
    setLoading(true);
    try {
      const res = await dispatch(createPublicOrder({
        name: name.trim(),
        phone: phone.trim(),
        lines: summary.payloadLines
      })).unwrap();

      if (res && res.whatsAppText) {
        const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(res.whatsAppText)}`;
        window.open(url, '_blank', 'noreferrer');
      }
      
      setSent(true);
    } catch (err) {
      console.error(err);
      alert(err?.message || 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="section-pad bg-[var(--site-contact-bg)] text-[#fff4df]">
      <div className="container-wide max-w-3xl">
        <div className="reveal text-center">
          <SectionLabel light>ملخص اختياراتك</SectionLabel>
          <h2 className="section-title">ملخص اختياراتك</h2>
          <p className="mt-4 text-[#fff4df]/65">راجع اختياراتك والفاتورة التفصيلية</p>
        </div>

        <div className="order-summary reveal mt-10">
          {summary.lines.length === 0 ? (
            <p className="text-center font-medium text-[var(--site-muted-text)]">لم يتم اختيار خدمات بعد.</p>
          ) : (
            <ul className="space-y-3 text-sm font-bold text-[var(--site-text-dark)]">
              {summary.lines.map((line) => (
                <li key={line.id} className="flex items-start justify-between gap-4 border-b border-[var(--site-about-stat-border)] pb-2 last:border-0 last:pb-0">
                  <span>{line.label}</span>
                  <span dir="ltr">{formatMoney(line.amount)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="order-total mt-4 border-t border-[var(--site-about-stat-border)] pt-4">
            <span className="text-[var(--site-muted-text)]">الإجمالي</span>
            <strong dir="ltr" className="text-2xl text-[var(--site-rust)]">{formatMoney(summary.total)}</strong>
          </div>
        </div>

        {sent ? (
          <div className="reveal mt-10 rounded-3xl border border-[#fff4df]/15 bg-[#fff4df]/[.04] p-10 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e3b75c] text-[#321d24]">
              <Check className="h-7 w-7" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-bold">وصل الطلب بنجاح.</h3>
            <p className="mt-3 text-sm text-[#fff4df]/60">سنعود إليك قريباً لتأكيد التفاصيل.</p>
            <button type="button" onClick={() => setSent(false)} className="mt-8 text-sm text-[#e3b75c] underline">
              طلب المزيد
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="reveal mt-10 space-y-6">
            <label className="block text-sm text-[#fff4df]/70">
              الاسم <span className="text-[#e3b75c]">*</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field mt-3 w-full rounded-xl border border-[#fff4df]/20 bg-[#fff4df]/10 px-4 py-3 text-[#fff4df]"
                placeholder="أدخل اسمك"
                disabled={loading}
              />
            </label>
            <label className="block text-sm text-[#fff4df]/70">
              رقم الهاتف <span className="text-[#e3b75c]">*</span>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="field mt-3 w-full rounded-xl border border-[#fff4df]/20 bg-[#fff4df]/10 px-4 py-3 text-[#fff4df]"
                placeholder="05xxxxxxxx"
                dir="ltr"
                disabled={loading}
              />
            </label>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-3 rounded-full bg-[#25d366] px-8 py-4 text-base font-bold text-white transition hover:bg-[#20b858] disabled:opacity-50"
              >
                {loading ? (
                  <>جاري الإرسال... <Loader2 className="h-5 w-5 animate-spin" /></>
                ) : (
                  <>تأكيد وإرسال الطلب عبر واتساب <Send className="h-5 w-5" /></>
                )}
              </button>
            </div>
          </form>
        )}
        
        {/* Warning Popup */}
        {showWarning && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all" 
            onClick={() => setShowWarning(false)}
            dir="rtl"
          >
            <div 
              className="relative w-full max-w-sm scale-100 rounded-3xl border border-[var(--site-about-stat-border)] bg-[var(--site-modal-bg)] p-8 text-center shadow-2xl transition-transform"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute right-4 top-4 text-[var(--site-muted-text)] hover:text-[var(--site-text-dark)] transition-colors"
                onClick={() => setShowWarning(false)}
              >
                <X className="h-6 w-6" />
              </button>
              
              <span className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500 shadow-inner">
                <AlertCircle className="h-10 w-10" strokeWidth={1.5} />
              </span>
              <h3 className="font-display text-2xl font-bold text-[var(--site-text-dark)]">عفواً!</h3>
              <p className="mt-3 text-base font-medium leading-relaxed text-[var(--site-muted-text)]">
                لم تقم باختيار أي خدمة بعد.<br/>يرجى اختيار خدمة واحدة على الأقل لإرسال طلبك.
              </p>
              
              <button 
                onClick={() => setShowWarning(false)}
                className="mt-8 w-full rounded-full bg-gradient-to-br from-[var(--site-gold-light)] to-[var(--site-gold)] px-6 py-3.5 font-bold text-[#321d24] shadow-md transition hover:scale-[1.02] active:scale-95"
              >
                حسناً، سأختار الآن
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
