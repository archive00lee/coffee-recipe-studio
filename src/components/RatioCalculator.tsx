import React, { useState } from 'react';
import { Scale, Sparkles, Snowflake, Flame, Droplets, Plus, Info } from 'lucide-react';

interface RatioCalculatorProps {
  onAddRecipeWithRatio: (beanGrams: number, waterMl: number, ratioText: string) => void;
}

export const RatioCalculator: React.FC<RatioCalculatorProps> = ({
  onAddRecipeWithRatio,
}) => {
  const [beanAmount, setBeanAmount] = useState<number>(20);
  const [ratio, setRatio] = useState<number>(15);
  const [isIcedMode, setIsIcedMode] = useState<boolean>(false);
  const [iceRatioPercent, setIceRatioPercent] = useState<number>(40); // 40% ice, 60% hot water

  const presets = [
    { label: '표준 골든 비율 (1:15)', value: 15, desc: '대중적이고 균형 잡힌 핸드드립 표준 비율' },
    { label: '에스프레소 (1:2)', value: 2, desc: '진한 샷 추출 기본 비율' },
    { label: '에어로프레스 (1:12)', value: 12, desc: '묵직하고 달콤한 고농도 추출' },
    { label: '콜드브루 (1:8)', value: 8, desc: '더치 및 침출식 저온 추출 원액' },
    { label: '마일드 푸어오버 (1:16.6)', value: 16.6, desc: '화려한 아로마와 라이트한 바디감' },
  ];

  const totalWater = Math.round(beanAmount * ratio);
  const iceGrams = isIcedMode ? Math.round(totalWater * (iceRatioPercent / 100)) : 0;
  const hotWaterGrams = totalWater - iceGrams;

  const ratioSummary = isIcedMode
    ? `원두 ${beanAmount}g / 뜨거운 물 ${hotWaterGrams}g + 얼음 ${iceGrams}g (총 ${totalWater}g, 1:${ratio})`
    : `원두 ${beanAmount}g / 물 ${totalWater}ml (1:${ratio})`;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in text-white">
      {/* Header */}
      <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">골든 추출 비율 계산기</h2>
            <p className="text-xs text-zinc-400">원두량과 추출 방식에 맞는 정밀 물량 및 얼음 비율 산출</p>
          </div>
        </div>

        <button
          onClick={() => setIsIcedMode(!isIcedMode)}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
            isIcedMode
              ? 'bg-white text-black border-white'
              : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
          }`}
        >
          <Snowflake className="w-3.5 h-3.5" />
          <span>아이스 드립 비율 모드</span>
        </button>
      </div>

      {/* Main Interactive Controls */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
        
        {/* Preset Selector Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>추출 스타일 프리셋</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {presets.map((p) => (
              <button
                key={p.value}
                onClick={() => setRatio(p.value)}
                className={`p-2.5 rounded-xl text-xs font-semibold border transition flex flex-col items-center justify-center text-center gap-1 ${
                  ratio === p.value
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                <span>{p.label.split(' ')[0]}</span>
                <span className="text-[10px] opacity-80 font-mono">1:{p.value}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs & Sliders */}
        <div className="grid md:grid-cols-2 gap-6 bg-zinc-950 p-5 rounded-xl border border-zinc-800">
          {/* Bean Grams */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-300">원두 무게 (g)</label>
              <span className="text-base font-black text-white font-mono">{beanAmount}g</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={beanAmount}
              onChange={(e) => setBeanAmount(Number(e.target.value))}
              className="w-full accent-white"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>5g (1인분 싱글)</span>
              <span>20g (표준 2인분)</span>
              <span>100g (콜드브루)</span>
            </div>
          </div>

          {/* Ratio Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-300">추출 비율 (1 : N)</label>
              <span className="text-base font-black text-white font-mono">1 : {ratio}</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="0.5"
              value={ratio}
              onChange={(e) => setRatio(Number(e.target.value))}
              className="w-full accent-white"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>1:2 (진함)</span>
              <span>1:15 (골든)</span>
              <span>1:25 (연함)</span>
            </div>
          </div>
        </div>

        {/* Ice Ratio Slider (If Iced Mode enabled) */}
        {isIcedMode && (
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 animate-fade-in">
            <div className="flex justify-between items-center text-xs font-bold text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Snowflake className="w-4 h-4 text-white" />
                <span>얼음 분할 비율 (총 물량 중 얼음 비중)</span>
              </span>
              <span className="font-mono text-white">{iceRatioPercent}% 얼음</span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              step="5"
              value={iceRatioPercent}
              onChange={(e) => setIceRatioPercent(Number(e.target.value))}
              className="w-full accent-white"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>20% (은은한 차가움)</span>
              <span>40% (표준 아이스 드립)</span>
              <span>60% (급랭 아이스)</span>
            </div>
          </div>
        )}

        {/* Calculation Result Summary Box */}
        <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-center space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
            산출된 추출 공식
          </span>

          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {ratioSummary}
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-center">
              <div className="text-[10px] text-zinc-400 mb-1">원두 용량</div>
              <div className="text-lg font-bold text-white font-mono">{beanAmount}g</div>
            </div>

            {isIcedMode ? (
              <>
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-center">
                  <div className="text-[10px] text-zinc-400 flex items-center justify-center gap-1 mb-1">
                    <Flame className="w-3 h-3 text-zinc-300" />
                    <span>뜨거운 물</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono">{hotWaterGrams}g</div>
                </div>

                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-center col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-zinc-400 flex items-center justify-center gap-1 mb-1">
                    <Snowflake className="w-3 h-3 text-zinc-300" />
                    <span>서버 준비 얼음</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono">{iceGrams}g</div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-center">
                  <div className="text-[10px] text-zinc-400 flex items-center justify-center gap-1 mb-1">
                    <Droplets className="w-3 h-3 text-zinc-300" />
                    <span>필요 물 용량</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono">{totalWater}ml</div>
                </div>

                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-center col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-zinc-400 mb-1">권장 수온</div>
                  <div className="text-lg font-bold text-zinc-200 font-mono">92 ~ 94°C</div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => onAddRecipeWithRatio(beanAmount, totalWater, ratioSummary)}
            className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>이 비율로 새 레시피 등록하기</span>
          </button>
        </div>

      </div>

      {/* Coffee Ratio Tip Card */}
      <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 text-xs text-zinc-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>커피 노하우:</strong> 약배전(Light Roast) 스페셜티 원두는 높은 비율(1:16 이상)과 높은 수온(94°C)을 사용할 때 섬세한 향미가 잘 살아나며, 강배전(Dark Roast) 원두는 낮은 비율(1:13~14)과 낮은 수온(88~90°C)에서 고소한 단맛을 즐길 수 있습니다.
        </p>
      </div>
    </div>
  );
};
