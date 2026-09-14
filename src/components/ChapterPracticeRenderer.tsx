import React, { useState } from 'react';
import { SolvedExample, PracticeQuizItem } from '../types';
import { Sparkles, AlertCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface SolvedExamplesListProps {
  examples: SolvedExample[];
}

export const SolvedExamplesList: React.FC<SolvedExamplesListProps> = ({ examples }) => {
  const [expandedIdx, setExpandedIdx] = useState<number[]>(examples.map((_, i) => i));

  const toggleExpand = (idx: number) => {
    setExpandedIdx((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="my-6 space-y-4">
      {examples.map((ex, idx) => {
        const isExpanded = expandedIdx.includes(idx);

        const levelColor = 
          ex.level === 'Easy'
            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
            : ex.level === 'SSC-level'
            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
            : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';

        return (
          <div
            key={idx}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div 
              onClick={() => toggleExpand(idx)}
              className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${levelColor}`}>
                    {ex.level || 'SSC-level'}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Example #{idx + 1}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                  {ex.question}
                </h4>
              </div>

              <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {/* Expanded Solution Body */}
            {isExpanded && (
              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-3 bg-slate-50/40 dark:bg-slate-950/20">
                <div className="pt-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Step-by-Step Solution:
                  </span>
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                    {ex.solution}
                  </div>
                </div>

                {ex.fastTrick && (
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">SSC Speed Shortcut: </span>
                      <span>{ex.fastTrick}</span>
                    </div>
                  </div>
                )}

                {ex.trapNote && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Candidate Trap Alert: </span>
                      <span>{ex.trapNote}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

interface PracticeQuizSectionProps {
  questions: PracticeQuizItem[];
}

export const PracticeQuizSection: React.FC<PracticeQuizSectionProps> = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const handleSelectOption = (qId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
    // Auto-reveal explanation upon selection
    setShowExplanation((prev) => ({ ...prev, [qId]: true }));
  };

  return (
    <div className="my-6 space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Interactive Chapter Practice</span>
        </h4>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {Object.keys(selectedAnswers).length} of {questions.length} Answered
        </span>
      </div>

      {questions.map((q, idx) => {
        const userChoice = selectedAnswers[q.id];
        const isAnswered = userChoice !== undefined;
        const isCorrect = isAnswered && userChoice === q.correctIndex;
        const revealed = showExplanation[q.id];

        return (
          <div
            key={q.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Q{idx + 1}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {q.sourceType || 'Practice'}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line">
              {q.question}
            </p>

            {/* Options */}
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => {
                let btnStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50';

                if (isAnswered) {
                  if (optIdx === q.correctIndex) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium';
                  } else if (optIdx === userChoice) {
                    btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                  } else {
                    btnStyle = 'border-slate-200 dark:border-slate-800 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(q.id, optIdx)}
                    className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between gap-3 transition-all ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && optIdx === q.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && optIdx === userChoice && optIdx !== q.correctIndex && (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation disclosure */}
            {revealed && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  {isCorrect ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Correct Answer!
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Incorrect Choice
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-line leading-relaxed">{q.explanation}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
