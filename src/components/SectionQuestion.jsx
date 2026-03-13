import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';

import searchIllustration from '../assets/search-illustation.svg';

const SectionQuestion = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const illustrationRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        toggleActions: "play none none reverse"
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

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="section-container relative z-30 bg-white">
      <div className="z-10 flex flex-col items-center justify-center space-y-8">
        <div className="w-56 h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 relative">
           <img 
            ref={illustrationRef}
            src={searchIllustration} 
            alt={t('question.alt')} 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="text-center max-w-[300px] md:max-w-3xl">
          <h2 ref={textRef} className="text-xl md:text-4xl lg:text-5xl font-bold text-primary leading-snug">
            {t('question.title')}
          </h2>
        </div>
      </div>
    </section>
  );
};

export default SectionQuestion;
