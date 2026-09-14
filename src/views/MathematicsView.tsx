import React, { useState, useEffect } from 'react';
import { MATH_TOPICS } from '../data/mockData';
import { storageService } from '../services/storageService';

interface MathematicsViewProps {
  onOpenRevision: () => void;
  onOpenDrill: () => void;
}

export const MathematicsView: React.FC<MathematicsViewProps> = ({
  onOpenRevision,
  onOpenDrill,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'Arithmetic' | 'Advanced Maths'>('all');
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

  const fractions = [
    { frac: '1/2', dec: '50.0%' },
    { frac: '1/3', dec: '33.33%' },
    { frac: '1/4', dec: '25.0%' },
    { frac: '1/5', dec: '20.0%' },
    { frac: '1/6', dec: '16.66%' },
    { frac: '1/7', dec: '14.28%' },
    { frac: '1/8', dec: '12.5%' },
    { frac: '1/9', dec: '11.11%' },
    { frac: '1/11', dec: '9.09%' },
    { frac: '1/12', dec: '8.33%' },
    { frac: '1/13', dec: '7.69%' },
    { frac: '1/14', dec: '7.14%' },
    { frac: '1/15', dec: '6.66%' },
    { frac: '1/16', dec: '6.25%' },
    { frac: '1/17', dec: '5.88%' },
    { frac: '1/19', dec: '5.26%' },
  ];

  const filteredTopics = MATH_TOPICS.filter(
    (t) => activeCategory === 'all' || t.category === activeCategory
  );

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-8 md:py-10 flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0f2042] text-white font-['Inter'] text-[11px] font-bold uppercase tracking-wider">
              Quantitative Aptitude
            </span>
            <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-['JetBrains_Mono']">
              Tier-I (50 Marks) &amp; Tier-II (90 Marks)
            </span>
          </div>

          <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#000922] dark:text-[#f8f9ff] tracking-tight">
            Mathematics Archive &amp; Shortcuts
          </h1>

          <p className="font-['Inter'] text-[15px] text-[#515f74] dark:text-[#94a3b8] max-w-2xl">
            Master the mental arithmetic framework, non-pen ratio approaches, and geometric theorems essential for SSC CGL 2026.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenRevision}
            className="px-4 py-2.5 rounded-xl bg-[#0f2042] text-white text-[13px] font-bold hover:bg-[#000922] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">functions</span>
            <span>Open Mensuration Formula Sheet</span>
          </button>
        </div>
      </div>

      {/* Speed Math Memory Anchor: Fractional Equivalents Strip */}
      <div className="bg-white dark:bg-[#0c1527] p-5 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#19988c]">bolt</span>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] text-[#000922] dark:text-[#f8f9ff]">
              Crucial Fraction-to-Percentage Equivalents (Mental Math)
            </h3>
          </div>
          <span className="text-[11px] font-['JetBrains_Mono'] text-[#515f74] dark:text-[#94a3b8]">
            Instant Calculation Anchors
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 gap-2">
          {fractions.map((f, i) => (
            <div
              key={i}
              className="p-2 rounded-lg bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] text-center flex flex-col items-center hover:border-[#0f2042] transition-colors"
            >
              <span className="font-['JetBrains_Mono'] font-bold text-[13px] text-[#0f2042] dark:text-[#89f5e7]">
                {f.frac}
              </span>
              <span className="font-['Inter'] text-[11px] text-[#515f74] dark:text-[#94a3b8] font-medium">
                {f.dec}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 border-b border-[#e5eeff] dark:border-[#1a2942] pb-3">
        {(['all', 'Arithmetic', 'Advanced Maths'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#0f2042] text-white shadow-xs'
                : 'text-[#515f74] dark:text-[#b9c7df] hover:bg-[#eff4ff] dark:hover:bg-[#1a2942]'
            }`}
          >
            {cat === 'all' ? 'All Math Topics' : cat}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTopics.map((topic) => {
          const isCompleted = completedChapters.includes(topic.id) || completedChapters.includes(topic.title.toLowerCase().replace(/\s+/g, '-'));
          const realStatus = isCompleted ? 'Completed' : 'Not Started';
          const realProgress = isCompleted ? 100 : 0;

          return (
            <div
              key={topic.id}
              className="p-5 rounded-xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs hover:border-[#7988b0] transition-all flex flex-col justify-between"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-['JetBrains_Mono'] font-bold px-2 py-0.5 rounded bg-[#eff4ff] dark:bg-[#1a2942] text-[#0f2042] dark:text-[#8ea4c8]">
                    {topic.category}
                  </span>
                  <span className={`text-[11px] font-['Inter'] font-semibold flex items-center gap-1 ${
                    realStatus === 'Completed'
                      ? 'text-[#059669]'
                      : 'text-[#515f74]'
                  }`}>
                    {realStatus}
                  </span>
                </div>

                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                    {topic.title}
                  </h3>
                  <p className="font-['Inter'] text-[13px] text-[#515f74] dark:text-[#94a3b8] mt-1 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                {/* Progress */}
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between text-[11px] font-['Inter'] text-[#515f74]">
                    <span>{topic.rulesCount} Concepts</span>
                    <span className="font-['JetBrains_Mono'] font-bold text-[#000922] dark:text-[#89f5e7]">
                      {realProgress}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#e5eeff] dark:bg-[#1a2942] overflow-hidden">
                    <div
                      className="h-full bg-[#000922] dark:bg-[#38bdf8] rounded-full"
                      style={{ width: `${realProgress}%` }}
                    />
                  </div>
                </div>
              </div>

            <div className="pt-4 mt-4 border-t border-[#e5eeff] dark:border-[#1a2942] flex items-center gap-2">
              <button
                onClick={onOpenRevision}
                className="flex-1 py-2 px-3 rounded-lg bg-[#eff4ff] dark:bg-[#162744] hover:bg-[#dce9ff] text-[#0b1c30] dark:text-white font-['Inter'] text-[12px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Formula Sheet</span>
              </button>
              <button
                onClick={onOpenDrill}
                className="py-2 px-3 rounded-lg bg-white dark:bg-[#0c1527] hover:bg-[#eff4ff] border border-[#e5eeff] dark:border-[#1a2942] text-[#000922] dark:text-[#89f5e7] font-['Inter'] text-[12px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Drill</span>
              </button>
            </div>
          </div>
        );
      })}
      </div>

    </div>
  );
};
