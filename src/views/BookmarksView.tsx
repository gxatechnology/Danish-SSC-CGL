import React, { useState, useEffect } from 'react';
import { BookmarkItem } from '../types';
import { storageService } from '../services/storageService';

interface BookmarksViewProps {
  onNavigate: (routeTarget: { route: string; slug?: string }) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({ onNavigate }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => storageService.getBookmarks());
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const handleStorageChange = () => {
      setBookmarks(storageService.getBookmarks());
    };
    window.addEventListener('danish_cgl_storage_changed', handleStorageChange);
    return () => window.removeEventListener('danish_cgl_storage_changed', handleStorageChange);
  }, []);

  const categories = ['All', 'English', 'Mathematics', 'Formula', 'Vocabulary', 'Question'];

  const filtered = bookmarks.filter((b) => {
    if (activeCategory === 'All') return true;
    return b.category === activeCategory;
  });

  const handleRemove = (targetId: string) => {
    const item = bookmarks.find((b) => b.targetId === targetId);
    if (item) {
      storageService.toggleBookmark(item);
      setBookmarks(storageService.getBookmarks());
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-[#0f2042] text-white font-mono text-[11px] font-bold uppercase">
            Saved Knowledge
          </span>
          <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-mono">
            {bookmarks.length} Total Bookmarks
          </span>
        </div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#000922] dark:text-[#f8f9ff]">
          Saved Bookmarks &amp; High-Yield Pinboard
        </h1>
        <p className="font-['Inter'] text-[15px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
          Access your starred grammar rules, mathematical theorems, vocabulary mnemonics, and questions.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e5eeff] dark:border-[#1a2942] pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#0f2042] text-white shadow-xs'
                : 'text-[#515f74] dark:text-[#b9c7df] hover:bg-[#eff4ff] dark:hover:bg-[#15233c]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bookmarks Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] text-center flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[48px] text-[#515f74]">
            bookmark_border
          </span>
          <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#000922] dark:text-[#f8f9ff]">
            No Bookmarks Saved Yet
          </h3>
          <p className="text-[14px] text-[#515f74] dark:text-[#94a3b8] max-w-md">
            Click the bookmark icon on any chapter, formula, or vocabulary card to assemble your high-yield revision pinboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] shadow-xs flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#eff4ff] dark:bg-[#1a2942] text-[#0f2042] dark:text-[#8ea4c8]">
                    {b.category}
                  </span>
                  <button
                    onClick={() => handleRemove(b.targetId)}
                    className="text-[#515f74] hover:text-[#ba1a1a] cursor-pointer"
                    title="Remove Bookmark"
                  >
                    <span className="material-symbols-outlined text-[18px]">bookmark_remove</span>
                  </button>
                </div>

                <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                  {b.title}
                </h3>

                {b.snippet && (
                  <p className="text-[13.5px] text-[#515f74] dark:text-[#94a3b8] line-clamp-3">
                    {b.snippet}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#e5eeff] dark:border-[#1a2942] flex items-center justify-between">
                <span className="text-[11px] text-[#515f74] dark:text-[#94a3b8]">
                  {new Date(b.savedAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onNavigate(b.routeTarget)}
                  className="px-3 py-1.5 rounded-xl bg-[#0f2042] text-white text-[12px] font-bold hover:bg-[#000922] flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Topic</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
