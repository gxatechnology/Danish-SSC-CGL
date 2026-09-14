import React, { useState } from 'react';
import { GRAMMAR_RULES } from '../content/grammarRules';
import { storageService } from '../services/storageService';

interface GrammarRulesHubViewProps {
  onStartQuiz: () => void;
}

export const GrammarRulesHubView: React.FC<GrammarRulesHubViewProps> = ({ onStartQuiz }) => {
  const [activeTopic, setActiveTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showExamples, setShowExamples] = useState<boolean>(true);
  const [revisedRuleIds, setRevisedRuleIds] = useState<string[]>(() => storageService.getRevisedRuleIds());

  const topics = ['all', 'Subject–Verb Agreement', 'Inversion & Conjunctions', 'Conditionals', 'Pronouns', 'Prepositions', 'Nouns'];

  const filtered = GRAMMAR_RULES.filter((r) => {
    const matchesTopic = activeTopic === 'all' || r.topic === activeTopic;
    const matchesQuery =
      searchQuery === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesQuery;
  });

  const handleToggleRevised = (id: string) => {
    storageService.toggleRevisedRule(id);
    setRevisedRuleIds(storageService.getRevisedRuleIds());
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0f2042] text-white font-['Inter'] text-[11px] font-bold uppercase tracking-wider">
              Grammar Concord &amp; Error Detection
            </span>
            <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-['JetBrains_Mono']">
              Rule Repository
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#000922] dark:text-[#f8f9ff]">
            English Grammar Rules Hub
          </h1>
          <p className="font-['Inter'] text-[15px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
            Indexed rule database, exam traps, and correct vs incorrect syntactic contrasts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="px-4 py-2.5 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] bg-white dark:bg-[#0c1527] text-[13px] font-semibold text-[#0f2042] dark:text-[#8ea4c8] flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-[#eff4ff]"
          >
            <span className="material-symbols-outlined text-[18px]">
              {showExamples ? 'visibility_off' : 'visibility'}
            </span>
            <span>{showExamples ? 'Hide Examples' : 'Show Examples'}</span>
          </button>

          <button
            onClick={onStartQuiz}
            className="px-4 py-2.5 rounded-xl bg-[#0f2042] text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-[#000922]"
          >
            <span className="material-symbols-outlined text-[18px]">quiz</span>
            <span>Quick Rule Quiz</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-[#e5eeff] dark:border-[#1a2942] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {topics.map((top) => (
            <button
              key={top}
              onClick={() => setActiveTopic(top)}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                activeTopic === top
                  ? 'bg-[#0f2042] text-white shadow-xs'
                  : 'text-[#515f74] dark:text-[#b9c7df] hover:bg-[#eff4ff] dark:hover:bg-[#15233c]'
              }`}
            >
              {top === 'all' ? 'All Rules' : top}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#515f74] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules or topics..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] text-[13px] text-[#0b1c30] dark:text-white placeholder-[#515f74] focus:outline-none focus:border-[#0f2042]"
          />
        </div>
      </div>

      {/* Rules Grid */}
      <div className="flex flex-col gap-4">
        {filtered.map((rule) => {
          const isRevised = revisedRuleIds.includes(rule.id);
          return (
            <div
              key={rule.id}
              className={`p-6 rounded-2xl bg-white dark:bg-[#0c1527] border transition-all flex flex-col gap-3 ${
                isRevised
                  ? 'border-[#a7f3d0] dark:border-[#065f46] shadow-xs'
                  : 'border-[#e5eeff] dark:border-[#1a2942] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#eff4ff] text-[#0f2042] dark:bg-[#1a2942] dark:text-[#8ea4c8] font-['JetBrains_Mono'] text-[12px] font-bold">
                    Rule {rule.ruleNumber}
                  </span>
                  <span className="text-[13px] font-bold text-[#515f74] dark:text-[#94a3b8]">
                    {rule.topic}
                  </span>
                </div>

                <button
                  onClick={() => handleToggleRevised(rule.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                    isRevised
                      ? 'bg-[#ecfdf5] text-[#059669]'
                      : 'bg-[#eff4ff] dark:bg-[#111c30] text-[#515f74] hover:bg-[#dce9ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isRevised ? 'check' : 'radio_button_unchecked'}
                  </span>
                  <span>{isRevised ? 'Revised' : 'Mark Revised'}</span>
                </button>
              </div>

              <h3 className="font-['Plus_Jakarta_Sans'] text-[19px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                {rule.title}
              </h3>

              <p className="text-[14.5px] text-[#0b1c30] dark:text-[#e2e8f0] leading-relaxed">
                {rule.statement}
              </p>

              {showExamples && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#fff1f2] dark:bg-[#201015] border border-[#fecdd3] dark:border-[#501320] text-[#881337] dark:text-[#fecdd3] text-[13px] flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#e11d48]">close</span>
                    <span><strong>Incorrect:</strong> {rule.incorrectExample}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#ecfdf5] dark:bg-[#062c24] border border-[#a7f3d0] dark:border-[#044e3f] text-[#065f46] dark:text-[#a7f3d0] text-[13px] flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#10b981]">check</span>
                    <span><strong>Correct:</strong> {rule.correctExample}</span>
                  </div>
                </div>
              )}

              <div className="text-[12px] text-[#515f74] dark:text-[#94a3b8] italic pt-1">
                {rule.explanation}
              </div>

              <div className="p-2.5 rounded-lg bg-[#fffbeb] dark:bg-[#2b2108] border border-[#fde68a] dark:border-[#713f12] text-[#92400e] dark:text-[#fef08a] text-[12px] flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#d97706]">warning</span>
                <span><strong>Exam Trap:</strong> {rule.frequentExamTrap}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
