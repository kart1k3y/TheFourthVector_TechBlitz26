import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { FaChevronDown } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const FAQItem = ({ faq, index, isOpen, onToggle }) => {
  const contentRef = useRef(null);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-1 text-left group transition-colors"
      >
        <span className="text-base md:text-lg font-semibold text-textPrimary group-hover:text-primary transition-colors pr-4">
          {faq.question}
        </span>
        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-gray-100 text-textSecondary'}`}>
          <FaChevronDown className="text-xs" />
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight || 200}px` : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p className="pb-5 px-1 text-textSecondary text-sm md:text-base leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
};

const SectionFAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const listRef = useRef(null);

  // Generate dynamic FAQ list from translations
  const faqs = Array.from({ length: 7 }, (_, i) => ({
    question: t(`faq.q${i + 1}.question`),
    answer: t(`faq.q${i + 1}.answer`)
  }));

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(titleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
    )
    .fromTo(listRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.3"
    );
  }, { scope: sectionRef });

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="relative z-20 bg-white py-20 md:py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <div ref={titleRef} className="text-center mb-12 md:mb-16">
          <span className="inline-block text-sm font-bold text-primary bg-indigo-50 px-4 py-1.5 rounded-full mb-4">
            {t('faq.titleBadge')}
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-textPrimary">
            {t('faq.title')}
          </h2>
        </div>

        <div ref={listRef} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionFAQ;
