import React from 'react';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChapter: () => void;
  onOpenRevision: () => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  onOpenChapter,
  onOpenRevision,
}) => {
  if (!isOpen) return null;

  const bookmarkedItems = [
    {
      id: 'bm-1',
      title: 'Rule 7: Correlative Proximity Concord',
      category: 'English Grammar',
      tag: 'Neither...nor closest subject rule',
      type: 'rule',
    },
    {
      id: 'bm-2',
      title: 'Incircle Radius Formula for Right Triangles',
      category: 'Mathematics',
      tag: 'r = (a + b - c) / 2',
      type: 'formula',
    },
    {
      id: 'bm-3',
      title: 'Order of Personal Pronouns (231 vs 123)',
      category: 'English Grammar',
      tag: 'Positive context: You, he and I',
      type: 'rule',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000922]/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#0c1527] rounded-2xl shadow-2xl border border-[#e5eeff] dark:border-[#1a2942] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-[#eff4ff] dark:bg-[#111c30] border-b border-[#e5eeff] dark:border-[#1a2942] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#002622] text-[#19988c] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">bookmark</span>
            </span>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#000922] dark:text-[#f8f9ff]">
              Saved Memory Anchors ({bookmarkedItems.length})
            </h3>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-[#515f74] hover:bg-[#dce9ff]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
          {bookmarkedItems.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-['JetBrains_Mono'] uppercase font-bold text-[#19988c] block">
                  {item.category}
                </span>
                <h4 className="text-[14px] font-bold text-[#000922] dark:text-[#f8f9ff] mt-0.5">
                  {item.title}
                </h4>
                <span className="text-[12px] font-['JetBrains_Mono'] text-[#515f74] dark:text-[#94a3b8]">
                  {item.tag}
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (item.type === 'rule') {
                    onOpenChapter();
                  } else {
                    onOpenRevision();
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-[#0f2042] text-white text-[12px] font-semibold hover:bg-[#000922]"
              >
                Open
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#f8f9ff] dark:bg-[#070e1c] border-t border-[#e5eeff] dark:border-[#1a2942] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0f2042] text-white text-[12px] font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
