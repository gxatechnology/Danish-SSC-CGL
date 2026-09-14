import React, { useState, useEffect } from 'react';
import { TestResult, StudyTutorContext, SubjectType } from './types';
import { MOCK_TESTS } from './content/mockTests';
import { storageService } from './services/storageService';

// Navigation & Global Components
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';

// Views
import { HomeView } from './views/HomeView';
import { ReasoningView } from './views/ReasoningView';
import { GeneralAwarenessView } from './views/GeneralAwarenessView';
import { MathematicsView } from './views/MathematicsView';
import { EnglishView } from './views/EnglishView';
import { Tier2View } from './views/Tier2View';
import { ChapterReadingView } from './views/ChapterReadingView';
import { GrammarRulesHubView } from './views/GrammarRulesHubView';
import { VocabularyHubView } from './views/VocabularyHubView';
import { FormulaHubView } from './views/FormulaHubView';
import { PracticeHubView } from './views/PracticeHubView';
import { MockTestsView } from './views/MockTestsView';
import { LiveMockTestView } from './views/LiveMockTestView';
import { MockResultView } from './views/MockResultView';
import { ErrorLogView } from './views/ErrorLogView';
import { BookmarksView } from './views/BookmarksView';
import { StudyPlanView } from './views/StudyPlanView';
import { LastDayRevisionView } from './views/LastDayRevisionView';
import { AllSubjectsRevisionView } from './views/AllSubjectsRevisionView';
import { AskTutorView } from './views/AskTutorView';
import { SettingsView } from './views/SettingsView';
import { SyllabusView } from './views/SyllabusView';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('dashboard');
  const [activeChapterSlug, setActiveChapterSlug] = useState<string>('subject-verb-agreement');
  const [activeSubject, setActiveSubject] = useState<SubjectType>('English');
  const [activeMockTestId, setActiveMockTestId] = useState<string>('mock-eng-sec-01');
  const [activeTestResult, setActiveTestResult] = useState<TestResult | null>(null);
  const [tutorContext, setTutorContext] = useState<StudyTutorContext | null>(null);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('df_theme') === 'dark';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync theme with document class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('df_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('df_theme', 'light');
    }
  }, [isDarkMode]);

  // Global Command+K Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation handlers
  const handleNavigate = (route: string, slugOrParams?: any) => {
    const slug = typeof slugOrParams === 'string' ? slugOrParams : slugOrParams?.chapterSlug;
    if (slug) {
      setActiveChapterSlug(slug);
    }

    if (route === 'reasoning-chapter') {
      setActiveSubject('Reasoning');
      setCurrentRoute('chapter-reading');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (route === 'ga-chapter' || route === 'general-awareness-chapter') {
      setActiveSubject('General Awareness');
      setCurrentRoute('chapter-reading');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (route === 'tier2-chapter') {
      setActiveSubject('Tier-II');
      setCurrentRoute('chapter-reading');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (route === 'english-chapter') {
      setActiveSubject('English');
      setCurrentRoute('chapter-reading');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (route === 'maths-chapter') {
      setActiveSubject('Mathematics');
      setCurrentRoute('chapter-reading');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenChapter = (slug: string, subject: SubjectType = 'English') => {
    setActiveChapterSlug(slug);
    setActiveSubject(subject);
    setCurrentRoute('chapter-reading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartMockTest = (testId: string) => {
    setActiveMockTestId(testId);
    setCurrentRoute('live-mock');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishMockTest = (result: TestResult) => {
    setActiveTestResult(result);
    setCurrentRoute('mock-results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewMockResult = (attemptId: string) => {
    const found = storageService.getTestResults().find((r) => r.attemptId === attemptId);
    if (found) {
      setActiveTestResult(found);
      setActiveMockTestId(found.testId);
      setCurrentRoute('mock-results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenTutorWithContext = (context: StudyTutorContext) => {
    setTutorContext(context);
    setCurrentRoute('ask-tutor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeMockTest =
    MOCK_TESTS.find((t) => t.id === activeMockTestId) || MOCK_TESTS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] dark:bg-[#070e1c] text-[#000922] dark:text-[#f8f9ff] font-['Inter'] selection:bg-[#89f5e7] selection:text-[#002622]">
      
      {/* Top Navbar */}
      {currentRoute !== 'live-mock' && (
        <Navbar
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          onOpenSearch={() => setIsSearchOpen(true)}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1 flex flex-col pb-20 md:pb-0">
        {currentRoute === 'dashboard' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenChapter={handleOpenChapter}
            onStartMiniTest={() => handleStartMockTest('mock-daily-mini-01')}
          />
        )}

        {currentRoute === 'reasoning' && (
          <ReasoningView onNavigate={handleNavigate} />
        )}

        {currentRoute === 'general-awareness' && (
          <GeneralAwarenessView onNavigate={handleNavigate} />
        )}

        {currentRoute === 'mathematics' && (
          <MathematicsView
            onOpenRevision={() => handleNavigate('mathematics-formulas')}
            onOpenDrill={() => handleNavigate('practice')}
          />
        )}

        {currentRoute === 'english' && (
          <EnglishView
            onOpenChapter={(chapterId) =>
              handleOpenChapter(chapterId || 'subject-verb-agreement', 'English')
            }
            onOpenDrill={() => handleNavigate('practice')}
          />
        )}

        {currentRoute === 'tier2' && (
          <Tier2View onNavigate={handleNavigate} />
        )}

        {currentRoute === 'chapter-reading' && (
          <ChapterReadingView
            slug={activeChapterSlug}
            subject={activeSubject}
            onBack={() => {
              if (activeSubject === 'Reasoning') handleNavigate('reasoning');
              else if (activeSubject === 'General Awareness') handleNavigate('general-awareness');
              else if (activeSubject === 'Tier-II') handleNavigate('tier2');
              else if (activeSubject === 'Mathematics') handleNavigate('mathematics');
              else handleNavigate('english');
            }}
            onOpenTutorWithContext={handleOpenTutorWithContext}
          />
        )}

        {currentRoute === 'english-grammar-rules' && (
          <GrammarRulesHubView
            onOpenChapter={(slug) => handleOpenChapter(slug, 'English')}
          />
        )}

        {currentRoute === 'english-vocabulary' && (
          <VocabularyHubView />
        )}

        {currentRoute === 'mathematics-formulas' && (
          <FormulaHubView
            onOpenChapter={(slug) => handleOpenChapter(slug, 'Mathematics')}
          />
        )}

        {currentRoute === 'practice' && (
          <PracticeHubView
            onOpenChapter={handleOpenChapter}
            onOpenTutorWithContext={handleOpenTutorWithContext}
          />
        )}

        {currentRoute === 'mock-tests' && (
          <MockTestsView
            onStartMockTest={handleStartMockTest}
            onViewResult={handleViewMockResult}
          />
        )}

        {currentRoute === 'live-mock' && (
          <LiveMockTestView
            test={activeMockTest}
            onFinishTest={handleFinishMockTest}
            onExitTest={() => handleNavigate('mock-tests')}
          />
        )}

        {currentRoute === 'mock-results' && activeTestResult && (
          <MockResultView
            result={activeTestResult}
            test={activeMockTest}
            onRetakeTest={() => handleStartMockTest(activeMockTest.id)}
            onBackToTests={() => handleNavigate('mock-tests')}
            onOpenTutorWithContext={handleOpenTutorWithContext}
          />
        )}

        {currentRoute === 'error-log' && (
          <ErrorLogView />
        )}

        {currentRoute === 'bookmarks' && (
          <BookmarksView
            onNavigate={({ route, slug }) => handleNavigate(route, slug)}
          />
        )}

        {currentRoute === 'study-plan' && (
          <StudyPlanView
            onOpenChapter={handleOpenChapter}
            onOpenTest={() => handleStartMockTest('mock-daily-mini-01')}
          />
        )}

        {currentRoute === 'last-day-revision' && (
          <LastDayRevisionView />
        )}

        {(currentRoute === 'revision-all' || currentRoute === 'revision') && (
          <AllSubjectsRevisionView
            onNavigate={handleNavigate}
            onOpenChapter={handleOpenChapter}
          />
        )}

        {currentRoute === 'ask-tutor' && (
          <AskTutorView
            initialContext={tutorContext}
            onClearContext={() => setTutorContext(null)}
          />
        )}

        {currentRoute === 'settings' && (
          <SettingsView
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          />
        )}

        {currentRoute === 'syllabus' && (
          <SyllabusView onOpenChapter={handleOpenChapter} />
        )}
      </main>

      {/* Floating AI Tutor Quick Trigger Button */}
      {currentRoute !== 'ask-tutor' && currentRoute !== 'live-mock' && (
        <button
          onClick={() => handleNavigate('ask-tutor')}
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-30 md:z-40 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-[#002622] hover:bg-[#003d36] text-[#19988c] border border-[#19988c]/40 shadow-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          title="Ask Danish's AI Study Tutor"
        >
          <span className="material-symbols-outlined text-[20px] text-[#89f5e7] animate-pulse">
            smart_toy
          </span>
          <span className="font-bold text-[12px] sm:text-[13px] text-white">Ask Tutor</span>
        </button>
      )}

      {/* Mobile Bottom Navigation */}
      {currentRoute !== 'live-mock' && (
        <MobileNav
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      )}

      {/* Footer */}
      {currentRoute !== 'live-mock' && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Global Command+K Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(route, slug) => handleNavigate(route, slug)}
      />

    </div>
  );
}
