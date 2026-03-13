import React, { useState, useMemo, useEffect } from 'react';
import { FaArrowLeft, FaCheckCircle, FaChevronRight } from 'react-icons/fa';
import questionsData from '../data/questions.json';
import schemesData from '../data/schemes.json';

const EligibilityFlow = ({ onBack }) => {
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

      if (q.tile === currentTile) {
        visible.push({ id: currentId, ...q });
      } else if (q.tile > currentTile) {
        nextFirstNode = currentId;
        proceed = true;
        break;
      } else if (q.tile < currentTile) {
        // We should skip this question and find the next one
      }

      const answer = answers[currentId];
      if (!answer) {
        proceed = false;
        break;
      }

      let nextNode = q.next; // Default next (if generic)
      // If it has options with specific next routing
      if (q.options && !q.type) {
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
    return schemesData.schemes.filter(scheme => {
      // Very basic eligibility matching block for demonstration
      return true; // Return all for now, as logic dictates specific fields we need an intensive filter
    });
  };

  const proceedNext = () => {
    const lastAnswered = visibleQuestions[visibleQuestions.length - 1];
    let nextNode = lastAnswered.next;
    if (lastAnswered.options && !lastAnswered.type) {
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
        <div className="w-full max-w-3xl">
          <button onClick={() => setIsFinished(false)} className="text-primary flex items-center mb-6 hover:underline font-semibold">
            <FaArrowLeft className="mr-2" /> Back to questions
          </button>
          
          <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-100 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <FaCheckCircle className="text-4xl text-green-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-textPrimary">Here are your eligible schemes</h2>
            </div>
            <p className="text-textSecondary mb-8 text-lg">Based on your answers, we found {results.length} schemes you might be eligible for.</p>

            <div className="space-y-6">
              {results.map(scheme => (
                <div key={scheme.id} className="p-6 border border-gray-100 rounded-xl bg-gray-50 hover:shadow-md transition-shadow">
                  <span className="text-sm font-bold text-primary bg-indigo-50 px-3 py-1 rounded-full mb-3 inline-block">{scheme.category}</span>
                  <h3 className="text-xl font-bold mb-2">{scheme.name}</h3>
                  <p className="text-textSecondary mb-4 text-sm">{scheme.benefit}</p>
                  {scheme.notes && <p className="text-xs text-gray-400">Note: {scheme.notes}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <button onClick={onBack} className="bg-textPrimary text-white px-8 py-3 rounded-xl font-semibold hover:bg-black transition-colors">
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 z-50 relative">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => {
              if (currentTile > 1) setCurrentTile(currentTile - 1);
              else onBack();
            }} 
            className="text-textSecondary hover:text-textPrimary flex items-center font-medium transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <div className="text-sm font-semibold text-primary bg-indigo-50 px-4 py-1.5 rounded-full">
            Step {currentTile} of 9
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-lg border border-gray-100">
          <div className="mb-8 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all duration-300" style={{ width: `${(currentTile / 9) * 100}%` }}></div>
          </div>

          <div className="space-y-10">
            {visibleQuestions.map((q, idx) => {
              const isActive = idx === visibleQuestions.length - 1; // Highlight the active interactive question
              return (
                <div key={q.id} className={`transition-opacity duration-300 ${!isActive ? 'opacity-60' : 'opacity-100'}`}>
                  <h3 className="text-xl md:text-2xl font-bold text-textPrimary mb-6">{q.text}</h3>
                  
                  {q.type === 'dropdown' ? (
                    <select 
                      className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:border-primary focus:ring-0 outline-none transition-colors"
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswer(q.id, e.target.value, 'dropdown')}
                    >
                      <option value="" disabled>Select an option</option>
                      <option value="state_1">Option 1</option>
                      <option value="state_2">Option 2</option>
                      <option value="state_3">Option 3</option>
                    </select>
                  ) : q.type === 'multi_select' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map(opt => {
                        const isSelected = (answers[q.id] || []).includes(opt.value || opt);
                        return (
                          <button
                            key={opt.value || opt}
                            onClick={() => handleAnswer(q.id, opt.value || opt, 'multi_select')}
                            className={`p-4 border-2 rounded-xl text-left font-semibold transition-all ${
                              isSelected 
                                ? 'border-primary bg-indigo-50 text-primary' 
                                : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50 text-textSecondary'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{opt.label || opt}</span>
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
                            className={`p-4 border-2 rounded-xl text-left font-semibold transition-all ${
                              isSelected 
                                ? 'border-primary bg-indigo-50 text-primary scale-[1.02]' 
                                : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50 text-textSecondary'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex justify-end">
            <button 
              disabled={!canProceed}
              onClick={proceedNext}
              className={`flex items-center px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                canProceed 
                  ? 'bg-primary text-white hover:shadow-lg hover:-translate-y-1' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next <FaChevronRight className="ml-2" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EligibilityFlow;
