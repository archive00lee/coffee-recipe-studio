export type BrewMethod = 
  | '에어로프레스' 
  | 'Hario v60 02' 
  | 'Hario Neo 02' 
  | 'Hario swich 02' 
  | 'UFO'
  | string;

export const FILTER_OPTIONS_MAP: Record<string, string[]> = {
  '에어로프레스': [
    '기본 1장',
    '기본 2장',
    'hario 02 기본',
    '칼딘',
    'SIBARIST',
    '스텐',
    '스텐(골드)',
  ],
  'Hario v60 02': [
    'hario 02 기본',
    'hario v60 메테오02',
    '카펙 아바카 th3',
    'SIBARIST',
    '하이플럭스 v타입 02',
  ],
  'Hario Neo 02': [
    'hario 02 기본',
    'hario v60 메테오02',
    '카펙 아바카 th3',
    'SIBARIST',
    '하이플럭스 v타입 02',
  ],
  'Hario swich 02': [
    'hario 02 기본',
    'hario v60 메테오02',
    '카펙 아바카 th3',
    'SIBARIST',
    '하이플럭스 v타입 02',
  ],
  'UFO': [
    'ufo 기본',
    'hario 02 기본',
    'hario v60 메테오02',
    '카펙 아바카 th3',
    'SIBARIST',
    '하이플럭스 v타입 02',
  ],
};

export interface BrewStep {
  id: string;
  phaseName: string; // e.g., "뜸들이기 (Bloom)", "1차 추출 (1st Pour)"
  waterAmountGrams: number;
  durationSeconds: number;
  description: string;
}

export interface CoffeeRecipe {
  id: number;
  title: string;
  brewMethod: string; // 추출도구
  filterType?: string; // 필터
  capType?: string; // 캡 (에어로프레스 전용: 기본, 플로우컨트롤)
  orientation?: '정방향' | '역방향' | string; // 추출방향 (에어로프레스 전용: 정방향, 역방향)
  beanAmountGrams: number;
  waterAmountMl: number;
  ratioText: string; // e.g., "원두 20g / 물 300ml (1:15)"
  waterTempCelsius: number;
  grindSizeMicrons: number; // 분쇄도 (미크론 μm 숫자)
  totalTimeSeconds: number;
  agtronNumber?: number; // 배전도 (Agtron No. 숫자 25~95)
  roastLevelName?: string; // e.g., 'LIGHT Roast', 'HIGH Roast', etc.
  desc: string;
  steps?: BrewStep[];
  isFavorite?: boolean;
  createdAt: string;
}

export function getAgtronRoastLevel(agtron: number, customName?: string): string {
  if (customName && customName.trim()) {
    return customName;
  }
  if (agtron >= 80) return 'LIGHT Roast';
  if (agtron >= 70) return 'CINNAMON Roast';
  if (agtron >= 60) return 'MEDIUM Roast';
  if (agtron >= 50) return 'CITY Roast';
  if (agtron >= 45) return 'FULL CITY Roast';
  if (agtron >= 35) return 'FRENCH Roast';
  return 'ITALIAN Roast';
}

export interface BrewEvaluation {
  id: number;
  recipeId: number; // 대상 레시피 ID
  recipeTitle: string;
  brewMethod: string;
  beanName: string; // 사용한 원두 명칭
  roastLevel: '약배전' | '중약배전' | '중배전' | '중강배전' | '강배전';
  rating: number; // 1 ~ 5 점 (종합 점수)
  acidity: number; // 산미 (1~5)
  sweetness: number; // 단맛 (1~5)
  body: number; // 바디감 (1~5)
  bitterness: number; // 쓴맛 (1~5)
  aftertaste: number; // 깔끔함/후미 (1~5)
  tastingNotes: string[]; // 시음 노트 태그
  evalDate: string; // YYYY-MM-DD
  memo: string; // 종합 평 및 다음 추출 피드백
}

