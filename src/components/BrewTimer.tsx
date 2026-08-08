import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, CheckCircle2, Coffee, Flame, Droplets, Clock } from 'lucide-react';
import { CoffeeRecipe, BrewStep } from '../types';

interface BrewTimerProps {
  recipes: CoffeeRecipe[];
  selectedRecipeForTimer?: CoffeeRecipe | null;
}

export const BrewTimer: React.FC<BrewTimerProps> = ({
  recipes,
  selectedRecipeForTimer,
}) => {
  const [activeRecipeId, setActiveRecipeId] = useState<number>(
    selectedRecipeForTimer ? selectedRecipeForTimer.id : (recipes[0]?.id || 1)
  );

  const activeRecipe = recipes.find(r => r.id === activeRecipeId) || recipes[0] || selectedRecipeForTimer;

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stepSecondsLeft, setStepSecondsLeft] = useState<number>(0);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Default fallback steps if recipe has no custom steps
  const steps: BrewStep[] = activeRecipe?.steps && activeRecipe.steps.length > 0
    ? activeRecipe.steps
    : [
        {
          id: 's1',
          phaseName: '뜸들이기 (Bloom)',
          waterAmountGrams: Math.round((activeRecipe?.waterAmountMl || 300) * 0.2),
          durationSeconds: 30,
          description: '원두 표면 전체를 골고루 적신 후 뜸을 들입니다.'
        },
        {
          id: 's2',
          phaseName: '1차 푸어링 (1st Pour)',
          waterAmountGrams: Math.round((activeRecipe?.waterAmountMl || 300) * 0.6),
          durationSeconds: 45,
          description: '원형을 그리며 일정 속도로 푸어링합니다.'
        },
        {
          id: 's3',
          phaseName: '2차 푸어링 (2nd Pour)',
          waterAmountGrams: activeRecipe?.waterAmountMl || 300,
          durationSeconds: (activeRecipe?.totalTimeSeconds || 150) - 75,
          description: '목표 수량까지 채우고 드립을 마칩니다.'
        }
      ];

  const currentStep = steps[currentStepIndex] || steps[0];

  // Initialize step timer when recipe or step changes
  useEffect(() => {
    if (activeRecipe) {
      setCurrentStepIndex(0);
      setStepSecondsLeft(steps[0]?.durationSeconds || 30);
      setTotalSecondsElapsed(0);
      setIsRunning(false);
      setIsCompleted(false);
    }
  }, [activeRecipeId]);

  // Web Audio Beep Generator
  const playBeep = (freq = 800, duration = 0.15) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.1;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.error(e);
    }
  };

  // Main Timer Interval Effect
  useEffect(() => {
    let interval: any = null;

    if (isRunning && !isCompleted) {
      interval = setInterval(() => {
        setTotalSecondsElapsed(prev => prev + 1);

        setStepSecondsLeft(prev => {
          if (prev <= 1) {
            // Step completed
            playBeep(900, 0.25);
            if (currentStepIndex < steps.length - 1) {
              const nextIdx = currentStepIndex + 1;
              setCurrentStepIndex(nextIdx);
              return steps[nextIdx].durationSeconds;
            } else {
              // All steps completed!
              setIsCompleted(true);
              setIsRunning(false);
              playBeep(1200, 0.5);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isCompleted, currentStepIndex, steps, soundEnabled]);

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setCurrentStepIndex(0);
    setStepSecondsLeft(steps[0]?.durationSeconds || 30);
    setTotalSecondsElapsed(0);
  };

  const handleSkipStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setStepSecondsLeft(steps[nextIdx].durationSeconds);
      playBeep(700, 0.1);
    } else {
      setIsCompleted(true);
      setIsRunning(false);
    }
  };

  const formatMinSec = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentStepDuration = currentStep?.durationSeconds || 1;
  const stepProgressPercent = Math.min(
    100,
    Math.max(0, ((currentStepDuration - stepSecondsLeft) / currentStepDuration) * 100)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header & Recipe Selector */}
      <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">커피 추출 라이브 타이머</h2>
            <p className="text-xs text-zinc-400">단계별 수량 가이드와 정밀 시간 알림</p>
          </div>
        </div>

        {/* Recipe Dropdown */}
        <div className="w-full sm:w-64">
          <select
            value={activeRecipeId}
            onChange={(e) => setActiveRecipeId(Number(e.target.value))}
            className="w-full bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-zinc-200 font-semibold rounded-xl p-2.5 focus:outline-none focus:border-zinc-600"
          >
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} ({r.ratioText.split(' ')[2] || r.brewMethod})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Digital Clock Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 text-center relative overflow-hidden text-white">

        {/* Mute/Unmute sound toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition"
          title={soundEnabled ? '음소거' : '소리 켜기'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
        </button>

        {/* Recipe Meta Info Bar */}
        {activeRecipe && (
          <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800 text-xs">
            <span className="text-white font-bold">{activeRecipe.title}</span>
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-300 font-mono">{activeRecipe.ratioText}</span>
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-300 font-medium flex items-center gap-1">
              <Flame className="w-3 h-3 text-zinc-400" />
              {activeRecipe.waterTempCelsius}°C
            </span>
          </div>
        )}

        {/* Digital Time Displays */}
        {!isCompleted ? (
          <div className="space-y-3 py-2">
            <div className="text-xs uppercase font-mono tracking-widest text-zinc-400">
              현재 단계 : <span className="text-white font-bold">{currentStep?.phaseName}</span> ({currentStepIndex + 1} / {steps.length})
            </div>

            {/* Giant Countdown Display */}
            <div className="text-6xl sm:text-8xl font-black font-mono tracking-tight text-white">
              {formatMinSec(stepSecondsLeft)}
            </div>

            {/* Total Elapsed & Target Water Indicator */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <div className="bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800 text-xs">
                <span className="text-zinc-400">총 누적 시간: </span>
                <span className="font-mono text-white font-bold">{formatMinSec(totalSecondsElapsed)}</span>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 text-zinc-200">
                <Droplets className="w-4 h-4 text-zinc-400" />
                <span className="font-bold">목표 물 용량: {currentStep?.waterAmountGrams || activeRecipe?.waterAmountMl}g</span>
              </div>
            </div>

            {/* Step Progress Bar */}
            <div className="w-full bg-zinc-950 rounded-full h-2.5 p-0.5 border border-zinc-800 mt-4">
              <div
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${stepProgressPercent}%` }}
              ></div>
            </div>

            {/* Step Description Guide */}
            <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto pt-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              💡 {currentStep?.description}
            </p>
          </div>
        ) : (
          /* Completion Screen */
          <div className="py-8 space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto text-white">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">커피 추출 완료!</h3>
              <p className="text-xs text-zinc-300">
                총 추출 시간 <span className="text-white font-mono font-bold">{formatMinSec(totalSecondsElapsed)}</span> 동안 완벽하게 추출되었습니다.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>타이머 초기화</span>
            </button>
          </div>
        )}

        {/* Timer Control Buttons */}
        {!isCompleted && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="p-3.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 transition"
              title="리셋"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-zinc-200 text-black flex items-center gap-2 transition"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-black text-black" />
                  <span>일시정지</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-black text-black" />
                  <span>{totalSecondsElapsed > 0 ? '재개' : '추출 시작'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleSkipStep}
              className="p-3.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 transition"
              title="다음 단계로 건너뛰기"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Steps Overview List */}
      <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-3">
        <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-2">
          <Coffee className="w-4 h-4 text-white" />
          <span>전체 추출 일정 로드맵</span>
        </h4>

        <div className="grid gap-2">
          {steps.map((step, idx) => (
            <div
              key={step.id || idx}
              className={`p-3 rounded-xl border text-xs flex items-center justify-between transition ${
                idx === currentStepIndex && !isCompleted
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : idx < currentStepIndex || isCompleted
                  ? 'bg-zinc-950 border-zinc-900 text-zinc-500'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center shrink-0 ${
                  idx === currentStepIndex && !isCompleted
                    ? 'bg-white text-black'
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {idx + 1}
                </span>
                <div>
                  <span className="font-bold mr-2">{step.phaseName}</span>
                  <span className="text-zinc-400 text-[11px]">{step.description}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                <span className="text-white font-bold">{step.waterAmountGrams}g</span>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-300">{step.durationSeconds}초</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
