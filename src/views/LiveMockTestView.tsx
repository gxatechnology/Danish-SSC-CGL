import React, { useState, useEffect, useRef } from 'react';
import { MockTest, TestResult } from '../types';
import { storageService } from '../services/storageService';

interface LiveMockTestViewProps {
  test: MockTest;
  onFinishTest: (result: TestResult) => void;
  onExitTest: () => void;
}

export const LiveMockTestView: React.FC<LiveMockTestViewProps> = ({
  test,
  onFinishTest,
  onExitTest,
}) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState(
    test.sections[0].durationMinutes * 60
  );
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  const currentSection = test.sections[currentSectionIdx];
  const currentQuestion = currentSection.questions[currentQuestionIdx];

  // Sectional Timer countdown
  useEffect(() => {
    if (!hasStarted) return;

    const timer = setInterval(() => {
      setSectionTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSectionTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, currentSectionIdx]);

  const handleSectionTimeExpired = () => {
    // If there is another section (e.g. Maths after English in Final Revision Test), advance to next section
    if (currentSectionIdx < test.sections.length - 1) {
      const nextIdx = currentSectionIdx + 1;
      setCurrentSectionIdx(nextIdx);
      setCurrentQuestionIdx(0);
      setSectionTimeRemaining(test.sections[nextIdx].durationMinutes * 60);
    } else {
      // Final section ended: auto submit
      handleSubmitFinal();
    }
  };

  const handleSelectOption = (optId: string) => {
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: optId }));
  };

  const handleClearResponse = () => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  const handleToggleMarkForReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleSaveAndNext = () => {
    if (currentQuestionIdx < currentSection.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else if (currentSectionIdx < test.sections.length - 1) {
      // Prompt user to transition to next section
      if (
        window.confirm(
          `You have reached the end of ${currentSection.sectionName}. Move to ${test.sections[currentSectionIdx + 1].sectionName}? Remember: section time does NOT transfer.`
        )
      ) {
        const nextIdx = currentSectionIdx + 1;
        setCurrentSectionIdx(nextIdx);
        setCurrentQuestionIdx(0);
        setSectionTimeRemaining(test.sections[nextIdx].durationMinutes * 60);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  const handleSubmitFinal = () => {
    const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    const topicStats: Record<string, { total: number; correct: number; wrong: number }> = {};
    const autoLogQueue: Array<{ q: typeof currentQuestion; userAns: string }> = [];

    // Collect all questions across all sections
    const allQuestions = test.sections.flatMap((s) => s.questions);

    allQuestions.forEach((q) => {
      const userAns = userAnswers[q.id];
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, correct: 0, wrong: 0 };
      }
      topicStats[q.topic].total += 1;

      if (!userAns) {
        unattemptedCount += 1;
      } else if (userAns === q.correctAnswer) {
        correctCount += 1;
        totalScore += 2; // +2 for correct
        topicStats[q.topic].correct += 1;
      } else {
        wrongCount += 1;
        totalScore -= 0.5; // -0.50 negative marking
        topicStats[q.topic].wrong += 1;

        if (storageService.isAutoErrorLogEnabled()) {
          autoLogQueue.push({ q, userAns });
        }
      }
    });

    // Auto-log wrong answers to Error Log if setting is active
    autoLogQueue.forEach(({ q, userAns }) => {
      storageService.addErrorLogItem({
        questionId: q.id,
        questionText: q.question,
        subject: q.subject,
        topic: q.topic,
        errorType: q.subject === 'English' ? 'Grammar' : 'Calculation',
        notes: `Selected (${userAns}) instead of (${q.correctAnswer}) during ${test.title}`,
        sourceTestOrChapter: test.title,
        correctAnswer: q.correctAnswer,
        yourAnswer: userAns,
      });
    });

    const accuracy =
      correctCount + wrongCount > 0
        ? Math.round((correctCount / (correctCount + wrongCount)) * 100)
        : 0;

    const topicBreakdown = Object.entries(topicStats).map(([topic, stats]) => ({
      topic,
      total: stats.total,
      correct: stats.correct,
      wrong: stats.wrong,
      accuracy:
        stats.correct + stats.wrong > 0
          ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100)
          : 0,
    }));

    const result: TestResult = {
      attemptId: `att-${Date.now()}`,
      testId: test.id,
      mockTestId: test.id,
      title: test.title,
      totalScore: Math.max(0, totalScore),
      maxMarks: test.maxMarks,
      correctCount,
      wrongCount,
      unattemptedCount,
      accuracy,
      negativeMarksLost: wrongCount * 0.5,
      timeTakenSeconds: elapsedSeconds,
      date: new Date().toISOString(),
      topicBreakdown,
      userAnswers,
    };

    storageService.saveTestResult(result);
    onFinishTest(result);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Screen Instructions
  if (!hasStarted) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6">
        <div className="p-8 rounded-3xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#0f2042] text-white font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-wider">
              {test.type} Mock Test
            </span>
            <span className="text-[13px] text-[#515f74] dark:text-[#94a3b8] font-mono">
              Tier-I Examination Protocol
            </span>
          </div>

          <div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] md:text-[34px] font-bold text-[#000922] dark:text-[#f8f9ff]">
              {test.title}
            </h1>
            <p className="font-['Inter'] text-[15px] text-[#515f74] dark:text-[#94a3b8] mt-1">
              {test.description}
            </p>
          </div>

          {/* Test Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] flex flex-col">
              <span className="text-[11px] font-bold uppercase text-[#515f74] dark:text-[#94a3b8]">
                Questions
              </span>
              <span className="text-[22px] font-bold text-[#0f2042] dark:text-[#8ea4c8]">
                {test.questionsCount}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] flex flex-col">
              <span className="text-[11px] font-bold uppercase text-[#515f74] dark:text-[#94a3b8]">
                Duration
              </span>
              <span className="text-[22px] font-bold text-[#0f2042] dark:text-[#8ea4c8]">
                {test.durationMinutes} mins
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] flex flex-col">
              <span className="text-[11px] font-bold uppercase text-[#515f74] dark:text-[#94a3b8]">
                Max Marks
              </span>
              <span className="text-[22px] font-bold text-[#0f2042] dark:text-[#8ea4c8]">
                {test.maxMarks}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] flex flex-col">
              <span className="text-[11px] font-bold uppercase text-[#515f74] dark:text-[#94a3b8]">
                Marking
              </span>
              <span className="text-[22px] font-bold text-[#059669]">
                +2 / -0.50
              </span>
            </div>
          </div>

          {/* Guidelines */}
          <div className="p-5 rounded-2xl bg-[#fff1f2] dark:bg-[#201015] border border-[#fecdd3] dark:border-[#501320] flex flex-col gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#e11d48]">
              Important Examination Directives
            </span>
            <ul className="text-[13px] text-[#881337] dark:text-[#fecdd3] space-y-1.5 list-disc pl-4">
              <li>Each question carries <strong>2 marks</strong> for correct response.</li>
              <li>Incorrect responses incur a deduction of <strong>0.50 marks (25% negative marking)</strong>.</li>
              <li>Sectional timer is <strong>non-transferable</strong>. Unused time will not carry forward.</li>
              <li>Test auto-submits when time expires. Do not refresh or close tab.</li>
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onExitTest}
              className="px-5 py-2.5 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] text-[13px] font-semibold text-[#515f74] hover:text-[#0f2042] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setHasStarted(true);
                startTimeRef.current = Date.now();
              }}
              className="px-8 py-3 rounded-xl bg-[#0f2042] hover:bg-[#000922] text-white font-bold text-[14px] shadow-sm cursor-pointer flex items-center gap-2"
            >
              <span>I Am Ready, Start Test</span>
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Test Screen with Sectional Timer and Palette
  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-4 md:px-8 py-3 sm:py-4 flex flex-col gap-3 sm:gap-4">
      {/* Test Top Navigation Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] sm:text-[18px] text-[#000922] dark:text-[#f8f9ff]">
            {test.title}
          </span>
          <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#1a2942] text-[#0f2042] dark:text-[#8ea4c8] text-[11px] sm:text-[12px] font-semibold font-mono">
            {currentSection.sectionName}
          </span>
        </div>

        {/* Sectional Timer & Submit Display */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl flex items-center gap-1.5 sm:gap-2 font-mono font-bold text-[14px] sm:text-[16px] ${
              sectionTimeRemaining < 120
                ? 'bg-[#fff1f2] text-[#e11d48] animate-pulse border border-[#fecdd3]'
                : 'bg-[#000922] text-[#89f5e7] border border-[#1a2942]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">timer</span>
            <span>{formatTimer(sectionTimeRemaining)}</span>
          </div>

          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white text-[12px] sm:text-[13px] font-bold cursor-pointer"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Mobile Question Quick Jumper & Palette Drawer Trigger */}
      <div className="lg:hidden flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 flex-1">
          {currentSection.questions.map((q, idx) => {
            const isCurrent = idx === currentQuestionIdx;
            const isAns = Boolean(userAnswers[q.id]);
            const isReview = Boolean(markedForReview[q.id]);

            let chipStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
            if (isCurrent) {
              chipStyle = 'bg-[#0f2042] text-white ring-2 ring-[#0f2042] dark:ring-[#89f5e7]';
            } else if (isReview) {
              chipStyle = 'bg-[#f59e0b] text-white';
            } else if (isAns) {
              chipStyle = 'bg-[#10b981] text-white';
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIdx(idx)}
                className={`w-8 h-8 rounded-lg font-mono text-[12px] font-bold shrink-0 flex items-center justify-center transition-all cursor-pointer ${chipStyle}`}
                title={`Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setIsMobilePaletteOpen(true)}
          className="px-2.5 py-1.5 rounded-xl bg-[#eff4ff] dark:bg-[#15233c] text-[#0f2042] dark:text-[#8ea4c8] text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer min-h-[36px]"
        >
          <span className="material-symbols-outlined text-[16px]">grid_view</span>
          <span>Palette</span>
        </button>
      </div>

      {/* Mobile Slide-Up Question Palette Sheet */}
      {isMobilePaletteOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end lg:hidden animate-in fade-in"
          onClick={() => setIsMobilePaletteOpen(false)}
        >
          <div 
            className="w-full bg-white dark:bg-[#0c1527] rounded-t-3xl border-t border-[#e5eeff] dark:border-[#1a2942] p-5 pb-8 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto -mt-1" />
            
            <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff] dark:border-[#1a2942]">
              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] text-[#000922] dark:text-[#f8f9ff]">
                  Question Palette ({currentSection.questions.length})
                </h4>
                <p className="text-[11px] text-[#515f74] dark:text-[#94a3b8]">
                  Tap any number to jump directly to that question
                </p>
              </div>
              <button
                onClick={() => setIsMobilePaletteOpen(false)}
                className="w-8 h-8 rounded-full bg-[#eff4ff] dark:bg-[#15233c] text-[#515f74] dark:text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-medium text-[#515f74] dark:text-[#94a3b8] p-2.5 rounded-xl bg-[#f8f9ff] dark:bg-[#111c30]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
                <span>Marked Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span>Not Visited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#0f2042]"></span>
                <span>Current</span>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-5 gap-2 pt-2">
              {currentSection.questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIdx;
                const isAns = Boolean(userAnswers[q.id]);
                const isReview = Boolean(markedForReview[q.id]);

                let btnStyle = 'bg-[#f8f9ff] dark:bg-[#111c30] text-[#515f74] border border-[#e5eeff] dark:border-[#1a2942]';
                if (isCurrent) {
                  btnStyle = 'bg-[#0f2042] text-white ring-2 ring-offset-1 ring-[#0f2042]';
                } else if (isReview) {
                  btnStyle = 'bg-[#f59e0b] text-white';
                } else if (isAns) {
                  btnStyle = 'bg-[#10b981] text-white';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIdx(idx);
                      setIsMobilePaletteOpen(false);
                    }}
                    className={`h-10 rounded-xl font-mono text-[13px] font-bold transition-all cursor-pointer ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Examination Viewport: Left Question Area, Right Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left: Question View */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="p-4 sm:p-6 md:p-8 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-5 sm:gap-6">
            
            {/* Question Header */}
            <div className="flex items-center justify-between border-b border-[#e5eeff] dark:border-[#1a2942] pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#0f2042] text-white font-mono text-[11px] sm:text-[12px] font-bold">
                  Q{currentQuestionIdx + 1} of {currentSection.questions.length}
                </span>
                <span className="text-[12px] sm:text-[13px] font-bold text-[#515f74] dark:text-[#94a3b8] truncate max-w-[160px] sm:max-w-none">
                  {currentQuestion.topic}
                </span>
              </div>
              <span className="text-[11px] sm:text-[12px] font-mono text-[#059669] font-bold shrink-0">
                +2.00 / -0.50
              </span>
            </div>

            {/* Question Text */}
            <p className="font-['Plus_Jakarta_Sans'] text-[15px] sm:text-[17px] md:text-[18px] font-semibold text-[#000922] dark:text-[#f8f9ff] leading-relaxed">
              {currentQuestion.question}
            </p>

            {/* Options */}
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = userAnswers[currentQuestion.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 sm:p-4 rounded-xl border text-left flex items-start gap-2.5 sm:gap-3 transition-all cursor-pointer min-h-[48px] ${
                      isSelected
                        ? 'border-[#0f2042] dark:border-[#89f5e7] bg-[#eff4ff] dark:bg-[#15233c] text-[#0f2042] dark:text-white font-semibold'
                        : 'border-[#e5eeff] dark:border-[#1a2942] bg-[#f8f9ff] dark:bg-[#111c30] text-[#0b1c30] dark:text-[#e2e8f0] hover:bg-[#eff4ff]'
                    }`}
                  >
                    <span className="font-mono font-bold text-[13px] shrink-0 mt-0.5">
                      ({opt.id})
                    </span>
                    <span className="text-[14px] sm:text-[15px] leading-snug">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#e5eeff] dark:border-[#1a2942]">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleClearResponse}
                  className="px-3 py-2.5 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] text-[12px] font-semibold text-[#515f74] hover:text-[#ba1a1a] cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  Clear Response
                </button>
                <button
                  onClick={handleToggleMarkForReview}
                  className={`px-3 py-2.5 rounded-xl border text-[12px] font-semibold cursor-pointer min-h-[44px] flex items-center justify-center ${
                    markedForReview[currentQuestion.id]
                      ? 'bg-[#fef3c7] border-[#f59e0b] text-[#b45309]'
                      : 'border-[#e5eeff] dark:border-[#1a2942] text-[#515f74]'
                  }`}
                >
                  {markedForReview[currentQuestion.id] ? 'Marked' : 'Mark Review'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={handlePrevious}
                  className="px-4 py-2.5 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] text-[13px] font-semibold text-[#0f2042] dark:text-[#8ea4c8] disabled:opacity-30 cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  Previous
                </button>
                <button
                  onClick={handleSaveAndNext}
                  className="px-6 py-2.5 rounded-xl bg-[#0f2042] text-white text-[13px] font-bold hover:bg-[#000922] cursor-pointer min-h-[44px] flex items-center justify-center shadow-xs"
                >
                  Save &amp; Next
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Question Palette */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-4">
            
            <div className="flex items-center justify-between">
              <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#000922] dark:text-[#f8f9ff]">
                Question Palette
              </h4>
              <span className="text-[12px] font-mono text-[#515f74] dark:text-[#94a3b8]">
                {test.questionsCount} Total
              </span>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-[#515f74] dark:text-[#94a3b8]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
                <span>Marked Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#e5eeff] dark:bg-[#1a2942]"></span>
                <span>Not Visited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#0f2042]"></span>
                <span>Current</span>
              </div>
            </div>

            {/* Palette Buttons */}
            <div className="grid grid-cols-5 gap-2 pt-2 border-t border-[#e5eeff] dark:border-[#1a2942]">
              {currentSection.questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIdx;
                const isAns = Boolean(userAnswers[q.id]);
                const isReview = Boolean(markedForReview[q.id]);

                let btnStyle = 'bg-[#f8f9ff] dark:bg-[#111c30] text-[#515f74]';
                if (isCurrent) {
                  btnStyle = 'bg-[#0f2042] text-white ring-2 ring-offset-2 ring-[#0f2042]';
                } else if (isReview) {
                  btnStyle = 'bg-[#f59e0b] text-white';
                } else if (isAns) {
                  btnStyle = 'bg-[#10b981] text-white';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`h-9 rounded-lg font-mono text-[12px] font-bold transition-all cursor-pointer ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Section Switcher for Multi-Section Tests */}
            {test.sections.length > 1 && (
              <div className="pt-3 border-t border-[#e5eeff] dark:border-[#1a2942] flex flex-col gap-2">
                <span className="text-[11px] uppercase font-bold text-[#515f74]">Sections</span>
                <div className="flex flex-col gap-1.5">
                  {test.sections.map((s, sIdx) => (
                    <button
                      key={s.sectionId}
                      disabled={sIdx === currentSectionIdx}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Switch section to ${s.sectionName}? Remember that section timer applies specifically.`
                          )
                        ) {
                          setCurrentSectionIdx(sIdx);
                          setCurrentQuestionIdx(0);
                          setSectionTimeRemaining(s.durationMinutes * 60);
                        }
                      }}
                      className={`text-left p-2 rounded-lg text-[12px] font-semibold cursor-pointer ${
                        sIdx === currentSectionIdx
                          ? 'bg-[#0f2042] text-white'
                          : 'bg-[#eff4ff] dark:bg-[#111c30] text-[#515f74]'
                      }`}
                    >
                      {s.sectionName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xl flex flex-col gap-4">
            <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#000922] dark:text-[#f8f9ff]">
              Submit Mock Examination?
            </h3>
            <p className="text-[14px] text-[#515f74] dark:text-[#94a3b8]">
              You have answered {Object.keys(userAnswers).length} out of {test.questionsCount} questions. Once submitted, answers cannot be edited and your detailed analytics report will be generated.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 rounded-xl border text-[13px] font-semibold text-[#515f74] cursor-pointer"
              >
                Continue Test
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  handleSubmitFinal();
                }}
                className="px-5 py-2 rounded-xl bg-[#e11d48] text-white text-[13px] font-bold cursor-pointer"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
