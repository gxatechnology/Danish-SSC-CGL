import React, { useState } from 'react';
import { TestResult, MockTest } from '../types';
import { storageService } from '../services/storageService';

interface MockResultViewProps {
  result: TestResult;
  test: MockTest;
  onRetakeTest: () => void;
  onBackToTests: () => void;
  onOpenTutorWithContext: (context: {
    subject: string;
    chapterTitle: string;
    currentSection?: string;
  }) => void;
}

export const MockResultView: React.FC<MockResultViewProps> = ({
  result,
  test,
  onRetakeTest,
  onBackToTests,
  onOpenTutorWithContext,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'wrong' | 'correct' | 'unattempted'>('all');
  const [loggedQuestions, setLoggedQuestions] = useState<string[]>([]);

  const allQuestions = test.sections.flatMap((s) => s.questions);

  const filteredQuestions = allQuestions.filter((q) => {
    const userAns = result.userAnswers[q.id];
    if (filterMode === 'wrong') return userAns && userAns !== q.correctAnswer;
    if (filterMode === 'correct') return userAns === q.correctAnswer;
    if (filterMode === 'unattempted') return !userAns;
    return true;
  });

  const handleAddToErrorLog = (q: (typeof allQuestions)[0], userAns: string) => {
    storageService.addErrorLogItem({
      questionId: q.id,
      questionText: q.question,
      subject: q.subject,
      topic: q.topic,
      errorType: q.subject === 'English' ? 'Grammar' : 'Calculation',
      notes: `Logged from ${test.title} result review.`,
      sourceTestOrChapter: test.title,
      correctAnswer: q.correctAnswer,
      yourAnswer: userAns || 'Unattempted',
    });
    setLoggedQuestions((prev) => [...prev, q.id]);
  };

  const handleAskTutor = (q: (typeof allQuestions)[0], userAns: string) => {
    onOpenTutorWithContext({
      subject: q.subject,
      chapterTitle: `${q.topic} - Mistake Diagnosis`,
      currentSection: `Question: "${q.question}"\nSelected: ${userAns || 'Unattempted'}\nCorrect: ${q.correctAnswer}\nExplanation: ${q.explanation}`,
    });
  };

  const minutesTaken = Math.floor(result.timeTakenSeconds / 60);
  const secondsTaken = result.timeTakenSeconds % 60;

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0f2042] text-white font-mono text-[11px] font-bold uppercase">
              Performance Diagnosis
            </span>
            <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-mono">
              Attempt Date: {new Date(result.date).toLocaleDateString()}
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] md:text-[34px] font-bold text-[#000922] dark:text-[#f8f9ff]">
            {result.title} — Analysis Report
          </h1>
          <p className="text-[14px] text-[#515f74] dark:text-[#94a3b8] mt-1">
            Detailed breakdown of score, speed, negative marks lost, and error taxonomy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRetakeTest}
            className="px-4 py-2.5 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] text-[13px] font-semibold text-[#0f2042] dark:text-[#8ea4c8] hover:bg-[#eff4ff] flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">replay</span>
            <span>Retake Test</span>
          </button>
          <button
            onClick={onBackToTests}
            className="px-5 py-2.5 rounded-xl bg-[#0f2042] text-white text-[13px] font-bold hover:bg-[#000922] cursor-pointer"
          >
            Back to Mocks
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col">
          <span className="text-[11px] uppercase font-bold text-[#515f74] dark:text-[#94a3b8]">
            Final Score
          </span>
          <span className="text-[28px] font-bold text-[#0f2042] dark:text-[#89f5e7] mt-1">
            {result.totalScore.toFixed(1)}
            <span className="text-[14px] text-[#515f74] font-normal"> / {result.maxMarks}</span>
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col">
          <span className="text-[11px] uppercase font-bold text-[#515f74] dark:text-[#94a3b8]">
            Accuracy
          </span>
          <span className="text-[28px] font-bold text-[#059669] mt-1">
            {result.accuracy}%
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col">
          <span className="text-[11px] uppercase font-bold text-[#515f74] dark:text-[#94a3b8]">
            Correct
          </span>
          <span className="text-[28px] font-bold text-[#10b981] mt-1">
            {result.correctCount}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col">
          <span className="text-[11px] uppercase font-bold text-[#515f74] dark:text-[#94a3b8]">
            Incorrect
          </span>
          <span className="text-[28px] font-bold text-[#e11d48] mt-1">
            {result.wrongCount}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#fff1f2] dark:bg-[#201015] border border-[#fecdd3] dark:border-[#501320] flex flex-col">
          <span className="text-[11px] uppercase font-bold text-[#e11d48]">
            Negative Marks Lost
          </span>
          <span className="text-[28px] font-bold text-[#ba1a1a] dark:text-[#f87171] mt-1">
            -{result.negativeMarksLost.toFixed(2)}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col">
          <span className="text-[11px] uppercase font-bold text-[#515f74] dark:text-[#94a3b8]">
            Time Taken
          </span>
          <span className="text-[24px] font-mono font-bold text-[#000922] dark:text-[#f8f9ff] mt-1">
            {minutesTaken}m {secondsTaken}s
          </span>
        </div>
      </div>

      {/* Topic Accuracy Breakdown */}
      {result.topicBreakdown && result.topicBreakdown.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-4">
          <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#000922] dark:text-[#f8f9ff]">
            Topic-Wise Precision Diagnostic
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.topicBreakdown.map((tb, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[13px] text-[#000922] dark:text-[#f8f9ff]">
                    {tb.topic}
                  </span>
                  <span className="text-[12px] font-bold font-mono text-[#0f2042] dark:text-[#8ea4c8]">
                    {tb.accuracy}% Accuracy
                  </span>
                </div>
                <div className="w-full bg-[#dce9ff] dark:bg-[#1a2942] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      tb.accuracy >= 80
                        ? 'bg-[#10b981]'
                        : tb.accuracy >= 50
                        ? 'bg-[#f59e0b]'
                        : 'bg-[#e11d48]'
                    }`}
                    style={{ width: `${tb.accuracy}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#515f74] dark:text-[#94a3b8]">
                  <span>{tb.correct} Correct</span>
                  <span>{tb.wrong} Wrong</span>
                  <span>{tb.total} Total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Question Review Filter */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5eeff] dark:border-[#1a2942] pb-3">
          <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[20px] text-[#000922] dark:text-[#f8f9ff]">
            Question-by-Question Detailed Review
          </h3>

          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: `All (${allQuestions.length})` },
              { id: 'wrong', label: `Incorrect (${result.wrongCount})` },
              { id: 'correct', label: `Correct (${result.correctCount})` },
              { id: 'unattempted', label: `Unattempted (${result.unattemptedCount})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterMode(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${
                  filterMode === f.id
                    ? 'bg-[#0f2042] text-white'
                    : 'bg-[#eff4ff] dark:bg-[#111c30] text-[#515f74] hover:bg-[#dce9ff]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Question Cards */}
        <div className="flex flex-col gap-5">
          {filteredQuestions.map((q, idx) => {
            const userAns = result.userAnswers[q.id];
            const isCorrect = userAns === q.correctAnswer;
            const isUnattempted = !userAns;
            const isLogged = loggedQuestions.includes(q.id);

            return (
              <div
                key={q.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] font-bold px-2 py-0.5 rounded bg-[#eff4ff] text-[#0f2042]">
                      #{idx + 1}
                    </span>
                    <span className="text-[13px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                      {q.subject} • {q.topic}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      isCorrect
                        ? 'bg-[#ecfdf5] text-[#059669]'
                        : isUnattempted
                        ? 'bg-[#eff4ff] text-[#515f74]'
                        : 'bg-[#fff1f2] text-[#e11d48]'
                    }`}
                  >
                    {isCorrect ? '+2.00 (Correct)' : isUnattempted ? '0.00 (Unattempted)' : '-0.50 (Incorrect)'}
                  </span>
                </div>

                <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-semibold text-[#000922] dark:text-[#f8f9ff]">
                  {q.question}
                </p>

                {/* Options display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {q.options.map((opt) => {
                    const isUserPick = userAns === opt.id;
                    const isRightOption = opt.id === q.correctAnswer;

                    let optClass = 'bg-[#f8f9ff] dark:bg-[#111c30] text-[#515f74] border-[#e5eeff] dark:border-[#1a2942]';
                    if (isRightOption) {
                      optClass = 'bg-[#ecfdf5] dark:bg-[#062c24] text-[#065f46] dark:text-[#a7f3d0] border-[#10b981] font-bold';
                    } else if (isUserPick && !isCorrect) {
                      optClass = 'bg-[#fff1f2] dark:bg-[#201015] text-[#881337] dark:text-[#fecdd3] border-[#e11d48] font-bold';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border text-[13.5px] flex items-start gap-2 ${optClass}`}
                      >
                        <span className="font-mono font-bold">({opt.id})</span>
                        <span>{opt.text}</span>
                        {isRightOption && <span className="ml-auto text-[11px] font-bold text-[#059669]">✓ Correct</span>}
                        {isUserPick && !isRightOption && <span className="ml-auto text-[11px] font-bold text-[#e11d48]">✕ Your Answer</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] text-[13px] text-[#0b1c30] dark:text-[#e2e8f0] flex flex-col gap-2">
                  <span className="font-bold text-[#0f2042] dark:text-[#8ea4c8]">
                    Solution &amp; Rationale:
                  </span>
                  <p>{q.explanation}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleAddToErrorLog(q, userAns)}
                    disabled={isLogged}
                    className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold flex items-center gap-1 cursor-pointer ${
                      isLogged
                        ? 'bg-[#ecfdf5] text-[#059669]'
                        : 'border border-[#e5eeff] dark:border-[#1a2942] text-[#515f74] hover:bg-[#eff4ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isLogged ? 'done' : 'bookmark_add'}
                    </span>
                    <span>{isLogged ? 'In Error Log' : 'Add to Error Log'}</span>
                  </button>

                  <button
                    onClick={() => handleAskTutor(q, userAns)}
                    className="px-3 py-1.5 rounded-xl bg-[#002622] hover:bg-[#003d36] text-[#19988c] font-bold text-[12px] flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                    <span>Ask Tutor Why I Was Wrong</span>
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
