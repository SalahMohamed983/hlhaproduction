import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderPrices } from '@/data/content';
import { fetchPublicSiteContent } from '@/store/slices/publicSlice';

const SiteContentContext = createContext(null);

export function SiteContentProvider({ children }) {
  const dispatch = useDispatch();
  const { works, siteCreators, digitalCatalog, photoPackages } = useSelector((s) => s.publicContent);

  useEffect(() => {
    dispatch(fetchPublicSiteContent());
  }, [dispatch]);

  const value = {
    works,
    siteCreators,
    digitalCatalog,
    photoPackages,
    // We provide dummy functions for backwards compatibility if needed, 
    // but the UI shouldn't use them directly anymore since Admin does its own calls.
    addWork: () => {}, updateWork: () => {}, removeWork: () => {},
    addCreator: () => {}, updateCreator: () => {}, removeCreator: () => {},
    addDigital: () => {}, updateDigital: () => {}, removeDigital: () => {},
    addPhoto: () => {}, updatePhoto: () => {}, removePhoto: () => {},
    prices: {
      contentWriterDesign: orderPrices.contentWriterDesign,
      pageManagement: orderPrices.pageManagement,
    },
  };

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error('useSiteContent must be used inside SiteContentContext');
  return ctx;
}
