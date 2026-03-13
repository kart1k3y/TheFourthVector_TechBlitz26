import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  FaTimes, 
  FaCheckCircle, 
  FaFileAlt, 
  FaExternalLinkAlt, 
  FaInfoCircle, 
  FaClipboardList,
  FaChevronRight
} from 'react-icons/fa';
import gsap from 'gsap';

const SchemeDetailModal = ({ scheme, isOpen, onClose }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const body = document.getElementById('modal-body');
      if (body) body.scrollTop = 0;
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const renderEligibility = () => {
    if (!scheme || !scheme.eligibility) return null;
    
    return (
      <section className="space-y-6">
        <div className="flex items-center gap-4 text-primary">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
            <FaCheckCircle className="text-2xl" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter">{t('schemeDetails.eligibility')}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(scheme.eligibility).map(([key, value]) => {
            const label = t(`questions.${key.toUpperCase()}.text`, key);
            let displayValue = '';
            
            if (Array.isArray(value)) {
              displayValue = value.map(v => t(`questions.${key.toUpperCase()}.options.${v}`, v)).join(', ');
            } else {
              displayValue = t(`questions.${key.toUpperCase()}.options.${value}`, value);
            }

            return (
              <motion.div 
                key={key} 
                whileHover={{ y: -2 }}
                className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 hover:border-primary/20 hover:bg-white hover:shadow-lg transition-all"
              >
                <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">{label}</p>
                <p className="text-textPrimary font-bold text-lg">{displayValue}</p>
              </motion.div>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && scheme && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-0 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-textPrimary/40 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 100 }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="relative w-full max-w-5xl h-full md:h-[92vh] bg-white md:rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none" />

            {/* Header */}
            <div className="relative p-8 md:p-12 border-b border-gray-100 flex-shrink-0 bg-white/40 backdrop-blur-2xl z-20">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-8 right-8 p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-textPrimary hover:shadow-lg transition-all"
              >
                <FaTimes className="text-xl" />
              </motion.button>
              
              <div className="pr-16">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <span className="px-5 py-2 rounded-full text-[11px] font-black tracking-[0.2em] uppercase bg-primary text-white shadow-lg shadow-primary/20">
                    {t(scheme.scheme_category)}
                  </span>
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-6xl font-black text-textPrimary leading-[1.1] tracking-tighter"
                >
                  {t(scheme.scheme_name)}
                </motion.h2>
              </div>
            </div>

            {/* Body */}
            <div 
              id="modal-body"
              className="flex-1 overflow-y-auto px-8 md:px-16 py-12 space-y-20 custom-scrollbar relative z-10"
            >
              <section className="space-y-8">
                <div className="flex items-center gap-4 text-primary">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                    <FaInfoCircle className="text-2xl" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{t('schemeDetails.overview')}</h3>
                </div>
                <div className="relative">
                  <p className="text-textSecondary text-lg md:text-2xl leading-relaxed md:leading-[1.6] font-medium max-w-4xl">
                    {t(scheme.scheme_benefit)}
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-7">
                  {renderEligibility()}
                </div>
                <div className="lg:col-span-5">
                  <section className="space-y-8">
                    <div className="flex items-center gap-4 text-primary">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                        <FaExternalLinkAlt className="text-xl" />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter">{t('schemeDetails.officialWebsite')}</h3>
                    </div>
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-textPrimary tracking-tight to-indigo-950 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                      <p className="relative text-indigo-100/80 text-lg mb-8 font-medium">
                        {t('schemeDetails.websiteInfo')}
                      </p>
                      <motion.a 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={scheme.official_link || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="relative flex items-center justify-center gap-4 w-full bg-white text-textPrimary py-5 px-8 rounded-2xl font-black text-lg hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] transition-all"
                      >
                        {t('schemeDetails.visitSite')}
                        <FaExternalLinkAlt className="text-sm" />
                      </motion.a>
                    </motion.div>
                  </section>
                </div>
              </div>

              <section className="space-y-10">
                <div className="flex items-center gap-4 text-primary">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                    <FaFileAlt className="text-2xl" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{t('schemeDetails.documents')}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {scheme.documents_required?.map((doc, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -5, borderColor: '#5B3F8C' }}
                      className="flex items-center gap-5 p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                        <FaCheckCircle className="text-xl" />
                      </div>
                      <span className="text-textPrimary font-black text-lg leading-tight tracking-tight">{t(`docs.${doc}`, doc)}</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section className="space-y-12 pb-24">
                <div className="flex items-center gap-4 text-primary">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                    <FaClipboardList className="text-2xl" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{t('schemeDetails.howToApply')}</h3>
                </div>
                
                <div className="relative pl-12 md:pl-20 space-y-16 before:absolute before:left-[23px] md:before:left-[39px] before:top-4 before:bottom-4 before:w-[4px] before:bg-gradient-to-b before:from-primary before:via-primary/50 before:to-transparent">
                  {scheme.application_steps?.map((step, index) => (
                    <motion.div 
                      key={index} 
                      className="relative group"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                    >
                      <div className="absolute -left-[45px] md:-left-[69px] top-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white border-[4px] border-primary z-10 flex items-center justify-center shadow-xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <span className="text-xl md:text-3xl font-black leading-none">{index + 1}</span>
                      </div>
                      <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm group-hover:shadow-2xl group-hover:border-primary/20 transition-all">
                        <p className="text-textPrimary font-bold text-xl md:text-3xl leading-tight tracking-tight">{t(step)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-8 md:p-12 bg-white flex-shrink-0 flex justify-end border-t border-gray-100 relative z-20">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full md:w-auto bg-textPrimary text-white px-16 py-6 rounded-[2rem] font-black text-xl hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] transition-all"
              >
                {t('schemeDetails.close')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


export default SchemeDetailModal;
