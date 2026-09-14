import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { MockAttemptResult } from '../types';

export const ProgressView: React.FC = () => {
  const [attempts, setAttempts] = useState<MockAttemptResult[]>(() => storageService.getMockAttempts());

  useEffect(() => {
    const handleStorageChange = () => {
      setAttempts(storageService.getMockAttempts());
    };
    window.addEventListener('danish_cgl_storage_changed', handleStorageChange);
    return () => window.removeEventListener('danish_cgl_storage_changed', handleStorageChange);
  }, []);

  const totalAttempted = attempts.reduce((acc, a) => acc + a.attempted, 0);
  const totalCorrect = attempts.reduce((acc, a) => acc + a.correct, 0);
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : null;
  const sectionalAvg = attempts.length > 0
    ? (attempts.reduce((acc, a) => acc + a.finalScore, 0) / attempts.length).toFixed(1)
    : null;

  // Breakdown by subject inferred from mockId / mock title
  const englishAttempts = attempts.filter((a) => a.mockId.includes('eng') || a.mockId.includes('mini'));
  const engAttempted = englishAttempts.reduce((acc, a) => acc + a.attempted, 0);
  const engCorrect = englishAttempts.reduce((acc, a) => acc + a.correct, 0);
  const engAccuracy = engAttempted > 0 ? Math.round((engCorrect / engAttempted) * 100) : null;

  const mathAttempts = attempts.filter((a) => a.mockId.includes('math') || a.mockId.includes('quant'));
  const mathAttempted = mathAttempts.reduce((acc, a) => acc + a.attempted, 0);
  const mathCorrect = mathAttempts.reduce((acc, a) => acc + a.correct, 0);
  const mathAccuracy = mathAttempted > 0 ? Math.round((mathCorrect / mathAttempted) * 100) : null;

  const reasoningAttempts = attempts.filter((a) => a.mockId.includes('reason') || a.mockId.includes('full'));
  const reasoningAttempted = reasoningAttempts.reduce((acc, a) => acc + a.attempted, 0);
  const reasoningCorrect = reasoningAttempts.reduce((acc, a) => acc + a.correct, 0);
  const reasoningAccuracy = reasoningAttempted > 0 ? Math.round((reasoningCorrect / reasoningAttempted) * 100) : null;

  const subjectStats = [
    {
      subject: 'English Language',
      attempted: engAttempted,
      correct: engCorrect,
      accuracy: engAccuracy,
      color: '#0f2042',
    },
    {
      subject: 'Quantitative Aptitude',
      attempted: mathAttempted,
      correct: mathCorrect,
      accuracy: mathAccuracy,
      color: '#19988c',
    },
    {
      subject: 'General Intelligence / Reasoning',
      attempted: reasoningAttempted,
      correct: reasoningCorrect,
      accuracy: reasoningAccuracy,
      color: '#059669',
    },
  ];

  // Days active streak calculated from real attempt dates
  const attemptDates = new Set(attempts.map((a) => new Date(a.date).toDateString()));
  const streakCount = attemptDates.size;

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-8 md:py-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0f2042] text-white font-['Inter'] text-[11px] font-bold uppercase tracking-wider">
              Diagnostic Analytics
            </span>
            <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-['JetBrains_Mono']">
              Real Performance Tracking
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#000922] dark:text-[#f8f9ff]">
            Performance &amp; Accuracy Dashboard
          </h1>
          <p className="font-['Inter'] text-[15px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
            {attempts.length === 0
              ? 'No mock tests attempted yet. Accuracy and diagnostic curves will calculate from your actual test submissions.'
              : `Real-time tracking across ${totalAttempted} attempted MCQs and ${attempts.length} mock exam session${attempts.length === 1 ? '' : 's'}.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] flex items-center gap-4">
            <div>
              <span className="text-[11px] text-[#515f74] uppercase font-bold block">Overall Accuracy</span>
              <span className="text-[20px] font-bold font-['JetBrains_Mono'] text-[#19988c]">
                {overallAccuracy !== null ? `${overallAccuracy}%` : '—'}
              </span>
            </div>
            <div className="w-px h-8 bg-[#e5eeff] dark:bg-[#1a2942]"></div>
            <div>
              <span className="text-[11px] text-[#515f74] uppercase font-bold block">Sectional Avg</span>
              <span className="text-[20px] font-bold font-['JetBrains_Mono'] text-[#000922] dark:text-[#89f5e7]">
                {sectionalAvg !== null ? `${sectionalAvg} / 50` : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accuracy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {subjectStats.map((stat, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col justify-between gap-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] text-[#000922] dark:text-[#f8f9ff]">
                {stat.subject}
              </span>
              <span className="font-['JetBrains_Mono'] font-bold text-[14px] px-2.5 py-0.5 rounded bg-[#eff4ff] text-[#0f2042] dark:bg-[#1a2942] dark:text-[#8ea4c8]">
                {stat.accuracy !== null ? `${stat.accuracy}%` : 'Not Attempted'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[12px] font-['Inter'] text-[#515f74]">
                <span>Attempted: {stat.attempted}</span>
                <span className="text-[#059669] font-bold">Correct: {stat.correct}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#e5eeff] dark:bg-[#1a2942] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: stat.accuracy !== null ? `${stat.accuracy}%` : '0%',
                    backgroundColor: stat.color,
                  }}
                />
              </div>
            </div>

            <span className="text-[11px] text-[#515f74] dark:text-[#94a3b8]">
              Target threshold for Tier-I: &gt;85%
            </span>
          </div>
        ))}
      </div>

      {/* Consistency Log */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#000922] dark:text-[#f8f9ff]">
              Academic Consistency &amp; Activity Log
            </h3>
            <span className="text-[13px] text-[#515f74] dark:text-[#94a3b8]">
              Tracks verified test completion sessions across your study timeline.
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#89f5e7]/20 text-[#002622] dark:text-[#89f5e7] font-['JetBrains_Mono'] text-[12px] font-bold">
            {streakCount > 0 ? `🔥 ${streakCount} Active Day${streakCount === 1 ? '' : 's'}` : '0 Active Days (Ready to Begin)'}
          </span>
        </div>

        {attempts.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#eff4ff]/60 dark:bg-[#111c30] border border-dashed border-[#ccd9f0] dark:border-[#1a2942] text-center flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-[#515f74]">
              pending_actions
            </span>
            <p className="text-[14px] font-semibold text-[#000922] dark:text-[#f8f9ff]">
              No study activity logged yet
            </p>
            <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8] max-w-sm">
              Complete any chapter reading, practice drill, or mock test to begin recording your academic consistency log.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pt-2">
            {attempts.slice(0, 5).map((a) => (
              <div
                key={a.attemptId}
                className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex items-center justify-between"
              >
                <div>
                  <span className="text-[13px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                    {a.mockTitle}
                  </span>
                  <span className="text-[11px] text-[#515f74] dark:text-[#94a3b8] block">
                    {new Date(a.date).toLocaleDateString()} • {a.attempted} Attempted • {a.correct} Correct
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-['JetBrains_Mono'] font-bold text-[14px] text-[#000922] dark:text-[#89f5e7]">
                    {a.finalScore.toFixed(1)} Marks
                  </span>
                  <span className="text-[11px] font-mono text-[#059669] block">
                    {a.accuracy}% Accuracy
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
