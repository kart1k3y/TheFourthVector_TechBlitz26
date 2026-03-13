import React, { useEffect } from 'react';
import { FaArrowLeft, FaChevronRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import schemesData from '../data/schemes.json';

// Map icon categories to scheme categories (English values as they appear in en/translation.json)
const CATEGORY_MAP = {
  Finance: ['Financial Inclusion', 'Business / Startup', 'Pension / Social Security', 'Financial'],
  Education: ['Education', 'Employment / Skill'],
  Agriculture: ['Agriculture', 'Farming'],
  Health: ['Health', 'Healthcare'],
  Women: ['Women', 'Women & Child Welfare'],
};

const CATEGORY_COLORS = {
  Finance: { bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
  Education: { bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
  Agriculture: { bg: 'bg-green-50', badge: 'bg-green-100 text-green-700', border: 'border-green-200' },
  Health: { bg: 'bg-rose-50', badge: 'bg-rose-100 text-rose-700', border: 'border-rose-200' },
  Women: { bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700', border: 'border-purple-200' },
};

const CategorySchemes = ({ category, icon, onBack, onSchemeSelect }) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schemeCategories = CATEGORY_MAP[category] || [];
  
  // Filter schemes by checking their English category name against the map
  const schemes = schemesData.schemes.filter(s => {
    const englishCategory = i18n.t(s.scheme_category, { lng: 'en' });
    return schemeCategories.includes(englishCategory);
  });

  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.Finance;
  const translatedCategory = t(`categories.${category}`);

  return (
    <div className="min-h-screen bg-gray-50 z-50 relative">
      {/* Header */}
      <div key={`cat-${category}`} className="flow-enter">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={onBack}
              className="flow-enter-child text-textSecondary hover:text-textPrimary transition-colors"
              style={{ '--child-i': 0 }}
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <div className="flow-enter-child flex items-center gap-3" style={{ '--child-i': 1 }}>
              {icon && (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center">
                  <img src={icon} alt={translatedCategory} className="w-6 h-6 md:w-7 md:h-7 object-contain" />
                </div>
              )}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-textPrimary">
                  {t('categoryView.title', { category: translatedCategory })}
                </h1>
                <p className="text-sm text-textSecondary">
                  {t('categoryView.count', { count: schemes.length })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scheme cards */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {schemes.map((scheme, i) => (
              <div
                key={scheme.id}
                onClick={() => onSchemeSelect(scheme)}
                className={`flow-enter-child bg-white p-5 md:p-7 rounded-2xl shadow-sm border ${colors.border} hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group flex flex-col`}
                style={{ '--child-i': i + 2 }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg md:text-xl font-bold text-textPrimary leading-snug group-hover:text-primary transition-colors">
                    {t(scheme.scheme_name)}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full ${colors.badge}`}>
                      {t(scheme.scheme_category)}
                    </span>
                    <FaChevronRight className="text-gray-300 group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <p className="text-textSecondary text-sm md:text-base leading-relaxed">
                  {t(scheme.scheme_benefit)}
                </p>
                {scheme.notes && (
                  <p className="text-xs text-gray-400 mt-2">{t('categoryView.note')}: {scheme.notes}</p>
                )}
              </div>
            ))}
          </div>


          {schemes.length === 0 && (
            <div className="flow-enter-child text-center py-20" style={{ '--child-i': 2 }}>
              <p className="text-textSecondary text-lg">{t('categoryView.noFound')}</p>
            </div>
          )}

          <div className="flow-enter-child text-center mt-12 pb-8" style={{ '--child-i': schemes.length + 3 }}>
            <button
              onClick={onBack}
              className="bg-textPrimary text-white px-8 py-3 rounded-xl font-semibold hover:bg-black transition-colors"
            >
              ← {t('categoryView.backToHome')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySchemes;
