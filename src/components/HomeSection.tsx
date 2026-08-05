import React from 'react';
import { Coffee, Flame, Droplets, ArrowRight, Bookmark, Sparkles, Eye } from 'lucide-react';
import { CoffeeRecipe, getAgtronRoastLevel } from '../types';

interface HomeSectionProps {
  recipes: CoffeeRecipe[];
  onNavigateToRecipes: () => void;
  onSelectRecipe: (recipe: CoffeeRecipe) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  recipes,
  onNavigateToRecipes,
  onSelectRecipe,
}) => {
  const favoriteRecipes = recipes.filter(r => r.isFavorite);
  const featuredRecipes = recipes.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Welcome & Archive Description */}
      <div className="grid md:grid-cols-12 gap-8 items-center bg-gradient-to-br from-zinc-900/80 via-zinc-950/70 to-black/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition duration-700"></div>

        <div className="md:col-span-8 space-y-4 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Coffee recipe archive
          </h2>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            원두의 미크론(μm) 단위 분쇄도, 물의 온도, 추출 비율 등 나만의 커피 레시피를 체계적으로 기록하세요.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onNavigateToRecipes}
              className="px-6 py-3 bg-gradient-to-r from-white via-zinc-200 to-zinc-300 hover:brightness-110 text-black font-extrabold text-sm rounded-xl transition shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center space-x-2 active:scale-95"
            >
              <span>레시피 둘러보기 ({recipes.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="md:col-span-4 grid grid-cols-2 gap-3.5 relative z-10">
          <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-white/20 transition">
            <div className="text-zinc-400 text-xs flex items-center justify-between mb-1">
              <span>보관된 레시피</span>
              <Coffee className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{recipes.length}개</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">등록된 공식</div>
          </div>

          <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-white/20 transition">
            <div className="text-zinc-400 text-xs flex items-center justify-between mb-1">
              <span>즐겨찾기</span>
              <Bookmark className="w-4 h-4 text-white fill-white" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{favoriteRecipes.length}개</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">자주 찾는 비율</div>
          </div>

          <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-white/20 transition">
            <div className="text-zinc-400 text-xs flex items-center justify-between mb-1">
              <span>표준 수온</span>
              <Flame className="w-4 h-4 text-zinc-300" />
            </div>
            <div className="text-base sm:text-lg font-bold text-zinc-100 font-mono">92℃ ~ 95℃</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">추천 가이드</div>
          </div>

          <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-white/20 transition">
            <div className="text-zinc-400 text-xs flex items-center justify-between mb-1">
              <span>드립 비율</span>
              <Droplets className="w-4 h-4 text-zinc-300" />
            </div>
            <div className="text-base sm:text-lg font-bold text-zinc-100 font-mono">1:15 ~ 1:16</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">골든 푸어오버</div>
          </div>
        </div>
      </div>

      {/* Featured Recipe Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-white" />
              <span>주요 레시피</span>
            </h3>
            <p className="text-xs text-zinc-400">자주 검색하는 커피 추출 레시피입니다.</p>
          </div>
          <button
            onClick={onNavigateToRecipes}
            className="text-xs font-semibold text-white hover:text-zinc-300 flex items-center gap-1 transition"
          >
            <span>전체보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {featuredRecipes.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredRecipes.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-zinc-900/60 via-zinc-950/80 to-black/90 backdrop-blur-xl border border-white/10 hover:border-white/30 p-5 rounded-2xl shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
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
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5 text-amber-400" />
                        <span>Agtron {item.agtronNumber ?? 55} ({getAgtronRoastLevel(item.agtronNumber ?? 55, item.roastLevelName)})</span>
                      </span>
                    </div>
                    {item.isFavorite && (
                      <Bookmark className="w-4 h-4 fill-white text-white shrink-0" />
                    )}
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-zinc-200 transition mb-2">
                    {item.title}
                  </h4>

                  <div className="bg-black/60 rounded-xl p-2.5 border border-white/10 text-xs font-mono text-zinc-300 mb-3 flex items-center justify-between backdrop-blur-md">
                    <span>{item.ratioText}</span>
                    <span className="text-white text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded-md border border-white/20">
                      {item.grindSizeMicrons} μm
                    </span>
                  </div>

                  <p className="text-zinc-300 text-xs leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => onSelectRecipe(item)}
                    className="w-full text-xs text-white hover:text-black font-extrabold bg-white/5 hover:bg-white py-2.5 rounded-xl border border-white/10 hover:border-white transition-all duration-300 flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>상세 가이드 보기</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-zinc-900/60 to-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center space-y-3 shadow-xl">
            <Coffee className="w-8 h-8 text-zinc-400 mx-auto" />
            <p className="text-sm font-semibold text-white">등록된 레시피가 없습니다</p>
            <p className="text-xs text-zinc-400">새로운 커피 레시피를 등록하여 첫 기록을 시작해 보세요.</p>
            <button
              onClick={onNavigateToRecipes}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:brightness-110 transition active:scale-95"
            >
              <span>레시피 둘러보기 및 추가</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
