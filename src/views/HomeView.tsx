import React, { useState, useEffect } from 'react';
import { ALL_CHAPTERS } from '../content/allChapters';
import { ENGLISH_CHAPTERS } from '../content/englishChapters';
import { MATHS_CHAPTERS } from '../content/mathsChapters';
import { REASONING_CHAPTERS } from '../content/reasoningChapters';
import { GENERAL_AWARENESS_CHAPTERS } from '../content/generalAwarenessChapters';
import { TIER2_CHAPTERS } from '../content/tier2Chapters';
import { STUDY_PLAN_DAYS } from '../content/studyPlan';
import { storageService } from '../services/storageService';
import { SubjectType } from '../types';

interface HomeViewProps {
  onNavigate: (route: string, slug?: string) => void;
  onOpenChapter: (slug: string, subject: SubjectType) => void;
  onStartMiniTest: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenChapter,
  onStartMiniTest,
}) => {
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [lastOpened, setLastOpened] = useState<{
    slug: string;
    subject: string;
    title: string;
  } | null>(null);
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [unresolvedErrorsCount, setUnresolvedErrorsCount] = useState<number>(0);

  // Live Exam Countdown to 30 Sep 2026
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 16, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateStats = () => {
      setCompletedChapters(storageService.getCompletedChapters());
      setLastOpened(storageService.getLastOpenedChapter());
      setRecentResults(storageService.getTestResults().slice(0, 3));
      setUnresolvedErrorsCount(
        storageService.getErrorLog().filter((e) => !e.isCorrected).length
      );
    };

    updateStats();
    window.addEventListener('danish_cgl_storage_changed', updateStats);

    const examDate = new Date('2026-09-30T09:00:00+05:30').getTime();

    const calculateTime = () => {
      const now = new Date('2026-09-14T10:00:00+05:30').getTime(); // Current mock reference date or real time
      const diff = Math.max(0, examDate - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    return () => window.removeEventListener('danish_cgl_storage_changed', updateStats);
  }, []);

  const todayPlan = STUDY_PLAN_DAYS.find((d) => d.isToday) || STUDY_PLAN_DAYS[0];

  const totalChapters = ALL_CHAPTERS.length;
  const completedCount = completedChapters.length;
  const progressPercent = Math.round((completedCount / totalChapters) * 100);

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      
      {/* Personalized Welcome Banner */}
      <div className="p-8 md:p-10 rounded-3xl bg-linear-to-br from-[#0f2042] via-[#000922] to-[#002622] text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col gap-3 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#19988c]/20 border border-[#19988c]/40 text-[#89f5e7] font-mono text-[11px] font-bold uppercase tracking-wider">
              A Personal Note of Encouragement
            </span>
          </div>

          <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] md:text-[38px] font-extrabold tracking-tight leading-tight">
            Assalamu Alaikum, Danish Fatma!
          </h1>

          <p className="font-['Inter'] text-[15px] md:text-[16px] text-[#e0e8f6] leading-relaxed">
            This study hub has been tailored for you with great care by <strong className="text-white">Tauqeer Ashraf</strong>. With dedicated focus on your highest-yield English rules and mathematical shortcuts, you have everything required to excel in the upcoming SSC CGL 2026 Tier-I examination.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('study-plan')}
              className="px-5 py-2.5 rounded-xl bg-[#19988c] hover:bg-[#147a70] text-[#002622] font-bold text-[13px] shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>View Today’s 14 Sep Target</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>

            <button
              onClick={() => onNavigate('ask-tutor')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-[13px] flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">smart_toy</span>
              <span>Ask Your Study Tutor</span>
            </button>
          </div>
        </div>

        {/* Live Exam Countdown Box */}
        <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col items-center justify-center shrink-0 w-full md:w-auto relative z-10">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#89f5e7] font-bold">
            Target Exam Date: 30 Sep 2026
          </span>
          <div className="flex items-center gap-3 mt-3 font-['JetBrains_Mono']">
            <div className="flex flex-col items-center">
              <span className="text-[34px] font-bold leading-none">{timeLeft.days}</span>
              <span className="text-[10px] uppercase text-[#94a3b8] mt-1">Days</span>
            </div>
            <span className="text-[24px] font-light text-white/40 pb-3">:</span>
            <div className="flex flex-col items-center">
              <span className="text-[34px] font-bold leading-none">
                {timeLeft.hours.toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase text-[#94a3b8] mt-1">Hours</span>
            </div>
            <span className="text-[24px] font-light text-white/40 pb-3">:</span>
            <div className="flex flex-col items-center">
              <span className="text-[34px] font-bold leading-none">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase text-[#94a3b8] mt-1">Mins</span>
            </div>
          </div>
          <span className="text-[11px] text-white/70 mt-3 font-medium">
            16 Full Preparation Days Remaining
          </span>
        </div>
      </div>

      {/* Quick Action Cards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={onStartMiniTest}
          className="p-5 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] hover:border-[#0f2042] text-left flex flex-col justify-between shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0f2042] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">quiz</span>
            </span>
            <span className="material-symbols-outlined text-[#515f74] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
          <div>
            <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#000922] dark:text-[#f8f9ff]">
              Daily Mini Test
            </h4>
            <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
              8-minute rapid calibration
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('mathematics-formulas')}
          className="p-5 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] hover:border-[#0f2042] text-left flex flex-col justify-between shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0f2042] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">calculate</span>
            </span>
            <span className="material-symbols-outlined text-[#515f74] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
          <div>
            <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#000922] dark:text-[#f8f9ff]">
              Formula Hub
            </h4>
            <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
              KaTeX-rendered cheat sheets
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('error-log')}
          className="p-5 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] hover:border-[#ba1a1a] text-left flex flex-col justify-between shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-10 h-10 rounded-xl bg-[#fff1f2] text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">warning</span>
            </span>
            {unresolvedErrorsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold font-mono">
                {unresolvedErrorsCount} Traps
              </span>
            )}
          </div>
          <div>
            <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#000922] dark:text-[#f8f9ff]">
              Error Log
            </h4>
            <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
              Eliminate negative marks
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('last-day-revision')}
          className="p-5 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] hover:border-[#0f2042] text-left flex flex-col justify-between shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0f2042] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">bolt</span>
            </span>
            <span className="material-symbols-outlined text-[#515f74] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
          <div>
            <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#000922] dark:text-[#f8f9ff]">
              Rapid Revision
            </h4>
            <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
              Condensed exam checkpoints
            </p>
          </div>
        </button>
      </div>

      {/* Main Two-Column Row: Today's Target vs Continue Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Columns: Today's Target (14 Sep) & Syllabus Progress */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Today's Target Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#e5eeff] dark:border-[#1a2942] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                  Today’s Study Agenda — {todayPlan.dayLabel}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('study-plan')}
                className="text-[12px] font-semibold text-[#0f2042] dark:text-[#8ea4c8] hover:underline"
              >
                View Full Timeline
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* English Agenda */}
              <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex flex-col justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono uppercase font-bold text-[#0f2042] dark:text-[#8ea4c8]">
                    English Priority
                  </span>
                  <h4 className="font-bold text-[14px] text-[#000922] dark:text-[#f8f9ff] mt-0.5">
                    {todayPlan.englishTask.title}
                  </h4>
                  <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8] mt-1">
                    {todayPlan.englishTask.description}
                  </p>
                </div>
                {todayPlan.englishTask.slug && (
                  <button
                    onClick={() => onOpenChapter(todayPlan.englishTask.slug!, 'English')}
                    className="text-[12px] font-bold text-[#0f2042] dark:text-[#89f5e7] hover:underline flex items-center gap-1 cursor-pointer mt-2"
                  >
                    <span>Read Topic Now</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                )}
              </div>

              {/* Maths Agenda */}
              <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex flex-col justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono uppercase font-bold text-[#0f2042] dark:text-[#8ea4c8]">
                    Quant Priority
                  </span>
                  <h4 className="font-bold text-[14px] text-[#000922] dark:text-[#f8f9ff] mt-0.5">
                    {todayPlan.mathsTask.title}
                  </h4>
                  <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8] mt-1">
                    {todayPlan.mathsTask.description}
                  </p>
                </div>
                {todayPlan.mathsTask.slug && (
                  <button
                    onClick={() => onOpenChapter(todayPlan.mathsTask.slug!, 'Mathematics')}
                    className="text-[12px] font-bold text-[#0f2042] dark:text-[#89f5e7] hover:underline flex items-center gap-1 cursor-pointer mt-2"
                  >
                    <span>Read Topic Now</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Subject Exploration Cards (All 5 Pillars of SSC CGL) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Reasoning Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-bold">
                    Tier-I &amp; II • 50 Marks
                  </span>
                  <span className="material-symbols-outlined text-indigo-600">psychology</span>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                  General Intelligence &amp; Reasoning
                </h3>
                <p className="text-[13px] text-[#515f74] dark:text-[#94a3b8] mt-1">
                  Kinship diagrams, Direction shadow laws, Syllogism Venn intersection, and Dice-net layouts.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-[#e5eeff] dark:border-[#1a2942]">
                <div className="flex items-center justify-between text-[12px] text-[#515f74]">
                  <span>Curriculum</span>
                  <span className="font-mono font-bold text-[#000922] dark:text-white">
                    {REASONING_CHAPTERS.length} Master Chapters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('reasoning')}
                    className="flex-1 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[12px] font-bold hover:bg-indigo-100 text-center cursor-pointer"
                  >
                    Reasoning Hub
                  </button>
                  <button
                    onClick={() => onOpenChapter('syllogism-venn', 'Reasoning')}
                    className="flex-1 py-2 rounded-xl bg-[#0f2042] text-white text-[12px] font-bold hover:bg-[#000922] text-center cursor-pointer"
                  >
                    Start Syllogism
                  </button>
                </div>
              </div>
            </div>

            {/* General Awareness Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-mono text-[11px] font-bold">
                    Tier-I &amp; II • 50 Marks
                  </span>
                  <span className="material-symbols-outlined text-amber-600">public</span>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                  General Awareness &amp; GK
                </h3>
                <p className="text-[13px] text-[#515f74] dark:text-[#94a3b8] mt-1">
                  Polity Articles &amp; Writs, Modern Indian Freedom struggle, River basins, Macroeconomics &amp; Static GK.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-[#e5eeff] dark:border-[#1a2942]">
                <div className="flex items-center justify-between text-[12px] text-[#515f74]">
                  <span>Curriculum</span>
                  <span className="font-mono font-bold text-[#000922] dark:text-white">
                    {GENERAL_AWARENESS_CHAPTERS.length} High-Yield Modules
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('general-awareness')}
                    className="flex-1 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[12px] font-bold hover:bg-amber-100 text-center cursor-pointer"
                  >
                    GK Hub
                  </button>
                  <button
                    onClick={() => onOpenChapter('indian-polity-constitution', 'General Awareness')}
                    className="flex-1 py-2 rounded-xl bg-[#0f2042] text-white text-[12px] font-bold hover:bg-[#000922] text-center cursor-pointer"
                  >
                    Polity Articles
                  </button>
                </div>
              </div>
            </div>

            {/* Mathematics Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-bold">
                    Tier-I &amp; II • 50 Marks
                  </span>
                  <span className="material-symbols-outlined text-emerald-600">calculate</span>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                  Quantitative Aptitude
                </h3>
                <p className="text-[13px] text-[#515f74] dark:text-[#94a3b8] mt-1">
                  Base-shift delta arithmetic, geometry inradius, Ptolemy’s cyclic quad theorems, and trigonometry.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-[#e5eeff] dark:border-[#1a2942]">
                <div className="flex items-center justify-between text-[12px] text-[#515f74]">
                  <span>Curriculum</span>
                  <span className="font-mono font-bold text-[#000922] dark:text-white">
                    {MATHS_CHAPTERS.length} Quant Modules
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('mathematics')}
                    className="flex-1 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[12px] font-bold hover:bg-emerald-100 text-center cursor-pointer"
                  >
                    Quant Hub
                  </button>
                  <button
                    onClick={() => onOpenChapter('percentage', 'Mathematics')}
                    className="flex-1 py-2 rounded-xl bg-[#0f2042] text-white text-[12px] font-bold hover:bg-[#000922] text-center cursor-pointer"
                  >
                    Percentages
                  </button>
                </div>
              </div>
            </div>

            {/* English Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-bold">
                    Tier-I &amp; II • 50 Marks
                  </span>
                  <span className="material-symbols-outlined text-blue-600">auto_stories</span>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                  English Language &amp; Comprehension
                </h3>
                <p className="text-[13px] text-[#515f74] dark:text-[#94a3b8] mt-1">
                  Grammar foundation, Subject-Verb concord, tenses, fixed prepositions, and BlackBook vocabulary.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-[#e5eeff] dark:border-[#1a2942]">
                <div className="flex items-center justify-between text-[12px] text-[#515f74]">
                  <span>Curriculum</span>
                  <span className="font-mono font-bold text-[#000922] dark:text-white">
                    {ENGLISH_CHAPTERS.length} Chapters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('english')}
                    className="flex-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[12px] font-bold hover:bg-blue-100 text-center cursor-pointer"
                  >
                    English Hub
                  </button>
                  <button
                    onClick={() => onOpenChapter('subject-verb-agreement', 'English')}
                    className="flex-1 py-2 rounded-xl bg-[#0f2042] text-white text-[12px] font-bold hover:bg-[#000922] text-center cursor-pointer"
                  >
                    Concord Rules
                  </button>
                </div>
              </div>
            </div>

            {/* Tier-II Specialized Modules Card (Full width on sm) */}
            <div className="sm:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono text-[11px] font-bold">
                    Tier-II Specific
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Statistics, Probability &amp; Computer Qualifying</span>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                  Tier-II Specialized Modules ({TIER2_CHAPTERS.length} Modules)
                </h3>
                <p className="text-[13px] text-[#515f74] dark:text-[#94a3b8]">
                  Crucial qualifying score in Computer Knowledge Module and high-scoring Statistics/Probability chapters.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => onNavigate('tier2')}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
                >
                  Explore Tier-II
                </button>
                <button
                  onClick={() => onNavigate('revision-all')}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  All Syllabus Traps
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right 5 Columns: Continue Where You Left Off & Performance Snippets */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Continue Where You Left Off */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-[#515f74] dark:text-[#94a3b8]">
                Resume Learning
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#10b981]">history</span>
            </div>

            {lastOpened ? (
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[12px] font-bold text-[#0f2042] dark:text-[#8ea4c8]">
                    {lastOpened.subject}
                  </span>
                  <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#000922] dark:text-[#f8f9ff]">
                    {lastOpened.title}
                  </h4>
                </div>
                <button
                  onClick={() =>
                    onOpenChapter(
                      lastOpened.slug,
                      lastOpened.subject as 'English' | 'Mathematics'
                    )
                  }
                  className="w-full py-2.5 rounded-xl bg-[#0f2042] text-white text-[13px] font-bold hover:bg-[#000922] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Continue Lesson</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] text-[#000922] dark:text-[#f8f9ff]">
                  Begin with Subject–Verb Agreement
                </h4>
                <p className="text-[13px] text-[#515f74] dark:text-[#94a3b8]">
                  Rule 1: Prepositional phrase interposition and isolating the true head subject.
                </p>
                <button
                  onClick={() => onOpenChapter('subject-verb-agreement', 'English')}
                  className="w-full py-2.5 rounded-xl bg-[#0f2042] text-white text-[13px] font-bold hover:bg-[#000922] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Start Module 1</span>
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                </button>
              </div>
            )}
          </div>

          {/* Syllabus Overall Progress */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] text-[#000922] dark:text-[#f8f9ff]">
                Curriculum Mastery Status
              </h4>
              <span className="font-mono text-[13px] font-bold text-[#0f2042] dark:text-[#8ea4c8]">
                {completedCount} / {totalChapters} Completed
              </span>
            </div>

            <div className="w-full bg-[#eff4ff] dark:bg-[#1a2942] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#10b981] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#515f74] dark:text-[#94a3b8]">
              <span>Tier-I High Priority Syllabus</span>
              <span className="font-bold">
                {completedCount === 0 ? '0% (Not Started)' : `${progressPercent}% Completed`}
              </span>
            </div>
          </div>

          {/* Recent Mock Attempts Snippet */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] text-[#000922] dark:text-[#f8f9ff]">
                Recent Mock Performance
              </h4>
              <button
                onClick={() => onNavigate('mock-tests')}
                className="text-[12px] font-bold text-[#0f2042] dark:text-[#8ea4c8] hover:underline"
              >
                All Mocks
              </button>
            </div>

            {recentResults.length === 0 ? (
              <div className="text-center py-6 text-[13px] text-[#515f74] dark:text-[#94a3b8]">
                No mock test attempted yet. Launch English Sectional 1 or Daily Mini Test to benchmark accuracy.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recentResults.map((r) => (
                  <div
                    key={r.attemptId}
                    className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-[13px] text-[#000922] dark:text-[#f8f9ff]">
                        {r.title}
                      </div>
                      <span className="text-[11px] text-[#515f74] dark:text-[#94a3b8]">
                        Accuracy: {r.accuracy}% • -{r.negativeMarksLost} marks lost
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[15px] text-[#0f2042] dark:text-[#8ea4c8]">
                      {r.totalScore.toFixed(1)} / {r.maxMarks}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
