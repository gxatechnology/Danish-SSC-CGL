import React, { useState, useRef, useEffect } from 'react';
import { TutorMessage, StudyTutorContext } from '../types';
import { askStudyTutor } from '../services/geminiTutor';

interface AskTutorViewProps {
  initialContext?: StudyTutorContext | null;
  onClearContext?: () => void;
}

export const AskTutorView: React.FC<AskTutorViewProps> = ({
  initialContext,
  onClearContext,
}) => {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'msg-init',
      sender: 'tutor',
      text: "Assalamu Alaikum Danish! I am your personal SSC CGL study mentor, created for you by Tauqeer Ashraf. I am grounded directly in your syllabus notes for English and Mathematics. Ask me to break down any grammar trap, solve a quant shortcut, or analyze your mistakes.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeContext, setActiveContext] = useState<StudyTutorContext | null>(
    initialContext || null
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialContext) {
      setActiveContext(initialContext);
    }
  }, [initialContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    'Explain Subject–Verb Agreement with Prepositional Phrases',
    'Why is "comprises of" considered an error in SSC CGL?',
    'Show me the base-shift shortcut for price vs consumption',
    'What is the difference between Incenter and Orthocenter angles?',
    'What should I prioritize revising today for 30 Sep exam?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text || isLoading) return;

    const userMsg: TutorMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askStudyTutor(text, activeContext || undefined);
      const tutorMsg: TutorMessage = {
        id: `tut-${Date.now()}`,
        sender: 'tutor',
        text: response.content,
        timestamp: new Date().toISOString(),
        groundedNotes: response.groundedNotes,
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err: any) {
      const errorMsg: TutorMessage = {
        id: `err-${Date.now()}`,
        sender: 'tutor',
        text: `Error connecting to tutor: ${err.message || 'Please check your connection.'}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearContext = () => {
    setActiveContext(null);
    if (onClearContext) onClearContext();
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 md:px-8 py-8 flex flex-col h-[calc(100vh-120px)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5eeff] dark:border-[#1a2942]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></span>
            <h1 className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold text-[#000922] dark:text-[#f8f9ff]">
              SSC CGL Personal Study Tutor
            </h1>
          </div>
          <p className="text-[13px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
            Dedicated mentor for Danish Fatma • Grounded in your custom English &amp; Quant curriculum.
          </p>
        </div>

        {activeContext && (
          <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-[#002622] text-[#89f5e7] text-[12px] font-medium border border-[#19988c]/30">
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Focus: {activeContext.chapterTitle}</span>
            <button
              onClick={handleClearContext}
              className="ml-2 text-[#89f5e7] hover:text-white cursor-pointer"
              title="Clear preloaded chapter context"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        )}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-5">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-[#002622] text-[#19988c] flex items-center justify-center shrink-0 border border-[#19988c]/30">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
              )}

              <div
                className={`max-w-2xl p-5 rounded-2xl flex flex-col gap-2 ${
                  isUser
                    ? 'bg-[#0f2042] text-white rounded-tr-none'
                    : 'bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] text-[#0b1c30] dark:text-[#e2e8f0] shadow-xs rounded-tl-none'
                }`}
              >
                <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap font-['Inter']">
                  {m.text}
                </p>

                {m.groundedNotes && m.groundedNotes.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-[#e5eeff] dark:border-[#1a2942] flex flex-col gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#19988c]">
                      Grounded In Your Notes
                    </span>
                    <ul className="text-[12px] text-[#515f74] dark:text-[#94a3b8] list-disc pl-4 space-y-0.5">
                      {m.groundedNotes.map((note, nIdx) => (
                        <li key={nIdx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <span
                  className={`text-[10px] self-end font-mono ${
                    isUser ? 'text-white/60' : 'text-[#515f74] dark:text-[#94a3b8]'
                  }`}
                >
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-[#0f2042] text-white flex items-center justify-center shrink-0 font-bold text-[12px]">
                  DF
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#002622] text-[#19988c] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#19988c] animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-[#19988c] animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-[#19988c] animate-bounce [animation-delay:0.4s]"></div>
              <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] ml-2">
                Consulting syllabus notes &amp; generating explanation...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pill Carousel */}
      <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold uppercase text-[#515f74] shrink-0">
          Suggested:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="px-3 py-1 rounded-full bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] text-[12px] font-medium text-[#0f2042] dark:text-[#8ea4c8] hover:bg-[#dce9ff] whitespace-nowrap cursor-pointer transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-sm"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything about grammar rules, formulas, traps, or shortcuts..."
            className="flex-1 px-4 py-2 text-[14px] bg-transparent text-[#000922] dark:text-white placeholder-[#515f74] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-5 py-2.5 rounded-xl bg-[#0f2042] hover:bg-[#000922] text-white text-[13px] font-bold disabled:opacity-40 flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <span>Ask Tutor</span>
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </form>
      </div>

    </div>
  );
};
