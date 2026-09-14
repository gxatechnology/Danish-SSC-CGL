import React from 'react';
import { ENGLISH_CHAPTERS } from '../content/englishChapters';
import { MATHS_CHAPTERS } from '../content/mathsChapters';

interface SyllabusViewProps {
  onOpenChapter: (slug: string, subject: 'English' | 'Mathematics') => void;
}

export const SyllabusView: React.FC<SyllabusViewProps> = ({ onOpenChapter }) => {
  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-[#0f2042] text-white font-mono text-[11px] font-bold uppercase">
            Official Curriculum Architecture
          </span>
          <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-mono">
            SSC CGL 2026 Tier-I
          </span>
        </div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#000922] dark:text-[#f8f9ff]">
          Detailed Syllabus Tree &amp; Topic Map
        </h1>
        <p className="font-['Inter'] text-[15px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
          Curriculum breakdown prioritizing high-yield scoring topics for Danish Fatma.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* English Syllabus */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#e5eeff] dark:border-[#1a2942] pb-4">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                English Language &amp; Comprehension
              </h2>
              <span className="text-[12px] font-mono text-[#515f74] dark:text-[#94a3b8]">
                25 Questions • 50 Marks (Tier-I)
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#eff4ff] dark:bg-[#111c30] text-[#0f2042] dark:text-[#8ea4c8] text-[12px] font-bold">
              {ENGLISH_CHAPTERS.length} Chapters Indexed
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {ENGLISH_CHAPTERS.map((ch) => (
              <div
                key={ch.slug}
                className="p-4 rounded-2xl bg-[#f8f9ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[15px] text-[#000922] dark:text-[#f8f9ff]">
                      {ch.title}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#0f2042] text-[10px] font-mono font-bold">
                      {ch.priority}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
                    {ch.rulesCount} Rules • {ch.mcqsCount} MCQs • {ch.estimatedMinutes} mins
                  </p>
                </div>

                <button
                  onClick={() => onOpenChapter(ch.slug, 'English')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0f2042] text-white text-[12px] font-bold hover:bg-[#000922] flex items-center gap-1 cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <span>Read Chapter</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mathematics Syllabus */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#e5eeff] dark:border-[#1a2942] pb-4">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                Quantitative Aptitude
              </h2>
              <span className="text-[12px] font-mono text-[#515f74] dark:text-[#94a3b8]">
                25 Questions • 50 Marks (Tier-I)
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#eff4ff] dark:bg-[#111c30] text-[#0f2042] dark:text-[#8ea4c8] text-[12px] font-bold">
              {MATHS_CHAPTERS.length} Core Modules
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {MATHS_CHAPTERS.map((ch) => (
              <div
                key={ch.slug}
                className="p-4 rounded-2xl bg-[#f8f9ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[15px] text-[#000922] dark:text-[#f8f9ff]">
                      {ch.title}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#0f2042] text-[10px] font-mono font-bold">
                      {ch.priority}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
                    {ch.rulesCount} Formulas • {ch.mcqsCount} MCQs • {ch.estimatedMinutes} mins
                  </p>
                </div>

                <button
                  onClick={() => onOpenChapter(ch.slug, 'Mathematics')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0f2042] text-white text-[12px] font-bold hover:bg-[#000922] flex items-center gap-1 cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <span>Read Module</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
