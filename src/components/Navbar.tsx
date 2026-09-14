import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string, slug?: string) => void;
  onOpenSearch: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
  isDarkMode,
  onToggleTheme,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      setErrorCount(storageService.getErrorLog().filter((e) => !e.isCorrected).length);
      setBookmarkCount(storageService.getBookmarks().length);
    };
    updateCounts();
    window.addEventListener('danish_cgl_storage_changed', updateCounts);
    return () => window.removeEventListener('danish_cgl_storage_changed', updateCounts);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'reasoning', label: 'Reasoning', icon: 'psychology' },
    { id: 'general-awareness', label: 'GA & GK', icon: 'public' },
    { id: 'mathematics', label: 'Quantitative', icon: 'calculate' },
    { id: 'english', label: 'English', icon: 'auto_stories' },
    { id: 'tier2', label: 'Tier-II', icon: 'memory' },
    { id: 'practice', label: 'MCQs', icon: 'fitness_center' },
    { id: 'mock-tests', label: 'Mocks', icon: 'timer' },
    { id: 'revision-all', label: 'Revision', icon: 'bolt' },
    { id: 'ask-tutor', label: 'AI Tutor', icon: 'smart_toy', highlight: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#070e1c]/95 backdrop-blur-md border-b border-[#e5eeff] dark:border-[#1a2942]">
      {/* Top micro-bar with dedication notice */}
      <div className="bg-[#000922] text-[#89f5e7] px-3 py-1.5 text-center text-[10px] sm:text-[11px] font-medium tracking-wide flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 leading-tight">
        <span>Prepared for Danish Fatma with care by Tauqeer Ashraf</span>
        <span className="text-[#89f5e7]/40 hidden xs:inline">•</span>
        <span className="text-white/80 font-mono">Target: SSC CGL 2026 (30 Sep)</span>
      </div>

      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Name */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0f2042] text-white flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-[16px] sm:text-[18px] shadow-xs">
            DF
          </div>
          <div className="flex flex-col">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[14px] sm:text-[16px] leading-tight text-[#000922] dark:text-[#f8f9ff]">
              Danish Study Hub
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#515f74] dark:text-[#94a3b8] font-['JetBrains_Mono'] hidden xs:block">
              SSC CGL 2026 Companion
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-xl text-[13px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#0f2042] text-white shadow-xs'
                    : item.highlight
                    ? 'bg-[#002622] text-[#19988c] hover:bg-[#003d36]'
                    : 'text-[#515f74] dark:text-[#b9c7df] hover:bg-[#eff4ff] dark:hover:bg-[#15233c] hover:text-[#000922]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Quick Search Shortcut for Desktop */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] bg-[#f8f9ff] dark:bg-[#111c30] text-[12px] text-[#515f74] dark:text-[#94a3b8] hover:border-[#0f2042] cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">search</span>
            <span>Search syllabus...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#070e1c] border border-[#e5eeff] dark:border-[#1a2942] text-[10px] font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Quick Search Button for Mobile */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] bg-white dark:bg-[#0c1527] text-[#515f74] dark:text-[#94a3b8] hover:text-[#0f2042] cursor-pointer"
            title="Search Syllabus"
          >
            <span className="material-symbols-outlined text-[19px]">search</span>
          </button>

          {/* Bookmarks Icon (Desktop / Tablet) */}
          <button
            onClick={() => onNavigate('bookmarks')}
            className="hidden sm:flex relative p-2 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] bg-white dark:bg-[#0c1527] text-[#515f74] dark:text-[#94a3b8] hover:text-[#0f2042] cursor-pointer"
            title="Saved Bookmarks"
          >
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#059669] text-white text-[9px] font-bold flex items-center justify-center font-mono">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Error Log Icon with badge */}
          <button
            onClick={() => onNavigate('error-log')}
            className="relative p-2 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] bg-white dark:bg-[#0c1527] text-[#515f74] dark:text-[#94a3b8] hover:text-[#ba1a1a] cursor-pointer"
            title="Error Log Notebook"
          >
            <span className="material-symbols-outlined text-[19px] sm:text-[20px]">warning</span>
            {errorCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ba1a1a] text-white text-[9px] font-bold flex items-center justify-center font-mono animate-pulse">
                {errorCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] bg-white dark:bg-[#0c1527] text-[#515f74] dark:text-[#94a3b8] hover:text-[#0f2042] cursor-pointer"
            title="Toggle theme"
          >
            <span className="material-symbols-outlined text-[19px] sm:text-[20px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Settings (Desktop / Tablet) */}
          <button
            onClick={() => onNavigate('settings')}
            className="hidden sm:flex p-2 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] bg-white dark:bg-[#0c1527] text-[#515f74] dark:text-[#94a3b8] hover:text-[#0f2042] cursor-pointer"
            title="Settings & Data Management"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] text-[#515f74] dark:text-[#94a3b8] cursor-pointer hover:bg-[#eff4ff] dark:hover:bg-[#15233c]"
            title="Toggle Menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-[#e5eeff] dark:border-[#1a2942] bg-white dark:bg-[#070e1c] p-4 flex flex-col gap-2 max-h-[80vh] overflow-y-auto shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="text-[11px] font-mono uppercase font-bold text-[#515f74] px-1 mb-1">
            Navigation Menu
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-left text-[14px] font-semibold flex items-center gap-2.5 cursor-pointer min-h-[44px] ${
                currentRoute === item.id
                  ? 'bg-[#0f2042] text-white'
                  : item.highlight
                  ? 'bg-[#002622] text-[#19988c]'
                  : 'text-[#515f74] dark:text-[#b9c7df] hover:bg-[#eff4ff] dark:hover:bg-[#15233c]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className="border-t border-[#e5eeff] dark:border-[#1a2942] my-1 pt-2 flex flex-col gap-1.5">
            <button
              onClick={() => {
                onNavigate('bookmarks');
                setIsMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl text-left text-[14px] font-semibold text-[#515f74] dark:text-[#b9c7df] flex items-center justify-between hover:bg-[#eff4ff] dark:hover:bg-[#15233c] min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">bookmark</span>
                <span>Saved Bookmarks</span>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#eff4ff] dark:bg-[#15233c] text-[#0f2042] dark:text-[#8ea4c8]">
                {bookmarkCount}
              </span>
            </button>

            <button
              onClick={() => {
                onNavigate('settings');
                setIsMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl text-left text-[14px] font-semibold text-[#515f74] dark:text-[#b9c7df] flex items-center gap-2.5 hover:bg-[#eff4ff] dark:hover:bg-[#15233c] min-h-[44px]"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              <span>Settings &amp; Backup</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
