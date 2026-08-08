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
    <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 space-y-3">
        
        {/* Top Row: Brand Logo & Optional Actions */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center space-x-3 cursor-pointer group shrink-0" onClick={() => setActiveTab('home')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-black transition duration-200">
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
                className="flex items-center space-x-1.5 text-xs text-zinc-200 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg hover:border-zinc-700 transition whitespace-nowrap"
              >
                <Bookmark className="w-3.5 h-3.5 fill-white text-white" />
                <span>{favoriteCount}개 저장됨</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Row: Navigation Tabs (Order: 홈 > 레시피 > 센서리 > 분쇄도 > 원두) */}
        <nav className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
              activeTab === 'home'
                ? 'bg-white text-black font-extrabold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>홈</span>
          </button>

          <button
            onClick={() => setActiveTab('recipe')}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
              activeTab === 'recipe'
                ? 'bg-white text-black font-extrabold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>레시피</span>
            <span className={`ml-0.5 px-2 py-0.5 rounded-full text-[11px] font-mono ${
              activeTab === 'recipe' ? 'bg-zinc-900 text-white' : 'bg-zinc-800 text-zinc-300'
            }`}>
              {recipeCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('evaluation')}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
              activeTab === 'evaluation'
                ? 'bg-white text-black font-extrabold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>센서리</span>
            <span className={`ml-0.5 px-2 py-0.5 rounded-full text-[11px] font-mono ${
              activeTab === 'evaluation' ? 'bg-zinc-900 text-white' : 'bg-zinc-800 text-zinc-300'
            }`}>
              {evaluationCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('grind')}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
              activeTab === 'grind'
                ? 'bg-white text-black font-extrabold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>분쇄도</span>
          </button>

          <button
            onClick={() => setActiveTab('bean')}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
              activeTab === 'bean'
                ? 'bg-white text-black font-extrabold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>원두</span>
            <span className={`ml-0.5 px-2 py-0.5 rounded-full text-[11px] font-mono ${
              activeTab === 'bean' ? 'bg-zinc-900 text-white' : 'bg-zinc-800 text-zinc-300'
            }`}>
              {beanCount}
            </span>
          </button>
        </nav>

      </div>
    </header>
  );
};


