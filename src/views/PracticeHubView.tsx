import React, { useState } from 'react';
import { MCQ_BANK } from '../content/mcqBank';
import { MCQQuestion, PracticeMode } from '../types';
import { storageService } from '../services/storageService';

interface PracticeHubViewProps {
  onOpenChapter?: (slug: string, subject: 'English' | 'Mathematics') => void;
  onOpenTutorWithContext: (context: {
    subject: string;
    chapterTitle: string;
    currentSection?: string;
  }) => void;
}

export const PracticeHubView: React.FC<PracticeHubViewProps> = ({ onOpenTutorWithContext }) => {
  const [activeSubject, setActiveSubject] = useState<string>('All');
  const [activeDifficulty, setActiveDifficulty] = useState<string>('All');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('Study');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  const [loggedErrors, setLoggedErrors] = useState<string[]>([]);

  const filteredQuestions = MCQ_BANK.filter((q) => {
    const matchesSub = activeSubject === 'All' || q.subject === activeSubject;
    const matchesDiff = activeDifficulty === 'All' || q.difficulty === activeDifficulty;
    return matchesSub && matchesDiff;
  });

  const handleSelectOption = (question: MCQQuestion, optId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [question.id]: optId }));

    if (practiceMode === 'Study') {
      // In Study mode, check immediately
      const isCorrect = optId === question.correctAnswer;
      if (!isCorrect && storageService.isAutoErrorLogEnabled()) {
        autoLogError(question, optId);
      }
    }
  };

  const handleSubmitQuestion = (question: MCQQuestion) => {
    setSubmittedAnswers((prev) => ({ ...prev, [question.id]: true }));
    const selected = selectedAnswers[question.id];
    if (selected && selected !== question.correctAnswer && storageService.isAutoErrorLogEnabled()) {
      autoLogError(question, selected);
    }
  };

  const autoLogError = (q: MCQQuestion, userAns: string) => {
    if (!loggedErrors.includes(q.id)) {
      storageService.addErrorLogItem({
        questionId: q.id,
        questionText: q.question,
        subject: q.subject,
        topic: q.topic,
        errorType: q.subject === 'English' ? 'Grammar' : 'Concept',
        notes: `Selected option (${userAns}) instead of correct answer (${q.correctAnswer}).`,
        sourceTestOrChapter: 'Practice Drill',
        correctAnswer: q.correctAnswer,
        yourAnswer: userAns,
      });
      setLoggedErrors((prev) => [...prev, q.id]);
    }
  };

  const handleManualAddErrorLog = (q: MCQQuestion) => {
    storageService.addErrorLogItem({
      questionId: q.id,
      questionText: q.question,
      subject: q.subject,
      topic: q.topic,
      errorType: 'Concept',
      notes: 'Added from manual practice review.',
      sourceTestOrChapter: 'Practice Mode',
      correctAnswer: q.correctAnswer,
      yourAnswer: selectedAnswers[q.id] || 'Not answered',
    });
    setLoggedErrors((prev) => [...prev, q.id]);
  };

  const handleAskTutor = (q: MCQQuestion) => {
    onOpenTutorWithContext({
      subject: q.subject,
      chapterTitle: `${q.topic} - Question Analysis`,
      currentSection: `Question: "${q.question}" (Correct: ${q.correctAnswer}, Selected: ${selectedAnswers[q.id] || 'None'})`,
    });
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0f2042] text-white font-['Inter'] text-[11px] font-bold uppercase tracking-wider">
              Targeted PYQ &amp; Concept Drills
            </span>
            <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-['JetBrains_Mono']">
              TCS Tier-I Framework
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#000922] dark:text-[#f8f9ff]">
            Practice Hub
          </h1>
          <p className="font-['Inter'] text-[15px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
            Real questions with dual study/practice modes, instant feedback, and one-tap Error Log capture.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center p-1 rounded-xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942]">
          {(['Study', 'Practice', 'Exam'] as PracticeMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setPracticeMode(mode)}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer ${
                practiceMode === mode
                  ? 'bg-[#0f2042] text-white shadow-xs'
                  : 'text-[#515f74] dark:text-[#94a3b8] hover:text-[#0f2042]'
              }`}
            >
              {mode} Mode
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5eeff] dark:border-[#1a2942] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Reasoning', 'General Awareness', 'Quantitative', 'English', 'Tier-II'].map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                activeSubject === sub
                  ? 'bg-[#0f2042] text-white shadow-xs'
                  : 'text-[#515f74] dark:text-[#b9c7df] hover:bg-[#eff4ff] dark:hover:bg-[#15233c]'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-[#515f74] dark:text-[#94a3b8]">Difficulty:</span>
          {['All', 'Easy', 'Moderate', 'Challenging'].map((diff) => (
            <button
              key={diff}
              onClick={() => setActiveDifficulty(diff)}
              className={`px-2.5 py-1 rounded-md text-[12px] font-medium transition-all cursor-pointer ${
                activeDifficulty === diff
                  ? 'bg-[#dce9ff] text-[#0f2042] dark:bg-[#1a2942] dark:text-[#8ea4c8] font-bold'
                  : 'text-[#515f74] dark:text-[#94a3b8] hover:bg-[#eff4ff]'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Stack */}
      <div className="flex flex-col gap-6">
        {filteredQuestions.map((q, idx) => {
          const selected = selectedAnswers[q.id];
          const isSubmitted = submittedAnswers[q.id] || practiceMode === 'Study';
          const isAnswered = Boolean(selected);
          const isCorrect = selected === q.correctAnswer;
          const isLogged = loggedErrors.includes(q.id);

          return (
            <div
              key={q.id}
              className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-5"
            >
              {/* Question Metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0f2042] text-white flex items-center justify-center font-['JetBrains_Mono'] text-[12px] font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-[13px] font-bold text-[#0f2042] dark:text-[#8ea4c8]">
                    {q.subject} • {q.topic}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#eff4ff] dark:bg-[#1a2942] text-[#515f74] dark:text-[#94a3b8] text-[11px] font-['JetBrains_Mono']">
                    {q.difficulty}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#ecfdf5] dark:bg-[#062c24] text-[#059669] dark:text-[#a7f3d0] text-[11px] font-bold">
                    {q.sourceType}
                  </span>
                </div>
              </div>

              {/* Question Statement */}
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[17px] font-semibold text-[#000922] dark:text-[#f8f9ff] leading-relaxed">
                {q.question}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt) => {
                  const isThisSelected = selected === opt.id;
                  const isThisCorrect = opt.id === q.correctAnswer;

                  let optClasses =
                    'border-[#e5eeff] dark:border-[#1a2942] bg-[#f8f9ff] dark:bg-[#111c30] text-[#0b1c30] dark:text-[#e2e8f0]';

                  if (isSubmitted) {
                    if (isThisCorrect) {
                      optClasses =
                        'border-[#10b981] bg-[#ecfdf5] dark:bg-[#062c24] text-[#065f46] dark:text-[#a7f3d0] font-semibold';
                    } else if (isThisSelected && !isCorrect) {
                      optClasses =
                        'border-[#e11d48] bg-[#fff1f2] dark:bg-[#201015] text-[#881337] dark:text-[#fecdd3] font-semibold';
                    }
                  } else if (isThisSelected) {
                    optClasses =
                      'border-[#0f2042] bg-[#eff4ff] dark:bg-[#15233c] text-[#0f2042] dark:text-white font-bold';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(q, opt.id)}
                      className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${optClasses}`}
                    >
                      <span className="font-['JetBrains_Mono'] font-bold text-[13px] shrink-0 mt-0.5">
                        ({opt.id})
                      </span>
                      <span className="text-[14.5px] leading-snug">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Controls in Practice Mode */}
              {practiceMode === 'Practice' && !submittedAnswers[q.id] && (
                <div className="flex justify-end">
                  <button
                    disabled={!isAnswered}
                    onClick={() => handleSubmitQuestion(q)}
                    className="px-5 py-2 rounded-xl bg-[#0f2042] text-white text-[13px] font-bold disabled:opacity-40 cursor-pointer"
                  >
                    Check Answer
                  </button>
                </div>
              )}

              {/* Feedback and Explanation */}
              {isSubmitted && isAnswered && (
                <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[13px] font-bold flex items-center gap-1.5 ${
                        isCorrect ? 'text-[#059669]' : 'text-[#ba1a1a]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isCorrect ? 'check_circle' : 'cancel'}
                      </span>
                      <span>
                        {isCorrect ? 'Correct Answer!' : `Incorrect — Correct Option is (${q.correctAnswer})`}
                      </span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleManualAddErrorLog(q)}
                        disabled={isLogged}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                          isLogged
                            ? 'bg-[#ecfdf5] text-[#059669]'
                            : 'bg-white dark:bg-[#070e1c] border border-[#e5eeff] text-[#515f74]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isLogged ? 'done' : 'bookmark_add'}
                        </span>
                        <span>{isLogged ? 'In Error Log' : 'Add to Error Log'}</span>
                      </button>

                      <button
                        onClick={() => handleAskTutor(q)}
                        className="px-3 py-1 rounded-lg bg-[#002622] hover:bg-[#003d36] text-[#19988c] font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                        <span>Ask Tutor Why</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[13.5px] text-[#0b1c30] dark:text-[#e2e8f0] leading-relaxed">
                    {q.explanation}
                  </p>

                  {q.shortcut && (
                    <div className="text-[12px] text-[#059669] dark:text-[#34d399] font-mono font-bold">
                      ⚡ Shortcut: {q.shortcut}
                    </div>
                  )}

                  {q.ruleAnchor && (
                    <div className="text-[11px] text-[#515f74] dark:text-[#94a3b8]">
                      Anchor: {q.ruleAnchor}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
