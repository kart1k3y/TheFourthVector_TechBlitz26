import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';

import SectionIntro from './SectionIntro';
import SectionConfusion from './SectionConfusion';
import SectionQuestion from './SectionQuestion';
import SectionCTA from './SectionCTA';
import SectionFAQ from './SectionFAQ';
import LanguageSwitcher from './LanguageSwitcher';

import agriIcon from '../assets/agri-icon.svg';
import banknoteIcon from '../assets/banknote.svg';
import educationIcon from '../assets/education-icon.svg';
import healthIcon from '../assets/health-icon.svg';
import womanIcon from '../assets/woman-icon.svg';

gsap.registerPlugin(ScrollTrigger);

const LandingFlow = ({ onStartEligibility, onCategorySelect }) => {
  const { t } = useTranslation();
  const container = useRef(null);
  const iconsContainerRef = useRef(null);
  const globalIconsRef = useRef([]);

  const iconData = [
    { src: banknoteIcon, alt: t('icons.finance'), category: 'Finance', wrapperClass: "w-20 h-20 md:w-32 md:h-32 shadow-md md:shadow-xl", imgClass: "w-10 h-10 md:w-16 md:h-16", initTop: '20vh', initLeft: '10%' },
    { src: educationIcon, alt: t('icons.education'), category: 'Education', wrapperClass: "w-20 h-20 md:w-32 md:h-32 shadow-md md:shadow-xl", imgClass: "w-10 h-10 md:w-16 md:h-16", initTop: '22vh', initLeft: '72%' },
    { src: agriIcon, alt: t('icons.agriculture'), category: 'Agriculture', wrapperClass: "w-20 h-20 md:w-32 md:h-32 shadow-md md:shadow-xl", imgClass: "w-10 h-10 md:w-16 md:h-16", initTop: '72vh', initLeft: '15%' },
    { src: healthIcon, alt: t('icons.health'), category: 'Health', wrapperClass: "w-20 h-20 md:w-32 md:h-32 shadow-md md:shadow-xl", imgClass: "w-10 h-10 md:w-16 md:h-16", initTop: '70vh', initLeft: '74%' },
    { src: womanIcon, alt: t('icons.women'), category: 'Women', wrapperClass: "w-20 h-20 md:w-32 md:h-32 shadow-md md:shadow-xl", imgClass: "w-10 h-10 md:w-16 md:h-16", initTop: '48vh', initLeft: '5%' },
  ];

  useGSAP(() => {
    // Scroll to top on mount to ensure triggers calculate correctly
    window.scrollTo(0, 0);
    
    // Slight delay to ensure DOM layout is complete before calculating triggers
    const ctx = gsap.context(() => {
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
            gsap.set(icon, {
              top: orbitY + (cPositions[i].y - orbitY) * p,
              left: orbitX + (cPositions[i].x - orbitX) * p,
              scale: 0.7 + (0.15 * p),  // Slightly larger in C shape
              opacity: 0.8, // Ensure it's fully visible
              xPercent: -50,
              yPercent: -50,
            });
          });
        }
      });

      // ─── PHASE 4: EXIT & PIN SECTION 3 — Icons form navbar on Section 4 ───
      const exitState = { progress: 0 };
      gsap.to(exitState, {
        progress: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".section-question-trigger",
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
        },
        onUpdate: () => {
          const p = exitState.progress;
          const cPositions = getSection3CPositions();

          const scrollY = window.scrollY || window.pageYOffset;
          const section4 = document.querySelector('.section-cta-trigger');
          const rect4 = section4.getBoundingClientRect();
          const containerW = mainEl.offsetWidth;

          // Navbar target: evenly spaced horizontal row near top of Section 4
          const navbarY = scrollY + rect4.top + 60; // 60px from top of Section 4
          const navPadding = containerW * 0.1; // 10% padding on each side
          const navWidth = containerW - (navPadding * 2);
          const navIconScale = 0.5; // Smaller icons for navbar

          icons.forEach((icon, i) => {
            // Evenly space across the navbar width
            const targetX = navPadding + (navWidth / (numIcons - 1)) * i;
            const targetY = navbarY;

            gsap.set(icon, {
              top: cPositions[i].y + (targetY - cPositions[i].y) * p,
              left: cPositions[i].x + (targetX - cPositions[i].x) * p,
              scale: 0.85 - ((0.85 - navIconScale) * p), // Shrink from 0.85 to 0.5
              opacity: 0.8 + (0.2 * p), // Slightly increase opacity to 1
              xPercent: -50,
              yPercent: -50,
            });
          });
        }
      });
      
      // Force ScrollTrigger to calculate positions now that DOM is fully ready
      ScrollTrigger.refresh();
    }, container);
    
    return () => ctx.revert();
  }, { scope: container });

  return (
    <main ref={container} className="relative w-full overflow-x-hidden bg-white">
      <LanguageSwitcher />

      {/* GLOBAL ICONS — absolute, stretches across full page height */}
      <div ref={iconsContainerRef} className="absolute top-0 left-0 w-full z-50" style={{ height: '500vh', pointerEvents: 'none' }}>
        {iconData.map((data, i) => (
          <div
            key={i}
            ref={el => globalIconsRef.current[i] = el}
            className={`absolute neumorphic-circle opacity-80 ${data.wrapperClass} cursor-pointer hover:scale-110 transition-transform`}
            style={{
              top: data.initTop,
              left: data.initLeft,
              pointerEvents: 'auto',
            }}
            onClick={() => onCategorySelect(data.category)}
            title={`View ${data.category} schemes`}
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
        <SectionCTA onStart={onStartEligibility} />
      </div>
      <SectionFAQ />
    </main>
  );
};

export default LandingFlow;
