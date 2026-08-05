import React, { useState } from 'react';
import { Plus, Search, Filter, Bookmark, Trash2, Eye, Clock, Thermometer, Sliders, Coffee, Flame, Edit3 } from 'lucide-react';
import { CoffeeRecipe, getAgtronRoastLevel } from '../types';

interface RecipeSectionProps {
  recipes: CoffeeRecipe[];
  openModal: () => void;
  deleteRecipe: (id: number) => void;
  toggleFavorite: (id: number) => void;
  onSelectRecipe: (recipe: CoffeeRecipe) => void;
  onEditRecipe: (recipe: CoffeeRecipe) => void;
}

export const RecipeSection: React.FC<RecipeSectionProps> = ({
  recipes,
  openModal,
  deleteRecipe,
  toggleFavorite,
  onSelectRecipe,
  onEditRecipe,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filterMethods = ['All', '에어로프레스', 'Hario v60 02', 'Hario Neo 02', 'Hario swich 02', 'UFO'];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.desc.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod = selectedMethod === 'All' || recipe.brewMethod === selectedMethod;
    const matchesFavorite = !onlyFavorites || recipe.isFavorite;

    return matchesSearch && matchesMethod && matchesFavorite;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2 tracking-tight">
            <span>등록된 레시피 목록</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-100 border border-white/20 backdrop-blur-md">
              {filteredRecipes.length} / {recipes.length}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            L coffee studio에 저장된 추출 레시피를 확인하고 관리하세요.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 hover:brightness-110 text-[#030303] px-4 py-2 rounded-xl transition shadow-[0_0_20px_rgba(255,255,255,0.2)] font-extrabold text-xs sm:text-sm active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>레시피 추가</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-gradient-to-br from-zinc-900/70 via-zinc-950/80 to-black/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 space-y-3 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="메뉴명, 레시피 설명 검색..."
              className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 transition"
            />
          </div>

          {/* Favorites Only Toggle */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition backdrop-blur-md ${
              onlyFavorites
                ? 'bg-gradient-to-r from-zinc-100 to-zinc-300 text-black border-white shadow-md'
                : 'bg-black/60 text-zinc-400 border-white/10 hover:text-white hover:border-white/30'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-black' : ''}`} />
            <span>즐겨찾기만 보기</span>
          </button>
        </div>

        {/* Method Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-[11px] text-zinc-400 font-medium mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3 text-white" />
            추출도구:
          </span>
          {filterMethods.map((method) => {
            const labelMap: Record<string, string> = {
              All: '전체',
            };

            return (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition backdrop-blur-md ${
                  selectedMethod === method
                    ? 'bg-gradient-to-r from-zinc-100 to-zinc-300 text-black font-bold shadow-md'
                    : 'bg-black/50 text-zinc-400 hover:text-white border border-white/10 hover:border-white/30'
                }`}
              >
                {labelMap[method] || method}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <div id="recipe-grid" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-zinc-900/60 via-zinc-950/80 to-black/90 backdrop-blur-xl border border-white/10 hover:border-white/30 p-5 rounded-2xl shadow-2xl flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1"
            >
              <div>
                {/* Method tag & Filter tag & Favorite Star */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-100 border border-white/20 backdrop-blur-md">
                      {item.brewMethod}
                    </span>
                    {item.filterType && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/80 text-zinc-300 border border-white/10">
                        {item.filterType}
                      </span>
                    )}
                    {item.capType && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/80 text-zinc-300 border border-white/10">
                        캡: {item.capType}
                      </span>
                    )}
                    {item.orientation && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/80 text-zinc-300 border border-white/10">
                        {item.orientation}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleFavorite(item.id)}
                    title={item.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                    className="text-zinc-500 hover:text-white transition p-1"
                  >
                    <Bookmark
                      className={`w-4 h-4 transition-colors ${
                        item.isFavorite ? 'fill-white text-white' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-zinc-200 transition-colors mb-2">
                  {item.title}
                </h3>

                {/* Ratio Tag */}
                <div className="bg-black/60 border border-white/10 rounded-xl p-2.5 mb-3 font-mono text-xs text-zinc-200 flex items-center justify-between backdrop-blur-md">
                  <span className="truncate">{item.ratioText}</span>
                  <span className="text-[10px] font-sans text-zinc-300 bg-white/10 px-2 py-0.5 rounded-md border border-white/20">
                    1:{((item.waterAmountMl || 1) / (item.beanAmountGrams || 1)).toFixed(1)}
                  </span>
                </div>

                {/* Metadata Chips: Temp, Grind, Duration */}
                <div className="grid grid-cols-3 gap-1.5 text-[11px] text-zinc-300 mb-3">
                  <div className="bg-black/60 border border-white/10 rounded-lg p-1.5 flex items-center gap-1 text-zinc-300">
                    <Thermometer className="w-3 h-3 text-zinc-400 shrink-0" />
                    <span className="truncate">{item.waterTempCelsius}°C</span>
                  </div>

                  <div className="bg-black/60 border border-white/10 rounded-lg p-1.5 flex items-center gap-1 text-zinc-300 font-mono">
                    <Sliders className="w-3 h-3 text-zinc-400 shrink-0" />
                    <span className="truncate">{item.grindSizeMicrons} μm</span>
                  </div>

                  <div className="bg-black/60 border border-white/10 rounded-lg p-1.5 flex items-center gap-1 text-zinc-300">
                    <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
                    <span className="truncate">
                      {Math.floor(item.totalTimeSeconds / 60)}분 {item.totalTimeSeconds % 60}초
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-zinc-300 text-xs leading-relaxed line-clamp-3 mb-3">
                  {item.desc}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectRecipe(item)}
                    className="text-xs text-white hover:text-black font-extrabold bg-white/5 hover:bg-white px-3 py-1.5 rounded-xl border border-white/10 hover:border-white transition-all duration-300 flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>상세 가이드</span>
                  </button>

                  <button
                    onClick={() => onEditRecipe(item)}
                    className="text-xs text-zinc-300 hover:text-white font-semibold bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 flex items-center gap-1"
                    title="레시피 수정"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>수정</span>
                  </button>
                </div>

                <button
                  onClick={() => setDeletingId(item.id)}
                  className="text-xs text-zinc-400 hover:text-rose-400 transition p-1.5 hover:bg-rose-500/10 rounded-lg"
                  title="레시피 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-gradient-to-br from-zinc-900/60 to-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-black/80 border border-white/20 flex items-center justify-center mx-auto text-white shadow-lg">
            <Coffee className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">조건에 맞는 레시피가 없습니다</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              검색어나 추출 방식 필터를 조정하거나, 새로운 나만의 커피 레시피를 직접 등록해 보세요!
            </p>
          </div>
          <button
            onClick={openModal}
            className="px-5 py-2.5 bg-gradient-to-r from-white to-zinc-200 hover:brightness-110 text-black font-extrabold text-xs rounded-xl shadow-lg transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>새 레시피 추가하기</span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId !== null && (
        <div className="fixed inset-0 bg-[#030303]/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#030303]/70 backdrop-blur-2xl border border-white/20 max-w-sm w-full p-6 rounded-2xl space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
            <h3 className="text-lg font-bold text-white">레시피 삭제</h3>
            <p className="text-xs text-zinc-300">
              정말로 이 레시피를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-lg"
              >
                취소
              </button>
              <button
                onClick={() => {
                  deleteRecipe(deletingId);
                  setDeletingId(null);
                }}
                className="px-4 py-2 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-[#030303] hover:brightness-110 text-xs font-extrabold rounded-lg shadow transition"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
