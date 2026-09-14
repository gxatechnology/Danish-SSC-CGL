import React, { useState } from 'react';

interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RevisionModal: React.FC<RevisionModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'mensuration' | 'grammar-inversion'>('mensuration');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  const formulas = [
    {
      title: 'Right-Angled Triangle Incircle Radius (r)',
      latex: 'r = (a + b - c) / 2',
      notes: 'Where a and b are perpendicular sides (Base and Height), and c is the Hypotenuse.',
      example: 'Sides = 6, 8, 10 cm -> r = (6 + 8 - 10)/2 = 4/2 = 2 cm.',
    },
    {
      title: 'Equilateral Triangle: Inradius (r) vs Circumradius (R)',
      latex: 'r = a / (2√3),   R = a / √3   =>   R = 2r',
      notes: 'Circumradius of an equilateral triangle is always exactly double its inradius. Area Ratio = 4 : 1.',
      example: 'If side = 6 cm -> r = 6/(2√3) = √3 cm; R = 2√3 cm.',
    },
    {
      title: 'Cyclic Quadrilateral Area (Brahmagupta\'s Formula)',
      latex: 'Area = √[(s - a)(s - b)(s - c)(s - d)]',
      notes: 'Where semi-perimeter s = (a + b + c + d) / 2. Opposite angles always sum to 180°: ∠A + ∠C = 180°.',
      example: 'Opposite angles: If ∠A = 70°, then ∠C = 110°.',
    },
    {
      title: 'Ptolemy\'s Theorem for Cyclic Quadrilaterals',
      latex: 'd1 × d2 = (a × c) + (b × d)',
      notes: 'Product of the diagonals equals the sum of the products of opposite sides.',
      example: 'Used frequently in Tier-II geometry questions when diagonals are given.',
    },
    {
      title: 'Circumscribed Quadrilateral Tangent Property',
      latex: 'AB + CD = BC + AD',
      notes: 'When a circle touches all four sides of a quadrilateral, the sums of opposite sides are equal.',
      example: 'AB = 7, CD = 9, BC = 6 -> AD = (7 + 9) - 6 = 10 cm.',
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#000922]/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-[#ffffff] dark:bg-[#0c1527] rounded-2xl shadow-2xl border border-[#e5eeff] dark:border-[#1a2942] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#eff4ff] dark:bg-[#111c30] border-b border-[#e5eeff] dark:border-[#1a2942] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#0f2042] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
            </span>
            <div>
              <span className="text-[11px] font-['JetBrains_Mono'] uppercase tracking-wider text-[#19988c] font-bold block">
                Last-Day Revision Deck
              </span>
              <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                Formula Sheet: Mensuration 2D &amp; Circles
              </h3>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-lg text-[#515f74] hover:bg-[#dce9ff]">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#e5eeff] dark:border-[#1a2942] px-6 bg-[#f8f9ff] dark:bg-[#070e1c] gap-4">
          <button
            onClick={() => setActiveTab('mensuration')}
            className={`py-3 text-[13px] font-bold border-b-2 transition-colors ${
              activeTab === 'mensuration'
                ? 'border-[#0f2042] text-[#0f2042] dark:text-[#89f5e7] dark:border-[#89f5e7]'
                : 'border-transparent text-[#515f74] hover:text-[#0b1c30]'
            }`}
          >
            Mensuration 2D &amp; Circles (Geometry Anchors)
          </button>
          <button
            onClick={() => setActiveTab('grammar-inversion')}
            className={`py-3 text-[13px] font-bold border-b-2 transition-colors ${
              activeTab === 'grammar-inversion'
                ? 'border-[#0f2042] text-[#0f2042] dark:text-[#89f5e7] dark:border-[#89f5e7]'
                : 'border-transparent text-[#515f74] hover:text-[#0b1c30]'
            }`}
          >
            Negative Adverb Inversions (English Anchors)
          </button>
        </div>

        {/* Formulas list */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 no-scrollbar">
          {activeTab === 'mensuration' ? (
            formulas.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#eff4ff]/60 dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex flex-col gap-2 relative group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#000922] dark:text-[#f8f9ff]">
                    {item.title}
                  </h4>
                  <button
                    onClick={() => handleCopy(item.latex, idx)}
                    className="p-1.5 rounded-md hover:bg-white dark:hover:bg-[#1a2942] text-[#515f74] dark:text-[#94a3b8] transition-colors"
                    title="Copy Formula"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedIndex === idx ? 'done' : 'content_copy'}
                    </span>
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-[#000922] dark:bg-[#070e1c] text-[#89f5e7] font-['JetBrains_Mono'] text-[14px] font-bold tracking-wide">
                  {item.latex}
                </div>

                <p className="text-[13px] text-[#515f74] dark:text-[#94a3b8]">
                  {item.notes}
                </p>

                <div className="text-[12px] font-['JetBrains_Mono'] px-3 py-1.5 rounded bg-white dark:bg-[#0c1527] text-[#0b1c30] dark:text-[#d3e4fe] border border-[#e5eeff] dark:border-[#1a2942]">
                  💡 Quick Exam Application: {item.example}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-[#eff4ff]/60 dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942]">
                <h4 className="font-bold text-[15px] text-[#000922] dark:text-[#f8f9ff] mb-2">
                  Negative Restrictive Adverb Inversion Formula
                </h4>
                <div className="p-3 rounded-lg bg-[#000922] text-[#89f5e7] font-['JetBrains_Mono'] text-[13px] font-bold">
                  [Hardly / Scarcely + had + Subject + V3 ... when + Simple Past]
                </div>
                <p className="text-[13px] text-[#515f74] mt-2">
                  Trap warning: TCS tests replacing "when" with "then" or "than". Never use "than" with Hardly/Scarcely! Only use "when".
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#eff4ff]/60 dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942]">
                <h4 className="font-bold text-[15px] text-[#000922] dark:text-[#f8f9ff] mb-2">
                  "No Sooner" Inversion Formula
                </h4>
                <div className="p-3 rounded-lg bg-[#000922] text-[#89f5e7] font-['JetBrains_Mono'] text-[13px] font-bold">
                  [No sooner + had + Subject + V3 ... THAN + Simple Past]
                </div>
                <p className="text-[13px] text-[#515f74] mt-2">
                  Note the correlative pair: "No sooner" takes "THAN", not "when" or "then".
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#f8f9ff] dark:bg-[#070e1c] border-t border-[#e5eeff] dark:border-[#1a2942] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0f2042] text-white font-semibold text-[13px] hover:bg-[#1e3a8a] transition-colors"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};
