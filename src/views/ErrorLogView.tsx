import React, { useState, useEffect } from 'react';
import { ErrorLogItem, ErrorType } from '../types';
import { storageService } from '../services/storageService';

export const ErrorLogView: React.FC = () => {
  const [items, setItems] = useState<ErrorLogItem[]>(() => storageService.getErrorLog());
  const [filterType, setFilterType] = useState<string>('All');
  const [autoLogEnabled, setAutoLogEnabled] = useState<boolean>(() =>
    storageService.isAutoErrorLogEnabled()
  );
  const [retestItem, setRetestItem] = useState<ErrorLogItem | null>(null);
  const [retestAnswer, setRetestAnswer] = useState<string>('');
  const [retestFeedback, setRetestFeedback] = useState<string | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setItems(storageService.getErrorLog());
      setAutoLogEnabled(storageService.isAutoErrorLogEnabled());
    };
    window.addEventListener('danish_cgl_storage_changed', handleStorageChange);
    return () => window.removeEventListener('danish_cgl_storage_changed', handleStorageChange);
  }, []);

  const errorTypes: Array<string> = [
    'All',
    'Concept',
    'Calculation',
    'Formula',
    'Grammar',
    'Vocabulary',
    'Rushed Reading',
    'Guessing',
  ];

  const filteredItems = items.filter((item) => {
    if (filterType === 'All') return true;
    return item.errorType === filterType;
  });

  const handleToggleCorrected = (id: string) => {
    storageService.toggleErrorLogCorrected(id);
    setItems(storageService.getErrorLog());
  };

  const handleDelete = (id: string) => {
    storageService.deleteErrorLogItem(id);
    setItems(storageService.getErrorLog());
  };

  const handleToggleAutoLog = () => {
    const next = !autoLogEnabled;
    storageService.setAutoErrorLog(next);
    setAutoLogEnabled(next);
  };

  const handleStartRetest = (item: ErrorLogItem) => {
    setRetestItem(item);
    setRetestAnswer('');
    setRetestFeedback(null);
  };

  const handleCheckRetest = () => {
    if (!retestItem) return;
    if (retestAnswer.trim().toUpperCase() === retestItem.correctAnswer.trim().toUpperCase()) {
      setRetestFeedback('Correct! Trap overcome.');
      storageService.toggleErrorLogCorrected(retestItem.id);
      setItems(storageService.getErrorLog());
      setTimeout(() => setRetestItem(null), 1500);
    } else {
      setRetestFeedback(`Incorrect. The correct answer remains (${retestItem.correctAnswer}).`);
    }
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ba1a1a] text-white font-mono text-[11px] font-bold uppercase">
              Negative Marks Elimination
            </span>
            <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-mono">
              Total Logged: {items.length} | Corrected: {items.filter((i) => i.isCorrected).length}
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#000922] dark:text-[#f8f9ff]">
            Error Log Notebook
          </h1>
          <p className="font-['Inter'] text-[15px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
            Classify and systematically re-test your conceptual blunders, calculation traps, and rushed readings.
          </p>
        </div>

        {/* Auto Log Toggle */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs">
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-[#000922] dark:text-[#f8f9ff]">
              Auto-Log Wrong Answers
            </span>
            <span className="text-[11px] text-[#515f74] dark:text-[#94a3b8]">
              Captures errors automatically during mocks
            </span>
          </div>
          <button
            onClick={handleToggleAutoLog}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              autoLogEnabled ? 'bg-[#0f2042]' : 'bg-[#dce9ff] dark:bg-[#1a2942]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                autoLogEnabled ? 'left-7' : 'left-1'
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e5eeff] dark:border-[#1a2942] pb-4">
        {errorTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
              filterType === type
                ? 'bg-[#0f2042] text-white shadow-xs'
                : 'text-[#515f74] dark:text-[#b9c7df] hover:bg-[#eff4ff] dark:hover:bg-[#15233c]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Error Items List */}
      {filteredItems.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] text-center flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[48px] text-[#10b981]">
            verified
          </span>
          <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#000922] dark:text-[#f8f9ff]">
            No Errors in this Category!
          </h3>
          <p className="text-[14px] text-[#515f74] dark:text-[#94a3b8] max-w-md">
            Your error notebook is clear. Keep testing your speed in Mocks and Practice Hub to surface hidden traps.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-2xl bg-white dark:bg-[#0c1527] border transition-all flex flex-col gap-4 shadow-xs ${
                item.isCorrected
                  ? 'border-[#a7f3d0] dark:border-[#065f46] opacity-80'
                  : 'border-[#e5eeff] dark:border-[#1a2942]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#fff1f2] dark:bg-[#201015] text-[#ba1a1a] dark:text-[#f87171] font-mono text-[11px] font-bold uppercase">
                    {item.errorType} Error
                  </span>
                  <span className="text-[13px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                    {item.subject} • {item.topic}
                  </span>
                  <span className="text-[11px] text-[#515f74] dark:text-[#94a3b8]">
                    via {item.sourceTestOrChapter}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartRetest(item)}
                    className="px-3 py-1 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] text-[#0f2042] dark:text-[#8ea4c8] text-[12px] font-bold hover:bg-[#dce9ff] flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    <span>Re-test Trap</span>
                  </button>

                  <button
                    onClick={() => handleToggleCorrected(item.id)}
                    className={`px-3 py-1 rounded-xl text-[12px] font-semibold flex items-center gap-1 cursor-pointer ${
                      item.isCorrected
                        ? 'bg-[#ecfdf5] text-[#059669]'
                        : 'border border-[#e5eeff] dark:border-[#1a2942] text-[#515f74]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {item.isCorrected ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>{item.isCorrected ? 'Corrected' : 'Mark Corrected'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded text-[#515f74] hover:text-[#ba1a1a] cursor-pointer"
                    title="Delete Entry"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-semibold text-[#000922] dark:text-[#f8f9ff]">
                {item.questionText}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#fff1f2] dark:bg-[#201015] border border-[#fecdd3] dark:border-[#501320] text-[13px]">
                  <span className="font-bold text-[#ba1a1a] block mb-0.5">✕ What went wrong:</span>
                  <span className="text-[#881337] dark:text-[#fecdd3]">
                    Your choice: <strong>{item.yourAnswer}</strong>
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#ecfdf5] dark:bg-[#062c24] border border-[#a7f3d0] dark:border-[#044e3f] text-[13px]">
                  <span className="font-bold text-[#059669] block mb-0.5">✓ Correct Resolution:</span>
                  <span className="text-[#065f46] dark:text-[#a7f3d0]">
                    Official answer: <strong>{item.correctAnswer}</strong>
                  </span>
                </div>
              </div>

              {item.notes && (
                <div className="text-[13px] text-[#515f74] dark:text-[#94a3b8] italic">
                  Notes: {item.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Re-test Modal */}
      {retestItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] font-bold text-[#ba1a1a]">
                Trap Re-Test Exercise
              </span>
              <button
                onClick={() => setRetestItem(null)}
                className="text-[#515f74] hover:text-[#000922] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="font-['Plus_Jakarta_Sans'] font-semibold text-[16px] text-[#000922] dark:text-[#f8f9ff]">
              {retestItem.questionText}
            </p>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-[#515f74] dark:text-[#94a3b8]">
                Enter Option letter (A, B, C, or D):
              </label>
              <input
                type="text"
                maxLength={2}
                value={retestAnswer}
                onChange={(e) => setRetestAnswer(e.target.value)}
                placeholder="e.g. A"
                className="w-24 p-2.5 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] text-center font-mono font-bold text-[18px] text-[#000922] dark:text-white uppercase"
              />
            </div>

            {retestFeedback && (
              <div
                className={`p-3 rounded-xl text-[13px] font-semibold ${
                  retestFeedback.startsWith('Correct')
                    ? 'bg-[#ecfdf5] text-[#059669]'
                    : 'bg-[#fff1f2] text-[#ba1a1a]'
                }`}
              >
                {retestFeedback}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRetestItem(null)}
                className="px-4 py-2 rounded-xl border text-[13px] font-semibold text-[#515f74] cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleCheckRetest}
                className="px-5 py-2 rounded-xl bg-[#0f2042] text-white text-[13px] font-bold cursor-pointer"
              >
                Verify Answer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
