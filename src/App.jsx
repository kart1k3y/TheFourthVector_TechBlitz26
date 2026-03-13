import React, { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';

import SectionIntro from './components/SectionIntro';
import SectionConfusion from './components/SectionConfusion';
import SectionQuestion from './components/SectionQuestion';
import SectionCTA from './components/SectionCTA';
import EligibilityFlow from './components/EligibilityFlow';
import LanguageSwitcher from './components/LanguageSwitcher';

import agriIcon from './assets/agri-icon.svg';
import banknoteIcon from './assets/banknote.svg';
import educationIcon from './assets/education-icon.svg';
import healthIcon from './assets/health-icon.svg';
import womanIcon from './assets/woman-icon.svg';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const { t } = useTranslation();
  const [view, setView] = useState('landing');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const container = useRef(null);
  const curtainRef = useRef(null);
  const iconsContainerRef = useRef(null);
  const globalIconsRef = useRef([]);

  const iconData = [
    { src: banknoteIcon, alt: t('icons.finance'), wrapperClass: "w-20 h-20 md:w-32 md:h-32 shadow-md md:shadow-xl", imgClass: "w-10 h-10 md:w-16 md:h-16", initTop: '20vh', initLeft: '10%' },
    { src: educationIcon, alt: t('icons.education'), wrapperClass: "w-20 h-20 md:w-32 md:h-32 shadow-md md:shadow-xl", imgClass: "w-10 h-10 md:w-16 md:h-16", initTop: '22vh', initLeft: '72%' },
    { src: agriIcon, alt: t('icons.agriculture'), wrapperClass: "w-20 h-20 md:w-32 md:h-32 shadow-md md:shadow-xl", imgClass: "w-10 h-10 md:w-16 md:h-16", initTop: '72vh', initLeft: '15%' },
    { src: healthIcon, alt: t('icons.health'), wrapperClass: "w-20 h-20 md:w-32 md:h-32 shadow-md md:shadow-xl", imgClass: "w-10 h-10 md:w-16 md:h-16", initTop: '70vh', initLeft: '74%' },
    { src: womanIcon, alt: t('icons.women'), wrapperClass: "w-20 h-20 md:w-32 md:h-32 shadow-md md:shadow-xl", imgClass: "w-10 h-10 md:w-16 md:h-16", initTop: '48vh', initLeft: '5%' },
  ];

  useGSAP(() => {
    const icons = globalIconsRef.current;
    const numIcons = icons.length;
    const orbitRadius = 120;
    const mainEl = container.current;

    // ── Helpers ──
    function getOrbitCenter() {
      const scrollY = window.scrollY || window.pageYOffset;
      const section = document.querySelector('.section-confusion-trigger');
      const sectionRect = section.getBoundingClientRect();
      return {
        y: scrollY + sectionRect.top + sectionRect.height * 0.35,
        x: mainEl.offsetWidth / 2,  // Dead center of the container
      };
    }

    function getInitPos(i) {
      return {
        y: parseFloat(iconData[i].initTop) / 100 * window.innerHeight,
        x: parseFloat(iconData[i].initLeft) / 100 * mainEl.offsetWidth,
      };
    }

    // Upward Arch shape: icons wrap elegantly above the central illustration
    function getSection3CPositions() {
      const scrollY = window.scrollY || window.pageYOffset;
      const section3 = document.querySelector('.section-question-trigger');
      const rect3 = section3.getBoundingClientRect();
      const sec3Top = scrollY + rect3.top;
      const containerW = mainEl.offsetWidth;

      // Make the arc responsive based on screen real estate
      const arcRadius = Math.min(containerW * 0.35, 300); // Cap it at 300px so it's not absurdly tall on ultrawide monitors
      const startX = containerW * 0.12;
      const endX = containerW * 0.88;
      // Raise the arc higher so it envelopes the top of the illustration
      const centerY = sec3Top + (rect3.height * 0.40);

      const positions = new Array(numIcons);

      // Clean mapping so icons don't criss-cross during transition! 
      // At the end of Phase 2 orbit, they are roughly in this X-axis order:
      const order = [1, 0, 2, 4, 3];

      for (let j = 0; j < numIcons; j++) {
        const iconIndex = order[j];
        const t = j / (numIcons - 1);  // 0 to 1
        const angle = Math.PI * (1 - t);

        positions[iconIndex] = {
          x: startX + t * (endX - startX),
          y: centerY - Math.sin(angle) * arcRadius,
        };
      }
      return positions;
    }

    // 1. Gentle floating animation for Section 1
    const floatTweens = icons.map((icon, i) => {
      return gsap.to(icon, {
        y: `+=${12 + (i % 3) * 8}`,
        rotation: `+=${8 + (i % 2) * 4}`,
        duration: (3 + (i * 0.3)) * 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.15
      });
    });

    // ─── PHASE 1: ARRIVAL (scroll from Section 1 to orbit circle) ───
    const arrivalState = { progress: 0 };
    gsap.to(arrivalState, {
      progress: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".section-confusion-trigger",
        start: "top bottom",
        end: "top top",
        scrub: 1.5,
        onEnter: () => floatTweens.forEach(t => t.pause()),
        onLeaveBack: () => floatTweens.forEach(t => t.resume()),
      },
      onUpdate: () => {
        const center = getOrbitCenter();
        const p = arrivalState.progress;
        icons.forEach((icon, i) => {
          const angle = (i / numIcons) * Math.PI * 2;
          // ─── PHASE 2: ORBIT ───
          // Dynamically size the orbit oval based on the screen width
          const radiusX = Math.min(mainEl.offsetWidth * 0.35, 380);
          const radiusY = Math.min(mainEl.offsetWidth * 0.20, 220);

          // Calculate target position for the orbit (Phase 2)
          const targetX = center.x + Math.cos(angle) * radiusX;
          const targetY = center.y + Math.sin(angle) * radiusY;
          const init = getInitPos(i);

          gsap.set(icon, {
            top: init.y + (targetY - init.y) * p,
            left: init.x + (targetX - init.x) * p,
            scale: 1 - (0.3 * p),
            rotation: 0,
            xPercent: -50 * p,
            yPercent: -50 * p,
          });
        });
      }
    });

    // ─── PHASE 2: PINNED SHORT ORBIT (partial revolution ~120°) ───
    const orbitState = { progress: 0 };
    gsap.to(orbitState, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".section-confusion-trigger",
        start: "top top",
        end: "+=80%",          // Much shorter pin — just enough for a partial orbit
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        refreshPriority: 10,   // MUST refresh first to offset child triggers correctly!
      },
      onUpdate: () => {
        const center = getOrbitCenter();
        icons.forEach((icon, i) => {
          const baseAngle = (i / numIcons) * Math.PI * 2;
          // Only rotate ~120° (1/3 of full circle) instead of 360°
          const currentAngle = baseAngle + orbitState.progress * (Math.PI * 2 / 3);

          gsap.set(icon, {
            top: center.y + Math.sin(currentAngle) * orbitRadius,
            left: center.x + Math.cos(currentAngle) * orbitRadius,
            scale: 0.7,
            xPercent: -50,
            yPercent: -50,
          });
        });
      }
    });

    // ─── PHASE 3: TRANSITION TO SECTION 3 (C-shape) ───
    const cShapeState = { progress: 0 };
    gsap.to(cShapeState, {
      progress: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".section-question-trigger",
        start: "top bottom",
        end: "top 30%",
        scrub: 1.5,
      },
      onUpdate: () => {
        const center = getOrbitCenter();
        const cPositions = getSection3CPositions();
        const p = cShapeState.progress;

        icons.forEach((icon, i) => {
          // Start from the last orbit position
          const baseAngle = (i / numIcons) * Math.PI * 2;
          const finalOrbitAngle = baseAngle + (Math.PI * 2 / 3);
          const orbitX = center.x + Math.cos(finalOrbitAngle) * orbitRadius;
          const orbitY = center.y + Math.sin(finalOrbitAngle) * orbitRadius;

          // Interpolate to C-shape position
          // Need to ensure opacity is reset if we scroll backward from Phase 4
          gsap.set(icon, {
            top: orbitY + (cPositions[i].y - orbitY) * p,
            left: orbitX + (cPositions[i].x - orbitX) * p,
            scale: 0.7 + (0.15 * p),  // Slightly larger in C shape
            opacity: 0.8, // Ensure it's fully visible (opacity-80 default)
            xPercent: -50,
            yPercent: -50,
          });
        });
      }
    });

    // ─── PHASE 4: EXIT & PIN SECTION 3 ───
    const exitState = { progress: 0 };
    gsap.to(exitState, {
      progress: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".section-question-trigger",
        start: "top top",       // Start exactly when Section 3 hits top
        end: "+=120%",          // Pin the section for 120% of viewport height
        pin: true,              // <--- THIS SCROLL-LOCKS THE WHITE SECTION
        scrub: 1.5,
        anticipatePin: 1,
      },
      onUpdate: () => {
        const p = exitState.progress;
        // The starting point for this phase is the final C-shape
        const cPositions = getSection3CPositions();

        const scrollY = window.scrollY || window.pageYOffset;
        const section3 = document.querySelector('.section-question-trigger');
        const rect3 = section3.getBoundingClientRect();

        const section4 = document.querySelector('.section-cta-trigger');
        const rect4 = section4.getBoundingClientRect();

        // Target: Center of Section 4 (the actual text area)
        const targetX = mainEl.offsetWidth / 2;
        // Pushing the target deeper into Section 4 to match the text height/center
        const targetY = scrollY + rect4.top + (rect4.height * 0.45);

        // Update global floating icons
        icons.forEach((icon, i) => {
          gsap.set(icon, {
            top: cPositions[i].y + (targetY - cPositions[i].y) * p,
            left: cPositions[i].x + (targetX - cPositions[i].x) * p,
            scale: (0.7 + 0.15) * (1 - p), // Shrink to 0 at the very end
            opacity: 0.8 * (1 - p),        // Fade to 0 at the very end
            xPercent: -50,
            yPercent: -50,
          });
        });

        // Synchronously fade out Section 3 text & illustration
        // Let them travel deeply into Section 4's area before vanishing
        gsap.set(['.section-question-trigger img', '.section-question-trigger h2'], {
          opacity: 1 - Math.pow(p, 1.5), // Stay visible longer, curve fades out mostly at the end
          y: p * 300,             // Sink deeply into Section 4
          scale: 1 - (p * 0.9)    // Shrink significantly to look like it's being sucked into the center
        });
      }
    });

  }, { scope: container });

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

  return (
    <>
      {view === 'eligibility' ? (
        <EligibilityFlow onBack={() => transitionTo('landing')} />
      ) : (
        <main ref={container} className="relative w-full overflow-x-hidden bg-white">
          <LanguageSwitcher />

          {/* GLOBAL ICONS — absolute, stretches across full page height */}
          <div ref={iconsContainerRef} className="absolute top-0 left-0 w-full z-40 pointer-events-none" style={{ height: '500vh' }}>
            {iconData.map((data, i) => (
              <div
                key={i}
                ref={el => globalIconsRef.current[i] = el}
                className={`absolute neumorphic-circle opacity-80 ${data.wrapperClass}`}
                style={{
                  top: data.initTop,
                  left: data.initLeft,
                }}
              >
                <img
                  src={data.src}
                  alt={data.alt}
                  className={`object-contain ${data.imgClass}`}
                />
              </div>
            ))}
          </div>

          <SectionIntro />
          <div className="section-confusion-trigger">
            <SectionConfusion />
          </div>
          <div className="section-question-trigger">
            <SectionQuestion />
          </div>
          <div className="section-cta-trigger">
            <SectionCTA onStart={() => transitionTo('eligibility')} />
          </div>
        </main>
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

