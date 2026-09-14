import React, { useState, useEffect } from 'react';
import { SPOT_ERRORS_QUESTIONS } from '../data/mockData';
import { MCQQuestion } from '../types';

interface PracticeDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteDrill?: () => void;
}

export const PracticeDrillModal: React.FC<PracticeDrillModalProps> = ({
  isOpen,
  onClose,
  onCompleteDrill,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1200); // 20 minutes
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen || isFinished) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isFinished]);

  if (!isOpen) return null;

  const currentQ: MCQQuestion = SPOT_ERRORS_QUESTIONS[currentIdx];
  const totalQs = SPOT_ERRORS_QUESTIONS.length;

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleSelectOption = (optId: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQ.id]: optId,
    });
  };

  const toggleMarkReview = () => {
    setMarkedForReview({
      ...markedForReview,
      [currentQ.id]: !markedForReview[currentQ.id],
    });
  };

  const handleFinish = () => {
    setIsFinished(true);
    if (onCompleteDrill) onCompleteDrill();
  };

  // Calculate score
  let correctCount = 0;
  let answeredCount = 0;
  SPOT_ERRORS_QUESTIONS.forEach((q) => {
    if (selectedOptions[q.id]) {
      answeredCount++;
      if (selectedOptions[q.id] === q.correctOptionId) {
        correctCount++;
      }
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#000922]/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div 
        className="w-full max-w-5xl bg-[#ffffff] dark:bg-[#0c1527] rounded-2xl shadow-2xl border border-[#e5eeff] dark:border-[#1a2942] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CBT Topbar */}
        <div className="px-6 py-3.5 bg-[#000922] text-white flex items-center justify-between border-b border-[#1a2942]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0f2042] flex items-center justify-center text-[#89f5e7] border border-[#1a2942]">
              <span className="material-symbols-outlined text-[18px]">computer</span>
            </div>
            <div>
              <span className="text-[11px] font-['JetBrains_Mono'] uppercase tracking-wider text-[#7988b0] block">
                SSC CGL Tier-I CBT Simulator
              </span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-white">
                Timed Drill: 20 MCQs Spotting Errors (PYQs)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown timer */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f2042] border border-[#1a2942]">
              <span className="material-symbols-outlined text-[16px] text-[#89f5e7]">timer</span>
              <span className="font-['JetBrains_Mono'] font-bold text-[14px] text-white tracking-wider">
                {timeString}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#7988b0] hover:text-white hover:bg-[#1a2942] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Finished Scorecard View */}
        {isFinished ? (
          <div className="p-8 flex flex-col items-center justify-center text-center gap-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#002622] text-[#19988c] flex items-center justify-center text-3xl font-bold border border-[#6bd8cb]">
              <span className="material-symbols-outlined text-[36px]">military_tech</span>
            </div>

            <div>
              <span className="text-[12px] font-bold font-['JetBrains_Mono'] text-[#19988c] uppercase tracking-wider">
                Sectional Diagnostic Complete
              </span>
              <h3 className="text-[26px] font-['Plus_Jakarta_Sans'] font-bold text-[#000922] dark:text-[#f8f9ff] mt-1">
                Drill Performance Summary
              </h3>
              <p className="text-[14px] text-[#515f74] dark:text-[#94a3b8] max-w-md mt-1">
                Great work, Danish! Consistent drill attempts sharpen proximity detection under exam stress.
              </p>
            </div>

            {/* Metric Score Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-xl">
              <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942]">
                <span className="text-[11px] text-[#515f74] uppercase font-semibold">Total Questions</span>
                <div className="text-[22px] font-bold font-['JetBrains_Mono'] text-[#000922] dark:text-[#f8f9ff]">{totalQs}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942]">
                <span className="text-[11px] text-[#515f74] uppercase font-semibold">Attempted</span>
                <div className="text-[22px] font-bold font-['JetBrains_Mono'] text-[#000922] dark:text-[#f8f9ff]">{answeredCount}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#89f5e7]/20 dark:bg-[#062c28] border border-[#6bd8cb] text-[#002622] dark:text-[#89f5e7]">
                <span className="text-[11px] uppercase font-semibold">Correct</span>
                <div className="text-[22px] font-bold font-['JetBrains_Mono'] text-[#19988c]">{correctCount}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942]">
                <span className="text-[11px] text-[#515f74] uppercase font-semibold">Accuracy</span>
                <div className="text-[22px] font-bold font-['JetBrains_Mono'] text-[#0f2042] dark:text-[#38bdf8]">
                  {answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsFinished(false);
                  setShowExplanation(true);
                  setCurrentIdx(0);
                }}
                className="px-5 py-2.5 rounded-lg bg-[#0f2042] text-white text-[14px] font-semibold hover:bg-[#1e3a8a] transition-colors"
              >
                Review Detailed Solutions
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-[#e5eeff] dark:border-[#1a2942] text-[14px] font-semibold text-[#0b1c30] dark:text-[#f8f9ff] hover:bg-[#eff4ff] transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Active Question CBT Canvas */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Main Question Workspace */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#e5eeff] dark:border-[#1a2942] no-scrollbar">
              <div className="flex flex-col gap-4">
                
                {/* Meta Question Info */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded font-['JetBrains_Mono'] text-[12px] font-bold bg-[#0f2042] text-white">
                      Question {currentIdx + 1} of {totalQs}
                    </span>
                    <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-semibold">
                      {currentQ.examSource}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#e5eeff] dark:bg-[#1a2942] text-[#0f2042] dark:text-[#8ea4c8]">
                    {currentQ.topic}
                  </span>
                </div>

                {/* Question Stem */}
                <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] text-[16px] font-medium text-[#0b1c30] dark:text-[#f8f9ff] leading-relaxed">
                  {currentQ.question}
                </div>

                {/* Radio Options List */}
                <div className="flex flex-col gap-2.5 mt-2">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedOptions[currentQ.id] === opt.id;
                    const isCorrect = opt.id === currentQ.correctOptionId;
                    
                    let cardClasses = 'border-[#e2e8f0] dark:border-[#1a2942] bg-white dark:bg-[#0c1527] text-[#1e293b] dark:text-[#e2e8f0] hover:bg-[#f8fafc] dark:hover:bg-[#111c30]';
                    if (isSelected && !showExplanation) {
                      cardClasses = 'border-[#0f2042] dark:border-[#38bdf8] bg-[#eff4ff] dark:bg-[#13233e] font-semibold shadow-xs';
                    } else if (showExplanation) {
                      if (isCorrect) {
                        cardClasses = 'border-[#059669] bg-[#ecfdf5] dark:bg-[#062c28] text-[#065f46] dark:text-[#89f5e7] font-semibold';
                      } else if (isSelected && !isCorrect) {
                        cardClasses = 'border-[#e11d48] bg-[#fff1f2] dark:bg-[#321215] text-[#9f1239] dark:text-[#ffdad6]';
                      }
                    }

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`min-h-[50px] px-4 py-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${cardClasses}`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-['JetBrains_Mono'] text-[12px] font-bold shrink-0 transition-colors ${
                          isSelected 
                            ? 'bg-[#0f2042] text-white' 
                            : 'bg-[#eff4ff] dark:bg-[#1a2942] text-[#515f74] dark:text-[#94a3b8]'
                        }`}>
                          {opt.id}
                        </div>
                        <span className="text-[14px] leading-snug flex-1">
                          {opt.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Panel */}
                {showExplanation && (
                  <div className="mt-2 p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] animate-in fade-in">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 text-[#059669] font-bold text-[13px]">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        <span>Official Solution &amp; SSC Rule Analysis</span>
                      </div>
                      <span className="text-[11px] font-['JetBrains_Mono'] text-[#515f74]">
                        Correct Answer: Option ({currentQ.correctOptionId})
                      </span>
                    </div>
                    <p className="text-[13px] text-[#0b1c30] dark:text-[#e2e8f0] leading-relaxed">
                      {currentQ.explanation}
                    </p>
                    {currentQ.ruleAnchor && (
                      <div className="mt-2 inline-block px-2.5 py-1 rounded bg-[#002622] text-[#19988c] font-['JetBrains_Mono'] text-[11px] font-bold">
                        {currentQ.ruleAnchor}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Nav Controller */}
              <div className="pt-6 mt-4 border-t border-[#e5eeff] dark:border-[#1a2942] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMarkReview}
                    className={`px-3 py-2 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-colors ${
                      markedForReview[currentQ.id]
                        ? 'bg-[#7c3aed] text-white'
                        : 'border border-[#e2e8f0] dark:border-[#1a2942] text-[#515f74] dark:text-[#b9c7df] hover:bg-[#eff4ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">bookmark_border</span>
                    <span>{markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}</span>
                  </button>

                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="px-3 py-2 rounded-lg border border-[#e2e8f0] dark:border-[#1a2942] text-[12px] font-semibold text-[#515f74] dark:text-[#b9c7df] hover:bg-[#eff4ff] flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                    <span>{showExplanation ? 'Hide Explanation' : 'View Explanation'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx(currentIdx - 1)}
                    className="px-3.5 py-2 rounded-lg border border-[#e2e8f0] dark:border-[#1a2942] text-[13px] font-semibold text-[#515f74] dark:text-[#b9c7df] disabled:opacity-30"
                  >
                    Previous
                  </button>

                  {currentIdx < totalQs - 1 ? (
                    <button
                      onClick={() => setCurrentIdx(currentIdx + 1)}
                      className="px-4 py-2 rounded-lg bg-[#0f2042] text-white text-[13px] font-semibold hover:bg-[#1e3a8a] transition-colors flex items-center gap-1"
                    >
                      <span>Save &amp; Next</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleFinish}
                      className="px-5 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-[13px] font-bold transition-colors shadow-xs"
                    >
                      Submit Exam Drill
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Question Palette (CBT Grid) */}
            <div className="w-full md:w-72 bg-[#eff4ff]/60 dark:bg-[#070e1c] p-5 flex flex-col justify-between border-t md:border-t-0">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#000922] dark:text-[#f8f9ff] block mb-3">
                  Question Palette
                </span>

                {/* 5-column palette button array */}
                <div className="grid grid-cols-5 gap-2">
                  {SPOT_ERRORS_QUESTIONS.map((q, idx) => {
                    const isAnswered = !!selectedOptions[q.id];
                    const isMarked = !!markedForReview[q.id];
                    const isCurrent = currentIdx === idx;

                    let btnStyle = 'bg-white dark:bg-[#111c30] text-[#475569] dark:text-[#94a3b8] border border-[#e2e8f0] dark:border-[#1a2942]';
                    if (isMarked) {
                      btnStyle = 'bg-[#7c3aed] text-white font-bold';
                    } else if (isAnswered) {
                      btnStyle = 'bg-[#059669] text-white font-bold';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIdx(idx)}
                        className={`h-9 rounded-md font-['JetBrains_Mono'] text-[12px] flex items-center justify-center transition-all ${btnStyle} ${
                          isCurrent ? 'ring-2 ring-[#0f2042] dark:ring-[#38bdf8] scale-105' : ''
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Palette Legend */}
                <div className="mt-6 flex flex-col gap-2 text-[11px] text-[#515f74] dark:text-[#94a3b8]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-[#059669]"></span>
                    <span>Answered ({Object.keys(selectedOptions).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-[#7c3aed]"></span>
                    <span>Marked for Review ({Object.values(markedForReview).filter(Boolean).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-white dark:bg-[#111c30] border border-[#e2e8f0]"></span>
                    <span>Not Visited</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#e5eeff] dark:border-[#1a2942]">
                <button
                  onClick={handleFinish}
                  className="w-full py-2.5 rounded-lg bg-[#000922] dark:bg-[#1e293b] text-white text-[13px] font-bold hover:bg-[#0f2042] transition-colors"
                >
                  End &amp; View Analysis
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
