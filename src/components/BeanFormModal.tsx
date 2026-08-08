import React, { useState, useEffect } from 'react';
import { X, Flame, Package, DollarSign, ExternalLink, Tag, Plus, Trash2, Edit3, Sparkles } from 'lucide-react';
import { BeanInfo, getAgtronRoastLevel } from '../types';

interface BeanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (beanData: Omit<BeanInfo, 'id' | 'createdAt'> & { id?: number }) => void;
  initialData?: BeanInfo | null;
}

const COMMON_FLAVOR_TAGS = [
  '자스민', '복숭아', '감귤류', '청사과', '베리류', '얼그레이',
  '밀크초콜릿', '다크초콜릿', '구운 아몬드', '카라멜', '바닐라',
  '리치', '열대과일', '요거트', '허브', '꿀'
];

export const BeanFormModal: React.FC<BeanFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [roastery, setRoastery] = useState('');
  const [origin, setOrigin] = useState('');
  const [agtronNumber, setAgtronNumber] = useState<number>(65);
  const [customRoastName, setCustomRoastName] = useState<string>('');
  const [price, setPrice] = useState<number>(18000);
  const [weightGrams, setWeightGrams] = useState<number>(200);
  const [purchaseUrl, setPurchaseUrl] = useState('');
  const [flavorNotes, setFlavorNotes] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setRoastery(initialData.roastery || '');
      setOrigin(initialData.origin || '');
      setAgtronNumber(initialData.agtronNumber ?? 65);
      setCustomRoastName(initialData.roastLevel || '');
      setPrice(initialData.price ?? 18000);
      setWeightGrams(initialData.weightGrams ?? 200);
      setPurchaseUrl(initialData.purchaseUrl || '');
      setFlavorNotes(initialData.flavorNotes || []);
      setDescription(initialData.description || '');
    } else {
      setName('');
      setRoastery('');
      setOrigin('');
      setAgtronNumber(65);
      setCustomRoastName('');
      setPrice(18000);
      setWeightGrams(200);
      setPurchaseUrl('');
      setFlavorNotes(['자스민', '복숭아', '얼그레이']);
      setDescription('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const currentRoastLevel = getAgtronRoastLevel(agtronNumber, customRoastName);

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !flavorNotes.includes(trimmed)) {
      setFlavorNotes([...flavorNotes, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFlavorNotes(flavorNotes.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id,
      name: name.trim() || '원두 이름 미지정',
      roastery: roastery.trim() || '로스터리 미지정',
      origin: origin.trim(),
      agtronNumber,
      roastLevel: currentRoastLevel,
      price: Number(price) || 0,
      weightGrams: Number(weightGrams) || 200,
      purchaseUrl: purchaseUrl.trim(),
      flavorNotes,
      description: description.trim(),
    });
    onClose();
  };

  const pricePer100g = weightGrams > 0 ? Math.round((price / weightGrams) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 w-full max-w-xl text-white space-y-4 my-auto relative">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
              <Package className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>{initialData ? '원두 정보 수정' : '새 원두 등록'}</span>
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </h3>
              <p className="text-[11px] text-zinc-400">구매한 원두의 배전도, 가격, 구매처 및 노트를 기록하세요.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          
          {/* Bean Name & Roastery */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                원두 이름 / 제품명 <span className="text-white">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 에티오피아 예가체프 아리차 G1"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                로스터리 브랜드명 <span className="text-white">*</span>
              </label>
              <input
                type="text"
                required
                value={roastery}
                onChange={(e) => setRoastery(e.target.value)}
                placeholder="예: 모모스 커피, 프릳츠, 블루보틀"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
              />
            </div>
          </div>

          {/* Origin / Farm Details */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              원산지 / 농장 / 품종 / 가공방식
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="예: 에티오피아 / 아리차 농장 / 워시드 (Washed) / 1,900m"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
            />
          </div>

          {/* REQUIRED: Agtron No. Roast Level Section */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-white" />
                <span>원두 배전도 (Agtron No.)</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 text-white text-xs font-mono font-bold">
                  <span>Agtron</span>
                  <input
                    type="number"
                    min="25"
                    max="95"
                    value={agtronNumber || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAgtronNumber(val);
                      if (val < 60 || val > 70) setCustomRoastName('');
                    }}
                    onBlur={() => {
                      let val = agtronNumber;
                      if (!val || val < 25) val = 25;
                      if (val > 95) val = 95;
                      setAgtronNumber(val);
                    }}
                    className="w-12 bg-zinc-950 border border-zinc-800 rounded px-1 py-0.5 text-center text-white font-bold font-mono focus:outline-none focus:border-zinc-600 text-xs"
                  />
                </div>
                <span className="text-xs font-bold text-white bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                  {currentRoastLevel}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <input
                type="range"
                min="25"
                max="95"
                step="1"
                value={agtronNumber}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAgtronNumber(val);
                  if (val < 60 || val > 70) setCustomRoastName('');
                }}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 px-0.5">
                <span>25 (Dark)</span>
                <span>45</span>
                <span>55</span>
                <span>65</span>
                <span>75</span>
                <span>95 (Light)</span>
              </div>
            </div>

            {/* Quick preset selector buttons */}
            <div className="space-y-1 pt-1">
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
                  const isSelected = currentRoastLevel === p.roast;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setAgtronNumber(p.val);
                        setCustomRoastName(p.roast);
                      }}
                      className={`text-[10px] font-mono px-2 py-0.8 rounded-md border transition ${
                        isSelected
                          ? 'bg-white text-black font-extrabold border-white'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Price & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                구매 가격 (원화 ₩)
              </label>
              <input
                type="number"
                step="500"
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="18000"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-zinc-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                용량 (g)
              </label>
              <input
                type="number"
                step="10"
                value={weightGrams || ''}
                onChange={(e) => setWeightGrams(Number(e.target.value))}
                placeholder="200"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-zinc-600 transition"
              />
            </div>
          </div>

          {/* Calculated Price Per 100g */}
          {weightGrams > 0 && price > 0 && (
            <div className="bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 text-xs flex justify-between items-center font-mono">
              <span className="text-zinc-400">100g 당 가성비 단가:</span>
              <span className="text-white font-bold">₩{pricePer100g.toLocaleString()} / 100g</span>
            </div>
          )}

          {/* Purchase Website Link */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span>구매 사이트 / 쇼핑몰 URL</span>
            </label>
            <input
              type="url"
              value={purchaseUrl}
              onChange={(e) => setPurchaseUrl(e.target.value)}
              placeholder="https://example.com/products/bean-123"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition font-mono"
            />
          </div>

          {/* Flavor Notes Tag Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-zinc-400" />
              <span>컵 노트 / 시음 향미 태그</span>
            </label>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(tagInput);
                  }
                }}
                placeholder="태그 입력 후 엔터 (예: 청사과)"
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
              />
              <button
                type="button"
                onClick={() => handleAddTag(tagInput)}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-bold rounded-xl transition"
              >
                추가
              </button>
            </div>

            {/* Common tags preset */}
            <div className="flex flex-wrap gap-1 pt-1">
              {COMMON_FLAVOR_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className={`text-[10px] px-2 py-0.5 rounded-lg border transition ${
                    flavorNotes.includes(tag)
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  +{tag}
                </button>
              ))}
            </div>

            {/* Selected Flavor Notes list */}
            {flavorNotes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                {flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="text-xs font-bold bg-zinc-800 text-white border border-zinc-700 px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm"
                  >
                    <span>{note}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(note)}
                      className="hover:text-zinc-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description & Notes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              원두 소개 / 아로마 특징 메모
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="원두에 대한 개괄적인 설명, 디개싱 팁, 추천 추출 방식 등을 기록하세요."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-white text-black hover:bg-zinc-200 font-extrabold text-xs rounded-xl transition"
            >
              {initialData ? '원두 수정 저장' : '원두 정보 등록'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
