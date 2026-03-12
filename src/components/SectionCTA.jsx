import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const SectionCTA = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const subtextRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "center center",
        scrub: false,
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(textRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    )
    .fromTo(buttonRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)" },
      "-=0.4"
    )
    .fromTo(subtextRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      "-=0.2"
    );

  }, { scope: sectionRef });

  const handleMouseEnter = () => {
    gsap.to(buttonRef.current, { scale: 1.05, duration: 0.2, ease: "power1.out" });
  };
  
  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, { scale: 1, duration: 0.2, ease: "power1.in" });
  };

  return (
    <section ref={sectionRef} className="section-container bg-cardBg z-40 relative">
      <div className="z-10 flex flex-col items-center justify-center space-y-10 px-4 w-full">
        
        <div className="text-center w-full max-w-[320px]">
          <h2 ref={textRef} className="text-3xl font-extrabold text-transparent bg-clip-text bg-primary-gradient leading-tight pb-2">
            Discover schemes you are eligible for on LokSahay — in seconds.
          </h2>
        </div>
        
        <div className="flex flex-col items-center space-y-4 w-full max-w-[280px]">
          <button 
            ref={buttonRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="w-full bg-primary text-white rounded-xl py-4 px-6 text-[16px] font-semibold shadow-[0_8px_20px_-6px_rgba(91,63,140,0.6)] hover:shadow-[0_12px_24px_-8px_rgba(91,63,140,0.8)] transition-shadow"
          >
            Check Eligibility
          </button>
          
          <p ref={subtextRef} className="text-sm text-center text-textSecondary font-medium leading-relaxed">
            Answer a few quick questions and get personalized scheme recommendations.
          </p>
        </div>

      </div>
    </section>
  );
};

export default SectionCTA;
