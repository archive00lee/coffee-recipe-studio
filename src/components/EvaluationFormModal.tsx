import React, { useState, useEffect } from 'react';
import { X, Star, ClipboardCheck, Sparkles, Tag, Edit3, Flame, Package } from 'lucide-react';
import { CoffeeRecipe, BrewEvaluation, BeanInfo, getAgtronRoastLevel } from '../types';

interface EvaluationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: CoffeeRecipe[];
  beans?: BeanInfo[];
  onSubmit: (evaluation: Omit<BrewEvaluation, 'id'>) => void;
  initialRecipeId?: number;
  initialData?: BrewEvaluation | null;
}

const PREDEFINED_NOTES = [
  '자스민', '플로럴', '시트러스', '복숭아', '베리류', '청사과', '얼그레이',
  '밀크초콜릿', '다크초콜릿', '구운 아몬드', '카라멜', '바닐라', '리치', '열대과일', '요거트', '허브', '꿀'
];

export const EvaluationFormModal: React.FC<EvaluationFormModalProps> = ({
  isOpen,
  onClose,
  recipes,
  beans = [],
  onSubmit,
  initialRecipeId,
  initialData,
}) => {
  const selectedDefaultRecipe = recipes.find(r => r.id === initialRecipeId) || recipes[0];

  const [selectedRecipeId, setSelectedRecipeId] = useState<number>(
    selectedDefaultRecipe ? selectedDefaultRecipe.id : 0
  );
  const [customRecipeTitle, setCustomRecipeTitle] = useState<string>(
    selectedDefaultRecipe ? selectedDefaultRecipe.title : ''
  );
  const [brewMethod, setBrewMethod] = useState<string>(
    selectedDefaultRecipe ? selectedDefaultRecipe.brewMethod : '에어로프레스'
  );

  const [beanName, setBeanName] = useState('');
  const [agtronNumber, setAgtronNumber] = useState<number>(65);
  const [customRoastName, setCustomRoastName] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  
  // Flavor metrics (1~5)
  const [acidity, setAcidity] = useState<number>(3);
  const [sweetness, setSweetness] = useState<number>(3);
  const [body, setBody] = useState<number>(3);
  const [bitterness, setBitterness] = useState<number>(2);
  const [aftertaste, setAftertaste] = useState<number>(4);

  const [tastingNotes, setTastingNotes] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [evalDate, setEvalDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setSelectedRecipeId(initialData.recipeId);
        setCustomRecipeTitle(initialData.recipeTitle || '');
        setBrewMethod(initialData.brewMethod || '에어로프레스');
        setBeanName(initialData.beanName || '');
        setAgtronNumber(initialData.agtronNumber ?? 65);
        setCustomRoastName(initialData.roastLevel || '');
        setRating(initialData.rating || 5);
        setAcidity(initialData.acidity || 3);
        setSweetness(initialData.sweetness || 3);
        setBody(initialData.body || 3);
        setBitterness(initialData.bitterness || 2);
        setAftertaste(initialData.aftertaste || 4);
        setTastingNotes(initialData.tastingNotes || []);
        setEvalDate(initialData.evalDate || new Date().toISOString().split('T')[0]);
        setMemo(initialData.memo || '');
      } else {
        const defaultRec = recipes.find(r => r.id === initialRecipeId) || recipes[0];
        setSelectedRecipeId(defaultRec ? defaultRec.id : 0);
        setCustomRecipeTitle(defaultRec ? defaultRec.title : '');
        setBrewMethod(defaultRec ? defaultRec.brewMethod : '에어로프레스');
        setBeanName('');
        setAgtronNumber(65);
        setCustomRoastName('');
        setRating(5);
        setAcidity(3);
        setSweetness(3);
        setBody(3);
        setBitterness(2);
        setAftertaste(4);
        setTastingNotes([]);
        setEvalDate(new Date().toISOString().split('T')[0]);
        setMemo('');
      }
    }
  }, [isOpen, initialData, initialRecipeId, recipes]);

  if (!isOpen) return null;

  const handleRecipeSelectChange = (idNum: number) => {
    setSelectedRecipeId(idNum);
    if (idNum === 0) {
      setCustomRecipeTitle('자유 추출 평가');
      setBrewMethod('에어로프레스');
    } else {
      const found = recipes.find(r => r.id === idNum);
      if (found) {
        setCustomRecipeTitle(found.title);
        setBrewMethod(found.brewMethod);
      }
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tastingNotes.includes(trimmed)) {
      setTastingNotes([...tastingNotes, trimmed]);
      setCustomTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTastingNotes(tastingNotes.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recipeTitleToSave = selectedRecipeId === 0 ? (customRecipeTitle.trim() || '자유 추출 레시피') : customRecipeTitle;
    const computedRoastLevel = getAgtronRoastLevel(agtronNumber, customRoastName);

    onSubmit({
      recipeId: selectedRecipeId,
      recipeTitle: recipeTitleToSave,
      brewMethod,
      beanName: beanName.trim() || '원두 미지정',
      agtronNumber,
      roastLevel: computedRoastLevel,
      rating,
      acidity,
      sweetness,
      body,
      bitterness,
      aftertaste,
      tastingNotes,
      evalDate,
      memo: memo.trim(),
    });

    onClose();
  };

  const renderStarPicker = (value: number, setValue: (v: number) => void, label: string) => (
    <div className="flex items-center justify-between bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
      <span className="text-xs font-semibold text-zinc-300">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue(star)}
            className="p-1 text-zinc-600 hover:text-white transition"
          >
            <Star
              className={`w-4 h-4 ${
                star <= value
                  ? 'fill-white text-white'
                  : 'text-zinc-700'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-mono font-bold text-zinc-300 ml-1.5 w-4 text-center">
          {value}
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#030303]/70 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#030303]/70 backdrop-blur-2xl border border-white/20 w-full max-w-2xl rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-5 my-8 max-h-[90vh] overflow-y-auto ring-1 ring-white/10">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white via-zinc-300 to-[#030303] border border-white/30 flex items-center justify-center text-[#030303] backdrop-blur-md shadow-md">
              {initialData ? <Edit3 className="w-4 h-4 stroke-[2.5]" /> : <ClipboardCheck className="w-4 h-4 stroke-[2.5]" />}
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {initialData ? '추출 평가 수정' : '추출 성패 & 센서리 평가 작성'}
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
          
          {/* Target Recipe Select */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                평가할 레시피 선택 <span className="text-white">*</span>
              </label>
              <select
                value={selectedRecipeId}
                onChange={(e) => handleRecipeSelectChange(Number(e.target.value))}
                className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-white/50 transition"
              >
                {recipes.map((r) => (
                  <option key={r.id} value={r.id}>
                    [{r.brewMethod}] {r.title}
                  </option>
                ))}
                <option value={0}>+ 직접 입력 (목록에 없는 레시피)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                평가 일자
              </label>
              <input
                type="date"
                value={evalDate}
                onChange={(e) => setEvalDate(e.target.value)}
                className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-white/50 transition font-mono"
              />
            </div>
          </div>

          {/* Bean Name & Roast Level */}
          <div className="space-y-3">
            {beans.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-white mb-1 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5" />
                  <span>보유 원두에서 불러오기 (선택)</span>
                </label>
                <select
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    if (selectedId) {
                      const found = beans.find(b => b.id === selectedId);
                      if (found) {
                        setBeanName(found.name);
                        setAgtronNumber(found.agtronNumber);
                        setCustomRoastName(found.roastLevel);
                        if (found.flavorNotes && found.flavorNotes.length > 0) {
                          setTastingNotes(prev => Array.from(new Set([...prev, ...found.flavorNotes!])));
                        }
                      }
                    }
                  }}
                  defaultValue=""
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-white/50 font-semibold"
                >
                  <option value="" disabled className="bg-[#030303] text-zinc-400">-- 등록된 원두 목록에서 바로 선택 --</option>
                  {beans.map(b => (
                    <option key={b.id} value={b.id} className="bg-[#030303] text-white">
                      [{b.roastery}] {b.name} (Agtron {b.agtronNumber})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                원두 이름 / 원산지
              </label>
              <input
                type="text"
                value={beanName}
                onChange={(e) => setBeanName(e.target.value)}
                placeholder="예: 에티오피아 예가체프 아리차, 콜롬비아 게이샤"
                className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 transition"
              />
            </div>
          </div>

          {/* Agtron No. Roast Level Slider Section */}
          <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-white" />
                <span>원두 배전도 (Agtron No.)</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/20 text-white text-xs font-mono font-bold">
                  <span>Agtron No.</span>
                  <input
                    type="number"
                    min="25"
                    max="95"
                    value={agtronNumber || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAgtronNumber(val);
                      if (val < 60 || val > 70) {
                        setCustomRoastName('');
                      }
                    }}
                    onBlur={() => {
                      let val = agtronNumber;
                      if (!val || val < 25) val = 25;
                      if (val > 95) val = 95;
                      setAgtronNumber(val);
                    }}
                    className="w-12 bg-black/60 border border-white/30 rounded px-1 py-0.5 text-center text-white font-bold font-mono focus:outline-none focus:border-white text-xs"
                  />
                </div>
                <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
                  {getAgtronRoastLevel(agtronNumber, customRoastName)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="25"
                max="95"
                step="1"
                value={agtronNumber}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAgtronNumber(val);
                  if (val < 60 || val > 70) {
                    setCustomRoastName('');
                  }
                }}
                className="w-full h-2 bg-gradient-to-r from-zinc-800 via-zinc-400 to-white rounded-lg appearance-none cursor-pointer accent-white"
              />

              <div className="flex justify-between text-[10px] font-mono text-zinc-400 px-0.5">
                <span>25</span>
                <span>35</span>
                <span>45</span>
                <span>50</span>
                <span>60</span>
                <span>70</span>
                <span>80</span>
                <span>95</span>
              </div>
            </div>

            {/* Quick preset selector buttons */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] text-zinc-400 font-semibold">배전도 프리셋 태그</div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'LIGHT', val: 85, roast: 'LIGHT Roast' },
                  { name: 'CINNAMON', val: 75, roast: 'CINNAMON Roast' },
                  { name: 'MEDIUM', val: 65, roast: 'MEDIUM Roast' },
                  { name: 'HIGH', val: 65, roast: 'HIGH Roast' },
                  { name: 'CITY', val: 55, roast: 'CITY Roast' },
                  { name: 'FULL CITY', val: 47, roast: 'FULL CITY Roast' },
                  { name: 'FRENCH', val: 38, roast: 'FRENCH Roast' },
                  { name: 'ITALIAN', val: 28, roast: 'ITALIAN Roast' },
                ].map((p) => {
                  const currentDisplay = getAgtronRoastLevel(agtronNumber, customRoastName);
                  const isSelected = currentDisplay === p.roast;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setAgtronNumber(p.val);
                        setCustomRoastName(p.roast);
                      }}
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-md border transition ${
                        isSelected
                          ? 'bg-white text-black font-extrabold border-white shadow-md'
                          : 'bg-black/40 text-zinc-300 border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Overall Rating (1~5 Stars) */}
          <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>종합 만족도 점수</span>
              </label>
              <span className="text-xs font-mono font-bold text-white">{rating} / 5 점</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'fill-white text-white'
                        : 'text-zinc-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Flavor Profile Metrics (5 Key Sensory Features) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-white">
              센서리 프로파일 (1 ~ 5점)
            </label>
            <div className="grid sm:grid-cols-2 gap-2">
              {renderStarPicker(acidity, setAcidity, '산미 (Acidity)')}
              {renderStarPicker(sweetness, setSweetness, '단맛 (Sweetness)')}
              {renderStarPicker(body, setBody, '바디감 (Body)')}
              {renderStarPicker(bitterness, setBitterness, '쓴맛 (Bitterness)')}
              {renderStarPicker(aftertaste, setAftertaste, '클린컵 / 후미 (Aftertaste)')}
            </div>
          </div>

          {/* Tasting Notes Tags */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="block text-xs font-bold text-white flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-zinc-400" />
              <span>시음 노트 키워드</span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(customTagInput);
                  }
                }}
                placeholder="태그 입력 후 엔터 (예: 청사과)"
                className="flex-1 bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 transition"
              />
              <button
                type="button"
                onClick={() => handleAddTag(customTagInput)}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition shrink-0"
              >
                추가
              </button>
            </div>

            {/* Common tags preset */}
            <div className="flex flex-wrap gap-1 pt-1">
              {PREDEFINED_NOTES.map((note) => {
                const isSelected = tastingNotes.includes(note);
                return (
                  <button
                    key={note}
                    type="button"
                    onClick={() => handleAddTag(note)}
                    className={`text-[10px] px-2 py-0.5 rounded-lg border transition ${
                      isSelected
                        ? 'bg-white text-black font-extrabold border-white'
                        : 'bg-black/40 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    +{note}
                  </button>
                );
              })}
            </div>

            {/* Selected Tasting Notes list with X delete buttons */}
            {tastingNotes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1.5 bg-black/40 p-2.5 rounded-xl border border-white/5">
                {tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="text-xs font-bold bg-white/15 text-white border border-white/30 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm"
                  >
                    <span>{note}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(note)}
                      className="hover:text-red-400 transition ml-0.5 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Memo & Extraction Feedback */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              추출 총평 및 다음 가이드 피드백
            </label>
            <textarea
              rows={3}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="맛의 균형감, 개선할 점 (예: 수온을 1~2도 낮추면 쓴맛이 줄고 단맛이 더 살 것 같음)을 기록하세요."
              className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 transition"
            ></textarea>
          </div>

          {/* Actions */}
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
              {initialData ? '수정사항 저장' : '평가 저장'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
