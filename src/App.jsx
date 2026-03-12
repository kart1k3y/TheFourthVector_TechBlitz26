import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import SectionIntro from './components/SectionIntro';
import SectionConfusion from './components/SectionConfusion';
import SectionQuestion from './components/SectionQuestion';
import SectionCTA from './components/SectionCTA';

import agriIcon from './assets/agri-icon.svg';
import banknoteIcon from './assets/banknote.svg';
import educationIcon from './assets/education-icon.svg';
import healthIcon from './assets/health-icon.svg';
import womanIcon from './assets/woman-icon.svg';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const container = useRef(null);
  const iconsContainerRef = useRef(null);
  const globalIconsRef = useRef([]);

  const iconData = [
    { src: banknoteIcon, alt: "Finance", className: "w-16", initTop: '20vh', initLeft: '10%' },
    { src: educationIcon, alt: "Education", className: "w-20", initTop: '22vh', initLeft: '72%' },
    { src: agriIcon, alt: "Agriculture", className: "w-24", initTop: '72vh', initLeft: '15%' },
    { src: healthIcon, alt: "Health", className: "w-16", initTop: '70vh', initLeft: '74%' },
    { src: womanIcon, alt: "Women", className: "w-16", initTop: '48vh', initLeft: '5%' },
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
      const mainWidth = mainEl.offsetWidth;
      return {
        y: parseFloat(iconData[i].initTop) / 100 * window.innerHeight,
        x: parseFloat(iconData[i].initLeft) / 100 * mainWidth,
      };
    }

    // HORIZONTAL C-shape: icons spread left to right with a curved (smile) shape
    function getSection3CPositions() {
      const scrollY = window.scrollY || window.pageYOffset;
      const section3 = document.querySelector('.section-question-trigger');
      const rect3 = section3.getBoundingClientRect();
      const sec3Top = scrollY + rect3.top;
      const containerW = mainEl.offsetWidth;

      // Horizontal arc: spread icons across 80% of width,
      // with a downward curve (like a smile / horizontal C)
      const arcRadius = 80;
      const startX = containerW * 0.1;  // 10% from left edge
      const endX = containerW * 0.9;    // 90% from left edge
      const centerY = sec3Top + rect3.height * 0.25; // Upper portion of section
      const positions = [];
      for (let i = 0; i < numIcons; i++) {
        const t = i / (numIcons - 1);  // 0 to 1
        // Angle from π to 0 (left to right along bottom of circle = smile shape)
        const angle = Math.PI * (1 - t);
        // Math.sin(angle) is positive (0 to 1 back to 0). Subtracting it moves the Y coordinate UP on screen.
        positions.push({
          x: startX + t * (endX - startX),
          y: centerY - Math.sin(angle) * arcRadius,  // Negative offset creates upward arch curve
        });
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
          const targetX = center.x + Math.cos(angle) * orbitRadius;
          const targetY = center.y + Math.sin(angle) * orbitRadius;
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

    // ─── PHASE 4: EXIT FROM SECTION 3 (Merge to bottom center) ───
    const exitState = { progress: 0 };
    gsap.to(exitState, {
      progress: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".section-question-trigger",
        start: "center center", // Start when Section 3 is fully in view
        end: "bottom center",   // End as Section 3 leaves the screen
        scrub: 1.5,
      },
      onUpdate: () => {
        const p = exitState.progress;
        // The starting point for this phase is the final C-shape
        const cPositions = getSection3CPositions();
        
        const scrollY = window.scrollY || window.pageYOffset;
        const section3 = document.querySelector('.section-question-trigger');
        const rect3 = section3.getBoundingClientRect();
        
        // Target: bottom center of Section 3
        const targetX = mainEl.offsetWidth / 2;
        // rect3.bottom is viewport-relative. scrollY + rect3.bottom is document-absolute.
        // We want the merge point to be near the bottom of Section 3.
        const targetY = scrollY + rect3.bottom - 50; 

        icons.forEach((icon, i) => {
          gsap.set(icon, {
            top: cPositions[i].y + (targetY - cPositions[i].y) * p,
            left: cPositions[i].x + (targetX - cPositions[i].x) * p,
            scale: (0.7 + 0.15) * (1 - p), // Shrink to 0
            opacity: 0.8 * (1 - p),        // Fade to 0
            xPercent: -50,
            yPercent: -50,
          });
        });
      }
    });

  }, { scope: container });

  return (
    <main ref={container} className="relative w-full overflow-x-hidden bg-white">

      {/* GLOBAL ICONS — absolute, stretches across full page height */}
      <div ref={iconsContainerRef} className="absolute top-0 left-0 w-full z-40 pointer-events-none" style={{ height: '500vh' }}>
        {iconData.map((data, i) => (
          <img
            key={i}
            ref={el => globalIconsRef.current[i] = el}
            src={data.src}
            alt={data.alt}
            className={`absolute object-contain opacity-80 ${data.className}`}
            style={{
              top: data.initTop,
              left: data.initLeft,
            }}
          />
        ))}
      </div>

      <SectionIntro />
      <div className="section-confusion-trigger">
        <SectionConfusion />
      </div>
      <div className="section-question-trigger">
        <SectionQuestion />
      </div>
      <SectionCTA />
    </main>
  );
}

export default App;
