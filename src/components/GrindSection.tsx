import React, { useState, useEffect } from 'react';
import { Sliders, Calculator, Bookmark, Plus, Trash2, ArrowRightLeft, Sparkles, Coffee, Info, Filter, ArrowRight, Check } from 'lucide-react';

// Grinder specs definition for conversion formula
export interface GrinderSpec {
  id: string;
  name: string;
  micronPerClick: number; // 1클릭당 미크론 변화량
  baseOffsetMicron: number; // 0클릭/0단계일 때 기본 입자 크기 (μm)
  unitName: string; // '클릭', '단계', '단' 등
  maxSetting: number;
  minSetting: number;
  description: string;
}

export const GRINDER_SPECS: Record<string, GrinderSpec> = {
  comandante: {
    id: 'comandante',
    name: '코만단테 C40 표준',
    micronPerClick: 30,
    baseOffsetMicron: 120,
    unitName: '클릭',
    minSetting: 1,
    maxSetting: 40,
    description: '[1클릭 = 약 30μm]',
  },
  comandanteRedClix: {
    id: 'comandanteRedClix',
    name: '코만단테 C40 Red Clix',
    micronPerClick: 15,
    baseOffsetMicron: 120,
    unitName: '클릭',
    minSetting: 1,
    maxSetting: 80,
    description: '[1클릭 = 약 15μm]',
  },
  baratzaEncore: {
    id: 'baratzaEncore',
    name: '바라짜 엔코',
    micronPerClick: 40,
    baseOffsetMicron: 150,
    unitName: '단계',
    minSetting: 1,
    maxSetting: 40,
    description: '[1단계 = 약 40μm]',
  },
  timemoreC2: {
    id: 'timemoreC2',
    name: '타임모어 C2 / C3',
    micronPerClick: 31.5,
    baseOffsetMicron: 130,
    unitName: '클릭',
    minSetting: 6,
    maxSetting: 30,
    description: '[1클릭 = 약 31.5μm]',
  },
  fellowOde2: {
    id: 'fellowOde2',
    name: '펠로우 오드 v2',
    micronPerClick: 25,
    baseOffsetMicron: 200,
    unitName: '단계',
    minSetting: 1,
    maxSetting: 11,
    description: '[1단계 = 약 25μm]',
  },
  kMax: {
    id: 'kMax',
    name: '1Zpresso K-Max / K-Ultra',
    micronPerClick: 22,
    baseOffsetMicron: 150,
    unitName: '클릭',
    minSetting: 1,
    maxSetting: 100,
    description: '[1클릭 = 약 22μm]',
  },
  leequip: {
    id: 'leequip',
    name: '리큅 LCG-C2400',
    micronPerClick: 21.87,
    baseOffsetMicron: 516.3, // 735 - 10 * 21.87
    unitName: '클릭',
    minSetting: 10,
    maxSetting: 45,
    description: '[1클릭 = 약 21.87μm]',
  },
  ek43: {
    id: 'ek43',
    name: '말코닉 EK43',
    micronPerClick: 70,
    baseOffsetMicron: 100,
    unitName: '단',
    minSetting: 1,
    maxSetting: 16,
    description: '[1단 = 약 70μm]',
  },
  custom: {
    id: 'custom',
    name: '직접 입력 (커스텀)',
    micronPerClick: 30,
    baseOffsetMicron: 100,
    unitName: '클릭',
    minSetting: 1,
    maxSetting: 100,
    description: '[커스텀 수치 지정]',
  },
};

export interface GrindRecord {
  id: string;
  grinderId: string;
  grinderName: string;
  calcMode: 'micronToClick' | 'clickToMicron';
  inputMicron: number;
  calculatedClick: number;
  calculatedMicron: number;
  unitName: string;
  brewMethodRecommendation: string;
  roastLevel?: string;
  notes?: string;
  createdAt: string;
}

// Recommend brew method based on micron size
const getBrewMethodByMicron = (micron: number): { title: string; desc: string } => {
  if (micron <= 300) {
    return { title: '에스프레소 (Espresso)', desc: '매우 고운 분말 (180~300μm). 고압 추출에 적합' };
  } else if (micron <= 450) {
    return { title: '모카포트 / 에어로프레스 고운 입자', desc: '고운 파우더~설탕 입자 (300~450μm). 스팀/압착 추출' };
  } else if (micron <= 600) {
    return { title: '에어로프레스 / 약배전 드립', desc: '고운 소금 크기 (450~600μm). 화사한 산미 추출' };
  } else if (micron <= 900) {
    return { title: '핸드드립 / 푸어오버 (V60, 칼리타)', desc: '중간 정제염 크기 (600~900μm). 표준 드립 입자' };
  } else if (micron <= 1100) {
    return { title: '클레버 / 침출식 드립', desc: '굵은 소금 크기 (900~1100μm). 잡미 없는 깔끔한 추출' };
  } else if (micron <= 1300) {
    return { title: '프렌치 프레스 (French Press)', desc: '굵은 천일염 크기 (1100~1300μm). 긴 침출 시간' };
  } else {
    return { title: '콜드브루 / 대용량 침출', desc: '아주 굵은 부스러기 크기 (1300μm 이상). 장시간 저온 추출' };
  }
};

export const GrindSection: React.FC = () => {
  // Calculator State
  const [selectedGrinderId, setSelectedGrinderId] = useState<string>('comandante');
  const [calcMode, setCalcMode] = useState<'micronToClick' | 'clickToMicron'>('micronToClick');
  
  // Custom Grinder Spec override if 'custom' selected
  const [customMicronPerClick, setCustomMicronPerClick] = useState<number>(30);
  const [customBaseOffset, setCustomBaseOffset] = useState<number>(100);

  // Input Values
  const [targetMicron, setTargetMicron] = useState<number>(750); // Default 750μm for drip
  const [inputClick, setInputClick] = useState<number>(21); // Default 21 clicks for comandante

  // Optional note for saving
  const [roastLevel, setRoastLevel] = useState<string>('중배전');
  const [notes, setNotes] = useState<string>('');

  // History Filter
  const [historyFilterGrinder, setHistoryFilterGrinder] = useState<string>('all');

  // Local Storage Records
  const [records, setRecords] = useState<GrindRecord[]>(() => {
    const saved = localStorage.getItem('coffee_grind_calc_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('coffee_grind_calc_records', JSON.stringify(records));
  }, [records]);

  // Current active grinder spec
  const currentSpec = GRINDER_SPECS[selectedGrinderId] || GRINDER_SPECS.comandante;
  const effectiveMicronPerClick = selectedGrinderId === 'custom' ? customMicronPerClick : currentSpec.micronPerClick;
  const effectiveBaseOffset = selectedGrinderId === 'custom' ? customBaseOffset : currentSpec.baseOffsetMicron;

  // Calculation Results
  let resultClick = 0;
  let resultMicron = 0;
  let boundaryNote = '';

  if (selectedGrinderId === 'leequip') {
    if (calcMode === 'micronToClick') {
      resultMicron = targetMicron;
      if (targetMicron < 735) {
        resultClick = 10;
        boundaryNote = ' (최소 실효 기준 735㎛ 미만 ➔ 10클릭 고정)';
      } else if (targetMicron > 1500) {
        resultClick = 45;
        boundaryNote = ' (최대 실효 기준 1500㎛ 초과 ➔ 45클릭 고정)';
      } else {
        resultClick = Math.round(10 + (targetMicron - 735) / 21.87);
      }
    } else {
      let calcClick = inputClick;
      if (inputClick < 10) {
        calcClick = 10;
        boundaryNote = ' (최소 실효 기준 10클릭 미만 ➔ 10클릭/735㎛ 고정)';
      } else if (inputClick > 45) {
        calcClick = 45;
        boundaryNote = ' (최대 실효 기준 45클릭 초과 ➔ 45클릭/1500㎛ 고정)';
      }
      resultClick = calcClick;
      resultMicron = Math.round(735 + (calcClick - 10) * 21.87);
    }
  } else if (calcMode === 'micronToClick') {
    resultMicron = targetMicron;
    resultClick = Math.max(1, Math.round((targetMicron - effectiveBaseOffset) / effectiveMicronPerClick));
  } else {
    resultClick = inputClick;
    resultMicron = Math.round(effectiveBaseOffset + inputClick * effectiveMicronPerClick);
  }

  const brewRecommendation = getBrewMethodByMicron(resultMicron);

  // Save Record
  const handleSaveRecord = () => {
    const newRecord: GrindRecord = {
      id: Date.now().toString(),
      grinderId: selectedGrinderId,
      grinderName: currentSpec.name,
      calcMode,
      inputMicron: targetMicron,
      calculatedClick: resultClick,
      calculatedMicron: resultMicron,
      unitName: currentSpec.unitName,
      brewMethodRecommendation: brewRecommendation.title,
      roastLevel,
      notes: notes.trim(),
      createdAt: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setRecords([newRecord, ...records]);
    setNotes('');
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('이 계산 기록을 삭제하시겠습니까?')) {
      setRecords(records.filter((r) => r.id !== id));
    }
  };

  // Filtered records
  const filteredRecords = records.filter((rec) => {
    if (historyFilterGrinder === 'all') return true;
    return rec.grinderId === historyFilterGrinder;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border border-white/15 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white">
            <Calculator className="w-3.5 h-3.5 text-zinc-300" />
            <span>Smart Grind Calculator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            분쇄도 계산기 & 클릭/미크론 변환
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            원하는 입자 크기(μm)에 맞는 클릭 수를 계산하거나, 그라인더 클릭 수에 따른 미크론(μm) 크기를 상호 계산하고 나만의 기록으로 저장해보세요.
          </p>
        </div>
      </div>

      {/* Main Calculator Card */}
      <div className="bg-black/80 backdrop-blur-xl border border-white/15 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
        {/* Step 1: Grinder Selection & Mode Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-white/10">
          {/* Grinder Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-300">
              1. 그라인더 선택 (Grinder)
            </label>
            <select
              value={selectedGrinderId}
              onChange={(e) => setSelectedGrinderId(e.target.value)}
              className="w-full bg-zinc-900 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-white transition"
            >
              {Object.values(GRINDER_SPECS).map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name} {spec.description}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Toggle */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-300">
              2. 계산 모드 (Calculation Mode)
            </label>
            <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-1 rounded-xl border border-white/15">
              <button
                type="button"
                onClick={() => setCalcMode('micronToClick')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  calcMode === 'micronToClick'
                    ? 'bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>미크론(μm) ➔ 클릭</span>
              </button>
              <button
                type="button"
                onClick={() => setCalcMode('clickToMicron')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  calcMode === 'clickToMicron'
                    ? 'bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>클릭 ➔ 미크론(μm)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Custom Grinder Spec Override (Only visible if 'custom' selected) */}
        {selectedGrinderId === 'custom' && (
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                1클릭 당 미크론 변화량 (μm/클릭)
              </label>
              <input
                type="number"
                value={customMicronPerClick}
                onChange={(e) => setCustomMicronPerClick(Number(e.target.value) || 10)}
                className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                0클릭 기본 입자 오프셋 (μm)
              </label>
              <input
                type="number"
                value={customBaseOffset}
                onChange={(e) => setCustomBaseOffset(Number(e.target.value) || 0)}
                className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-mono"
              />
            </div>
          </div>
        )}

        {/* Step 2: Interactive Input Controls */}
        <div className="bg-zinc-900/90 border border-white/10 p-5 rounded-2xl space-y-4">
          {calcMode === 'micronToClick' ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-white flex items-center gap-2">
                  <span>목표 입자 크기 설정 (Target Micron):</span>
                  <span className="text-sm font-mono font-extrabold text-white bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/20">
                    {targetMicron} μm
                  </span>
                </label>
              </div>

              <input
                type="range"
                min={150}
                max={1500}
                step={10}
                value={targetMicron}
                onChange={(e) => setTargetMicron(Number(e.target.value))}
                className="w-full accent-white cursor-pointer h-2 bg-zinc-800 rounded-lg"
              />

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={targetMicron}
                  onChange={(e) => setTargetMicron(Number(e.target.value) || 0)}
                  className="w-32 bg-black border border-white/20 rounded-xl p-2.5 text-sm font-mono font-bold text-white"
                />
                <span className="text-xs text-zinc-400">마이크로미터(μm) 수치를 직접 입력하셔도 됩니다.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-white flex items-center gap-2">
                  <span>현재 그라인더 세팅 설정 ({currentSpec.unitName}):</span>
                  <span className="text-sm font-mono font-extrabold text-white bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/20">
                    {inputClick} {currentSpec.unitName}
                  </span>
                </label>
              </div>

              <input
                type="range"
                min={currentSpec.minSetting}
                max={currentSpec.maxSetting}
                step={1}
                value={inputClick}
                onChange={(e) => setInputClick(Number(e.target.value))}
                className="w-full accent-white cursor-pointer h-2 bg-zinc-800 rounded-lg"
              />

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={inputClick}
                  onChange={(e) => setInputClick(Number(e.target.value) || 0)}
                  className="w-32 bg-black border border-white/20 rounded-xl p-2.5 text-sm font-mono font-bold text-white"
                />
                <span className="text-xs text-zinc-400">그라인더의 클릭/단계 숫자를 직접 입력하세요.</span>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Calculation Result Card */}
        <div className="bg-gradient-to-r from-zinc-900 via-black to-zinc-900 border-2 border-white/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                계산 결과 (Calculated Result)
              </span>
              <div className="flex items-baseline gap-3 pt-1">
                {calcMode === 'micronToClick' ? (
                  <>
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                      약 {resultClick} {currentSpec.unitName}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">({targetMicron} μm 기준)</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                      약 {resultMicron} μm
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">({inputClick} {currentSpec.unitName} 기준)</span>
                  </>
                )}
              </div>
              {boundaryNote && (
                <p className="text-[11px] font-semibold text-amber-400 pt-0.5">
                  {boundaryNote}
                </p>
              )}
              <p className="text-xs text-zinc-300 font-medium pt-2 flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-white shrink-0" />
                <span>추천 추출 방식: <strong>{brewRecommendation.title}</strong> — {brewRecommendation.desc}</span>
              </p>
            </div>

            {/* Quick Save Inputs */}
            <div className="flex flex-col gap-2 shrink-0 sm:w-64 border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-6 pt-4 sm:pt-0">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="원두명 또는 추출 메모 (선택)"
                className="bg-black/60 border border-white/15 rounded-xl p-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/50"
              />
              <button
                onClick={handleSaveRecord}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs shadow-lg transition active:scale-95"
              >
                <Bookmark className="w-4 h-4 fill-black" />
                <span>계산 결과 기록 저장</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History & Filter Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-zinc-300" />
            <span>저장된 분쇄도 계산 기록 (Grind History)</span>
          </h3>

          {/* Grinder Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0 mr-1" />
            <button
              onClick={() => setHistoryFilterGrinder('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                historyFilterGrinder === 'all'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-black/60 text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              전체 ({records.length})
            </button>
            {Object.values(GRINDER_SPECS).map((spec) => {
              const count = records.filter((r) => r.grinderId === spec.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={spec.id}
                  onClick={() => setHistoryFilterGrinder(spec.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                    historyFilterGrinder === spec.id
                      ? 'bg-white text-black shadow-md'
                      : 'bg-black/60 text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {spec.name.split(' ')[0]} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* History List */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 bg-black/40 rounded-3xl border border-white/10 p-6">
            <Info className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">저장된 계산 기록이 없습니다.</p>
            <p className="text-[11px] text-zinc-500 mt-1">상단의 계산기에서 원하는 수치를 계산하고 &apos;계산 결과 기록 저장&apos; 버튼을 눌러보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/15 hover:border-white/30 transition space-y-2.5 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 border border-white/15">
                      {rec.grinderName}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5 flex items-center gap-2">
                      <span>{rec.brewMethodRecommendation}</span>
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-mono font-extrabold text-white bg-white/15 px-2.5 py-1 rounded-lg border border-white/20">
                        {rec.calculatedClick} {rec.unitName} ({rec.calculatedMicron} μm)
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRecord(rec.id)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition"
                      title="기록 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {rec.notes && (
                  <p className="text-xs text-zinc-300 bg-white/5 p-2.5 rounded-xl border border-white/10 leading-relaxed">
                    {rec.notes}
                  </p>
                )}

                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 font-mono">
                  <span>등록일: {rec.createdAt}</span>
                  <span>모드: {rec.calcMode === 'micronToClick' ? '미크론➜클릭' : '클릭➜미크론'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
