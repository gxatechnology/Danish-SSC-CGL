import React from 'react';
import { ERROR_NOTES } from '../data/mockData';

interface RevisionViewProps {
  onOpenRevisionModal: () => void;
  onOpenChapter: () => void;
  onOpenErrorRetest: (noteId: string) => void;
}

export const RevisionView: React.FC<RevisionViewProps> = ({
  onOpenRevisionModal,
  onOpenChapter,
  onOpenErrorRetest,
}) => {
  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-8 md:py-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0f2042] text-white font-['Inter'] text-[11px] font-bold uppercase tracking-wider">
              Memory Anchors &amp; High-Yield Formulas
            </span>
            <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-['JetBrains_Mono']">
              Rapid Recall Deck
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#000922] dark:text-[#f8f9ff]">
            Last-Day Revision Hub
          </h1>
          <p className="font-['Inter'] text-[15px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
            Formulas, proximity rules, and mistake traps curated for high-velocity pre-exam retention.
          </p>
        </div>

        <button
          onClick={onOpenRevisionModal}
          className="px-5 py-3 rounded-xl bg-[#0f2042] text-white font-bold text-[14px] flex items-center gap-2 shadow-xs cursor-pointer hover:bg-[#000922] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          <span>Open Full Interactive Deck</span>
        </button>
      </div>

      {/* Bento revision cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Mensuration 2D & Circles */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-['JetBrains_Mono'] font-bold px-2.5 py-0.5 rounded bg-[#eff4ff] text-[#0f2042] dark:bg-[#1a2942] dark:text-[#8ea4c8]">
                Mathematics • Advanced
              </span>
              <span className="text-[12px] text-[#19988c] font-bold">5 Essential Formulas</span>
            </div>

            <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#000922] dark:text-[#f8f9ff]">
              Mensuration 2D, Circles &amp; Cyclic Quads
            </h3>

            <div className="flex flex-col gap-2">
              <div className="p-3 rounded-xl bg-[#000922] text-[#89f5e7] font-['JetBrains_Mono'] text-[13px] font-bold">
                Incircle Radius in Right △: r = (a + b - c) / 2
              </div>
              <div className="p-3 rounded-xl bg-[#000922] text-[#89f5e7] font-['JetBrains_Mono'] text-[13px] font-bold">
                Equilateral △: Inradius r = a/(2√3), Circumradius R = a/√3
              </div>
              <div className="p-3 rounded-xl bg-[#000922] text-[#89f5e7] font-['JetBrains_Mono'] text-[13px] font-bold">
                Ptolemy's Theorem: d1 × d2 = (a × c) + (b × d)
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#e5eeff] dark:border-[#1a2942] flex items-center justify-between">
            <span className="text-[12px] text-[#515f74]">Direct TCS PYQ Application</span>
            <button
              onClick={onOpenRevisionModal}
              className="text-[13px] font-bold text-[#0f2042] dark:text-[#89f5e7] hover:underline flex items-center gap-1"
            >
              <span>Review All Formulas</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Card 2: Subject-Verb & Inversion Anchors */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-['JetBrains_Mono'] font-bold px-2.5 py-0.5 rounded bg-[#eff4ff] text-[#0f2042] dark:bg-[#1a2942] dark:text-[#8ea4c8]">
                English Grammar • Core
              </span>
              <span className="text-[12px] text-[#19988c] font-bold">High Frequency Rules</span>
            </div>

            <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#000922] dark:text-[#f8f9ff]">
              Subject–Verb Proximity &amp; Inversion
            </h3>

            <div className="flex flex-col gap-2">
              <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] text-[#0b1c30] dark:text-[#e2e8f0] text-[13px] font-['Inter'] border border-[#e5eeff] dark:border-[#1a2942]">
                <strong className="text-[#0f2042] dark:text-[#89f5e7]">Proximity Concord:</strong> With "Neither...nor" / "Either...or", verb follows the nearest subject.
              </div>
              <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] text-[#0b1c30] dark:text-[#e2e8f0] text-[13px] font-['Inter'] border border-[#e5eeff] dark:border-[#1a2942]">
                <strong className="text-[#0f2042] dark:text-[#89f5e7]">Hardly / Scarcely:</strong> Takes "when" (never "than"). Inversion: [Hardly + had + S + V3...].
              </div>
              <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] text-[#0b1c30] dark:text-[#e2e8f0] text-[13px] font-['Inter'] border border-[#e5eeff] dark:border-[#1a2942]">
                <strong className="text-[#0f2042] dark:text-[#89f5e7]">More than one:</strong> Takes Singular Noun + Singular Verb ("More than one student was absent").
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#e5eeff] dark:border-[#1a2942] flex items-center justify-between">
            <span className="text-[12px] text-[#515f74]">Rules 1 through 9</span>
            <button
              onClick={onOpenChapter}
              className="text-[13px] font-bold text-[#0f2042] dark:text-[#89f5e7] hover:underline flex items-center gap-1"
            >
              <span>Open Subject-Verb Module</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

      </div>

      {/* Error Notebook Section in Revision */}
      <div className="bg-white dark:bg-[#0c1527] p-6 rounded-2xl border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]">notification_important</span>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#000922] dark:text-[#f8f9ff]">
              Mistake Retention Anchors (Error Notebook)
            </h3>
          </div>
          <span className="text-[12px] font-['JetBrains_Mono'] text-[#ba1a1a] font-bold">
            2 Flagged Traps
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ERROR_NOTES.map((err) => (
            <div
              key={err.id}
              className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-[#0b1c30] dark:text-[#f8f9ff]">{err.source}</span>
                  <span className="text-[#ba1a1a] font-['JetBrains_Mono'] font-bold">{err.type}</span>
                </div>
                <p className="text-[13px] italic text-[#0b1c30] dark:text-[#e2e8f0]">
                  {err.quote}
                </p>
                <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8] mt-1">
                  {err.ruleDetail}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e5eeff] dark:border-[#1a2942]">
                <span className="text-[11px] font-['JetBrains_Mono'] text-[#515f74]">
                  Tested {err.testedCount} times
                </span>
                <button
                  onClick={() => onOpenErrorRetest(err.id)}
                  className="px-3 py-1 rounded-md bg-[#0f2042] text-white text-[12px] font-semibold hover:bg-[#000922] transition-colors"
                >
                  Retest Trap
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
