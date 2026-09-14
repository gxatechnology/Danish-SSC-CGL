import React, { useState } from 'react';
import { storageService } from '../services/storageService';

interface SettingsViewProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode, onToggleTheme }) => {
  const [autoLog, setAutoLog] = useState<boolean>(() => storageService.isAutoErrorLogEnabled());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [resetModalType, setResetModalType] = useState<'progress' | 'results' | 'all' | null>(null);

  const handleToggleAutoLog = () => {
    const next = !autoLog;
    storageService.setAutoErrorLog(next);
    setAutoLog(next);
    showFeedback(`Auto error logging ${next ? 'enabled' : 'disabled'}.`);
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleExportData = () => {
    const jsonStr = storageService.exportAllUserData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `danish-fatma-ssc-cgl-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showFeedback('Study data exported successfully!');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = storageService.importUserData(content);
        if (success) {
          showFeedback('Study data imported successfully! Refreshing...');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          showFeedback('Failed to parse JSON file.');
        }
      } catch (err) {
        showFeedback('Error importing study data.');
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteReset = () => {
    if (resetModalType === 'all') {
      storageService.clearAllData();
      showFeedback('All study data cleared. Reloading...');
      setTimeout(() => window.location.reload(), 1000);
    }
    setResetModalType(null);
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-[#0f2042] text-white font-mono text-[11px] font-bold uppercase">
            Preferences &amp; Persistence
          </span>
          <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-mono">
            Candidate: Danish Fatma
          </span>
        </div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#000922] dark:text-[#f8f9ff]">
          Settings &amp; Data Management
        </h1>
        <p className="font-['Inter'] text-[15px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
          Configure visual display, automatic mistake logging, and backup or restore your revision progress.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-[#ecfdf5] dark:bg-[#062c24] border border-[#a7f3d0] dark:border-[#044e3f] text-[#065f46] dark:text-[#a7f3d0] text-[13px] font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">info</span>
          <span>{feedback}</span>
        </div>
      )}

      {/* Settings Options */}
      <div className="flex flex-col gap-6">
        
        {/* Appearance Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-4">
          <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#000922] dark:text-[#f8f9ff]">
            Interface Theme
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#000922] dark:text-[#f8f9ff]">
                Dark Mode Palette
              </p>
              <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8]">
                Deep midnight slate for strain-free nocturnal study sessions.
              </p>
            </div>
            <button
              onClick={onToggleTheme}
              className="px-4 py-2 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] bg-[#eff4ff] dark:bg-[#111c30] text-[13px] font-bold text-[#0f2042] dark:text-[#8ea4c8] flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
              <span>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
            </button>
          </div>
        </div>

        {/* Study Automation Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-4">
          <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#000922] dark:text-[#f8f9ff]">
            Error Tracking Engine
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#000922] dark:text-[#f8f9ff]">
                Auto-Log Negative Marking Traps
              </p>
              <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8]">
                When taking sectional mocks or drills, wrong answers are automatically saved to your Error Log.
              </p>
            </div>
            <button
              onClick={handleToggleAutoLog}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoLog ? 'bg-[#0f2042]' : 'bg-[#dce9ff] dark:bg-[#1a2942]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  autoLog ? 'left-7' : 'left-1'
                }`}
              ></div>
            </button>
          </div>
        </div>

        {/* Data Backup & Restore */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col gap-4">
          <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#000922] dark:text-[#f8f9ff]">
            Data Portability &amp; Backups
          </h3>
          <p className="text-[13px] text-[#515f74] dark:text-[#94a3b8]">
            Your entire study progress—completed chapters, test attempts, bookmarks, and error logs—is preserved in local storage. You can download an offline JSON backup or restore it on another device.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleExportData}
              className="px-4 py-2.5 rounded-xl bg-[#0f2042] text-white text-[13px] font-bold hover:bg-[#000922] flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export My Study Data (JSON)</span>
            </button>

            <label className="px-4 py-2.5 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] bg-[#eff4ff] dark:bg-[#111c30] text-[13px] font-bold text-[#0f2042] dark:text-[#8ea4c8] hover:bg-[#dce9ff] flex items-center gap-1.5 cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">upload</span>
              <span>Import Study Data</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl bg-[#fff1f2] dark:bg-[#201015] border border-[#fecdd3] dark:border-[#501320] flex flex-col gap-4">
          <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#e11d48]">
            Danger Zone
          </h3>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[14px] font-medium text-[#881337] dark:text-[#fecdd3]">
                Reset All Progress &amp; Error Logs
              </p>
              <p className="text-[12px] text-[#9f1239] dark:text-[#fda4af]">
                Permanently wipes all local mock test history, bookmarks, and completed chapter marks.
              </p>
            </div>
            <button
              onClick={() => setResetModalType('all')}
              className="px-4 py-2 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white text-[13px] font-bold cursor-pointer"
            >
              Reset Everything
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {resetModalType && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xl flex flex-col gap-4">
            <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#ba1a1a]">
              Confirm Data Reset?
            </h3>
            <p className="text-[14px] text-[#515f74] dark:text-[#94a3b8]">
              This action cannot be undone. Are you sure you want to erase all test results, error notebooks, and chapter completions?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setResetModalType(null)}
                className="px-4 py-2 rounded-xl border text-[13px] font-semibold text-[#515f74] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReset}
                className="px-5 py-2 rounded-xl bg-[#e11d48] text-white text-[13px] font-bold cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
