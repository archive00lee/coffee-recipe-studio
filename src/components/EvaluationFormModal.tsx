import React, { useState, useEffect } from 'react';
import { X, Star, ClipboardCheck, Sparkles, Tag, Edit3 } from 'lucide-react';
import { CoffeeRecipe, BrewEvaluation } from '../types';

interface EvaluationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: CoffeeRecipe[];
  onSubmit: (evaluation: Omit<BrewEvaluation, 'id'>) => void;
  initialRecipeId?: number;
  initialData?: BrewEvaluation | null;
}

const PREDEFINED_NOTES = [
  '자스민', '플로럴', '시트러스', '복숭아', '베리', '청사과', 
  '밀크초콜릿', '카라멜', '견과류', '바닐라', '다크초콜릿', '허브', '꿀'
];

const ROAST_LEVELS: Array<BrewEvaluation['roastLevel']> = [
  '약배전', '중약배전', '중배전', '중강배전', '강배전'
];

export const EvaluationFormModal: React.FC<EvaluationFormModalProps> = ({
  isOpen,
  onClose,
  recipes,
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
  const [roastLevel, setRoastLevel] = useState<BrewEvaluation['roastLevel']>('약배전');
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
        setRoastLevel(initialData.roastLevel || '약배전');
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
        setRoastLevel('약배전');
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

  const toggleNote = (note: string) => {
    if (tastingNotes.includes(note)) {
      setTastingNotes(tastingNotes.filter(n => n !== note));
    } else {
      setTastingNotes([...tastingNotes, note]);
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customTagInput.trim()) {
      e.preventDefault();
      const val = customTagInput.trim();
      if (!tastingNotes.includes(val)) {
        setTastingNotes([...tastingNotes, val]);
      }
      setCustomTagInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recipeTitleToSave = selectedRecipeId === 0 ? (customRecipeTitle.trim() || '자유 추출 레시피') : customRecipeTitle;

    onSubmit({
      recipeId: selectedRecipeId,
      recipeTitle: recipeTitleToSave,
      brewMethod,
      beanName: beanName.trim() || '원두 미지정',
      roastLevel,
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
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in">
      <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-950/90 to-black/95 backdrop-blur-2xl border border-white/20 w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md shadow-md">
              {initialData ? <Edit3 className="w-4 h-4" /> : <ClipboardCheck className="w-4 h-4" />}
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
          <div className="grid sm:grid-cols-2 gap-3">
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

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                배전도 (로스팅 정도)
              </label>
              <select
                value={roastLevel}
                onChange={(e) => setRoastLevel(e.target.value as BrewEvaluation['roastLevel'])}
                className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-white/50 transition"
              >
                {ROAST_LEVELS.map((rl) => (
                  <option key={rl} value={rl}>
                    {rl}
                  </option>
                ))}
              </select>
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
            <div className="flex flex-wrap gap-1.5">
              {PREDEFINED_NOTES.map((note) => {
                const isSelected = tastingNotes.includes(note);
                return (
                  <button
                    key={note}
                    type="button"
                    onClick={() => toggleNote(note)}
                    className={`text-xs px-2.5 py-1 rounded-xl border transition backdrop-blur-md ${
                      isSelected
                        ? 'bg-gradient-to-r from-white to-zinc-200 text-black border-white font-bold shadow-md'
                        : 'bg-black/60 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    #{note}
                  </button>
                );
              })}
            </div>
            <div className="pt-1">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={handleAddCustomTag}
                placeholder="직접 태그 입력 후 Enter (예: 패션후르츠, 피치, 베르가못)"
                className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 transition"
              />
            </div>
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
