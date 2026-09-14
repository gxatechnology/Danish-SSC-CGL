import React, { useState, useEffect } from 'react';
import { ALL_CHAPTERS } from '../content/allChapters';
import { GRAMMAR_RULES } from '../content/grammarRules';
import { MATH_FORMULAS } from '../content/formulas';
import { VOCABULARY_DATA } from '../content/vocabulary';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (route: string, slug?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const chapterMatches = ALL_CHAPTERS.filter(
    (c) =>
      c.title.toLowerCase().includes(trimmed) ||
      c.summary.toLowerCase().includes(trimmed) ||
      c.category.toLowerCase().includes(trimmed) ||
      (c.subcategory && c.subcategory.toLowerCase().includes(trimmed)) ||
      (c.favouriteTrap && c.favouriteTrap.toLowerCase().includes(trimmed))
  );

  const formulaMatches = MATH_FORMULAS.filter(
    (f) =>
      f.title.toLowerCase().includes(trimmed) ||
      f.plainText.toLowerCase().includes(trimmed) ||
      f.topic.toLowerCase().includes(trimmed)
  );

  const ruleMatches = GRAMMAR_RULES.filter(
    (r) =>
      r.title.toLowerCase().includes(trimmed) ||
      r.statement.toLowerCase().includes(trimmed) ||
      r.topic.toLowerCase().includes(trimmed)
  );

  const vocabMatches = VOCABULARY_DATA.filter(
    (v) =>
      v.word.toLowerCase().includes(trimmed) ||
      v.meaning.toLowerCase().includes(trimmed)
  );

  const getChapterRoute = (subject: string): string => {
    switch (subject) {
      case 'Reasoning':
        return 'reasoning-chapter';
      case 'General Awareness':
        return 'ga-chapter';
      case 'Mathematics':
        return 'maths-chapter';
      case 'Tier-II':
        return 'tier2-chapter';
      case 'English':
      default:
        return 'english-chapter';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 md:pt-24 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#e5eeff] dark:border-[#1a2942] flex items-center gap-3">
          <span className="material-symbols-outlined text-[#515f74] text-[22px]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all 5 subjects: chapters, rules, formulas, traps (e.g. Syllogism, Article 32, Incentre)..."
            className="flex-1 bg-transparent text-[15px] text-[#000922] dark:text-white placeholder-[#515f74] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-md bg-[#eff4ff] dark:bg-[#111c30] text-[11px] font-mono text-[#515f74] hover:text-[#000922] cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Stream */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
          {trimmed.length === 0 ? (
            <div className="text-center py-8 text-[#515f74] dark:text-[#94a3b8] text-[13px]">
              Type a keyword to instantly query across all 24 textbook modules, formulas, and examiner traps.
            </div>
          ) : (
            <>
              {/* Chapters */}
              {chapterMatches.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#515f74] px-1">
                    Textbook Modules ({chapterMatches.length})
                  </span>
                  {chapterMatches.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => {
                        onSelectResult(getChapterRoute(c.subject), c.slug);
                        onClose();
                      }}
                      className="text-left p-3 rounded-xl hover:bg-[#eff4ff] dark:hover:bg-[#111c30] flex flex-col gap-0.5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[14px] text-[#000922] dark:text-[#f8f9ff]">
                          {c.title}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {c.subject}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8] line-clamp-1">
                        {c.summary}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* Math Formulas */}
              {formulaMatches.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#515f74] px-1">
                    Maths Formulas ({formulaMatches.length})
                  </span>
                  {formulaMatches.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        onSelectResult('mathematics');
                        onClose();
                      }}
                      className="text-left p-3 rounded-xl hover:bg-[#eff4ff] dark:hover:bg-[#111c30] flex flex-col gap-0.5 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[14px] text-[#000922] dark:text-[#f8f9ff]">
                          {f.title}
                        </span>
                        <span className="text-[11px] font-mono text-[#19988c]">
                          {f.topic}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-mono line-clamp-1">
                        {f.plainText}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* Grammar Rules */}
              {ruleMatches.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#515f74] px-1">
                    Grammar Rules ({ruleMatches.length})
                  </span>
                  {ruleMatches.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onSelectResult('english');
                        onClose();
                      }}
                      className="text-left p-3 rounded-xl hover:bg-[#eff4ff] dark:hover:bg-[#111c30] flex flex-col gap-0.5 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[14px] text-[#000922] dark:text-[#f8f9ff]">
                          Rule #{r.ruleNumber}: {r.title}
                        </span>
                        <span className="text-[11px] font-mono text-[#059669]">
                          {r.topic}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8] line-clamp-1">
                        {r.statement}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* Vocabulary */}
              {vocabMatches.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#515f74] px-1">
                    Vocabulary ({vocabMatches.length})
                  </span>
                  {vocabMatches.slice(0, 10).map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        onSelectResult('english');
                        onClose();
                      }}
                      className="text-left p-2.5 rounded-xl hover:bg-[#eff4ff] dark:hover:bg-[#111c30] flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-bold text-[14px] text-[#000922] dark:text-[#f8f9ff]">
                        {v.word}
                      </span>
                      <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8]">
                        {v.meaning}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {chapterMatches.length === 0 &&
                formulaMatches.length === 0 &&
                ruleMatches.length === 0 &&
                vocabMatches.length === 0 && (
                  <div className="text-center py-8 text-[#515f74] text-[13px]">
                    No direct matches found for "{query}". Try a broader term.
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
