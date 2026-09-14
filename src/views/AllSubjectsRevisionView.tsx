import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  AlertTriangle, 
  BookOpen, 
  Brain, 
  Globe2, 
  Calculator, 
  Cpu, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { ALL_CHAPTERS, SUBJECTS_CONFIG } from '../content/allChapters';
import { SubjectType, AppRoute } from '../types';

interface AllSubjectsRevisionViewProps {
  onNavigate: (route: AppRoute, params?: { chapterSlug?: string }) => void;
}

export const AllSubjectsRevisionView: React.FC<AllSubjectsRevisionViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'traps' | 'tricks' | 'all'>('traps');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChapters = ALL_CHAPTERS.filter((ch) => {
    const matchesSubject = selectedSubject === 'all' || ch.subject === selectedSubject;
    const matchesQuery =
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.favouriteTrap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ch.memoryTrick && ch.memoryTrick.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ch.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesQuery;
  });

  const getSubjectRoute = (subject: SubjectType, slug: string): { route: AppRoute; params: { chapterSlug: string } } => {
    switch (subject) {
      case 'Reasoning':
        return { route: 'reasoning-chapter', params: { chapterSlug: slug } };
      case 'General Awareness':
        return { route: 'ga-chapter', params: { chapterSlug: slug } };
      case 'Mathematics':
        return { route: 'maths-chapter', params: { chapterSlug: slug } };
      case 'Tier-II':
        return { route: 'tier2-chapter', params: { chapterSlug: slug } };
      case 'English':
      default:
        return { route: 'english-chapter', params: { chapterSlug: slug } };
    }
  };

  const getSubjectIcon = (subject: SubjectType) => {
    switch (subject) {
      case 'Reasoning':
        return <Brain className="w-3.5 h-3.5 text-indigo-500" />;
      case 'General Awareness':
        return <Globe2 className="w-3.5 h-3.5 text-amber-500" />;
      case 'Mathematics':
        return <Calculator className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Tier-II':
        return <Cpu className="w-3.5 h-3.5 text-purple-500" />;
      case 'English':
      default:
        return <BookOpen className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cross-Syllabus Rapid Revision</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Master Revision & Examiner Trap Radar
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Consolidated quick-revision deck spanning all 24 chapters across Reasoning, General Awareness, Quantitative Aptitude, English Grammar, and Tier-II Modules. Use this before mock tests or in the final week prior to the examination.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search traps, memory tricks, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedSubject === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              All Subjects ({ALL_CHAPTERS.length})
            </button>
            {SUBJECTS_CONFIG.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSubject(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedSubject === s.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                {s.id}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('traps')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'traps'
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Examiner Trap Points ({filteredChapters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tricks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'tricks'
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Memory Anchors & Formulas</span>
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((ch) => {
            const nav = getSubjectRoute(ch.subject, ch.slug);

            return (
              <div
                key={ch.slug}
                className="flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {getSubjectIcon(ch.subject)}
                      <span>{ch.subject}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {ch.rulesCount} Rules
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {ch.title}
                  </h3>

                  {/* Body based on tab */}
                  {activeTab === 'traps' ? (
                    <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50 space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Examiner's Trap
                      </span>
                      <p className="text-xs text-rose-950 dark:text-rose-200 leading-relaxed font-medium">
                        {ch.favouriteTrap}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Memory Anchor
                      </span>
                      <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                        {ch.memoryTrick || 'Master core structural identities and review solved problems.'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {ch.estimatedMinutes}m review
                  </span>
                  <button
                    onClick={() => onNavigate(nav.route, nav.params)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>Read Chapter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
