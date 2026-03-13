import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  FaArrowLeft,
  FaCheckCircle, 
  FaFileAlt, 
  FaExternalLinkAlt, 
  FaInfoCircle, 
  FaClipboardList,
  FaShareAlt
} from 'react-icons/fa';

const SchemeDetailView = ({ scheme, onBack }) => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [scheme]);

  if (!scheme) return null;

  const renderEligibility = () => {
    if (!scheme.eligibility) return null;
    
    return (
      <section className="space-y-8">
        <div className="flex items-center gap-4 text-primary">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
            <FaCheckCircle className="text-2xl" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{t('schemeDetails.eligibility')}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                whileHover={{ y: -5 }}
                className="bg-gray-50/50 p-6 md:p-8 rounded-[2rem] border border-gray-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl transition-all"
              >
                <p className="text-xs font-black text-gray-400 uppercase mb-3 tracking-[0.2em]">{label}</p>
                <p className="text-textPrimary font-bold text-xl md:text-2xl">{displayValue}</p>
              </motion.div>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Dynamic Header/Hero */}
      <div className="relative h-[40vh] md:h-[50vh] bg-textPrimary overflow-hidden flex items-end">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -ml-48 -mb-48" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-textPrimary via-textPrimary/40 to-transparent" />
        
        <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 pb-12 md:pb-20">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-10 group transition-colors"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold uppercase tracking-widest text-sm">{t('eligibility.back')}</span>
          </motion.button>
          
          <div className="space-y-6">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-5 py-2 rounded-full text-[11px] font-black tracking-[0.3em] uppercase bg-primary text-white shadow-2xl shadow-primary/40"
            >
              {t(scheme.scheme_category)}
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter"
            >
              {t(scheme.scheme_name)}
            </motion.h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-10 md:-mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          
          {/* Left Column: Core Details */}
          <div className="lg:col-span-12 space-y-24">
            
            {/* Overview Section */}
            <section className="space-y-10">
              <div className="flex items-center gap-4 text-primary">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                  <FaInfoCircle className="text-2xl" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{t('schemeDetails.overview')}</h3>
              </div>
              <p className="text-textSecondary text-xl md:text-3xl leading-[1.6] font-medium max-w-5xl">
                {t(scheme.scheme_benefit)}
              </p>
            </section>

            {/* Eligibility Grid */}
            {renderEligibility()}

            {/* Official Website CTA */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-textPrimary to-indigo-950 p-10 md:p-16 rounded-[3rem] text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="max-w-2xl text-center md:text-left">
                  <h3 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter">{t('schemeDetails.officialWebsite')}</h3>
                  <p className="text-indigo-100/70 text-lg md:text-xl font-medium leading-relaxed">
                    {t('schemeDetails.websiteInfo')}
                  </p>
                </div>
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={scheme.official_link || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full md:w-auto flex items-center justify-center gap-4 bg-white text-textPrimary py-6 px-12 rounded-3xl font-black text-xl hover:shadow-[0_30px_60px_-10px_rgba(255,255,255,0.4)] transition-all whitespace-nowrap"
                >
                  {t('schemeDetails.visitSite')}
                  <FaExternalLinkAlt className="text-sm" />
                </motion.a>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-20 md:gap-32">
              {/* Documents Required */}
              <section className="space-y-12">
                <div className="flex items-center gap-4 text-primary">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                    <FaFileAlt className="text-2xl" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{t('schemeDetails.documents')}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {scheme.documents_required?.map((doc, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-5 p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl transition-all group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                        <FaCheckCircle className="text-xl" />
                      </div>
                      <span className="text-textPrimary font-black text-xl leading-tight tracking-tight">{t(`docs.${doc}`, doc)}</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Application Steps */}
              <section className="space-y-12">
                <div className="flex items-center gap-4 text-primary">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                    <FaClipboardList className="text-2xl" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{t('schemeDetails.howToApply')}</h3>
                </div>
                
                <div className="relative pl-12 md:pl-20 space-y-16 before:absolute before:left-[23px] md:before:left-[39px] before:top-4 before:bottom-4 before:w-[4px] before:bg-gradient-to-b before:from-primary before:via-primary/50 before:to-transparent">
                  {scheme.application_steps?.map((step, index) => (
                    <motion.div 
                      key={index} 
                      className="relative group"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                    >
                      <div className="absolute -left-[45px] md:-left-[69px] top-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-textPrimary text-white shadow-xl group-hover:bg-primary transition-all duration-300 flex items-center justify-center">
                        <span className="text-xl md:text-3xl font-black leading-none">{index + 1}</span>
                      </div>
                      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm group-hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] group-hover:border-primary/20 transition-all">
                        <p className="text-textPrimary font-bold text-xl md:text-3xl leading-tight tracking-tight">{step}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>

            {/* Footer Back Button */}
            <div className="pt-20 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="bg-primary text-white px-20 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-4"
              >
                <FaArrowLeft />
                {t('eligibility.back')}
              </motion.button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetailView;
