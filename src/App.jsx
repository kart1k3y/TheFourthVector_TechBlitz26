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
import SchemeDetailView from './components/SchemeDetailView';

function App() {
  const [view, setView] = useState('landing');
  const [previousView, setPreviousView] = useState('landing');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const curtainRef = useRef(null);

  // Curtain wipe transition
  const transitionTo = useCallback((targetView) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const curtain = curtainRef.current;
    const tl = gsap.timeline();

    tl.set(curtain, { display: 'block', yPercent: 100 })
      .to(curtain, {
        yPercent: 0,
        duration: 0.6,
        ease: 'power3.inOut',
      })
      .call(() => {
        // Track the previous view only if we are going to schemeDetail
        if (targetView === 'schemeDetail') {
          setPreviousView(view);
        }
        setView(targetView);
        window.scrollTo(0, 0);
      })
      .to({}, { duration: 0.15 })
      .to(curtain, {
        yPercent: -100,
        duration: 0.6,
        ease: 'power3.inOut',
      })
      .call(() => {
        setIsTransitioning(false);
        gsap.set(curtain, { display: 'none' });
      });
  }, [isTransitioning, view]);

  // Handle icon click → navigate to category page
  const handleIconClick = useCallback((category) => {
    setSelectedCategory(category);
    transitionTo('category');
  }, [transitionTo]);

  // Handle scheme click → navigate to detail page
  const handleSchemeClick = useCallback((scheme) => {
    setSelectedScheme(scheme);
    transitionTo('schemeDetail');
  }, [transitionTo]);

  return (
    <>
      {view === 'eligibility' ? (
        <EligibilityFlow 
          onBack={() => transitionTo('landing')} 
          onSchemeSelect={handleSchemeClick}
        />
      ) : view === 'category' ? (
        <CategorySchemes
          category={selectedCategory}
          icon={null}
          onBack={() => transitionTo('landing')}
          onSchemeSelect={handleSchemeClick}
        />
      ) : view === 'schemeDetail' ? (
        <SchemeDetailView
          scheme={selectedScheme}
          onBack={() => transitionTo(previousView)}
        />
      ) : (
        <LandingFlow 
          onStartEligibility={() => transitionTo('eligibility')}
          onCategorySelect={handleIconClick}
        />
      )}

      {/* Curtain overlay */}
      <div
        ref={curtainRef}
        className="page-curtain"
      />
    </>
  );
}

export default App;

