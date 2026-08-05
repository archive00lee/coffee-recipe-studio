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

export function formatSecondsToMinSec(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0초';
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins > 0 && secs > 0) {
    return `${mins}분 ${secs}초`;
  } else if (mins > 0) {
    return `${mins}분`;
  } else {
    return `${secs}초`;
  }
}

export function formatTimeDigital(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export interface BeanInfo {
  id: number;
  name: string; // 원두/제품명
  roastery: string; // 로스터리 명칭
  origin?: string; // 원산지/농장/가공방식
  agtronNumber: number; // Agtron 배전도 (25~95)
  roastLevel: string; // 로스팅 레벨 (e.g. LIGHT Roast, MEDIUM Roast)
  price: number; // 가격 (원)
  weightGrams: number; // 용량 (g)
  purchaseUrl?: string; // 구매 사이트 URL
  flavorNotes?: string[]; // 컵 노트 / 센서리 노특
  description?: string; // 원두 설명 및 메모
  createdAt: string;
}

export interface BrewEvaluation {
  id: number;
  recipeId: number; // 대상 레시피 ID
  recipeTitle: string;
  brewMethod: string;
  beanName: string; // 사용한 원두 명칭
  roastLevel: string; // e.g., 'LIGHT Roast', 'MEDIUM Roast', '약배전', '중배전'
  agtronNumber?: number; // Agtron 배전도 (25~95)
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

