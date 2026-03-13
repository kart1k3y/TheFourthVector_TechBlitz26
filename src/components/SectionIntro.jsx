import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';

const SectionIntro = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    // Text fade in
    gsap.fromTo(textRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", delay: 0.2 }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="section-container relative z-10 flex items-center justify-center">
      
      <div className="z-10 text-center max-w-[320px] md:max-w-3xl lg:max-w-4xl">
        <h1 ref={textRef} className="text-2xl md:text-5xl lg:text-6xl font-bold text-textPrimary leading-tight">
          {t('intro.title')}
        </h1>
      </div>
    </section>
  );
};

export default SectionIntro;
