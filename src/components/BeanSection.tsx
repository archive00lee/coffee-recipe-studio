import React, { useState } from 'react';
import { 
  Package, Plus, Search, Flame, DollarSign, ExternalLink, 
  Trash2, Edit3, Tag, Sparkles, Filter, Store, ExternalLink as LinkIcon
} from 'lucide-react';
import { BeanInfo, getAgtronRoastLevel } from '../types';

interface BeanSectionProps {
  beans: BeanInfo[];
  onOpenAddModal: () => void;
  onOpenEditModal: (bean: BeanInfo) => void;
  onDeleteBean: (id: number) => void;
}

export const BeanSection: React.FC<BeanSectionProps> = ({
  beans,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteBean,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoastFilter, setSelectedRoastFilter] = useState<string>('all');

  // Filter logic
  const filteredBeans = beans.filter((b) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      b.name.toLowerCase().includes(query) ||
      b.roastery.toLowerCase().includes(query) ||
      (b.origin && b.origin.toLowerCase().includes(query)) ||
      (b.flavorNotes && b.flavorNotes.some(n => n.toLowerCase().includes(query)));

    if (!matchesSearch) return false;

    if (selectedRoastFilter === 'all') return true;
    return b.roastLevel === selectedRoastFilter;
  });

  // Calculate statistics
  const totalBeans = beans.length;
  const avgPrice100g = beans.length > 0
    ? Math.round(
        beans.reduce((acc, curr) => acc + (curr.weightGrams > 0 ? (curr.price / curr.weightGrams) * 100 : 0), 0) / beans.length
      )
    : 0;

  return (
    <section className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#030303] via-zinc-900 to-[#030303] border border-white/20 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20 text-white text-xs font-semibold shadow-sm">
              <Package className="w-3.5 h-3.5" />
              <span>원두 인벤토리 ({totalBeans}개 보유)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              원두 정보 & 구매 라이브러리
            </h2>
            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
              구매한 원두의 Agtron 배전도, 용량, 100g당 가격, 구매 사이트 링크 및 컵 노트를 관리하고 추출 레시피와 매칭해보세요.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {beans.length > 0 && (
              <div className="bg-[#030303]/80 p-3 rounded-2xl border border-white/10 text-right hidden sm:block font-mono">
                <div className="text-[10px] text-zinc-400 font-sans">평균 가성비 단가</div>
                <div className="text-xs font-bold text-white">₩{avgPrice100g.toLocaleString()} / 100g</div>
              </div>
            )}
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 hover:brightness-110 text-[#030303] font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>원두 정보 추가</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="원두 이름, 로스터리, 원산지, 컵 노트 태그 검색..."
            className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition"
          />
        </div>

        {/* Roast Level Filter */}
        <select
          value={selectedRoastFilter}
          onChange={(e) => setSelectedRoastFilter(e.target.value)}
          className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/40 font-semibold shrink-0"
        >
          <option value="all">전체 배전도 보기</option>
          <option value="LIGHT Roast">LIGHT Roast</option>
          <option value="CINNAMON Roast">CINNAMON Roast</option>
          <option value="MEDIUM Roast">MEDIUM Roast</option>
          <option value="HIGH Roast">HIGH Roast</option>
          <option value="CITY Roast">CITY Roast</option>
          <option value="FULL CITY Roast">FULL CITY Roast</option>
          <option value="FRENCH Roast">FRENCH Roast</option>
          <option value="ITALIAN Roast">ITALIAN Roast</option>
        </select>
      </div>

      {/* Bean Cards Grid */}
      {filteredBeans.length === 0 ? (
        <div className="bg-[#030303]/60 border border-white/10 rounded-3xl p-10 text-center space-y-3 backdrop-blur-md">
          <Package className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-300">등록된 원두가 없거나 검색 결과가 없습니다</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            새로운 원두 정보를 등록하고 Agtron 배전도, 가격, 구매 사이트 링크 등을 기록해보세요.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition"
          >
            + 첫 원두 추가하기
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBeans.map((bean) => {
            const price100g = bean.weightGrams > 0 ? Math.round((bean.price / bean.weightGrams) * 100) : 0;

            return (
              <div
                key={bean.id}
                className="bg-[#030303]/80 backdrop-blur-md border border-white/10 rounded-3xl p-5 hover:border-white/30 transition duration-300 space-y-3 flex flex-col justify-between group shadow-lg relative overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Top Row: Roastery & Roast Level Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded-xl border border-white/20">
                      <Store className="w-3.5 h-3.5" />
                      <span>{bean.roastery}</span>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl bg-white/10 text-white border border-white/20 flex items-center gap-1 shrink-0">
                      <Flame className="w-3 h-3 text-white" />
                      <span>Agtron {bean.agtronNumber ?? 65} ({bean.roastLevel})</span>
                    </span>
                  </div>

                  {/* Bean Name & Origin */}
                  <div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-zinc-200 transition tracking-tight">
                      {bean.name}
                    </h3>
                    {bean.origin && (
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                        {bean.origin}
                      </p>
                    )}
                  </div>

                  {/* Flavor Notes Tags */}
                  {bean.flavorNotes && bean.flavorNotes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {bean.flavorNotes.map((note) => (
                        <span
                          key={note}
                          className="text-[10px] font-semibold bg-white/5 text-zinc-200 px-2 py-0.5 rounded-lg border border-white/10"
                        >
                          #{note}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description / Memo */}
                  {bean.description && (
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5">
                      {bean.description}
                    </p>
                  )}
                </div>

                {/* Bottom Row: Price Spec & Actions / Links */}
                <div className="pt-3 border-t border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1 text-zinc-300">
                      <span className="text-zinc-500 text-[10px]">가격/중량:</span>
                      <strong className="text-white">₩{bean.price ? bean.price.toLocaleString() : '0'}</strong>
                      <span className="text-zinc-400 text-[11px]">/ {bean.weightGrams}g</span>
                    </div>

                    {price100g > 0 && (
                      <span className="text-[10px] text-zinc-200 bg-white/10 px-2 py-0.5 rounded border border-white/20">
                        ₩{price100g.toLocaleString()}/100g
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    {/* Purchase Link Button */}
                    {bean.purchaseUrl ? (
                      <a
                        href={bean.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1.5 text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-xl transition font-bold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>구매 사이트 이동</span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-zinc-500 italic">구매 링크 없음</span>
                    )}

                    {/* Edit & Delete Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenEditModal(bean)}
                        title="원두 정보 수정"
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`'${bean.name}' 원두 정보를 삭제하시겠습니까?`)) {
                            onDeleteBean(bean.id);
                          }
                        }}
                        title="원두 삭제"
                        className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
