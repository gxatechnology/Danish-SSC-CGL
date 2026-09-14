import React from 'react';
import { ChapterDiagram } from '../types';

interface ChapterDiagramRendererProps {
  diagram: ChapterDiagram;
}

export const ChapterDiagramRenderer: React.FC<ChapterDiagramRendererProps> = ({ diagram }) => {
  const renderSvgContent = () => {
    switch (diagram.type) {
      case 'direction':
        return (
          <svg viewBox="0 0 320 280" className="w-full max-w-md mx-auto">
            {/* Background Grid */}
            <circle cx="160" cy="140" r="100" fill="none" stroke="currentColor" strokeDasharray="3 3" className="text-slate-300 dark:text-slate-700" />
            <circle cx="160" cy="140" r="60" fill="none" stroke="currentColor" strokeDasharray="2 2" className="text-slate-200 dark:text-slate-800" />

            {/* Cardinal Axes */}
            <line x1="160" y1="20" x2="160" y2="260" stroke="currentColor" strokeWidth="2" className="text-slate-400 dark:text-slate-600" />
            <line x1="40" y1="140" x2="280" y2="140" stroke="currentColor" strokeWidth="2" className="text-slate-400 dark:text-slate-600" />

            {/* Ordinal Axes */}
            <line x1="75" y1="55" x2="245" y2="225" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-indigo-300 dark:text-indigo-800" />
            <line x1="75" y1="225" x2="245" y2="55" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-indigo-300 dark:text-indigo-800" />

            {/* Central Pin */}
            <circle cx="160" cy="140" r="5" fill="#4f46e5" />

            {/* Cardinal Labels */}
            <text x="160" y="16" textAnchor="middle" className="font-extrabold text-[13px] fill-red-500">N (0° / 360°)</text>
            <text x="160" y="275" textAnchor="middle" className="font-extrabold text-[13px] fill-slate-700 dark:fill-slate-300">S (180°)</text>
            <text x="295" y="144" textAnchor="start" className="font-extrabold text-[13px] fill-amber-500">E (90°)</text>
            <text x="25" y="144" textAnchor="end" className="font-extrabold text-[13px] fill-slate-700 dark:fill-slate-300">W (270°)</text>

            {/* Ordinal Labels */}
            <text x="250" y="50" textAnchor="start" className="font-bold text-[11px] fill-indigo-500">NE (45°)</text>
            <text x="250" y="235" textAnchor="start" className="font-bold text-[11px] fill-indigo-500">SE (135°)</text>
            <text x="70" y="235" textAnchor="end" className="font-bold text-[11px] fill-indigo-500">SW (225°)</text>
            <text x="70" y="50" textAnchor="end" className="font-bold text-[11px] fill-indigo-500">NW (315°)</text>

            {/* Sun & Shadow Callout */}
            <g transform="translate(195, 80)">
              <rect x="0" y="0" width="115" height="42" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
              <text x="8" y="16" className="text-[9px] font-bold fill-amber-900">Morning (Sunrise in E):</text>
              <text x="8" y="32" className="text-[9px] fill-amber-800">Shadow falls to WEST</text>
            </g>
          </svg>
        );

      case 'venn':
        return (
          <svg viewBox="0 0 340 220" className="w-full max-w-md mx-auto">
            {/* Venn Universal Box */}
            <rect x="10" y="10" width="320" height="200" rx="12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-300 dark:text-slate-700" />
            <text x="25" y="32" className="font-bold text-[11px] fill-slate-500">Universal Set (U)</text>

            {/* Circle A */}
            <circle cx="130" cy="115" r="65" fill="#6366f1" fillOpacity="0.25" stroke="#4f46e5" strokeWidth="2" />
            <text x="95" y="120" className="font-bold text-[14px] fill-indigo-700 dark:fill-indigo-300">Set A</text>

            {/* Circle B */}
            <circle cx="210" cy="115" r="65" fill="#10b981" fillOpacity="0.25" stroke="#059669" strokeWidth="2" />
            <text x="245" y="120" className="font-bold text-[14px] fill-emerald-700 dark:fill-emerald-300">Set B</text>

            {/* Intersection Highlight */}
            <text x="170" y="115" textAnchor="middle" className="font-extrabold text-[11px] fill-slate-900 dark:fill-white">A ∩ B</text>
            <text x="170" y="130" textAnchor="middle" className="text-[9px] fill-slate-600 dark:fill-slate-300">(Common)</text>
          </svg>
        );

      case 'family-tree':
        return (
          <svg viewBox="0 0 360 240" className="w-full max-w-lg mx-auto">
            {/* Generation G+1 */}
            <text x="20" y="45" className="text-[10px] font-bold fill-slate-400 uppercase tracking-wider">Gen +1</text>
            {/* Father [Male +] */}
            <g transform="translate(100, 20)">
              <rect x="0" y="0" width="70" height="40" rx="6" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
              <text x="35" y="24" textAnchor="middle" className="text-[11px] font-bold fill-indigo-900">Father (+)</text>
            </g>
            {/* Marriage Equal Sign */}
            <line x1="175" y1="40" x2="205" y2="40" stroke="#e11d48" strokeWidth="3" />
            <text x="190" y="34" textAnchor="middle" className="text-[10px] font-extrabold fill-rose-600">=</text>
            {/* Mother [Female -] */}
            <g transform="translate(210, 20)">
              <circle cx="35" cy="20" r="20" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2" />
              <text x="35" y="24" textAnchor="middle" className="text-[11px] font-bold fill-rose-900">Mother (-)</text>
            </g>

            {/* Offspring Trunk */}
            <line x1="190" y1="40" x2="190" y2="100" stroke="#64748b" strokeWidth="2" />
            <line x1="100" y1="100" x2="280" y2="100" stroke="#64748b" strokeWidth="2" />

            {/* Generation G0 */}
            <text x="20" y="145" className="text-[10px] font-bold fill-slate-400 uppercase tracking-wider">Gen 0</text>
            {/* Brother (+) */}
            <line x1="100" y1="100" x2="100" y2="130" stroke="#64748b" strokeWidth="2" />
            <g transform="translate(65, 130)">
              <rect x="0" y="0" width="70" height="40" rx="6" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
              <text x="35" y="24" textAnchor="middle" className="text-[11px] font-bold fill-indigo-900">Brother (+)</text>
            </g>

            {/* Self / Candidate */}
            <line x1="190" y1="100" x2="190" y2="130" stroke="#64748b" strokeWidth="2" />
            <g transform="translate(155, 130)">
              <rect x="0" y="0" width="70" height="40" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
              <text x="35" y="24" textAnchor="middle" className="text-[11px] font-bold fill-amber-900">Self (You)</text>
            </g>

            {/* Sister (-) */}
            <line x1="280" y1="100" x2="280" y2="130" stroke="#64748b" strokeWidth="2" />
            <g transform="translate(245, 130)">
              <circle cx="35" cy="20" r="20" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2" />
              <text x="35" y="24" textAnchor="middle" className="text-[11px] font-bold fill-rose-900">Sister (-)</text>
            </g>

            {/* Legend Footer */}
            <g transform="translate(40, 195)">
              <rect x="0" y="0" width="280" height="32" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-slate-800 dark:stroke-slate-700" />
              <text x="15" y="20" className="text-[9.5px] fill-slate-600 dark:fill-slate-300">
                [+]: Male  |  [-]: Female  |  [=]: Spouse  |  [-]: Sibling
              </text>
            </g>
          </svg>
        );

      case 'triangle':
        return (
          <svg viewBox="0 0 320 240" className="w-full max-w-md mx-auto">
            {/* Right Triangle */}
            <polygon points="50,200 270,200 50,50" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2.5" />
            
            {/* 90 deg marker */}
            <rect x="50" y="180" width="20" height="20" fill="none" stroke="#16a34a" strokeWidth="1.5" />

            {/* Incircle */}
            <circle cx="85" cy="165" r="35" fill="#fef3c7" fillOpacity="0.4" stroke="#d97706" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="85" cy="165" r="3" fill="#d97706" />
            <text x="95" y="168" className="text-[11px] font-bold fill-amber-900 dark:fill-amber-300">Incentre (I)</text>

            {/* Side Lengths */}
            <text x="40" y="130" textAnchor="end" className="font-bold text-[12px] fill-slate-700 dark:fill-slate-300">a (Perpendicular)</text>
            <text x="160" y="222" textAnchor="middle" className="font-bold text-[12px] fill-slate-700 dark:fill-slate-300">b (Base)</text>
            <text x="175" y="115" className="font-bold text-[12px] fill-slate-700 dark:fill-slate-300">c (Hypotenuse)</text>

            {/* Inradius Formula Banner */}
            <g transform="translate(130, 20)">
              <rect x="0" y="0" width="165" height="38" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1" />
              <text x="10" y="16" className="text-[10px] font-bold fill-blue-900">Inradius Formula:</text>
              <text x="10" y="30" className="text-[10px] font-extrabold fill-blue-700">r = (a + b - c) / 2 = s - c</text>
            </g>
          </svg>
        );

      case 'dice-net':
        return (
          <svg viewBox="0 0 300 240" className="w-full max-w-sm mx-auto">
            {/* Standard Cross Net */}
            {/* Top (Face 1) */}
            <rect x="110" y="10" width="50" height="50" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="135" y="42" textAnchor="middle" className="text-[18px] font-bold fill-blue-900">1</text>

            {/* Middle Row (Faces 2, 3, 4, 5) */}
            <rect x="60" y="65" width="50" height="50" rx="4" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
            <text x="85" y="97" textAnchor="middle" className="text-[18px] font-bold fill-slate-800">2</text>

            <rect x="110" y="65" width="50" height="50" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="135" y="97" textAnchor="middle" className="text-[18px] font-bold fill-blue-900">3</text>

            <rect x="160" y="65" width="50" height="50" rx="4" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
            <text x="185" y="97" textAnchor="middle" className="text-[18px] font-bold fill-slate-800">4</text>

            <rect x="210" y="65" width="50" height="50" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="235" y="97" textAnchor="middle" className="text-[18px] font-bold fill-blue-900">5</text>

            {/* Bottom (Face 6) */}
            <rect x="110" y="120" width="50" height="50" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="135" y="152" textAnchor="middle" className="text-[18px] font-bold fill-blue-900">6</text>

            {/* Opposite Rule Callout */}
            <g transform="translate(30, 185)">
              <rect x="0" y="0" width="240" height="42" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
              <text x="10" y="16" className="text-[10px] font-bold fill-amber-900">Alternating Face Law:</text>
              <text x="10" y="32" className="text-[9.5px] fill-amber-800">Opposites: (1 ↔ 6), (2 ↔ 4), (3 ↔ 5)</text>
            </g>
          </svg>
        );

      case 'mirror-inversion':
        return (
          <svg viewBox="0 0 320 180" className="w-full max-w-sm mx-auto">
            {/* Mirror Line */}
            <line x1="160" y1="15" x2="160" y2="165" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5 3" />
            <text x="160" y="175" textAnchor="middle" className="text-[9px] font-bold fill-red-500 uppercase tracking-widest">Mirror (M - N)</text>

            {/* Left Letter: Original 'P' */}
            <g transform="translate(60, 45)">
              <text x="0" y="65" className="font-extrabold text-[70px] fill-slate-900 dark:fill-white font-mono">P</text>
              <text x="10" y="90" className="text-[10px] font-bold fill-slate-500 uppercase">Original</text>
            </g>

            {/* Right Letter: Laterally Inverted 'ꟼ' */}
            <g transform="translate(240, 45) scale(-1, 1)">
              <text x="-40" y="65" className="font-extrabold text-[70px] fill-indigo-600 dark:fill-indigo-400 font-mono">P</text>
            </g>
            <text x="210" y="135" className="text-[10px] font-bold fill-indigo-600 dark:fill-indigo-400 uppercase">Mirror Image</text>
          </svg>
        );

      default:
        return (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
            [Concept Diagram: {diagram.title}]
          </div>
        );
    }
  };

  return (
    <div className="my-6 p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          {diagram.title}
        </h4>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          DIAGRAM
        </span>
      </div>

      <div className="py-2 flex justify-center">
        {renderSvgContent()}
      </div>

      {diagram.caption && (
        <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400 italic">
          {diagram.caption}
        </p>
      )}
    </div>
  );
};
