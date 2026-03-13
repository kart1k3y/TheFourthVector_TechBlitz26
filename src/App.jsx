import React, { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';

import SectionIntro from './components/SectionIntro';
import SectionConfusion from './components/SectionConfusion';
import SectionQuestion from './components/SectionQuestion';
import SectionCTA from './components/SectionCTA';
import SectionFAQ from './components/SectionFAQ';
import EligibilityFlow from './components/EligibilityFlow';
import CategorySchemes from './components/CategorySchemes';
import LandingFlow from './components/LandingFlow';

function App() {
  const [view, setView] = useState('landing');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const curtainRef = useRef(null);

  // Curtain wipe transition
  const transitionTo = useCallback((targetView) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const curtain = curtainRef.current;
    const tl = gsap.timeline();

    // Phase 1: Curtain sweeps up from bottom to cover the screen
    tl.set(curtain, { display: 'block', yPercent: 100 })
      .to(curtain, {
        yPercent: 0,
        duration: 0.6,
        ease: 'power3.inOut',
      })
      // At the midpoint, swap the actual view
      .call(() => {
        setView(targetView);
        window.scrollTo(0, 0);
      })
      // Small hold while the content mounts
      .to({}, { duration: 0.15 })
      // Phase 2: Curtain slides away upward, revealing new content
      .to(curtain, {
        yPercent: -100,
        duration: 0.6,
        ease: 'power3.inOut',
      })
      .call(() => {
        setIsTransitioning(false);
        gsap.set(curtain, { display: 'none' });
      });
  }, [isTransitioning]);

  // Handle icon click → navigate to category page
  const handleIconClick = useCallback((category) => {
    setSelectedCategory(category);
    transitionTo('category');
  }, [transitionTo]);

  return (
    <>
      {view === 'eligibility' ? (
        <EligibilityFlow onBack={() => transitionTo('landing')} />
      ) : view === 'category' ? (
        <CategorySchemes
          category={selectedCategory}
          // Simple icon mapping since we moved iconData to LandingFlow
          icon={null} // Default icon or pass it if needed, but the category page looks fine without it
          onBack={() => transitionTo('landing')}
        />
      ) : (
        <LandingFlow 
          onStartEligibility={() => transitionTo('eligibility')}
          onCategorySelect={handleIconClick}
        />
      )}

      {/* Curtain overlay — always mounted so GSAP can animate it across view changes */}
      <div
        ref={curtainRef}
        className="page-curtain"
      />
    </>
  );
}

export default App;

