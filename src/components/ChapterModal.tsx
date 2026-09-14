import React, { useState } from 'react';
import { SUBJECT_VERB_RULES } from '../data/mockData';

interface ChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDrill: () => void;
}

export const ChapterModal: React.FC<ChapterModalProps> = ({
  isOpen,
  onClose,
  onStartDrill,
}) => {
  const [completedRules, setCompletedRules] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [activeRuleTab, setActiveRuleTab] = useState<number>(7);

  if (!isOpen) return null;

  const toggleRuleCompletion = (num: number) => {
    if (completedRules.includes(num)) {
      setCompletedRules(completedRules.filter((n) => n !== num));
    } else {
      setCompletedRules([...completedRules, num]);
    }
  };

  const activeRule = SUBJECT_VERB_RULES.find((r) => r.number === activeRuleTab) || SUBJECT_VERB_RULES[6];
  const progressPercent = Math.round((completedRules.length / 9) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#000922]/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-[#ffffff] dark:bg-[#0c1527] rounded-2xl shadow-2xl border border-[#e5eeff] dark:border-[#1a2942] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#eff4ff] dark:bg-[#111c30] border-b border-[#e5eeff] dark:border-[#1a2942] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f2042] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">menu_book</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Inter'] text-[11px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-[#0f2042] text-white">
                  CGL Tier-I &amp; Tier-II
                </span>
                <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-['JetBrains_Mono']">
                  Chapter 01
                </span>
              </div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                Subject–Verb Agreement (Mastery Module)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#515f74] dark:text-[#94a3b8] hover:bg-[#dce9ff] dark:hover:bg-[#1a2942] transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Progress Bar & Status Bar */}
        <div className="px-6 py-3 bg-[#ffffff] dark:bg-[#0c1527] border-b border-[#e5eeff] dark:border-[#1a2942] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-[12px] mb-1">
              <span className="font-semibold text-[#0b1c30] dark:text-[#e2e8f0]">
                Module Completion Status
              </span>
              <span className="font-['JetBrains_Mono'] font-bold text-[#0f2042] dark:text-[#89f5e7]">
                {completedRules.length} of 9 Rules ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#e5eeff] dark:bg-[#1a2942] overflow-hidden">
              <div 
                className="h-full bg-[#000922] dark:bg-[#38bdf8] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onStartDrill();
            }}
            className="px-4 py-2 rounded-lg bg-[#002622] hover:bg-[#003d36] text-[#19988c] font-bold text-[13px] flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Solve 3 Remaining MCQs</span>
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6 no-scrollbar">
          
          {/* Rules List Sidebar */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-1.5 border-b md:border-b-0 md:border-r border-[#e5eeff] dark:border-[#1a2942] pb-4 md:pb-0 md:pr-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#515f74] dark:text-[#8ea4c8] mb-1">
              9 Core SSC CGL Rules
            </span>
            {SUBJECT_VERB_RULES.map((rule) => {
              const isDone = completedRules.includes(rule.number);
              const isActive = activeRuleTab === rule.number;
              return (
                <button
                  key={rule.number}
                  onClick={() => setActiveRuleTab(rule.number)}
                  className={`p-2.5 rounded-lg text-left text-[13px] flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-[#0f2042] text-white font-bold shadow-xs'
                      : 'hover:bg-[#eff4ff] dark:hover:bg-[#111c30] text-[#0b1c30] dark:text-[#e2e8f0]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-['JetBrains_Mono'] text-[10px] font-bold ${
                      isActive ? 'bg-white text-[#0f2042]' : 'bg-[#e5eeff] dark:bg-[#1a2942] text-[#515f74] dark:text-[#b9c7df]'
                    }`}>
                      {rule.number}
                    </span>
                    <span className="truncate">{rule.title}</span>
                  </div>
                  {isDone ? (
                    <span className="material-symbols-outlined text-[16px] text-[#19988c]">check_circle</span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Rule Detailed View */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[12px] font-['JetBrains_Mono'] font-bold text-[#19988c] uppercase tracking-wider">
                  Rule 0{activeRule.number} Details
                </span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold text-[#000922] dark:text-[#f8f9ff] mt-0.5">
                  {activeRule.title}
                </h3>
              </div>

              <button
                onClick={() => toggleRuleCompletion(activeRule.number)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-colors ${
                  completedRules.includes(activeRule.number)
                    ? 'bg-[#89f5e7]/30 text-[#002622] dark:text-[#89f5e7] border border-[#6bd8cb]'
                    : 'bg-[#eff4ff] dark:bg-[#1a2942] text-[#515f74] dark:text-[#b9c7df] hover:bg-[#dce9ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {completedRules.includes(activeRule.number) ? 'check' : 'radio_button_unchecked'}
                </span>
                <span>{completedRules.includes(activeRule.number) ? 'Marked as Mastered' : 'Mark as Mastered'}</span>
              </button>
            </div>

            {/* Formula box */}
            {activeRule.formula && (
              <div className="p-3.5 rounded-xl bg-[#000922] dark:bg-[#070e1c] text-[#89f5e7] font-['JetBrains_Mono'] text-[13px] border border-[#1a2942] shadow-xs">
                <span className="text-[#7988b0] text-[11px] block uppercase font-bold tracking-wider mb-1">
                  SSC Standard Formula
                </span>
                {activeRule.formula}
              </div>
            )}

            {/* Explanation */}
            <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] text-[#0b1c30] dark:text-[#e2e8f0] text-[14px] leading-relaxed border border-[#e5eeff] dark:border-[#1a2942]">
              <span className="font-bold block text-[12px] uppercase tracking-wider text-[#515f74] dark:text-[#8ea4c8] mb-1">
                Pedagogical Analysis
              </span>
              {activeRule.explanation}
            </div>

            {/* Incorrect vs Correct comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div className="p-3.5 rounded-xl bg-[#ffdad6]/40 dark:bg-[#321215] border border-[#ffdad6] dark:border-[#521c21] flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[#ba1a1a] font-bold text-[13px]">
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                  <span>TCS Exam Trap Form</span>
                </div>
                <p className="font-['JetBrains_Mono'] text-[13px] text-[#0b1c30] dark:text-[#fecdd3] mt-1">
                  {activeRule.incorrectExample}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#89f5e7]/20 dark:bg-[#062c28] border border-[#89f5e7]/40 dark:border-[#0d5951] flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[#19988c] font-bold text-[13px]">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Corrected SSC Standard</span>
                </div>
                <p className="font-['JetBrains_Mono'] text-[13px] text-[#0b1c30] dark:text-[#a7f3d0] mt-1">
                  {activeRule.correctExample}
                </p>
              </div>
            </div>

            {/* Next / Prev Navigation */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#e5eeff] dark:border-[#1a2942]">
              <button
                disabled={activeRuleTab <= 1}
                onClick={() => setActiveRuleTab(activeRuleTab - 1)}
                className="px-3 py-1.5 rounded-lg border border-[#e5eeff] dark:border-[#1a2942] text-[13px] text-[#515f74] dark:text-[#b9c7df] disabled:opacity-30 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Previous Rule</span>
              </button>

              <button
                disabled={activeRuleTab >= 9}
                onClick={() => setActiveRuleTab(activeRuleTab + 1)}
                className="px-3 py-1.5 rounded-lg bg-[#0f2042] text-white text-[13px] font-semibold disabled:opacity-30 flex items-center gap-1"
              >
                <span>Next Rule</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
