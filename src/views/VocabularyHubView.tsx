import React, { useState } from 'react';
import { VOCABULARY_DATA } from '../content/vocabulary';
import { VocabItem } from '../types';
import { storageService } from '../services/storageService';

interface VocabularyHubViewProps {
  onStartQuiz: () => void;
}

export const VocabularyHubView: React.FC<VocabularyHubViewProps> = ({ onStartQuiz }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [items, setItems] = useState<VocabItem[]>(VOCABULARY_DATA);
  const [learnedIds, setLearnedIds] = useState<string[]>([]);

  const tabs = [
    { id: 'all', label: `All (${VOCABULARY_DATA.length})` },
    { id: 'one-word', label: `One Word (${VOCABULARY_DATA.filter((v) => v.type === 'one-word').length})` },
    { id: 'idiom', label: `Idioms (${VOCABULARY_DATA.filter((v) => v.type === 'idiom').length})` },
    { id: 'synonym', label: `Synonyms (${VOCABULARY_DATA.filter((v) => v.type === 'synonym').length})` },
    { id: 'antonym', label: `Antonyms (${VOCABULARY_DATA.filter((v) => v.type === 'antonym').length})` },
    { id: 'confusing-word', label: `Confusing Words (${VOCABULARY_DATA.filter((v) => v.type === 'confusing-word').length})` },
    { id: 'spelling', label: `Spellings (${VOCABULARY_DATA.filter((v) => v.type === 'spelling').length})` },
  ];

  const filtered = items.filter((item) => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesQuery =
      searchQuery === '' ||
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const handleToggleLearned = (id: string) => {
    setLearnedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleShuffle = () => {
    setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const handleToggleBookmark = (item: VocabItem) => {
    storageService.toggleBookmark({
      targetId: item.id,
      title: item.word,
      category: 'Vocabulary',
      snippet: item.meaning,
      routeTarget: { route: 'english-vocabulary', slug: item.type },
    });
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0f2042] text-white font-['Inter'] text-[11px] font-bold uppercase tracking-wider">
              BlackBook Curated Vocab Engine
            </span>
            <span className="text-[12px] text-[#515f74] dark:text-[#94a3b8] font-['JetBrains_Mono']">
              Verified SSC Vocabulary
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#000922] dark:text-[#f8f9ff]">
            Vocabulary &amp; Root Words Hub
          </h1>
          <p className="font-['Inter'] text-[15px] text-[#515f74] dark:text-[#94a3b8] mt-0.5">
            Active vocabulary deck: {VOCABULARY_DATA.length} imported high-frequency items across 6 test dimensions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShuffle}
            className="px-4 py-2.5 rounded-xl border border-[#e5eeff] dark:border-[#1a2942] bg-white dark:bg-[#0c1527] text-[13px] font-semibold text-[#0f2042] dark:text-[#8ea4c8] flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-[#eff4ff]"
          >
            <span className="material-symbols-outlined text-[18px]">shuffle</span>
            <span>Shuffle Deck</span>
          </button>

          <button
            onClick={onStartQuiz}
            className="px-4 py-2.5 rounded-xl bg-[#0f2042] text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-[#000922]"
          >
            <span className="material-symbols-outlined text-[18px]">quiz</span>
            <span>Quick Vocab Quiz</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-[#e5eeff] dark:border-[#1a2942] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0f2042] text-white shadow-xs'
                  : 'text-[#515f74] dark:text-[#b9c7df] hover:bg-[#eff4ff] dark:hover:bg-[#15233c]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#515f74] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words or meanings..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#0c1527] border border-[#e5eeff] dark:border-[#1a2942] text-[13px] text-[#0b1c30] dark:text-white placeholder-[#515f74] focus:outline-none focus:border-[#0f2042]"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => {
          const isLearned = learnedIds.includes(item.id);
          const isBookmarked = storageService.isBookmarked(item.id);
          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl bg-white dark:bg-[#0c1527] border transition-all flex flex-col justify-between gap-4 ${
                isLearned
                  ? 'border-[#a7f3d0] dark:border-[#065f46] shadow-xs opacity-85'
                  : 'border-[#e5eeff] dark:border-[#1a2942] shadow-xs'
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-['JetBrains_Mono'] uppercase font-bold px-2 py-0.5 rounded bg-[#eff4ff] text-[#0f2042] dark:bg-[#1a2942] dark:text-[#8ea4c8]">
                    {item.type.replace('-', ' ')}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleBookmark(item)}
                      className="p-1 rounded text-[#515f74] hover:text-[#0f2042] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isBookmarked ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                    <button
                      onClick={() => handleToggleLearned(item.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                        isLearned
                          ? 'bg-[#ecfdf5] text-[#059669]'
                          : 'bg-[#eff4ff] dark:bg-[#111c30] text-[#515f74]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isLearned ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span>{isLearned ? 'Learned' : 'Learn'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#000922] dark:text-[#f8f9ff]">
                    {item.word}
                  </h3>
                  <p className="text-[14px] text-[#0b1c30] dark:text-[#e2e8f0] mt-1 font-medium">
                    {item.meaning}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#111c30] border border-[#e5eeff] dark:border-[#1a2942] text-[12px] text-[#515f74] dark:text-[#94a3b8] italic">
                  "{item.example}"
                </div>

                {item.mnemonic && (
                  <div className="text-[12px] text-[#19988c] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">psychology</span>
                    <span><strong>Mnemonic:</strong> {item.mnemonic}</span>
                  </div>
                )}
              </div>

              {item.synonyms && item.synonyms.length > 0 && (
                <div className="pt-3 border-t border-[#e5eeff] dark:border-[#1a2942] text-[11px] text-[#515f74] dark:text-[#94a3b8] flex flex-wrap gap-1">
                  <span className="font-bold">Synonyms:</span>
                  {item.synonyms.map((s, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-[#eff4ff] dark:bg-[#1a2942]">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
