import React, { useState } from 'react';
import { MATH_FORMULAS } from '../content/formulas';
import { MathFormula } from '../components/MathFormula';
import { storageService } from '../services/storageService';

export const FormulaHubView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revisedIds, setRevisedIds] = useState<string[]>(() => storageService.getRevisedFormulaIds());

  const categories = ['all', 'Geometry', 'Mensuration 2D', 'Arithmetic', 'Advanced Quant'];

  const filtered = MATH_FORMULAS.filter((f) => {
    const matchesCat = activeCategory === 'all' || f.category === activeCategory;
    const matchesQuery =
      searchQuery === '' ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.plainText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleCopy = (id: string, plainText: string) => {
    navigator.clipboard.writeText(plainText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleToggleRevised = (id: string) => {
    storageService.toggleRevisedFormula(id);
    setRevisedIds(storageService.getRevisedFormulaIds());
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0f2042] text-white font-['Inter'] text-[11px] font-bold uppercase tracking-wider">
              High-Yield SSC CGL Quant Deck
            </span>
            <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-['JetBrains_Mono']">
              KaTeX Precision Rendering
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#000922] dark:text-[#f8f9ff]">
            Mathematics Formula Hub
          </h1>
          <p className="font-['Inter'] text-[15px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
            Formulas, variable interpretations, and examination traps curated for instant recall.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] bg-white dark:bg-[#0c1527] text-[#0f2042] dark:text-[#8ea4c8] text-[13px] font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-[#eff4ff]"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print Formula Sheet</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-[#e5eeff] dark:border-[#1a2942] pb-4 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#0f2042] text-white shadow-xs'
                  : 'text-[#515f74] dark:text-[#b9c7df] hover:bg-[#eff4ff] dark:hover:bg-[#15233c]'
              }`}
            >
              {cat === 'all' ? 'All Formulas' : cat}
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
            placeholder="Search formulas or topics..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] text-[13px] text-[#0b1c30] dark:text-white placeholder-[#515f74] focus:outline-none focus:border-[#0f2042]"
          />
        </div>
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((formula) => {
          const isRevised = revisedIds.includes(formula.id);
          return (
            <div
              key={formula.id}
              className={`p-6 rounded-2xl bg-white dark:bg-[#0c1527] border transition-all flex flex-col justify-between gap-4 ${
                isRevised
                  ? 'border-[#a7f3d0] dark:border-[#065f46] shadow-xs'
                  : 'border-[#e5eeff] dark:border-[#1a2942] shadow-xs'
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-['JetBrains_Mono'] font-bold px-2 py-0.5 rounded bg-[#eff4ff] text-[#0f2042] dark:bg-[#1a2942] dark:text-[#8ea4c8]">
                    {formula.category} • {formula.topic}
                  </span>

                  <div className="flex items-center gap-1.5 print:hidden">
                    <button
                      onClick={() => handleToggleRevised(formula.id)}
                      className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
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

                    <button
                      onClick={() => handleCopy(formula.id, formula.plainText)}
                      className="p-1 rounded text-[#515f74] hover:text-[#0f2042] cursor-pointer"
                      title="Copy formula text"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {copiedId === formula.id ? 'done' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>

                <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                  {formula.title}
                </h3>

                {/* KaTeX formula box */}
                <div className="p-3.5 rounded-xl bg-[#000922] text-[#89f5e7] border border-[#1a2942]">
                  <MathFormula math={formula.latex} block />
                </div>

                {/* Variables list */}
                <div className="text-[12px] text-[#515f74] dark:text-[#94a3b8] flex flex-col gap-1">
                  {formula.variables.map((v, vIdx) => (
                    <div key={vIdx} className="flex items-start gap-1">
                      <span className="font-['JetBrains_Mono'] font-bold text-[#000922] dark:text-[#e2e8f0] min-w-16">
                        {v.symbol}:
                      </span>
                      <span>{v.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#e5eeff] dark:border-[#1a2942] flex flex-col gap-2">
                <div className="text-[12px] text-[#059669] dark:text-[#34d399]">
                  <strong>When to use:</strong> {formula.whenToUse}
                </div>
                <div className="text-[12px] text-[#ba1a1a] dark:text-[#f87171]">
                  <strong>Common Trap:</strong> {formula.commonTrap}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
