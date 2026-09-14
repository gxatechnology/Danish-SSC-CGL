import React, { useState, useEffect } from 'react';
import { GRAMMAR_CHAPTERS, EXAM_DRILLS, VOCAB_COMPREHENSION } from '../data/mockData';
import { GrammarChapter } from '../types';
import { storageService } from '../services/storageService';

interface EnglishViewProps {
  onOpenChapter: (chapterId?: string) => void;
  onOpenDrill: () => void;
}

export const EnglishView: React.FC<EnglishViewProps> = ({
  onOpenChapter,
  onOpenDrill,
}) => {
  const [filter, setFilter] = useState<'all' | 'grammar' | 'exam-grammar' | 'vocab'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedChapters, setCompletedChapters] = useState<string[]>(() =>
    storageService.getCompletedChapters()
  );

  useEffect(() => {
    const handleStorage = () => {
      setCompletedChapters(storageService.getCompletedChapters());
    };
    window.addEventListener('danish_cgl_storage_changed', handleStorage);
    return () => window.removeEventListener('danish_cgl_storage_changed', handleStorage);
  }, []);

  const filterTabs: { id: 'all' | 'grammar' | 'exam-grammar' | 'vocab'; label: string; count: number }[] = [
    { id: 'all', label: 'All Modules', count: 24 },
    { id: 'grammar', label: 'Core Grammar (14)', count: 14 },
    { id: 'exam-grammar', label: 'Exam Drills & Voice (5)', count: 5 },
    { id: 'vocab', label: 'Vocab & Comprehension (5)', count: 5 },
  ];

  const q = searchQuery.toLowerCase().trim();

  const filteredGrammar = GRAMMAR_CHAPTERS.filter(
    (c) => (!q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
  );

  const filteredDrills = EXAM_DRILLS.filter(
    (d) => (!q || d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q))
  );

  const filteredVocab = VOCAB_COMPREHENSION.filter(
    (v) => (!q || v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q))
  );

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-8 md:py-10 flex flex-col gap-8">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0f2042] text-white font-['Inter'] text-[11px] font-bold uppercase tracking-wider">
              English Language &amp; Comprehension
            </span>
            <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-['JetBrains_Mono']">
              Tier-I (50 Marks) &amp; Tier-II (135 Marks)
            </span>
          </div>

          <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#000922] dark:text-[#f8f9ff] tracking-tight">
            English Syllabus &amp; Chapter Modules
          </h1>

          <p className="font-['Inter'] text-[15px] text-[#515f74] dark:text-[#94a3b8] max-w-2xl">
            Comprehensive coverage across 14 grammar foundations, 5 exam patterns, and high-frequency root vocabulary decks for SSC CGL 2026.
          </p>
        </div>

        {/* Quick stat banner */}
        <div className="flex items-center gap-3 bg-white dark:bg-[#0c1527] p-3.5 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] shadow-xs">
          <div className="flex flex-col pr-4 border-r border-[#e5eeff] dark:border-[#1a2942]">
            <span className="text-[11px] text-[#515f74] uppercase font-bold">Grammar Rules</span>
            <span className="text-[20px] font-bold font-['JetBrains_Mono'] text-[#000922] dark:text-[#89f5e7]">152 Total</span>
          </div>
          <div className="flex flex-col pr-4 border-r border-[#e5eeff] dark:border-[#1a2942]">
            <span className="text-[11px] text-[#515f74] uppercase font-bold">Questions Pool</span>
            <span className="text-[20px] font-bold font-['JetBrains_Mono'] text-[#000922] dark:text-[#89f5e7]">1,450+ MCQs</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#515f74] uppercase font-bold">Target Words</span>
            <span className="text-[20px] font-bold font-['JetBrains_Mono'] text-[#19988c]">850 Words</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#0c1527] p-3 rounded-xl border border-[#e5eeff] dark:border-[#1a2942]">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-[#0f2042] text-white shadow-xs'
                  : 'text-[#45464e] dark:text-[#b9c7df] hover:bg-[#eff4ff] dark:hover:bg-[#1a2942]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* In-page filter input */}
        <div className="flex items-center gap-2 bg-[#eff4ff] dark:bg-[#111c30] px-3 py-1.5 rounded-lg border border-[#e5eeff] dark:border-[#1a2942] w-full sm:w-64">
          <span className="material-symbols-outlined text-[18px] text-[#515f74]">search</span>
          <input
            type="text"
            placeholder="Filter English chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[13px] text-[#0b1c30] dark:text-[#f8f9ff] focus:outline-hidden"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#515f74] hover:text-black text-[14px]">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Section 1: Core Grammar Chapters (14 Chapters) */}
      {(filter === 'all' || filter === 'grammar') && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0f2042] dark:bg-[#38bdf8]"></span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                Core Grammar Foundation ({filteredGrammar.length})
              </h2>
            </div>
            <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-['Inter']">
              Click any chapter to study rules or take drills
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGrammar.map((ch) => {
              const isSpotlight = ch.id === 'sv-agreement';
              const isCompleted =
                completedChapters.includes(ch.id) ||
                (ch.id === 'sv-agreement' && completedChapters.includes('subject-verb-agreement'));
              const realStatus = isCompleted ? 'Completed' : 'Not Started';
              const realProgress = isCompleted ? 100 : 0;

              return (
                <div
                  key={ch.id}
                  className={`p-5 rounded-xl bg-white dark:bg-[#0c1527] border transition-all flex flex-col justify-between group ${
                    isSpotlight
                      ? 'border-[#0f2042] dark:border-[#38bdf8] shadow-md ring-1 ring-[#0f2042]/20'
                      : 'border-[#e5eeff] dark:border-[#1a2942] hover:border-[#7988b0] shadow-xs'
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-['JetBrains_Mono'] font-bold px-2 py-0.5 rounded ${
                        ch.priority === 'High Priority'
                          ? 'bg-[#ba1a1a]/10 text-[#ba1a1a]'
                          : ch.priority === 'Quick Revision'
                          ? 'bg-[#19988c]/15 text-[#002622] dark:text-[#19988c]'
                          : 'bg-[#dce9ff] text-[#000922] dark:text-[#89f5e7]'
                      }`}>
                        {ch.priority}
                      </span>

                      <span className={`text-[11px] font-['Inter'] font-semibold flex items-center gap-1 ${
                        realStatus === 'Completed'
                          ? 'text-[#059669]'
                          : 'text-[#515f74] dark:text-[#94a3b8]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          realStatus === 'Completed'
                            ? 'bg-[#059669]'
                            : 'bg-neutral-300'
                        }`} />
                        {realStatus}
                      </span>
                    </div>

                    {/* Chapter Title & Description */}
                    <div>
                      <h3 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#000922] dark:text-[#f8f9ff] group-hover:text-[#0f2042] dark:group-hover:text-[#89f5e7] transition-colors">
                        {ch.title}
                      </h3>
                      <p className="font-['Inter'] text-[13px] text-[#515f74] dark:text-[#94a3b8] mt-1 line-clamp-2 leading-relaxed">
                        {ch.description}
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex justify-between text-[11px] font-['Inter'] text-[#515f74] dark:text-[#94a3b8]">
                        <span>{ch.rulesCount} Rules • {ch.mcqsCount} MCQs</span>
                        <span className="font-['JetBrains_Mono'] font-bold text-[#000922] dark:text-[#89f5e7]">
                          {realProgress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#e5eeff] dark:bg-[#1a2942] overflow-hidden">
                        <div
                          className="h-full bg-[#000922] dark:bg-[#38bdf8] rounded-full transition-all"
                          style={{ width: `${realProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-4 border-t border-[#e5eeff] dark:border-[#1a2942] flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenChapter(ch.id)}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#eff4ff] dark:bg-[#162744] hover:bg-[#dce9ff] text-[#0b1c30] dark:text-white font-['Inter'] text-[12px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">menu_book</span>
                      <span>Study Rules</span>
                    </button>

                    <button
                      onClick={onOpenDrill}
                      className="py-2 px-3 rounded-lg bg-white dark:bg-[#0c1527] hover:bg-[#eff4ff] dark:hover:bg-[#1a2942] border border-[#e5eeff] dark:border-[#1a2942] text-[#000922] dark:text-[#89f5e7] font-['Inter'] text-[12px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">bolt</span>
                      <span>MCQs</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Section 2: Exam Question Patterns & High Yield Drills */}
      {(filter === 'all' || filter === 'exam-grammar') && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                Exam Question Patterns (TCS Format)
              </h2>
            </div>
            <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-['Inter']">
              Direct previous years question sets (2018–2024)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDrills.map((drill) => (
              <div
                key={drill.id}
                className="p-5 rounded-xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs hover:border-[#7988b0] transition-all flex flex-col justify-between"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-['JetBrains_Mono'] font-bold px-2 py-0.5 rounded bg-[#eff4ff] text-[#0f2042] dark:bg-[#1a2942] dark:text-[#8ea4c8]">
                      {drill.subtext}
                    </span>
                    <span className="text-[11px] font-['JetBrains_Mono'] font-bold text-[#ba1a1a]">
                      {drill.priority}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                      {drill.title}
                    </h3>
                    <p className="font-['Inter'] text-[13px] text-[#515f74] dark:text-[#94a3b8] mt-1 leading-relaxed">
                      {drill.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between font-['JetBrains_Mono'] text-[12px] text-[#515f74] dark:text-[#94a3b8] pt-2">
                    <span>{drill.mcqsCount} Practice Sets</span>
                    <span>Accuracy Target: 90%</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#e5eeff] dark:border-[#1a2942]">
                  <button
                    onClick={onOpenDrill}
                    className="w-full py-2.5 rounded-lg bg-[#0f2042] hover:bg-[#000922] text-white font-['Inter'] text-[13px] font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_circle</span>
                    <span>Launch PYQ Drill</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Vocabulary & Comprehension Modules */}
      {(filter === 'all' || filter === 'vocab') && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#19988c]"></span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                Vocabulary &amp; Reading Comprehension Decks
              </h2>
            </div>
            <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-['Inter']">
              BlackBook &amp; Root Word Curations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVocab.map((vocab) => (
              <div
                key={vocab.id}
                className="p-5 rounded-xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs hover:border-[#7988b0] transition-all flex flex-col justify-between"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-['JetBrains_Mono'] font-bold px-2 py-0.5 rounded bg-[#89f5e7]/20 text-[#002622] dark:text-[#89f5e7] border border-[#6bd8cb]/40">
                      {vocab.badge}
                    </span>
                    <span className="text-[11px] font-['JetBrains_Mono'] font-bold text-[#19988c]">
                      {vocab.target}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                      {vocab.title}
                    </h3>
                    <p className="font-['Inter'] text-[13px] text-[#515f74] dark:text-[#94a3b8] mt-1 leading-relaxed">
                      {vocab.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {vocab.tags?.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-['Inter'] px-2 py-0.5 rounded bg-[#eff4ff] dark:bg-[#111c30] text-[#515f74] dark:text-[#94a3b8]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#e5eeff] dark:border-[#1a2942] flex items-center justify-between">
                  <span className="text-[11px] font-['JetBrains_Mono'] text-[#515f74] dark:text-[#94a3b8]">
                    {vocab.footerType}
                  </span>
                  <button
                    onClick={onOpenDrill}
                    className="px-4 py-2 rounded-lg bg-[#002622] hover:bg-[#003d36] text-[#19988c] font-['Inter'] text-[12px] font-bold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>{vocab.buttonText}</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
