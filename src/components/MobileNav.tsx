import React, { useState } from 'react';

interface MobileNavProps {
  currentRoute: string;
  onNavigate: (route: string, slug?: string) => void;
  onOpenSearch: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
}) => {
  const [isSubjectsSheetOpen, setIsSubjectsSheetOpen] = useState(false);

  const subjects = [
    { id: 'reasoning', label: 'Reasoning', sub: 'Kinship, Venn, Direction, Dice', icon: 'psychology', badge: 'Tier I & II' },
    { id: 'general-awareness', label: 'GA & GK', sub: 'Polity, History, Rivers, Macro', icon: 'public', badge: 'Tier I & II' },
    { id: 'mathematics', label: 'Quantitative', sub: 'Arithmetic, Geometry, Algebra', icon: 'calculate', badge: 'Tier I & II' },
    { id: 'english', label: 'English Language', sub: 'Grammar rules, Vocab, Concord', icon: 'auto_stories', badge: 'Tier I & II' },
    { id: 'tier2', label: 'Tier-II Modules', sub: 'Stats, Probability, Computer', icon: 'memory', badge: 'Tier II Only' },
    { id: 'syllabus', label: 'Syllabus Tracker', sub: 'Official TCS Tier-I & II map', icon: 'account_tree', badge: 'Full Map' },
  ];

  const isSubjectActive = [
    'reasoning',
    'general-awareness',
    'mathematics',
    'english',
    'tier2',
    'chapter-reading',
    'syllabus',
    'english-grammar-rules',
    'english-vocabulary',
    'mathematics-formulas',
  ].includes(currentRoute);

  return (
    <>
      {/* Subjects Quick Drawer / Bottom Sheet */}
      {isSubjectsSheetOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end md:hidden animate-in fade-in duration-200"
          onClick={() => setIsSubjectsSheetOpen(false)}
        >
          <div 
            className="w-full bg-white dark:bg-[#0c1527] rounded-t-3xl border-t border-[#e5eeff] dark:border-[#1a2942] p-5 pb-8 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom duration-250 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto -mt-1" />

            <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff] dark:border-[#1a2942]">
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[17px] text-[#000922] dark:text-[#f8f9ff]">
                  SSC CGL 5 Pillars
                </h3>
                <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8]">
                  Select a subject hub or curriculum module
                </p>
              </div>
              <button
                onClick={() => setIsSubjectsSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-[#eff4ff] dark:bg-[#15233c] text-[#515f74] dark:text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {subjects.map((sub) => {
                const isActive = currentRoute === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      onNavigate(sub.id);
                      setIsSubjectsSheetOpen(false);
                    }}
                    className={`p-3.5 rounded-2xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0f2042] text-white border-[#0f2042] shadow-sm'
                        : 'bg-[#f8f9ff] dark:bg-[#111c30] text-[#000922] dark:text-[#f8f9ff] border-[#e5eeff] dark:border-[#1a2942] hover:bg-[#eff4ff]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive 
                          ? 'bg-white/15 text-white' 
                          : 'bg-[#eff4ff] dark:bg-[#1a2942] text-[#0f2042] dark:text-[#8ea4c8]'
                      }`}>
                        <span className="material-symbols-outlined text-[20px]">{sub.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[14px] leading-snug">{sub.label}</span>
                        <span className={`text-[11px] line-clamp-1 ${
                          isActive ? 'text-white/80' : 'text-[#515f74] dark:text-[#94a3b8]'
                        }`}>
                          {sub.sub}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {sub.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search Shortcut inside sheet */}
            <button
              onClick={() => {
                setIsSubjectsSheetOpen(false);
                onOpenSearch();
              }}
              className="mt-1 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold text-[13px] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span>Search Across All 24 Modules (⌘K)</span>
            </button>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav 
        id="mobile-bottom-navigation"
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#070e1c]/95 backdrop-blur-md border-t border-[#e5eeff] dark:border-[#1a2942] md:hidden px-2 py-1 shadow-lg"
      >
        <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
          {/* 1. Home */}
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer min-h-[44px] ${
              currentRoute === 'dashboard'
                ? 'text-[#0f2042] dark:text-[#89f5e7] font-bold'
                : 'text-[#515f74] dark:text-[#94a3b8] hover:text-[#0f2042]'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${
              currentRoute === 'dashboard' ? 'fill-1' : ''
            }`}>
              home
            </span>
            <span className="text-[10px] leading-tight mt-0.5 font-medium">Home</span>
          </button>

          {/* 2. Subjects Hub (Drawer Trigger) */}
          <button
            onClick={() => setIsSubjectsSheetOpen(true)}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer min-h-[44px] ${
              isSubjectActive
                ? 'text-[#0f2042] dark:text-[#89f5e7] font-bold'
                : 'text-[#515f74] dark:text-[#94a3b8] hover:text-[#0f2042]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              menu_book
            </span>
            <span className="text-[10px] leading-tight mt-0.5 font-medium">Subjects</span>
          </button>

          {/* 3. Practice / MCQs */}
          <button
            onClick={() => onNavigate('practice')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer min-h-[44px] ${
              currentRoute === 'practice'
                ? 'text-[#0f2042] dark:text-[#89f5e7] font-bold'
                : 'text-[#515f74] dark:text-[#94a3b8] hover:text-[#0f2042]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              fitness_center
            </span>
            <span className="text-[10px] leading-tight mt-0.5 font-medium">Practice</span>
          </button>

          {/* 4. Mocks */}
          <button
            onClick={() => onNavigate('mock-tests')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer min-h-[44px] ${
              currentRoute === 'mock-tests' || currentRoute === 'mock-results'
                ? 'text-[#0f2042] dark:text-[#89f5e7] font-bold'
                : 'text-[#515f74] dark:text-[#94a3b8] hover:text-[#0f2042]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              timer
            </span>
            <span className="text-[10px] leading-tight mt-0.5 font-medium">Mocks</span>
          </button>

          {/* 5. Revision */}
          <button
            onClick={() => onNavigate('revision-all')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer min-h-[44px] ${
              currentRoute === 'revision-all' || currentRoute === 'last-day-revision'
                ? 'text-[#0f2042] dark:text-[#89f5e7] font-bold'
                : 'text-[#515f74] dark:text-[#94a3b8] hover:text-[#0f2042]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              bolt
            </span>
            <span className="text-[10px] leading-tight mt-0.5 font-medium">Revision</span>
          </button>
        </div>
      </nav>
    </>
  );
};
