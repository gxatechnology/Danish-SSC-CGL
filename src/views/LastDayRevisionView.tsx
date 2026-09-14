import React, { useState } from 'react';
import { GRAMMAR_RULES } from '../content/grammarRules';
import { MATH_FORMULAS } from '../content/formulas';
import { VOCABULARY_DATA } from '../content/vocabulary';
import { MathFormula } from '../components/MathFormula';

export const LastDayRevisionView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'english' | 'maths'>('english');

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#e11d48] text-white font-mono text-[11px] font-bold uppercase tracking-wider">
              24-Hour Pre-Exam Calibration
            </span>
            <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-mono">
              Zero Cognitive Fatigue
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#000922] dark:text-[#f8f9ff]">
            Last-Day Rapid Revision Sheet
          </h1>
          <p className="font-['Inter'] text-[15px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
            Ultra-condensed formula sheets, high-trap grammar rules, and root words for non-stop speed recall.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942]">
          <button
            onClick={() => setActiveTab('english')}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold cursor-pointer transition-colors ${
              activeTab === 'english'
                ? 'bg-[#0f2042] text-white shadow-xs'
                : 'text-[#515f74] hover:text-[#0f2042]'
            }`}
          >
            English Rapid Deck
          </button>
          <button
            onClick={() => setActiveTab('maths')}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold cursor-pointer transition-colors ${
              activeTab === 'maths'
                ? 'bg-[#0f2042] text-white shadow-xs'
                : 'text-[#515f74] hover:text-[#0f2042]'
            }`}
          >
            Maths Formula Deck
          </button>
        </div>
      </div>

      {/* English Rapid Deck */}
      {activeTab === 'english' && (
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-4">
            <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#000922] dark:text-[#f8f9ff] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
              <span>10 High-Trap SSC Grammar Rules</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GRAMMAR_RULES.slice(0, 8).map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex flex-col gap-2"
                >
                  <span className="text-[11px] font-mono font-bold text-[#0f2042] dark:text-[#8ea4c8]">
                    Rule {rule.ruleNumber}: {rule.title}
                  </span>
                  <p className="text-[13px] font-medium text-[#000922] dark:text-[#e2e8f0]">
                    {rule.statement}
                  </p>
                  <div className="text-[12px] text-[#ba1a1a] dark:text-[#f87171] italic">
                    Trap: {rule.frequentExamTrap}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-4">
            <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#000922] dark:text-[#f8f9ff] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
              <span>High-Frequency BlackBook Vocabulary Quick Glances</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {VOCABULARY_DATA.slice(0, 9).map((v) => (
                <div
                  key={v.id}
                  className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[14px] text-[#000922] dark:text-[#f8f9ff]">
                      {v.word}
                    </span>
                    <span className="text-[10px] font-mono text-[#515f74]">
                      {v.type}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8]">
                    {v.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Maths Formula Deck */}
      {activeTab === 'maths' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MATH_FORMULAS.map((formula) => (
              <div
                key={formula.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-[#0f2042] dark:text-[#8ea4c8]">
                    {formula.category} • {formula.topic}
                  </span>
                </div>
                <h4 className="font-bold text-[16px] text-[#000922] dark:text-[#f8f9ff]">
                  {formula.title}
                </h4>
                <div className="p-3 rounded-xl bg-[#000922] text-[#89f5e7]">
                  <MathFormula math={formula.latex} block />
                </div>
                <div className="text-[12px] text-[#ba1a1a] dark:text-[#f87171]">
                  <strong>Trap:</strong> {formula.commonTrap}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
