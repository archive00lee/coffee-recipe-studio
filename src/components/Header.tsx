import React from 'react';
import { Coffee, Bookmark, Compass, ClipboardCheck, Package, Sliders } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'recipe' | 'evaluation' | 'bean' | 'grind';
  setActiveTab: (tab: 'home' | 'recipe' | 'evaluation' | 'bean' | 'grind') => void;
  openAddModal?: () => void;
  recipeCount: number;
  evaluationCount: number;
  beanCount?: number;
  favoriteCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openAddModal,
  recipeCount,
  evaluationCount,
  beanCount = 0,
  favoriteCount
}) => {
  return (
    <header className="border-b border-white/10 bg-black/70 backdrop-blur-xl sticky top-0 z-40 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 space-y-3">
        
        {/* Top Row: Brand Logo & Optional Actions */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center space-x-3 cursor-pointer group shrink-0" onClick={() => setActiveTab('home')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-white via-zinc-400 to-[#030303] border border-white/30 flex items-center justify-center text-[#030303] shadow-lg group-hover:border-white transition duration-300">
              <Coffee className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-extrabold tracking-wider text-white flex items-center gap-2 whitespace-nowrap">
                L coffee studio
              </h1>
              <p className="text-xs text-zinc-400 -mt-0.5 font-medium whitespace-nowrap">나만의 커피 추출 레시피 아카이브</p>
            </div>
          </div>

          {/* Quick Favorite Badge if available */}
          {favoriteCount > 0 && (
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setActiveTab('recipe')}
                title="즐겨찾기 목록"
                className="flex items-center space-x-1.5 text-xs text-zinc-200 bg-zinc-900/90 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl hover:border-white/30 transition whitespace-nowrap shadow-md"
              >
                <Bookmark className="w-3.5 h-3.5 fill-white text-white" />
                <span>{favoriteCount}개 저장됨</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Row: Navigation Tabs (Order: 홈 > 레시피 > 센서리 > 분쇄도 > 원두) */}
        <nav className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2 bg-[#030303]/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-inner overflow-x-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-[#030303] shadow-lg font-extrabold scale-[1.02]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>홈</span>
          </button>

          <button
            onClick={() => setActiveTab('recipe')}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
              activeTab === 'recipe'
                ? 'bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-[#030303] shadow-lg font-extrabold scale-[1.02]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>레시피</span>
            <span className={`ml-0.5 px-2 py-0.5 rounded-full text-[11px] font-mono ${
              activeTab === 'recipe' ? 'bg-[#030303] text-white' : 'bg-white/10 text-zinc-300'
            }`}>
              {recipeCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('evaluation')}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
              activeTab === 'evaluation'
                ? 'bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-[#030303] shadow-lg font-extrabold scale-[1.02]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>센서리</span>
            <span className={`ml-0.5 px-2 py-0.5 rounded-full text-[11px] font-mono ${
              activeTab === 'evaluation' ? 'bg-[#030303] text-white' : 'bg-white/10 text-zinc-300'
            }`}>
              {evaluationCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('grind')}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
              activeTab === 'grind'
                ? 'bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-[#030303] shadow-lg font-extrabold scale-[1.02]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>분쇄도</span>
          </button>

          <button
            onClick={() => setActiveTab('bean')}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
              activeTab === 'bean'
                ? 'bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-[#030303] shadow-lg font-extrabold scale-[1.02]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>원두</span>
            <span className={`ml-0.5 px-2 py-0.5 rounded-full text-[11px] font-mono ${
              activeTab === 'bean' ? 'bg-[#030303] text-white' : 'bg-white/10 text-zinc-300'
            }`}>
              {beanCount}
            </span>
          </button>
        </nav>

      </div>
    </header>
  );
};


