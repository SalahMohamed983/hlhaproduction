import { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { useReveal } from '@/hooks/useReveal';
import { Splash } from '@/components/Splash';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { WorkSection } from '@/components/sections/WorkSection';
import { BloggersSection } from '@/components/sections/BloggersSection';
import { PhotographersSection } from '@/components/sections/PhotographersSection';
import { DigitalOrderSection } from '@/components/sections/DigitalOrderSection';
import { ExtraOrderSection } from '@/components/sections/ExtraOrderSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { ProjectModal } from '@/components/modals/ProjectModal';
import { CreatorModal } from '@/components/modals/CreatorModal';

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState('film');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const { bloggers, setBloggerCount } = useOrder();

  const revealRef = useReveal([showSplash]);

  return (
    <div ref={revealRef} dir="rtl" className="noise page-shell min-h-[100dvh] bg-[var(--site-bg)]">
      {showSplash && <Splash onSkip={() => setShowSplash(false)} />}

      <HeroSection
        onMenu={() => setMenuOpen((v) => !v)}
        menuOpen={menuOpen}
        onContact={() => scrollTo('bloggers')}
        onWork={() => scrollTo('work')}
      />

      <AboutSection />
      <ServicesSection
        activeService={activeService}
        onSelectService={setActiveService}
       
      />
      <WorkSection
        onSelectProject={setSelectedProject}
        onContact={() => scrollTo('contact')}
      />
      <section id="our-services-header" className="bg-[var(--site-bloggers-bg)] pt-20 pb-4">
        <div className="container-wide text-center reveal">
          <h2 className="section-title text-[var(--site-text-dark)]">
            خدماتنا
          </h2>
        </div>
      </section>

      <PhotographersSection />
      <BloggersSection onSelectCreator={setSelectedCreator} />
      <DigitalOrderSection />
      <ExtraOrderSection />
      <ProcessSection />
      <ContactSection />
      <Footer />

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
      {selectedCreator && (
        <CreatorModal
          creator={selectedCreator}
          onClose={() => setSelectedCreator(null)}
          onContact={() => scrollTo('contact')}
          onAddToOrder={() => {
            const current = bloggers[selectedCreator.id];
            if (!current?.video) {
              setBloggerCount(selectedCreator.id, 1);
            }
            scrollTo('contact');
          }}
        />
      )}
    </div>
  );
}
