import React, { useState } from 'react';
import { STUDY_PLAN_DAYS } from '../content/studyPlan';
import { StudyPlanDay } from '../types';
import { storageService } from '../services/storageService';

interface StudyPlanViewProps {
  onOpenChapter: (slug: string, subject: 'English' | 'Mathematics') => void;
  onOpenTest: () => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({ onOpenChapter, onOpenTest }) => {
  const [days, setDays] = useState<StudyPlanDay[]>(() => {
    const saved = storageService.getStudyPlanDays();
    return saved.length > 0 ? saved : STUDY_PLAN_DAYS;
  });

  const toggleTask = (dayNumber: number, taskType: 'english' | 'maths' | 'practice' | 'revision') => {
    setDays((prev) => {
      const updated = prev.map((d) => {
        if (d.dayNumber !== dayNumber) return d;
        if (taskType === 'english') {
          return { ...d, englishTask: { ...d.englishTask, completed: !d.englishTask.completed } };
        }
        if (taskType === 'maths') {
          return { ...d, mathsTask: { ...d.mathsTask, completed: !d.mathsTask.completed } };
        }
        if (taskType === 'practice') {
          return { ...d, practiceTask: { ...d.practiceTask, completed: !d.practiceTask.completed } };
        }
        if (taskType === 'revision') {
          return { ...d, revisionTask: { ...d.revisionTask, completed: !d.revisionTask.completed } };
        }
        return d;
      });
      storageService.saveStudyPlanDays(updated);
      return updated;
    });
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-[#0f2042] text-white font-mono text-[11px] font-bold uppercase">
            Syllabus Progression
          </span>
          <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-mono">
            Target Exam Date: 30 September 2026
          </span>
        </div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#000922] dark:text-[#f8f9ff]">
          17-Day Intensive Study Masterplan
        </h1>
        <p className="font-['Inter'] text-[15px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
          Structured roadmap from 14 September to 30 September 2026 specifically designed for Danish Fatma.
        </p>
      </div>

      {/* Daily Cards Timeline */}
      <div className="flex flex-col gap-5">
        {days.map((day) => (
          <div
            key={day.dayNumber}
            className={`p-6 rounded-2xl bg-white dark:bg-[#0c1527] border transition-all shadow-xs flex flex-col gap-4 ${
              day.isToday
                ? 'border-[#0f2042] dark:border-[#89f5e7] ring-1 ring-[#0f2042] dark:ring-[#89f5e7]'
                : 'border-[#e5eeff] dark:border-[#1a2942]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5eeff] dark:border-[#1a2942] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[13px] font-bold px-2.5 py-0.5 rounded bg-[#eff4ff] text-[#0f2042]">
                  Day {day.dayNumber}
                </span>
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] text-[#000922] dark:text-[#f8f9ff]">
                  {day.dayLabel}
                </span>
                {day.isToday && (
                  <span className="px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] text-[10px] font-bold uppercase tracking-wider">
                    Current Focus
                  </span>
                )}
              </div>
              {day.notes && (
                <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] italic">
                  Tip: {day.notes}
                </span>
              )}
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* English Task */}
              <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase text-[#0f2042] dark:text-[#8ea4c8]">
                      English Task
                    </span>
                    <button
                      onClick={() => toggleTask(day.dayNumber, 'english')}
                      className="cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#10b981]">
                        {day.englishTask.completed ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                    </button>
                  </div>
                  <h4 className="font-bold text-[14px] text-[#000922] dark:text-[#f8f9ff]">
                    {day.englishTask.title}
                  </h4>
                  <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8] mt-1">
                    {day.englishTask.description}
                  </p>
                </div>
                {day.englishTask.slug && (
                  <button
                    onClick={() => onOpenChapter(day.englishTask.slug!, 'English')}
                    className="text-[12px] font-bold text-[#0f2042] dark:text-[#89f5e7] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Lesson</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                )}
              </div>

              {/* Maths Task */}
              <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase text-[#0f2042] dark:text-[#8ea4c8]">
                      Maths Task
                    </span>
                    <button
                      onClick={() => toggleTask(day.dayNumber, 'maths')}
                      className="cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#10b981]">
                        {day.mathsTask.completed ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                    </button>
                  </div>
                  <h4 className="font-bold text-[14px] text-[#000922] dark:text-[#f8f9ff]">
                    {day.mathsTask.title}
                  </h4>
                  <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8] mt-1">
                    {day.mathsTask.description}
                  </p>
                </div>
                {day.mathsTask.slug && (
                  <button
                    onClick={() => onOpenChapter(day.mathsTask.slug!, 'Mathematics')}
                    className="text-[12px] font-bold text-[#0f2042] dark:text-[#89f5e7] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Lesson</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                )}
              </div>

              {/* Practice Task */}
              <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase text-[#0f2042] dark:text-[#8ea4c8]">
                      Mock / Drill
                    </span>
                    <button
                      onClick={() => toggleTask(day.dayNumber, 'practice')}
                      className="cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#10b981]">
                        {day.practiceTask.completed ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                    </button>
                  </div>
                  <h4 className="font-bold text-[14px] text-[#000922] dark:text-[#f8f9ff]">
                    {day.practiceTask.title}
                  </h4>
                  <p className="text-[12px] text-[#515f74] dark:text-[#94a3b8] mt-1">
                    Target: {day.practiceTask.targetCount} Questions
                  </p>
                </div>
                <button
                  onClick={onOpenTest}
                  className="text-[12px] font-bold text-[#0f2042] dark:text-[#89f5e7] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Launch Drill</span>
                  <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                </button>
              </div>

              {/* Revision Task */}
              <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase text-[#0f2042] dark:text-[#8ea4c8]">
                      Quick Revision
                    </span>
                    <button
                      onClick={() => toggleTask(day.dayNumber, 'revision')}
                      className="cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#10b981]">
                        {day.revisionTask.completed ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                    </button>
                  </div>
                  <h4 className="font-bold text-[14px] text-[#000922] dark:text-[#f8f9ff]">
                    {day.revisionTask.title}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
