import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Sliders, Scale, Thermometer, Clock, Sparkles, Filter, Compass, Edit3 } from 'lucide-react';
import { CoffeeRecipe, BrewStep, FILTER_OPTIONS_MAP, formatSecondsToMinSec, formatTimeDigital } from '../types';

interface RecipeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recipe: Omit<CoffeeRecipe, 'id' | 'createdAt'>) => void;
  initialData?: CoffeeRecipe | null;
}

export const RecipeFormModal: React.FC<RecipeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [brewMethod, setBrewMethod] = useState<string>('에어로프레스');
  const [filterType, setFilterType] = useState<string>('기본 1장');
  const [capType, setCapType] = useState<string>('기본');
  const [orientation, setOrientation] = useState<'정방향' | '역방향'>('정방향');
  const [beanAmount, setBeanAmount] = useState<number>(20);
  const [waterAmount, setWaterAmount] = useState<number>(300);
  const [waterTemp, setWaterTemp] = useState<number>(93);
  const [grindSizeMicrons, setGrindSizeMicrons] = useState<number>(800);
  const [minutes, setMinutes] = useState<number>(2);
  const [seconds, setSeconds] = useState<number>(30);
  const [desc, setDesc] = useState('');

  // Custom step builder
  const [steps, setSteps] = useState<BrewStep[]>([
    { id: '1', phaseName: '뜸들이기 (Bloom)', waterAmountGrams: 50, durationSeconds: 30, description: '전체 가루를 고르게 적셔 이산화탄소를 빼냅니다.' },
    { id: '2', phaseName: '1차 푸어링 (1st Pour)', waterAmountGrams: 150, durationSeconds: 40, description: '중심에서 바깥쪽으로 부드럽게 물을 부어줍니다.' },
    { id: '3', phaseName: '2차 푸어링 (2nd Pour)', waterAmountGrams: 300, durationSeconds: 80, description: '목표 수량 300g까지 채우고 완벽하게 드립을 마칩니다.' }
  ]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setBrewMethod(initialData.brewMethod || '에어로프레스');
        setFilterType(initialData.filterType || (FILTER_OPTIONS_MAP[initialData.brewMethod] || ['기본 1장'])[0]);
        setCapType(initialData.capType || '기본');
        setOrientation((initialData.orientation as '정방향' | '역방향') || '정방향');
        setBeanAmount(initialData.beanAmountGrams || 20);
        setWaterAmount(initialData.waterAmountMl || 300);
        setWaterTemp(initialData.waterTempCelsius || 93);
        setGrindSizeMicrons(initialData.grindSizeMicrons || 800);
        const totalSec = initialData.totalTimeSeconds || 150;
        setMinutes(Math.floor(totalSec / 60));
        setSeconds(totalSec % 60);
        setDesc(initialData.desc || '');
        if (initialData.steps && initialData.steps.length > 0) {
          setSteps(initialData.steps);
        } else {
          setSteps([]);
        }
      } else {
        // Reset to default
        setTitle('');
        setBrewMethod('에어로프레스');
        setFilterType('기본 1장');
        setCapType('기본');
        setOrientation('정방향');
        setBeanAmount(20);
        setWaterAmount(300);
        setWaterTemp(93);
        setGrindSizeMicrons(800);
        setMinutes(2);
        setSeconds(30);
        setDesc('');
        setSteps([
          { id: '1', phaseName: '뜸들이기 (Bloom)', waterAmountGrams: 50, durationSeconds: 30, description: '전체 가루를 고르게 적셔 이산화탄소를 빼냅니다.' },
          { id: '2', phaseName: '1차 푸어링 (1st Pour)', waterAmountGrams: 150, durationSeconds: 40, description: '중심에서 바깥쪽으로 부드럽게 물을 부어줍니다.' },
          { id: '3', phaseName: '2차 푸어링 (2nd Pour)', waterAmountGrams: 300, durationSeconds: 80, description: '목표 수량 300g까지 채우고 완벽하게 드립을 마칩니다.' }
        ]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleBrewMethodChange = (newMethod: string) => {
    setBrewMethod(newMethod);
    const availableFilters = FILTER_OPTIONS_MAP[newMethod] || ['기본 1장'];
    setFilterType(availableFilters[0]);
  };

  const currentAvailableFilters = FILTER_OPTIONS_MAP[brewMethod] || ['기본 1장'];

  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        id: Date.now().toString(),
        phaseName: `${steps.length + 1}차 푸어링`,
        waterAmountGrams: waterAmount,
        durationSeconds: 30,
        description: '다음 단계 푸어링을 수행합니다.'
      }
    ]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, field: keyof BrewStep, value: any) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const calculatedRatio = beanAmount > 0 ? (waterAmount / beanAmount).toFixed(1) : '15.0';
  const ratioText = `원두 ${beanAmount}g / 물 ${waterAmount}ml (1:${calculatedRatio})`;
  const totalTimeSeconds = (minutes * 60) + seconds;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      brewMethod,
      filterType,
      capType: brewMethod === '에어로프레스' ? capType : undefined,
      orientation: brewMethod === '에어로프레스' ? orientation : undefined,
      beanAmountGrams: Number(beanAmount),
      waterAmountMl: Number(waterAmount),
      ratioText,
      waterTempCelsius: Number(waterTemp),
      grindSizeMicrons: Number(grindSizeMicrons) || 800,
      agtronNumber: 55,
      roastLevelName: '',
      totalTimeSeconds: Number(totalTimeSeconds),
      desc: desc.trim() || '추출 설명 및 팁이 입력되지 않았습니다.',
      steps,
      isFavorite: false,
    });

    // Reset Form
    setTitle('');
    setDesc('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#030303]/70 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#030303]/70 backdrop-blur-2xl border border-white/20 w-full max-w-2xl rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-5 my-8 max-h-[90vh] overflow-y-auto ring-1 ring-white/10">
        
        {/* Modal Title Bar */}
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white via-zinc-300 to-[#030303] border border-white/30 flex items-center justify-center text-[#030303] backdrop-blur-md shadow-md">
              {initialData ? <Edit3 className="w-4 h-4 stroke-[2.5]" /> : <Sparkles className="w-4 h-4 stroke-[2.5]" />}
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {initialData ? '커스텀 레시피 수정' : '새 커스텀 레시피 작성'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition border border-transparent hover:border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Menu Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              메뉴명 / 레시피 이름 <span className="text-white">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 에티오피아 예가체프 드립, 에어로프레스 정밀 레시피"
              className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 transition"
            />
          </div>

          {/* Brew Equipment (추출도구), Filter (필터), Cap (캡), & Water Temp */}
          <div className={`grid ${brewMethod === '에어로프레스' ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-3`}>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">추출도구</label>
              <select
                value={brewMethod}
                onChange={(e) => handleBrewMethodChange(e.target.value)}
                className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-white/50 transition"
              >
                <option value="에어로프레스">에어로프레스</option>
                <option value="Hario v60 02">Hario v60 02</option>
                <option value="Hario Neo 02">Hario Neo 02</option>
                <option value="Hario swich 02">Hario swich 02</option>
                <option value="UFO">UFO</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-zinc-400" />
                <span>필터</span>
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-white/50 transition"
              >
                {currentAvailableFilters.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {brewMethod === '에어로프레스' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                    <span>캡</span>
                  </label>
                  <select
                    value={capType}
                    onChange={(e) => setCapType(e.target.value)}
                    className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-white/50 transition"
                  >
                    <option value="기본">기본</option>
                    <option value="플로우컨트롤">플로우컨트롤</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-zinc-400" />
                    <span>추출방향</span>
                  </label>
                  <div className="grid grid-cols-2 p-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setOrientation('정방향')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        orientation === '정방향'
                          ? 'bg-white text-black shadow-md font-extrabold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      정방향
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrientation('역방향')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        orientation === '역방향'
                          ? 'bg-white text-black shadow-md font-extrabold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      역방향
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-zinc-400" />
                <span>추출 물 온도 (°C)</span>
              </label>
              <input
                type="number"
                min="10"
                max="100"
                required
                value={waterTemp}
                onChange={(e) => setWaterTemp(Number(e.target.value))}
                className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-white/50 transition font-mono"
              />
            </div>
          </div>

          {/* Bean & Water Amount Ratio Inputs */}
          <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-white" />
                <span>원두량 & 물 용량 비율 계산</span>
              </span>
              <span className="font-mono text-zinc-200 bg-white/10 px-2 py-0.5 rounded-md border border-white/20">
                자동 계산 비율: 1 : {calculatedRatio}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">원두 용량 (g)</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={beanAmount}
                  onChange={(e) => setBeanAmount(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-white/50 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">총 물 용량 (ml/g)</label>
                <input
                  type="number"
                  min="1"
                  max="3000"
                  required
                  value={waterAmount}
                  onChange={(e) => setWaterAmount(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-white/50 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Grind Size (Microns - Numbers only) & Total Time */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                  <span>원두 분쇄도 (미크론 단위)</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">숫자만 입력</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  required
                  min="100"
                  max="3000"
                  step="10"
                  value={grindSizeMicrons || ''}
                  onChange={(e) => setGrindSizeMicrons(Number(e.target.value))}
                  placeholder="예: 800"
                  className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 pr-12 text-sm text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-white/50 transition"
                />
                <span className="absolute right-3.5 text-xs font-bold font-mono text-zinc-300 pointer-events-none">
                  μm
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">
                * 숫자를 기입하시면 미크론(μm) 단위가 자동 적용됩니다 (예: 에스프레소 250, 드립 800, 체맥스 1000)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>총 목표 추출 시간</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-full">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-white/50 font-mono"
                  />
                  <span className="text-xs text-zinc-400 shrink-0">분</span>
                </div>
                <div className="flex items-center gap-1 w-full">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(Number(e.target.value))}
                    className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-white/50 font-mono"
                  />
                  <span className="text-xs text-zinc-400 shrink-0">초</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Custom Phase Builder */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex justify-between items-center">
              <div>
                <label className="block text-xs font-bold text-white">
                  단계별 추출 가이드 세팅
                </label>
                <p className="text-[10px] text-zinc-400">단계를 추가하면 이전 단계와 합산된 누적 시간 범위가 자동으로 표기됩니다.</p>
              </div>
              <button
                type="button"
                onClick={handleAddStep}
                className="text-xs text-zinc-200 hover:text-white font-semibold flex items-center gap-1 bg-black/60 border border-white/10 px-2.5 py-1 rounded-xl hover:border-white/30 transition backdrop-blur-md shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>단계 추가</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {steps.map((step, idx) => {
                const prevCumulativeSec = steps.slice(0, idx).reduce((acc, curr) => acc + (Number(curr.durationSeconds) || 0), 0);
                const currentSec = Number(step.durationSeconds) || 0;
                const totalCumulativeSec = prevCumulativeSec + currentSec;

                const prevCumulativeWater = steps.slice(0, idx).reduce((acc, curr) => acc + (Number(curr.waterAmountGrams) || 0), 0);
                const currentWater = Number(step.waterAmountGrams) || 0;
                const totalCumulativeWater = prevCumulativeWater + currentWater;

                return (
                  <div key={step.id || idx} className="bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={step.phaseName}
                        onChange={(e) => handleStepChange(idx, 'phaseName', e.target.value)}
                        placeholder="단계 이름 (e.g. 뜸들이기)"
                        className="bg-black/40 border border-white/10 rounded-lg p-1.5 text-xs text-white font-bold w-1/3"
                      />
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-zinc-400 shrink-0">물(g)</span>
                          <input
                            type="number"
                            value={step.waterAmountGrams}
                            onChange={(e) => handleStepChange(idx, 'waterAmountGrams', Number(e.target.value))}
                            className="w-14 bg-black/40 border border-white/10 rounded-lg p-1 text-xs text-zinc-200 font-mono"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-zinc-400 shrink-0">시간(초)</span>
                          <input
                            type="number"
                            value={step.durationSeconds}
                            onChange={(e) => handleStepChange(idx, 'durationSeconds', Number(e.target.value))}
                            className="w-14 bg-black/40 border border-white/10 rounded-lg p-1 text-xs text-zinc-200 font-mono"
                          />
                        </div>
                        {steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(idx)}
                            className="text-zinc-400 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Time & Water Accumulation Indicator */}
                    <div className="flex items-center justify-between bg-black/40 px-2.5 py-1 rounded-lg border border-white/5 text-[11px] font-mono">
                      <span className="text-zinc-400 text-[10px]">
                        구간: <strong className="text-zinc-200">{formatTimeDigital(prevCumulativeSec)} ~ {formatTimeDigital(totalCumulativeSec)}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">
                          누적 시간 {formatSecondsToMinSec(totalCumulativeSec)}
                        </span>
                        <span className="text-zinc-600">|</span>
                        <span className="font-bold text-white">
                          누적 물량 {totalCumulativeWater}g
                        </span>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                      placeholder="단계 설명 및 팁"
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-1.5 text-xs text-zinc-300"
                    />
                  </div>
                );
              })}
            </div>

            {/* Total Steps Time & Water Summary Card */}
            {steps.length > 0 && (() => {
              const totalStepsSec = steps.reduce((acc, curr) => acc + (Number(curr.durationSeconds) || 0), 0);
              const totalStepsWater = steps.reduce((acc, curr) => acc + (Number(curr.waterAmountGrams) || 0), 0);
              return (
                <div className="flex items-center justify-between bg-black/80 p-3 rounded-xl border border-white/20 text-xs shadow-md">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white shrink-0" />
                    <div>
                      <span className="text-zinc-400 font-semibold">모든 단계 총합: </span>
                      <span className="text-white font-extrabold font-mono text-xs sm:text-sm ml-1">
                        시간 {formatSecondsToMinSec(totalStepsSec)} ({formatTimeDigital(totalStepsSec)}) | 물량 {totalStepsWater}g
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMinutes(Math.floor(totalStepsSec / 60));
                      setSeconds(totalStepsSec % 60);
                      if (totalStepsWater > 0) {
                        setWaterAmount(totalStepsWater);
                      }
                    }}
                    className="text-[10px] font-bold text-black bg-gradient-to-r from-white to-zinc-300 hover:brightness-110 px-2.5 py-1 rounded-lg transition shadow shrink-0"
                  >
                    목표치에 적용
                  </button>
                </div>
              );
            })()}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              추출 설명 및 마스터 팁 <span className="text-white">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="추출 순서, 유량 조절법, 푸어링 팁 등을 상세히 기록하세요."
              className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 transition"
            ></textarea>
          </div>

          {/* Form Action Buttons */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-white to-zinc-200 hover:brightness-110 text-black font-extrabold text-xs rounded-xl shadow-lg transition"
            >
              {initialData ? '수정사항 저장' : '레시피 저장'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
