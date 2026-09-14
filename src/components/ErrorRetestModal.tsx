import React, { useState } from 'react';
import { ERROR_NOTES } from '../data/mockData';

interface ErrorRetestModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteId?: string;
  onSuccessResolve: (id: string) => void;
}

export const ErrorRetestModal: React.FC<ErrorRetestModalProps> = ({
  isOpen,
  onClose,
  noteId = 'err-1',
  onSuccessResolve,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(noteId);
  const [chosenAnswer, setChosenAnswer] = useState<string | null>(null);
  const [isResolved, setIsResolved] = useState(false);

  if (!isOpen) return null;

  const currentError = ERROR_NOTES.find((e) => e.id === selectedNoteId) || ERROR_NOTES[0];

  const testData = selectedNoteId === 'err-1' ? {
    question: 'Select the grammatical correction for the flagged question from SSC CGL 2023 Shift 2:',
    highlight: '"Neither the principal nor the lecturers was present at the annual symposium."',
    options: [
      { id: '1', text: 'Neither the principal nor the lecturers were present at the annual symposium.', isCorrect: true },
      { id: '2', text: 'Neither the principal or the lecturers was present at the annual symposium.', isCorrect: false },
      { id: '3', text: 'Neither the principal nor the lecturers are being present at the annual symposium.', isCorrect: false },
    ],
    ruleTip: 'Rule of Proximity: With "Neither...nor", the verb agrees strictly with the nearest subject ("lecturers" -> plural verb "were").'
  } : {
    question: 'Solve the sign calculation for Pipe & Cistern Level-2 Drill:',
    highlight: 'Pipe A can fill a tank in 12 hours. Due to a leakage at the bottom (Pipe B), it empties the full tank in 20 hours. When both operate together, what is the net hourly work rate?',
    options: [
      { id: '1', text: 'Net Rate = 1/12 + 1/20 = 8/60 (7.5 hours)', isCorrect: false },
      { id: '2', text: 'Net Rate = 1/12 - 1/20 = 2/60 = 1/30 (Takes 30 hours to fill)', isCorrect: true },
      { id: '3', text: 'Net Rate = 1/20 - 1/12 = Negative rate (Cannot fill)', isCorrect: false },
    ],
    ruleTip: 'Unitary Sign Convention: Filling pipes contribute positive work (+1/A); waste/leakage pipes subtract work (-1/B). Total time = 1 / (1/12 - 1/20) = 30 hrs.'
  };

  const handleSelectOption = (id: string, isCorrect: boolean) => {
    setChosenAnswer(id);
    if (isCorrect) {
      setIsResolved(true);
      onSuccessResolve(selectedNoteId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000922]/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-[#ffffff] dark:bg-[#0c1527] rounded-2xl shadow-2xl border border-[#e5eeff] dark:border-[#1a2942] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#eff4ff] dark:bg-[#111c30] border-b border-[#e5eeff] dark:border-[#1a2942] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#ba1a1a] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">notification_important</span>
            </span>
            <div>
              <span className="text-[11px] font-['JetBrains_Mono'] text-[#ba1a1a] font-bold uppercase tracking-wider">
                Error Retention Drill
              </span>
              <h3 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                Retest Mistake Notebook
              </h3>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-[#515f74] hover:bg-[#dce9ff]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab switch between error 1 & 2 */}
        <div className="flex border-b border-[#e5eeff] dark:border-[#1a2942] bg-[#f8f9ff] dark:bg-[#070e1c]">
          {ERROR_NOTES.map((err) => (
            <button
              key={err.id}
              onClick={() => {
                setSelectedNoteId(err.id);
                setChosenAnswer(null);
                setIsResolved(false);
              }}
              className={`flex-1 py-2.5 px-4 text-[12px] font-bold font-['Inter'] transition-colors text-left border-r last:border-r-0 border-[#e5eeff] dark:border-[#1a2942] ${
                selectedNoteId === err.id
                  ? 'bg-white dark:bg-[#0c1527] text-[#0f2042] dark:text-[#89f5e7] border-b-2 border-b-[#0f2042] dark:border-b-[#89f5e7]'
                  : 'text-[#515f74] hover:bg-[#eff4ff]'
              }`}
            >
              {err.source}
            </button>
          ))}
        </div>

        {/* Question body */}
        <div className="p-6 flex flex-col gap-4">
          <div>
            <span className="text-[11px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] font-bold uppercase">
              {currentError.type}
            </span>
            <p className="text-[14px] text-[#515f74] dark:text-[#94a3b8] mt-1.5">
              {testData.question}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] text-[14px] font-['JetBrains_Mono'] text-[#0b1c30] dark:text-[#f8f9ff] border border-[#e5eeff] dark:border-[#1a2942]">
            {testData.highlight}
          </div>

          {/* Options */}
          <div className="flex flex-col gap-2 mt-1">
            {testData.options.map((opt) => {
              const isSelected = chosenAnswer === opt.id;
              let optStyle = 'border-[#e2e8f0] dark:border-[#1a2942] bg-white dark:bg-[#0c1527] hover:bg-[#eff4ff]';
              if (isSelected) {
                optStyle = opt.isCorrect 
                  ? 'border-[#059669] bg-[#ecfdf5] dark:bg-[#062c28] text-[#065f46] dark:text-[#89f5e7] font-semibold'
                  : 'border-[#ba1a1a] bg-[#ffdad6] text-[#ba1a1a] font-semibold';
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                  className={`p-3.5 rounded-xl border text-[13px] cursor-pointer flex items-center justify-between transition-all ${optStyle}`}
                >
                  <span>{opt.text}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[18px]">
                      {opt.isCorrect ? 'check_circle' : 'cancel'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Feedback & Rule tip */}
          {chosenAnswer && (
            <div className={`p-4 rounded-xl text-[13px] border animate-in fade-in ${
              isResolved 
                ? 'bg-[#89f5e7]/20 border-[#6bd8cb] text-[#002622] dark:text-[#89f5e7]'
                : 'bg-[#ffdad6]/30 border-[#ffdad6] text-[#ba1a1a]'
            }`}>
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <span className="material-symbols-outlined text-[16px]">
                  {isResolved ? 'task_alt' : 'error'}
                </span>
                <span>{isResolved ? 'Error Cleared & Rule Anchored!' : 'Trap Triggered - Review Rule Logic'}</span>
              </div>
              <p>{testData.ruleTip}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-[#e5eeff] dark:border-[#1a2942] mt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#0f2042] text-white text-[13px] font-semibold hover:bg-[#1e3a8a] transition-colors"
            >
              {isResolved ? 'Done & Save Progress' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
