import React, { useState, useEffect } from 'react';
import { TestResult, StudyTutorContext } from './types';
import { MOCK_TESTS } from './content/mockTests';
import { storageService } from './services/storageService';

// Navigation & Global Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';

// Views
import { HomeView } from './views/HomeView';
import { EnglishView } from './views/EnglishView';
import { MathematicsView } from './views/MathematicsView';
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
import { AskTutorView } from './views/AskTutorView';
import { SettingsView } from './views/SettingsView';
import { SyllabusView } from './views/SyllabusView';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('dashboard');
  const [activeChapterSlug, setActiveChapterSlug] = useState<string>('subject-verb-agreement');
  const [activeSubject, setActiveSubject] = useState<'English' | 'Mathematics'>('English');
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
  const handleNavigate = (route: string, slug?: string) => {
    if (slug) {
      setActiveChapterSlug(slug);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenChapter = (slug: string, subject: 'English' | 'Mathematics') => {
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
      <main className="flex-1 flex flex-col">
        {currentRoute === 'dashboard' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenChapter={handleOpenChapter}
            onStartMiniTest={() => handleStartMockTest('mock-daily-mini-01')}
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

        {currentRoute === 'mathematics' && (
          <MathematicsView
            onOpenRevision={() => handleNavigate('mathematics-formulas')}
            onOpenDrill={() => handleNavigate('practice')}
          />
        )}

        {currentRoute === 'chapter-reading' && (
          <ChapterReadingView
            slug={activeChapterSlug}
            subject={activeSubject}
            onBack={() => handleNavigate(activeSubject.toLowerCase())}
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
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-[#002622] hover:bg-[#003d36] text-[#19988c] border border-[#19988c]/40 shadow-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          title="Ask Danish's AI Study Tutor"
        >
          <span className="material-symbols-outlined text-[20px] text-[#89f5e7] animate-pulse">
            smart_toy
          </span>
          <span className="font-bold text-[13px] text-white">Ask Tutor</span>
        </button>
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
