import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';

import confusedIllustration from '../assets/confused-illustration.svg';

const SectionConfusion = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const illustrationRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center",
        end: "center center",
        scrub: 1,
      }
    });

    // Only keep illustration and text animations
    tl.fromTo(textRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }
    )
    .fromTo(illustrationRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1 },
      "<0.2"
    );

    // Add a gentle floating effect to the central illustration
    gsap.to(illustrationRef.current, {
      y: "+=15",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="section-container relative bg-cardBg z-20">

      <div className="z-10 flex flex-col items-center justify-center space-y-8">
        <div className="w-48 h-48 md:w-80 md:h-80 lg:w-96 lg:h-96 relative">
           <img 
            ref={illustrationRef}
            src={confusedIllustration} 
            alt={t('confusion.alt')} 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="text-center max-w-[280px] md:max-w-2xl pt-24 mt-8">
          <h2 ref={textRef} className="text-xl md:text-4xl lg:text-5xl font-semibold text-textPrimary leading-snug">
            {t('confusion.title')}
          </h2>
        </div>
      </div>
    </section>
  );
};

export default SectionConfusion;
