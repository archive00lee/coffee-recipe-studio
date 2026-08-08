import React, { useState } from 'react';
import { X, Copy, Check, Thermometer, Sliders, Clock, Scale, Coffee, ListOrdered, Edit3 } from 'lucide-react';
import { CoffeeRecipe, formatSecondsToMinSec, formatTimeDigital } from '../types';

interface RecipeDetailModalProps {
  recipe: CoffeeRecipe | null;
  onClose: () => void;
  onEdit?: (recipe: CoffeeRecipe) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  onEdit,
}) => {
  const [copied, setCopied] = useState(false);

  if (!recipe) return null;

  const handleCopy = () => {
    const text = `[L coffee studio 레시피] ${recipe.title}\n` +
      `• 추출도구: ${recipe.brewMethod}\n` +
      (recipe.filterType ? `• 필터: ${recipe.filterType}\n` : '') +
      (recipe.capType ? `• 캡: ${recipe.capType}\n` : '') +
      (recipe.orientation ? `• 추출방향: ${recipe.orientation}\n` : '') +
      `• 비율: ${recipe.ratioText}\n` +
      `• 물 온도: ${recipe.waterTempCelsius}°C\n` +
      `• 분쇄도: ${recipe.grindSizeMicrons} μm\n` +
      `• 목표 시간: ${Math.floor(recipe.totalTimeSeconds / 60)}분 ${recipe.totalTimeSeconds % 60}초\n` +
      `• 설명: ${recipe.desc}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculatedRatio = (
    (recipe.waterAmountMl || 1) / (recipe.beanAmountGrams || 1)
  ).toFixed(1);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-2xl p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto text-white">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-100 border border-zinc-700">
                {recipe.brewMethod}
              </span>
              {recipe.filterType && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-950 text-zinc-300 border border-zinc-800">
                  필터: {recipe.filterType}
                </span>
              )}
              {recipe.capType && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-950 text-zinc-300 border border-zinc-800">
                  캡: {recipe.capType}
                </span>
              )}
              {recipe.orientation && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-950 text-zinc-300 border border-zinc-800">
                  방향: {recipe.orientation}
                </span>
              )}
            </div>
            <h3 className="text-xl font-extrabold text-white mt-2 tracking-tight">{recipe.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white bg-zinc-800 p-2 rounded-xl border border-zinc-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recipe Spec Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <div className="text-[10px] text-zinc-400 flex items-center gap-1 mb-1">
              <Scale className="w-3.5 h-3.5 text-white" />
              <span>원두 / 물</span>
            </div>
            <div className="text-xs font-bold text-white font-mono">
              {recipe.beanAmountGrams}g / {recipe.waterAmountMl}ml
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5 font-mono">비율 1:{calculatedRatio}</div>
          </div>

          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <div className="text-[10px] text-zinc-400 flex items-center gap-1 mb-1">
              <Thermometer className="w-3.5 h-3.5 text-zinc-300" />
              <span>추출 수온</span>
            </div>
            <div className="text-xs font-bold text-zinc-100 font-mono">
              {recipe.waterTempCelsius}°C
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">권장 수온</div>
          </div>

          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <div className="text-[10px] text-zinc-400 flex items-center gap-1 mb-1">
              <Sliders className="w-3.5 h-3.5 text-white" />
              <span>분쇄도</span>
            </div>
            <div className="text-xs font-mono font-bold text-white truncate">
              {recipe.grindSizeMicrons} μm
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">입자 미크론</div>
          </div>

          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <div className="text-[10px] text-zinc-400 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-zinc-300" />
              <span>목표 시간</span>
            </div>
            <div className="text-xs font-bold text-zinc-100 font-mono">
              {formatSecondsToMinSec(recipe.totalTimeSeconds)}
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">추출 타임</div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
          <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <Coffee className="w-3.5 h-3.5 text-white" />
            <span>추출 가이드 & 설명</span>
          </h4>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
            {recipe.desc}
          </p>
        </div>

        {/* Step by Step Breakdown */}
        {recipe.steps && recipe.steps.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-white" />
                <span>단계별 상세 가이드 및 누적 타임라인</span>
              </h4>
              <span className="text-[11px] font-mono text-white bg-zinc-800 px-2.5 py-0.5 rounded-lg border border-zinc-700 font-bold">
                총합 {formatSecondsToMinSec(recipe.steps.reduce((acc, curr) => acc + (Number(curr.durationSeconds) || 0), 0))}
              </span>
            </div>

            <div className="space-y-2">
              {recipe.steps.map((step, index) => {
                const prevCumulativeSec = recipe.steps!.slice(0, index).reduce((acc, curr) => acc + (Number(curr.durationSeconds) || 0), 0);
                const currentSec = Number(step.durationSeconds) || 0;
                const totalCumulativeSec = prevCumulativeSec + currentSec;

                const prevCumulativeWater = recipe.steps!.slice(0, index).reduce((acc, curr) => acc + (Number(curr.waterAmountGrams) || 0), 0);
                const currentWater = Number(step.waterAmountGrams) || 0;
                const totalCumulativeWater = prevCumulativeWater + currentWater;

                return (
                  <div
                    key={step.id || index}
                    className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-white text-black text-xs font-mono font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{step.phaseName}</span>
                            {currentWater > 0 && (
                              <span className="text-[10px] font-mono bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded border border-zinc-700">
                                +물 {currentWater}g
                              </span>
                            )}
                          </div>
                          {step.description && (
                            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono text-white bg-zinc-800 px-2.5 py-0.5 rounded-lg border border-zinc-700 font-bold block">
                          +{formatSecondsToMinSec(currentSec)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 text-[11px] font-mono">
                      <span className="text-zinc-400 text-[10px]">
                        추출 구간: <strong className="text-zinc-200">{formatTimeDigital(prevCumulativeSec)} ~ {formatTimeDigital(totalCumulativeSec)}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">
                          누적 시간 {formatSecondsToMinSec(totalCumulativeSec)}
                        </span>
                        <span className="text-zinc-700">|</span>
                        <span className="text-white font-bold">
                          누적 물량 {totalCumulativeWater}g
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 text-xs text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl bg-zinc-800 border border-zinc-700 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="text-white font-bold">복사되었습니다!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>레시피 복사</span>
                </>
              )}
            </button>

            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(recipe);
                }}
                className="flex items-center space-x-1.5 text-xs text-zinc-200 hover:text-white px-3.5 py-2 rounded-xl bg-zinc-800 border border-zinc-700 transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-white" />
                <span>수정</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs rounded-xl transition"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
