import React, { useState, useEffect } from 'react';
import { StudyChapter } from '../types';
import { MathFormula } from '../components/MathFormula';
import { storageService } from '../services/storageService';
import { ChapterDiagramRenderer } from '../components/ChapterDiagramRenderer';
import { ChapterTableRenderer } from '../components/ChapterTableRenderer';
import { SolvedExamplesList, PracticeQuizSection } from '../components/ChapterPracticeRenderer';
import { ChapterNotesPanel } from '../components/ChapterNotesPanel';
import { 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  Circle, 
  Share2, 
  Bot, 
  Clock, 
  Layers, 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight,
  ListOrdered,
  Printer,
  ChevronRight,
  BookOpen
} from 'lucide-react';

import { ALL_CHAPTERS, getChapterBySlug } from '../content/allChapters';

interface ChapterReadingViewProps {
  chapter?: StudyChapter;
  slug?: string;
  subject?: string;
  onNavigateChapter?: (slug: string) => void;
  onBackToSubject?: () => void;
  onBack?: () => void;
  onOpenTutorWithContext: (context: {
    subject: string;
    chapterTitle: string;
    currentSection?: string;
    rules?: string[];
    formulas?: string[];
  }) => void;
  onStartQuiz?: () => void;
}

export const ChapterReadingView: React.FC<ChapterReadingViewProps> = ({
  chapter: propChapter,
  slug,
  subject: _propSubject,
  onNavigateChapter,
  onBackToSubject,
  onBack,
  onOpenTutorWithContext,
  onStartQuiz,
}) => {
  const chapter = propChapter || (slug ? getChapterBySlug(slug) : undefined) || ALL_CHAPTERS[0];
  const handleBack = onBackToSubject || onBack || (() => window.history.back());
  const handleNavChapter = onNavigateChapter || ((targetSlug: string) => {
    window.location.hash = targetSlug;
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);

  useEffect(() => {
    const completedList = storageService.getCompletedChapters();
    setIsCompleted(completedList.includes(chapter.slug));
    setIsBookmarked(storageService.isBookmarked(chapter.slug));
    storageService.setLastOpenedChapter({
      slug: chapter.slug,
      subject: chapter.subject,
      title: chapter.title,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapter.slug]);

  const handleToggleCompleted = () => {
    const updated = storageService.toggleChapterCompletion(chapter.slug);
    setIsCompleted(updated);
  };

  const handleToggleBookmark = () => {
    const routeMapping: Record<string, string> = {
      English: 'english-chapter',
      Mathematics: 'maths-chapter',
      Reasoning: 'reasoning-chapter',
      'General Awareness': 'ga-chapter',
      'Tier-II': 'tier2-chapter',
    };

    const updated = storageService.toggleBookmark({
      targetId: chapter.slug,
      title: chapter.title,
      category: chapter.subject,
      snippet: chapter.summary,
      routeTarget: {
        route: (routeMapping[chapter.subject] || 'english-chapter') as any,
        slug: chapter.slug,
      },
    });
    setIsBookmarked(updated);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = `${chapter.title} | Danish SSC CGL Study Hub`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: chapter.summary, url });
        setShareFeedback('Shared successfully!');
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(url);
      setShareFeedback('Lesson link copied to clipboard!');
    }
    setTimeout(() => setShareFeedback(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAskTutor = () => {
    const rules = chapter.sections
      .filter((s) => s.rulesList)
      .flatMap((s) => s.rulesList!.map((r) => `${r.title}: ${r.statement}`));
    const formulas = chapter.sections
      .filter((s) => s.mathFormulas)
      .flatMap((s) => s.mathFormulas!);

    onOpenTutorWithContext({
      subject: chapter.subject,
      chapterTitle: chapter.title,
      currentSection: chapter.sections[activeSectionIdx]?.title,
      rules,
      formulas,
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Breadcrumb Header */}
      <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        <button 
          onClick={handleBack} 
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          {chapter.subject} Hub
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-400 dark:text-slate-600">{chapter.unit || chapter.category}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-[200px] sm:max-w-md">
          {chapter.title}
        </span>
      </nav>

      {/* Chapter Title & Action Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 text-xs font-bold uppercase tracking-wider">
              {chapter.priority}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {chapter.estimatedMinutes} mins
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> {chapter.rulesCount} Key Points
              </span>
            </span>
          </div>

          {/* Actions toolbar */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleToggleBookmark}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px] ${
                isBookmarked
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark Chapter'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
              <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              onClick={handleToggleCompleted}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px] ${
                isCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
              }`}
              title={isCompleted ? 'Completed' : 'Mark Completed'}
            >
              {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4" />}
              <span className="text-[11px] sm:text-xs">{isCompleted ? 'Done' : 'Mark Done'}</span>
            </button>

            <button
              onClick={handlePrint}
              title="Print or Save as PDF"
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-semibold cursor-pointer min-h-[38px]"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleShare}
              title="Share chapter"
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-semibold cursor-pointer min-h-[38px]"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={handleAskTutor}
              className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer min-h-[38px]"
            >
              <Bot className="w-4 h-4" />
              <span className="text-[11px] sm:text-xs">AI Tutor</span>
            </button>
          </div>
        </div>

        {shareFeedback && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in">
            {shareFeedback}
          </div>
        )}

        <div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {chapter.title}
          </h1>
          <p className="mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
            {chapter.summary}
          </p>
        </div>

        {/* Favorite Trap Callout */}
        {chapter.favouriteTrap && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/40 flex items-start gap-2.5 sm:gap-3">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                SSC Examiner's Favorite Trap
              </span>
              <p className="text-xs sm:text-sm text-rose-900 dark:text-rose-200 font-medium leading-relaxed">
                {chapter.favouriteTrap}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Section Navigation Pills & Practice Trigger */}
      <div className="lg:hidden flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {chapter.sections.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveSectionIdx(idx);
                const el = document.getElementById(`section-${idx}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeSectionIdx === idx
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {sec.sectionNumber ? `${sec.sectionNumber}. ` : ''}{sec.title}
            </button>
          ))}
        </div>

        <button
          onClick={onStartQuiz}
          className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:opacity-90 transition-opacity cursor-pointer min-h-[44px]"
        >
          <BookOpen className="w-4 h-4" />
          <span>Practice Chapter MCQs ({chapter.mcqsCount})</span>
        </button>
      </div>

      {/* 3-Column Layout: Left (Sections & Quiz CTA), Center (Full Educational Content), Right (Notes & Memory Trick) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Navigator (Sticky on Desktop) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-5 sticky top-20">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Chapter Sections</span>
            </h4>
            <div className="space-y-1">
              {chapter.sections.map((sec, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveSectionIdx(idx);
                    const el = document.getElementById(`section-${idx}`);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors font-medium leading-snug ${
                    activeSectionIdx === idx
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onStartQuiz}
            className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
          >
            <BookOpen className="w-4 h-4" />
            <span>Practice Chapter MCQs ({chapter.mcqsCount})</span>
          </button>
        </div>

        {/* Center: Full Educational Sections */}
        <div className="lg:col-span-6 space-y-6">
          {chapter.sections.map((section, sIdx) => (
            <section
              key={sIdx}
              id={`section-${sIdx}`}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 scroll-mt-24"
            >
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                  {section.title}
                </h3>
              </div>

              {section.content && (
                <div className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line font-sans">
                  {section.content}
                </div>
              )}

              {/* Render SVG Diagrams */}
              {section.diagram && (
                <ChapterDiagramRenderer diagram={section.diagram} />
              )}

              {/* Render High-Yield Reference Tables */}
              {section.table && (
                <ChapterTableRenderer table={section.table} />
              )}

              {/* Math Formulas */}
              {section.mathFormulas && section.mathFormulas.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block">
                    Mathematical Formula Anchor
                  </span>
                  {section.mathFormulas.map((mf, mIdx) => (
                    <div key={mIdx} className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-indigo-100 dark:border-indigo-900/60 shadow-2xs">
                      <MathFormula math={mf} block />
                    </div>
                  ))}
                </div>
              )}

              {/* Rules List */}
              {section.rulesList && section.rulesList.length > 0 && (
                <div className="space-y-4">
                  {section.rulesList.map((r, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                          Rule {r.ruleNo}: {r.title}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-bold">
                          RULE
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {r.statement}
                      </p>
                      {r.incorrect && (
                        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-2 border border-rose-200 dark:border-rose-900/40">
                          <span className="font-bold text-rose-600">✕ Incorrect:</span>
                          <span>{r.incorrect}</span>
                        </div>
                      )}
                      {r.correct && (
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm flex items-start gap-2 border border-emerald-200 dark:border-emerald-900/40">
                          <span className="font-bold text-emerald-600">✓ Correct:</span>
                          <span>{r.correct}</span>
                        </div>
                      )}
                      {r.trapNote && (
                        <div className="text-xs text-amber-700 dark:text-amber-400 italic pt-1">
                          <strong>Trap Warning:</strong> {r.trapNote}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Render Solved Examples */}
              {section.solvedExamples && section.solvedExamples.length > 0 && (
                <SolvedExamplesList examples={section.solvedExamples} />
              )}

              {/* In-Chapter Practice Quiz */}
              {section.practiceQuestions && section.practiceQuestions.length > 0 && (
                <PracticeQuizSection questions={section.practiceQuestions} />
              )}
            </section>
          ))}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
            {chapter.prevSlug ? (
              <button
                onClick={() => handleNavChapter(chapter.prevSlug!)}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 shadow-2xs transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Topic</span>
              </button>
            ) : (
              <div />
            )}

            {chapter.nextSlug ? (
              <button
                onClick={() => handleNavChapter(chapter.nextSlug!)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
              >
                <span>Next Topic</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
              >
                <span>Return to {chapter.subject} Hub</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Sticky Sidebar: Notes & Memory Anchors */}
        <div className="lg:col-span-3 space-y-5 sticky top-20">
          {/* Chapter Notes & Assessment Panel */}
          <ChapterNotesPanel 
            chapterSlug={chapter.slug} 
            chapterTitle={chapter.title} 
          />

          {/* Memory Trick Card */}
          {chapter.memoryTrick && (
            <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 shadow-sm space-y-2">
              <span className="text-[11px] uppercase font-bold text-amber-800 dark:text-amber-400 block tracking-wider">
                Exam Memory Anchor
              </span>
              <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 font-medium leading-relaxed">
                {chapter.memoryTrick}
              </p>
            </div>
          )}

          {/* Personalized Guidance Card */}
          <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 shadow-sm space-y-2">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
              Study Hub Guidance
            </span>
            <p className="text-xs leading-relaxed text-slate-300">
              Prepared for Danish Fatma. Focus on identifying exam traps, eliminating wrong options in under 20 seconds, and retaining formula shortcuts.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
