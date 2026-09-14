import React, { useState } from 'react';
import { MOCK_TESTS } from '../content/mockTests';
import { storageService } from '../services/storageService';

interface MockTestsViewProps {
  onStartMockTest: (testId: string) => void;
  onViewResult?: (attemptId: string) => void;
}

export const MockTestsView: React.FC<MockTestsViewProps> = ({
  onStartMockTest,
  onViewResult,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'English' | 'Mathematics' | 'Full' | 'Mini'>('all');
  const pastResults = storageService.getTestResults();

  const getLatestResult = (testId: string) => {
    return pastResults.find((r) => r.testId === testId);
  };

  const filteredTests = MOCK_TESTS.filter((t) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'English') return t.title.includes('English');
    if (selectedCategory === 'Mathematics') return t.title.includes('Quantitative') || t.title.includes('Math');
    if (selectedCategory === 'Full') return t.type === 'Full-Length';
    if (selectedCategory === 'Mini') return t.type === 'Daily Mini';
    return true;
  });

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-8 md:py-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0f2042] text-white font-mono text-[11px] font-bold uppercase tracking-wider">
              TCS Simulation Engine
            </span>
            <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-mono">
              +2.00 Correct • -0.50 Negative Marking
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#000922] dark:text-[#f8f9ff]">
            Mock Test Series &amp; Timed Sectionals
          </h1>
          <p className="font-['Inter'] text-[15px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
            Full-fledged exam simulator with sectional timers, question status palettes, and automatic mistake taxonomy.
          </p>
        </div>

        <button
          onClick={() => onStartMockTest('mock-daily-mini-01')}
          className="px-5 py-3 rounded-xl bg-[#0f2042] text-white font-bold text-[14px] flex items-center gap-2 shadow-xs cursor-pointer hover:bg-[#000922] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>Launch 8-Min Mini Drill</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e5eeff] dark:border-[#1a2942] pb-3 overflow-x-auto">
        {[
          { id: 'all', label: 'All Tests' },
          { id: 'English', label: 'English Sectionals' },
          { id: 'Mathematics', label: 'Quantitative Sectionals' },
          { id: 'Full', label: 'Full Length Mocks' },
          { id: 'Mini', label: 'Daily Mini Tests' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === tab.id
                ? 'bg-[#0f2042] text-white shadow-xs'
                : 'text-[#515f74] dark:text-[#b9c7df] hover:bg-[#eff4ff]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTests.map((test) => {
          const totalQ = test.sections.reduce((acc, s) => acc + s.questions.length, 0);
          const totalMins = test.sections.reduce((acc, s) => acc + s.durationMinutes, 0);
          const maxScore = totalQ * 2;
          const past = getLatestResult(test.id);

          return (
            <div
              key={test.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs hover:border-[#0f2042] dark:hover:border-[#89f5e7] transition-all flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#eff4ff] text-[#0f2042] dark:bg-[#1a2942] dark:text-[#8ea4c8] uppercase">
                    {test.type}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      past
                        ? 'bg-[#ecfdf5] text-[#059669]'
                        : 'bg-[#dce9ff] text-[#000922] dark:text-[#89f5e7]'
                    }`}
                  >
                    {past ? 'Attempted' : 'Available'}
                  </span>
                </div>

                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                    {test.title}
                  </h3>
                  <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8]">
                    {totalQ} Questions • {totalMins} Minutes • Max {maxScore} Marks
                  </span>
                </div>

                {past && (
                  <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#515f74] uppercase font-bold block">Latest Score</span>
                      <span className="text-[16px] font-bold font-mono text-[#000922] dark:text-[#89f5e7]">
                        {past.totalScore.toFixed(1)} / {past.maxMarks}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#515f74] uppercase font-bold block">Accuracy</span>
                      <span className="text-[16px] font-bold font-mono text-[#059669]">
                        {past.accuracy}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-2 border-t border-[#e5eeff] dark:border-[#1a2942] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#515f74] dark:text-[#94a3b8]">
                  {past ? new Date(past.date).toLocaleDateString() : 'TCS 2026 Format'}
                </span>
                <div className="flex items-center gap-2">
                  {past && onViewResult && (
                    <button
                      onClick={() => onViewResult(past.attemptId)}
                      className="px-3 py-1.5 rounded-lg border border-[#e5eeff] dark:border-[#1a2942] text-[#0f2042] dark:text-[#8ea4c8] text-[12px] font-semibold hover:bg-[#eff4ff] cursor-pointer"
                    >
                      Report
                    </button>
                  )}
                  <button
                    onClick={() => onStartMockTest(test.id)}
                    className="px-4 py-1.5 rounded-lg bg-[#0f2042] hover:bg-[#000922] text-white text-[12px] font-semibold transition-colors cursor-pointer"
                  >
                    {past ? 'Retake' : 'Start Mock'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
