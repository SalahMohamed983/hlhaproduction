import { useEffect, useRef } from 'react';

/** يُظهر العناصر ذات class "reveal" عند التمرير.
 *  يستخدم MutationObserver لرصد الكروت التي تُضاف بعد fetch البيانات (async).
 */
export function useReveal(deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    // دالة مساعدة: تُسجّل أي .reveal لم يُرصد بعد
    function observeNew() {
      root.querySelectorAll('.reveal:not(.visible)').forEach((node) => {
        io.observe(node);
      });
    }

    // راقب المرة الأولى
    observeNew();

    // راقب إضافة عناصر جديدة (نتيجة async data fetch)
    const mo = new MutationObserver(observeNew);
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
