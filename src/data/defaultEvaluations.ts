import { BrewEvaluation } from '../types';

export const defaultEvaluations: BrewEvaluation[] = [
  {
    id: 101,
    recipeId: 2,
    recipeTitle: '하리오 V60 02 표준 푸어오버',
    brewMethod: 'Hario v60 02',
    beanName: '에티오피아 예가체프 아리차 내추럴',
    roastLevel: '약배전',
    rating: 5,
    acidity: 5,
    sweetness: 4,
    body: 3,
    bitterness: 1,
    aftertaste: 5,
    tastingNotes: ['자스민', '복숭아', '시트러스', '홍차'],
    evalDate: '2026-08-03',
    memo: '산미와 화려한 플로럴 아로마가 선명하게 살아남. 후미가 아주 클린하고 단맛과의 균형이 훌륭함.'
  },
  {
    id: 102,
    recipeId: 1,
    recipeTitle: '에어로프레스 인버티드 (AeroPress Inverted)',
    brewMethod: '에어로프레스',
    beanName: '콜롬비아 수프리모 핑크 보르본',
    roastLevel: '중약배전',
    rating: 4,
    acidity: 3,
    sweetness: 5,
    body: 4,
    bitterness: 2,
    aftertaste: 4,
    tastingNotes: ['밀크초콜릿', '자두', '카라멜'],
    evalDate: '2026-08-04',
    memo: '바디감이 묵직하고 단맛 표현이 우수함. 다음 추출 시 분쇄도를 20μm 살짝 가늘게 조절해봐도 좋을 듯.'
  }
];
