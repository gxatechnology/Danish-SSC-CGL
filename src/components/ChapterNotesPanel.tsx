import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { AssessmentStatus } from '../types';
import { Edit3, Check, Highlighter, Save, Sparkles, BookMarked } from 'lucide-react';

interface ChapterNotesPanelProps {
  chapterSlug: string;
  chapterTitle: string;
}

export const ChapterNotesPanel: React.FC<ChapterNotesPanelProps> = ({
  chapterSlug,
  chapterTitle,
}) => {
  const [notes, setNotes] = useState('');
  const [assessment, setAssessment] = useState<AssessmentStatus>('Not Yet');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedNotes = storageService.getChapterNotes(chapterSlug);
    const savedAssessment = storageService.getChapterAssessment(chapterSlug);
    setNotes(savedNotes);
    setAssessment(savedAssessment);
  }, [chapterSlug]);

  const handleNotesChange = (val: string) => {
    setNotes(val);
    storageService.saveChapterNotes(chapterSlug, val);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAssessmentChange = (status: AssessmentStatus) => {
    setAssessment(status);
    storageService.saveChapterAssessment(chapterSlug, status);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Personal Notes & Mastery
          </h4>
        </div>
        {isSaved && (
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
            <Check className="w-3 h-3" /> Saved
          </span>
        )}
      </div>

      {/* Self Assessment Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
          Self-Assessed Chapter Mastery:
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['Not Yet', 'Need Revision', 'Confident'] as AssessmentStatus[]).map((status) => {
            const isSelected = assessment === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => handleAssessmentChange(status)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border ${
                  isSelected
                    ? status === 'Confident'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : status === 'Need Revision'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-slate-700 text-white border-slate-700 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Your Revision Notepad:
          </label>
          <span className="text-[10px] text-slate-400">
            {notes.trim().split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
        <textarea
          rows={5}
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder={`Jot down formulas, difficult PYQ question numbers, or memory anchors for ${chapterTitle}...`}
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed resize-y"
        />
      </div>

      <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal italic flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-indigo-500" />
        Notes persist automatically across your study sessions in browser storage.
      </p>
    </div>
  );
};
