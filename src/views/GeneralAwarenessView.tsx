import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Search, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  Landmark,
  Scale,
  Microscope,
  Compass
} from 'lucide-react';
import { GENERAL_AWARENESS_CHAPTERS } from '../content/generalAwarenessChapters';
import { storageService } from '../services/storageService';
import { AppRoute, StudyChapter } from '../types';

interface GeneralAwarenessViewProps {
  onNavigate: (route: AppRoute, params?: { chapterSlug?: string }) => void;
}

export const GeneralAwarenessView: React.FC<GeneralAwarenessViewProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);

  useEffect(() => {
    const loadCompletion = () => {
      const completed = GENERAL_AWARENESS_CHAPTERS.filter((ch) =>
        storageService.isChapterCompleted(ch.slug)
      ).map((ch) => ch.slug);
      setCompletedSlugs(completed);
    };

    loadCompletion();
    window.addEventListener('danish_cgl_storage_changed', loadCompletion);
    return () => window.removeEventListener('danish_cgl_storage_changed', loadCompletion);
  }, []);

  const units = ['all', ...Array.from(new Set(GENERAL_AWARENESS_CHAPTERS.map((ch) => ch.unit || ch.category)))];

  const filteredChapters = GENERAL_AWARENESS_CHAPTERS.filter((ch) => {
    const matchesQuery =
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnit = selectedUnit === 'all' || ch.unit === selectedUnit || ch.category === selectedUnit;
    return matchesQuery && matchesUnit;
  });

  const completedCount = completedSlugs.length;
  const totalCount = GENERAL_AWARENESS_CHAPTERS.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/30">
                <Globe2 className="w-3.5 h-3.5" />
                <span>High-Scoring Static GK & Conceptual Foundation</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                General Awareness & GK Textbook
              </h1>
              <p className="text-amber-200 text-sm sm:text-base leading-relaxed">
                Comprehensive reference covering Indian Polity & Constitution, Modern History & INC Sessions, Physical & Indian Geography, and General Science (Physics, Chemistry, Biology). Includes high-frequency tables and PYQ traps.
              </p>
            </div>

            {/* Zero-State Metrics */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 flex flex-col justify-center min-w-[220px]">
              <div className="flex items-center justify-between text-xs text-amber-200 mb-2">
                <span>Verified Progress</span>
                <span className="font-bold text-white">{completedCount} of {totalCount} Done</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-amber-300 mt-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{progressPercent}% Complete • Real Session Data</span>
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles, rivers, dynasties, chemical formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {units.map((unit) => (
              <button
                key={unit}
                onClick={() => setSelectedUnit(unit)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedUnit === unit
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {unit === 'all' ? 'All Units' : unit}
              </button>
            ))}
          </div>
        </div>

        {/* Chapter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredChapters.map((chapter: StudyChapter) => {
            const isCompleted = completedSlugs.includes(chapter.slug);
            const assessment = storageService.getChapterAssessment(chapter.slug);

            return (
              <div
                key={chapter.slug}
                id={`card-${chapter.slug}`}
                className={`flex flex-col justify-between rounded-2xl border transition-all duration-200 hover:shadow-lg bg-white dark:bg-slate-900 ${
                  isCompleted
                    ? 'border-emerald-200 dark:border-emerald-900/60 ring-1 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700'
                } p-6 sm:p-7`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50">
                      {chapter.unit || chapter.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {assessment !== 'Not Yet' && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          assessment === 'Confident'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        }`}>
                          {assessment}
                        </span>
                      )}
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {chapter.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {chapter.summary}
                    </p>
                  </div>

                  {/* High Yield SSC Trap */}
                  {chapter.favouriteTrap && (
                    <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 rounded-xl p-3.5 text-xs text-amber-800 dark:text-amber-300">
                      <span className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        SSC Examiner Trap Point
                      </span>
                      <p>{chapter.favouriteTrap}</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {chapter.estimatedMinutes}m read
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      {chapter.rulesCount} Key Points
                    </span>
                  </div>

                  <button
                    id={`btn-read-${chapter.slug}`}
                    onClick={() => onNavigate('ga-chapter', { chapterSlug: chapter.slug })}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-sm"
                  >
                    <span>Read Full Chapter</span>
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
