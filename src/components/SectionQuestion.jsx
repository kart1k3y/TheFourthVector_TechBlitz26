import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import searchIllustration from '../assets/search-illustation.svg';

const SectionQuestion = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const illustrationRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        end: "center center",
        scrub: 1,
      }
    });

    tl.fromTo(illustrationRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }
    )
    .fromTo(textRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1 },
      "<0.2"
    );

    // --- EXIT ANIMATION ---
    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "center center",
        end: "bottom center",
        scrub: 1,
      }
    });

    // Move illustration and text towards bottom center and fade out
    exitTl.to(illustrationRef.current, {
      opacity: 0,
      y: 150,
      scale: 0.5,
      duration: 1
    }, 0)
    .to(textRef.current, {
      opacity: 0,
      y: 100,
      scale: 0.5,
      duration: 1
    }, 0);

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="section-container relative z-30 bg-white">
      <div className="z-10 flex flex-col items-center justify-center space-y-8">
        <div className="w-56 h-56 relative">
           <img 
            ref={illustrationRef}
            src={searchIllustration} 
            alt="Searching Person" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="text-center max-w-[300px]">
          <h2 ref={textRef} className="text-xl md:text-2xl font-bold text-primary leading-snug">
            Do you know which schemes you are actually eligible for?
          </h2>
        </div>
      </div>
    </section>
  );
};

export default SectionQuestion;
