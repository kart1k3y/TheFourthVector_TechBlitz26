import React, { useState, useMemo, useEffect } from 'react';
import { FaArrowLeft, FaCheckCircle, FaChevronRight, FaInfoCircle } from 'react-icons/fa';
import questionsData from '../data/questions.json';
import schemesData from '../data/schemes.json';
import { useTranslation } from 'react-i18next';

const EligibilityFlow = ({ onBack }) => {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState({});
  const [currentTile, setCurrentTile] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTile, isFinished]);

  // Compute the current visible questions based on the answers and currentTile
  const { visibleQuestions, nextTileFirstNode, canProceed } = useMemo(() => {
    let currentId = questionsData.start_question;
    const visible = [];
    let nextFirstNode = null;
    let proceed = false;

    while (currentId && currentId !== 'RESULTS') {
      const q = questionsData.questions[currentId];
      if (!q) break;

      // Special dynamic skips based on previous answers to make it "intelligent"
      let skipQuestion = false;

      if (currentId === 'Q12' || currentId === 'Q13') {
        // If household size is 1, they don't have children or girl children to ask about
        if (answers['Q11'] === '1') {
          skipQuestion = true;
          // Dynamically route past this node directly to Q14
          currentId = q.next || 'Q14';
          continue; // Skip processing this question and move to the next iteration
        }
      }

      if (q.tile === currentTile && !skipQuestion) {
        visible.push({ id: currentId, ...q });
      } else if (q.tile > currentTile) {
        nextFirstNode = currentId;
        proceed = true;
        break;
      }

      const answer = answers[currentId];
      if (!answer && !skipQuestion) {
        proceed = false;
        break;
      }

      let nextNode = q.next; // Default next (if generic)
      // If it has options with specific next routing
      if (q.type === 'single_select' && q.options && !skipQuestion) {
        const option = q.options.find(opt => opt.value === answer);
        if (option && option.next) {
          nextNode = option.next;
        }
      }

      currentId = nextNode;
      if (currentId === 'RESULTS') {
        proceed = true;
      }
    }

    return { visibleQuestions: visible, nextTileFirstNode: nextFirstNode, canProceed: proceed };
  }, [answers, currentTile]);

  const handleAnswer = (qId, value, type) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };

      if (type === 'multi_select') {
        let currentArr = newAnswers[qId] || [];
        if (value === 'none') {
          currentArr = ['none'];
        } else {
          currentArr = currentArr.filter(v => v !== 'none');
          if (currentArr.includes(value)) {
            currentArr = currentArr.filter(v => v !== value);
          } else {
            currentArr.push(value);
          }
        }
        newAnswers[qId] = currentArr;
        if (currentArr.length === 0) delete newAnswers[qId];
      } else {
        newAnswers[qId] = value;
      }
      return newAnswers;
    });
  };

  const calculateResults = () => {
    // Helper: check if a user's answer matches a scheme rule value
    const doesMatch = (userAnswer, ruleValue) => {
      if (Array.isArray(ruleValue)) {
        return ruleValue.includes(userAnswer);
      }
      return userAnswer === ruleValue;
    };

    // Helper: find the question ID for a given field name
    const findQuestionId = (field) => {
      return Object.keys(questionsData.questions).find(
        qId => questionsData.questions[qId].field === field
      );
    };

    // HARD BLOCKERS: If the user answered these and they don't match, reject the scheme instantly.
    // This prevents male users from seeing women-only schemes, users with no children from seeing child schemes, etc.
    const hardBlockerFields = [
      'gender', 'age_group', 'occupation', 'girl_child', 
      'children_under10', 'residence', 'interest', 'bank_account'
    ];

    return schemesData.schemes.filter(scheme => {
      if (!scheme.eligibility) return true;

      // ── Phase 1: Hard blockers ──
      for (const field of hardBlockerFields) {
        const ruleValue = scheme.eligibility[field];
        if (ruleValue === undefined) continue; // scheme doesn't care about this field

        const questionId = findQuestionId(field);
        if (!questionId) continue; // field not in questionnaire

        const userAnswer = answers[questionId];
        if (userAnswer === undefined || userAnswer === null || userAnswer === '') continue; // user didn't answer → skip, don't block

        if (!doesMatch(userAnswer, ruleValue)) {
          return false; // HARD REJECT — user answered and it doesn't match
        }
      }

      // ── Phase 2: Soft scoring for remaining fields ──
      const softFields = Object.keys(scheme.eligibility).filter(
        k => !hardBlockerFields.includes(k)
      );

      if (softFields.length === 0) return true; // all rules were hard-blockers and they passed

      let softMatch = 0;
      let softFail = 0;
      let softAnswered = 0;

      for (const key of softFields) {
        const ruleValue = scheme.eligibility[key];

        if (key === 'documents') {
          // documents field is special (multi_select)
          const docQId = findQuestionId('documents');
          if (docQId) {
            const docAnswer = answers[docQId];
            if (docAnswer !== undefined) {
              softAnswered++;
              const userDocs = docAnswer || [];
              if (ruleValue.every(reqDoc => userDocs.includes(reqDoc))) {
                softMatch++;
              } else {
                softFail++;
              }
            }
          }
          continue;
        }

        const questionId = findQuestionId(key);
        if (!questionId) continue;

        const userAnswer = answers[questionId];
        if (userAnswer === undefined || userAnswer === null || userAnswer === '') continue;

        softAnswered++;
        if (doesMatch(userAnswer, ruleValue)) {
          softMatch++;
        } else {
          softFail++;
        }
      }

      // If user answered at least one soft field, require majority match
      if (softAnswered > 0) {
        return softMatch >= softFail;
      }

      return true; // no soft fields were answered, hard blockers already passed
    });
  };

  const proceedNext = () => {
    const lastAnswered = visibleQuestions[visibleQuestions.length - 1];
    let nextNode = lastAnswered.next;

    // For single_select it may have specific routing on the selected option
    if (lastAnswered.type === 'single_select' && lastAnswered.options) {
      const option = lastAnswered.options.find(opt => opt.value === answers[lastAnswered.id]);
      if (option && option.next) nextNode = option.next;
    }

    if (nextNode === 'RESULTS') {
      setIsFinished(true);
    } else {
      setCurrentTile(currentTile + 1);
    }
  };

  if (isFinished) {
    const results = calculateResults();
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 z-50 relative">
        <div key="results" className="w-full max-w-3xl flow-enter">
          <button onClick={() => setIsFinished(false)} className="text-primary flex items-center mb-6 hover:underline font-semibold flow-enter-child" style={{ '--child-i': 0 }}>
            <FaArrowLeft className="mr-2" /> Back to questions
          </button>

          <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-100 mb-8 flow-enter-child" style={{ '--child-i': 1 }}>
            <div className="flex items-center space-x-4 mb-6">
              <FaCheckCircle className="text-4xl text-green-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-textPrimary">{t('eligibility.titleResults')}</h2>
            </div>
            <p className="text-textSecondary mb-8 text-lg">{t('eligibility.resultsFound', { count: results.length })}</p>

            <div className="space-y-6">
              {results.map((scheme, i) => (
                <div key={scheme.id} className="p-6 border border-gray-100 rounded-xl bg-gray-50 hover:shadow-md transition-shadow flow-enter-child" style={{ '--child-i': i + 2 }}>
                  <span className="text-sm font-bold text-primary bg-indigo-50 px-3 py-1 rounded-full mb-3 inline-block">{t(scheme.scheme_category)}</span>
                  <h3 className="text-xl font-bold mb-2">{t(scheme.scheme_name)}</h3>
                  <p className="text-textSecondary mb-4 text-sm">{t(scheme.scheme_benefit)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10 flow-enter-child" style={{ '--child-i': results.length + 2 }}>
            <button onClick={onBack} className="bg-textPrimary text-white px-8 py-3 rounded-xl font-semibold hover:bg-black transition-colors">
              {t('eligibility.returnHome')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 z-50 relative">
      {/* key forces React to fully unmount/remount this div when tile changes, guaranteeing CSS animations re-trigger */}
      <div key={`tile-${currentTile}`} className="w-full max-w-2xl flow-enter">
        <div className="flex items-center justify-between mb-8 flow-enter-child" style={{ '--child-i': 0 }}>
          <button
            onClick={() => {
              if (currentTile > 1) setCurrentTile(currentTile - 1);
              else onBack();
            }}
            className="text-textSecondary hover:text-textPrimary flex items-center font-medium transition-colors"
          >
            <FaArrowLeft className="mr-2" /> {t('eligibility.back')}
          </button>
          <div className="text-sm font-semibold text-primary bg-indigo-50 px-4 py-1.5 rounded-full">
            {t('eligibility.step', { current: currentTile, total: 6 })}
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-lg border border-gray-100 flow-enter-child" style={{ '--child-i': 1 }}>
          <div className="mb-8 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all duration-300" style={{ width: `${(currentTile / 6) * 100}%` }}></div>
          </div>

          <div className="space-y-10">
            {visibleQuestions.map((q, idx) => {
              const isActive = idx === visibleQuestions.length - 1;
              return (
                <div key={q.id} className={`transition-opacity duration-300 ${!isActive ? 'opacity-60' : 'opacity-100'}`}>
                  <div className="flex items-center gap-2 mb-6 relative z-10">
                    <h3 className="text-xl md:text-2xl font-bold text-textPrimary">{t(q.question_title)}</h3>
                    {q.field === 'bpl' && (
                      <div className="group relative flex items-center justify-center cursor-help">
                        <FaInfoCircle className="text-gray-400 hover:text-primary transition-colors text-lg" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs text-center p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl pointer-events-none z-50">
                          Below poverty line
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {q.type === 'dropdown' ? (
                    <select
                      className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:border-primary focus:ring-0 outline-none transition-colors"
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswer(q.id, e.target.value, 'dropdown')}
                    >
                      <option value="" disabled>{t('eligibility.selectOption')}</option>
                      {q.options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {t(opt.option_label)}
                        </option>
                      ))}
                    </select>
                  ) : q.type === 'text' ? (
                    <input
                      type="text"
                      className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:border-primary focus:ring-0 outline-none transition-colors"
                      placeholder={t('eligibility.enterAnswer')}
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswer(q.id, e.target.value, 'text')}
                    />
                  ) : q.type === 'multi_select' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map(opt => {
                        const isSelected = (answers[q.id] || []).includes(opt.value);
                        return (
                          <button
                            key={opt.value}
                            onClick={() => handleAnswer(q.id, opt.value, 'multi_select')}
                            className={`p-4 border-2 rounded-xl text-left font-semibold transition-all ${isSelected
                              ? 'border-primary bg-indigo-50 text-primary'
                              : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50 text-textSecondary'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{t(opt.option_label)}</span>
                              <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                                {isSelected && <FaCheckCircle className="text-white text-xs" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map(opt => {
                        const isSelected = answers[q.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => handleAnswer(q.id, opt.value, 'single')}
                            className={`p-4 border-2 rounded-xl text-left font-semibold transition-all ${isSelected
                              ? 'border-primary bg-indigo-50 text-primary scale-[1.02]'
                              : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50 text-textSecondary'
                              }`}
                          >
                            {t(opt.option_label)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex justify-end flow-enter-child" style={{ '--child-i': visibleQuestions.length + 2 }}>
            <button
              disabled={!canProceed}
              onClick={proceedNext}
              className={`flex items-center px-8 py-4 rounded-xl font-bold text-lg transition-all ${canProceed
                ? 'bg-primary text-white hover:shadow-lg hover:-translate-y-1'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {t('eligibility.next')} <FaChevronRight className="ml-2" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EligibilityFlow;
