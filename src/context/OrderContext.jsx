import { createContext, useContext, useMemo, useState } from 'react';
import { contentWriterMin, orderPrices } from '@/data/content';
import { useSiteContent } from '@/context/SiteContentContext';

function emptyBlogger() {
  return { video: false, videoCount: 0 };
}

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { siteCreators, digitalCatalog, photoPackages, prices } = useSiteContent();
  const [bloggers, setBloggers] = useState({});
  const [digital, setDigital] = useState({});
  const [photoPicks, setPhotoPicks] = useState({});
  const [contentWriter, setContentWriter] = useState({ on: false, qty: contentWriterMin });
  const [pageManagement, setPageManagement] = useState({ on: false, qty: 0 });

  function toggleBlogger(id) {
    setBloggers((prev) => {
      const current = prev[id] || emptyBlogger();
      const nextOn = !current.video;
      return {
        ...prev,
        [id]: {
          video: nextOn,
          videoCount: nextOn ? Math.max(1, current.videoCount) : 0,
        },
      };
    });
  }

  function setBloggerCount(id, qty) {
    const n = Math.max(0, qty);
    setBloggers((prev) => ({
      ...prev,
      [id]: {
        video: n > 0,
        videoCount: n,
      },
    }));
  }

  function toggleDigital(id) {
    setDigital((prev) => {
      const current = prev[id] || { on: false, qty: 0 };
      const nextOn = !current.on;
      return {
        ...prev,
        [id]: { on: nextOn, qty: nextOn ? Math.max(1, current.qty) : 0 },
      };
    });
  }

  function setDigitalQty(id, qty) {
    const n = Math.max(0, qty);
    setDigital((prev) => ({
      ...prev,
      [id]: { on: n > 0, qty: n },
    }));
  }

  function togglePhotoPackage(id) {
    setPhotoPicks((prev) => {
      const current = prev[id] || { on: false, qty: 0 };
      const nextOn = !current.on;
      return { ...prev, [id]: { on: nextOn, qty: nextOn ? Math.max(1, current.qty) : 0 } };
    });
  }

  function setPhotoPackageQty(id, qty) {
    const n = Math.max(0, qty);
    setPhotoPicks((prev) => ({ ...prev, [id]: { on: n > 0, qty: n } }));
  }

  function toggleContentWriter() {
    setContentWriter((prev) => ({
      on: !prev.on,
      qty: prev.on ? prev.qty : Math.max(contentWriterMin, prev.qty),
    }));
  }

  function setContentWriterQty(qty) {
    const n = Math.max(contentWriterMin, qty);
    setContentWriter((prev) => ({ on: true, qty: n }));
  }

  function togglePageManagement() {
    setPageManagement((prev) => {
      const nextOn = !prev.on;
      return { on: nextOn, qty: nextOn ? Math.max(1, prev.qty) : 0 };
    });
  }

  function setPageManagementQty(qty) {
    const n = Math.max(0, qty);
    setPageManagement({ on: n > 0, qty: n });
  }

  const summary = useMemo(() => {
    const lines = [];
    const payloadLines = [];

    siteCreators.forEach((creator) => {
      const item = bloggers[creator.id];
      if (!item) return;
      if (item.video && item.videoCount > 0) {
        lines.push({
          id: `${creator.id}-video`,
          label: `${creator.name} — فيديو × ${item.videoCount}`,
          amount: item.videoCount * (creator.videoPrice || orderPrices.bloggerVideo),
        });
        payloadLines.push({ kind: 'blogger', bloggerId: creator.id, qty: item.videoCount });
      }
    });

    digitalCatalog.forEach((product) => {
      const item = digital[product.id];
      if (item?.on && item.qty > 0) {
        lines.push({
          id: product.id,
          label: `${product.title} × ${item.qty}`,
          amount: item.qty * (product.price || 0),
        });
        payloadLines.push({ kind: 'digital', digitalProductId: product.id, qty: item.qty });
      }
    });

    photoPackages.forEach((pack) => {
      const item = photoPicks[pack.id];
      if (item?.on && item.qty > 0) {
        lines.push({
          id: pack.id,
          label: `${pack.name} × ${item.qty}`,
          amount: item.qty * (pack.price || 0),
        });
        payloadLines.push({ kind: 'photo', photoPackageId: pack.id, qty: item.qty });
      }
    });

    if (contentWriter.on) {
      lines.push({
        id: 'writer',
        label: `كاتب محتوى ومصمم— ${contentWriter.qty} تصميم`,
        amount: contentWriter.qty * (prices.contentWriterDesign || orderPrices.contentWriterDesign),
      });
      payloadLines.push({ kind: 'social_media', code: 'content_writer', qty: contentWriter.qty });
    }

    if (pageManagement.on && pageManagement.qty > 0) {
      lines.push({
        id: 'pages',
        label: `إدارة صفحة × ${pageManagement.qty}`,
        amount: pageManagement.qty * (prices.pageManagement || orderPrices.pageManagement),
      });
      payloadLines.push({ kind: 'social_media', code: 'page_management', qty: pageManagement.qty });
    }

    const total = lines.reduce((sum, line) => sum + line.amount, 0);
    return { lines, payloadLines, total };
  }, [bloggers, digital, photoPicks, contentWriter, pageManagement, siteCreators, digitalCatalog, photoPackages, prices]);

  const value = {
    bloggers,
    digital,
    photoPicks,
    contentWriter,
    pageManagement,
    summary,
    toggleBlogger,
    setBloggerCount,
    toggleDigital,
    setDigitalQty,
    togglePhotoPackage,
    setPhotoPackageQty,
    toggleContentWriter,
    setContentWriterQty,
    togglePageManagement,
    setPageManagementQty,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used inside OrderProvider');
  return ctx;
}

export function formatMoney(amount) {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
