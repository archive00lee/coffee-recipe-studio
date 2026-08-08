import React, { useState } from 'react';
import { 
  ClipboardCheck, Plus, Search, Star, Trash2, 
  Coffee, Tag, ArrowUpRight, Sparkles, Edit3, Flame
} from 'lucide-react';
import { CoffeeRecipe, BrewEvaluation, getAgtronRoastLevel } from '../types';

interface EvaluationSectionProps {
  evaluations: BrewEvaluation[];
  recipes: CoffeeRecipe[];
  openAddModal: () => void;
  deleteEvaluation: (id: number) => void;
  onSelectRecipe: (recipe: CoffeeRecipe) => void;
  onEditEvaluation: (evaluation: BrewEvaluation) => void;
}

export const EvaluationSection: React.FC<EvaluationSectionProps> = ({
  evaluations,
  recipes,
  openAddModal,
  deleteEvaluation,
  onSelectRecipe,
  onEditEvaluation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number>(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filteredEvaluations = evaluations.filter((ev) => {
    const matchesSearch =
      ev.recipeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.beanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.brewMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.memo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.tastingNotes.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRating = selectedRatingFilter === 0 || ev.rating >= selectedRatingFilter;

    return matchesSearch && matchesRating;
  });

  const averageRating = evaluations.length > 0
    ? (evaluations.reduce((acc, curr) => acc + curr.rating, 0) / evaluations.length).toFixed(1)
    : '0.0';

  const handleDelete = (id: number) => {
    if (deletingId === id) {
      deleteEvaluation(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 3000);
    }
  };

  const handleRecipeClick = (recipeId: number) => {
    const found = recipes.find((r) => r.id === recipeId);
    if (found) {
      onSelectRecipe(found);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Hero Banner */}
      <div className="bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            SENSORY LOG
          </h2>
          <p className="text-zinc-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            레시피별 맛과 바디감, 산미, 후미를 평가하고 저장하세요.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 z-10 w-full sm:w-auto justify-between sm:justify-end border-t md:border-t-0 border-zinc-800 pt-4 md:pt-0">
          <div className="text-right">
            <div className="text-2xl font-extrabold text-white font-mono flex items-center justify-end gap-1">
              <Star className="w-5 h-5 fill-white text-white" />
              <span>{averageRating}</span>
              <span className="text-xs text-zinc-400 font-normal">/ 5.0</span>
            </div>
            <p className="text-[11px] text-zinc-400">총 {evaluations.length}개의 평가 기록</p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center space-x-2 bg-white text-black hover:bg-zinc-200 text-xs font-extrabold px-4 py-2.5 rounded-xl transition shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>새 평가 작성</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="레시피명, 원두, 시음노트 태그 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
          />
        </div>

        {/* Rating Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: '전체', value: 0 },
            { label: '★ 5점만점', value: 5 },
            { label: '★ 4점 이상', value: 4 },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setSelectedRatingFilter(item.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition border ${
                selectedRatingFilter === item.value
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Evaluations Grid */}
      {filteredEvaluations.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredEvaluations.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl space-y-4 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Method, Date & Actions */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-100 border border-zinc-700">
                        {item.brewMethod}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white flex items-center gap-1.5 mt-1">
                      <span>{item.recipeTitle}</span>
                      {recipes.some((r) => r.id === item.recipeId) && (
                        <button
                          onClick={() => handleRecipeClick(item.recipeId)}
                          title="레시피 상세 보기"
                          className="text-zinc-400 hover:text-white p-0.5"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      )}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">
                      <Star className="w-3.5 h-3.5 fill-white text-white" />
                      <span className="text-xs font-mono font-bold text-white ml-1">
                        {item.rating}
                      </span>
                    </div>

                    {/* Edit button */}
                    <button
                      onClick={() => onEditEvaluation(item)}
                      className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 hover:text-white hover:border-zinc-700 transition text-xs"
                      title="평가 수정"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className={`p-1.5 rounded-lg border text-xs transition ${
                        deletingId === item.id
                          ? 'bg-zinc-800 border-zinc-600 text-white font-bold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                      }`}
                      title="평가 삭제"
                    >
                      {deletingId === item.id ? '확인' : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Bean Name & Roast Level */}
                <div className="flex items-center gap-2 text-xs bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                  <Coffee className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="font-semibold text-zinc-200 truncate">{item.beanName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-white ml-auto shrink-0 border border-zinc-700 font-mono font-bold flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5 text-white" />
                    <span>Agtron {item.agtronNumber ?? 55} ({getAgtronRoastLevel(item.agtronNumber ?? 55, item.roastLevel)})</span>
                  </span>
                </div>

                {/* Sensory Metrics Bar Grid */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {[
                    { label: '산미', val: item.acidity },
                    { label: '단맛', val: item.sweetness },
                    { label: '바디', val: item.body },
                    { label: '쓴맛', val: item.bitterness },
                    { label: '후미', val: item.aftertaste },
                  ].map((m) => (
                    <div key={m.label} className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-center">
                      <div className="text-[10px] text-zinc-400 mb-1">{m.label}</div>
                      <div className="text-xs font-mono font-bold text-white mb-1">{m.val}</div>
                      <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-white h-full"
                          style={{ width: `${(m.val / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tasting Notes */}
                {item.tastingNotes && item.tastingNotes.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    <Tag className="w-3 h-3 text-zinc-400 mr-1" />
                    {item.tastingNotes.map((note) => (
                      <span
                        key={note}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-950 text-zinc-200 border border-zinc-800"
                      >
                        #{note}
                      </span>
                    ))}
                  </div>
                )}

                {/* Memo */}
                {item.memo && (
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-white" />
                      추출 총평 및 다음 가이드
                    </span>
                    {item.memo}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center mx-auto text-zinc-300">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">등록된 추출 평가가 없습니다</h3>
            <p className="text-xs text-zinc-400">
              커피를 추출한 후 맛과 바디감, 피드백 노트를 작성해 보세요.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-1.5 bg-white text-black font-extrabold text-xs px-4 py-2.5 rounded-xl hover:bg-zinc-200 transition"
          >
            <Plus className="w-4 h-4" />
            <span>첫 추출 평가 작성하기</span>
          </button>
        </div>
      )}

    </div>
  );
};
