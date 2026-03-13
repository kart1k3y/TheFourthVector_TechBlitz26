import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { FaChevronDown } from 'react-icons/fa';

const faqs = [
  {
    question: "How do I find the schemes I am eligible for?",
    answer: "Simply click \"Check Eligibility\" and answer a few quick questions about your age, occupation, income, and location. Based on your responses, the platform will show government schemes that you may qualify for."
  },
  {
    question: "How many questions do I need to answer?",
    answer: "You only need to answer a short set of simple questions (about 1–2 minutes). These questions help the system understand your situation and match you with relevant schemes."
  },
  {
    question: "Do I need to upload any documents?",
    answer: "No. You do not need to upload documents to check your eligibility here. Documents such as Aadhaar card, bank account details, or ration card may only be required when you apply through the official government website."
  },
  {
    question: "Is my personal information safe?",
    answer: "Yes. The platform only uses your answers to match you with relevant schemes. No sensitive personal data such as Aadhaar numbers or bank details are stored."
  },
  {
    question: "What if I am eligible for multiple schemes?",
    answer: "If you qualify for multiple government programs, the platform will show all matching schemes along with their benefits so you can explore each option."
  },
  {
    question: "Can I still use this platform if I am not sure about my BPL status or income?",
    answer: "Yes. If you are unsure about some answers, you can still complete the questionnaire. The platform will try to suggest schemes based on the information you provide."
  },
  {
    question: "Does this platform apply for the scheme on my behalf?",
    answer: "No. This platform helps you discover schemes you may be eligible for. After viewing the results, you can visit the official government website or application portal to apply."
  }
];

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
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const listRef = useRef(null);

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
            FAQs
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-textPrimary">
            Frequently Asked Questions
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
