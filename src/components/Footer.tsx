import React from 'react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-[#e5eeff] dark:border-[#1a2942] bg-white dark:bg-[#070e1c] py-10 px-4 md:px-8 mt-16 print:hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] text-[#000922] dark:text-[#f8f9ff]">
              Danish SSC CGL Study Hub
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#eff4ff] dark:bg-[#1a2942] text-[#0f2042] dark:text-[#8ea4c8]">
              Tier-I 2026
            </span>
          </div>
          <p className="text-[13px] text-[#515f74] dark:text-[#94a3b8] mt-1">
            Dedicated learning management system prepared specifically for Danish Fatma by Tauqeer Ashraf.
          </p>
          <p className="text-[11px] text-[#515f74]/70 dark:text-[#94a3b8]/70 mt-1">
            Grounded in TCS pattern question frameworks, BlackBook vocabulary, and non-pen Quant shortcuts.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[13px] font-medium text-[#515f74] dark:text-[#94a3b8]">
          <button onClick={() => onNavigate('dashboard')} className="hover:text-[#0f2042] dark:hover:text-white cursor-pointer">
            Dashboard
          </button>
          <button onClick={() => onNavigate('syllabus')} className="hover:text-[#0f2042] dark:hover:text-white cursor-pointer">
            Syllabus Map
          </button>
          <button onClick={() => onNavigate('study-plan')} className="hover:text-[#0f2042] dark:hover:text-white cursor-pointer">
            17-Day Plan
          </button>
          <button onClick={() => onNavigate('last-day-revision')} className="hover:text-[#0f2042] dark:hover:text-white cursor-pointer">
            Rapid Revision
          </button>
          <button onClick={() => onNavigate('error-log')} className="hover:text-[#0f2042] dark:hover:text-white cursor-pointer">
            Error Log
          </button>
          <button onClick={() => onNavigate('settings')} className="hover:text-[#0f2042] dark:hover:text-white cursor-pointer">
            Settings &amp; Backup
          </button>
        </div>

      </div>
    </footer>
  );
};
