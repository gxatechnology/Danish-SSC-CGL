import React, { useState } from 'react';
import { NavTab } from '../types';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenSearch: () => void;
  bookmarksCount: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenBookmarks: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  bookmarksCount,
  isDarkMode,
  onToggleTheme,
  onOpenBookmarks,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'english', label: 'English' },
    { id: 'mathematics', label: 'Mathematics' },
    { id: 'practice', label: 'Practice' },
    { id: 'mock-tests', label: 'Mock Tests' },
    { id: 'revision', label: 'Revision' },
    { id: 'study-plan', label: 'Study Plan' },
    { id: 'progress', label: 'Progress' },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/95 dark:bg-[#070e1c]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(15,32,66,0.06)] border-b border-[#e5eeff] dark:border-[#1a2942]">
      <div className="h-16 w-full max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 shrink-0 cursor-pointer group"
          id="app-brand-logo"
        >
          <img
            alt="Danish SSC CGL Study Hub Logo"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WCtHJEX-X9i8LC1X45MZNhNS6i_kz2JZlE3-9jrvwDQCGV-nQVvu1KQfHxgyOsgFjvKdIPYLv1rAYIz0QGqAv026n6CPEdkdcmbIrZk7XJMWq9dMyGP-NXsDgbPdv0YfdZP_n4xrau_XGTsQdd1mXpiHh39iQc7DddPj0jmhjIywzWs7-g_j2mAQWfM9uakWHIwEKG1qljo77SP65Fcyn63Fnlm-gEAoNlMvDU2ruaPCSNEohyWNXWjPw"
          />
          <div className="flex flex-col">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] text-[#000922] dark:text-[#f8f9ff] leading-tight tracking-tight">
              Danish SSC CGL
            </span>
            <span className="font-['Inter'] font-bold text-[10px] text-[#515f74] dark:text-[#94a3b8] tracking-widest uppercase">
              Study Hub 2026
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0f2042] text-[#ffffff] font-semibold text-[14px] rounded-lg shadow-xs'
                    : 'font-sans font-semibold text-[14px] text-[#45464e] dark:text-[#b9c7df] hover:bg-[#e5eeff] dark:hover:bg-[#15233c] hover:text-[#0b1c30] dark:hover:text-[#ffffff] rounded-lg'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Section Tools */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          
          {/* Quick Search Button */}
          <button
            id="global-search-trigger"
            onClick={onOpenSearch}
            className="hidden md:flex items-center bg-[#eff4ff] dark:bg-[#111c30] px-3 py-1.5 rounded-lg border border-[#e5eeff] dark:border-[#223552] gap-2 w-56 lg:w-64 text-[#45464e] dark:text-[#a0aec0] hover:border-[#7988b0] transition-colors cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[18px] text-[#515f74] dark:text-[#8ea4c8]">search</span>
            <span className="font-['Inter'] text-[13px] flex-1 truncate">Search notes, formulas...</span>
            <kbd className="font-['JetBrains_Mono'] text-[11px] bg-[#ffffff] dark:bg-[#1b2b46] px-1.5 py-0.5 rounded text-[#515f74] dark:text-[#b9c7df] border border-[#e5eeff] dark:border-[#2a3f63] shadow-xs font-semibold">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Search Icon */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-lg text-[#45464e] dark:text-[#b9c7df] hover:bg-[#e5eeff] dark:hover:bg-[#1a2942] transition-colors"
            title="Search"
            id="mobile-search-button"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {/* Bookmarks Counter */}
          <button
            id="bookmark-list-trigger"
            onClick={onOpenBookmarks}
            className="relative p-2 rounded-lg text-[#45464e] dark:text-[#b9c7df] hover:bg-[#e5eeff] dark:hover:bg-[#1a2942] transition-colors cursor-pointer"
            title="View Saved Bookmarks"
          >
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
            <span className="absolute top-1 right-1 flex items-center justify-center font-['JetBrains_Mono'] text-[10px] font-bold h-4 w-4 rounded-full bg-[#002622] text-[#19988c] border border-[#6bd8cb]">
              {bookmarksCount}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-button"
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-[#45464e] dark:text-[#b9c7df] hover:bg-[#e5eeff] dark:hover:bg-[#1a2942] transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDarkMode ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          <div className="h-6 w-px bg-[#e5eeff] dark:bg-[#1f314d] mx-1 hidden sm:block"></div>

          {/* User Profile Card */}
          <div 
            onClick={() => handleNavClick('progress')}
            className="flex items-center gap-2.5 pl-1 cursor-pointer group"
            id="user-profile-badge"
          >
            <div className="w-8 h-8 rounded-full bg-[#000922] dark:bg-[#3b82f6] flex items-center justify-center font-['JetBrains_Mono'] font-bold text-[#ffffff] text-[12px] shadow-xs tracking-wider group-hover:scale-105 transition-transform">
              DF
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="font-['Inter'] text-[12px] text-[#0b1c30] dark:text-[#f8f9ff] leading-tight font-semibold">
                Danish Fatma
              </span>
              <span className="font-['Inter'] text-[10px] text-[#002622] dark:text-[#6bd8cb] bg-[#89f5e7]/40 dark:bg-[#002622] px-1.5 py-0.5 rounded font-bold tracking-tight mt-0.5">
                Target: 30 Sep 2026
              </span>
            </div>
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            id="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-[#45464e] dark:text-[#b9c7df] hover:bg-[#e5eeff] transition-colors"
            title="Toggle Menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#ffffff] dark:bg-[#0c1527] border-b border-[#e5eeff] dark:border-[#1a2942] px-4 py-3 flex flex-col gap-1 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-[14px] font-semibold flex items-center justify-between ${
                  isActive
                    ? 'bg-[#0f2042] text-[#ffffff]'
                    : 'text-[#45464e] dark:text-[#b9c7df] hover:bg-[#e5eeff] dark:hover:bg-[#15233c]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="material-symbols-outlined text-[16px]">chevron_right</span>}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
