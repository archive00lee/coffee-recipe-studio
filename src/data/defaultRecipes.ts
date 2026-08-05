import { CoffeeRecipe } from '../types';

export const defaultRecipes: CoffeeRecipe[] = [
  {
    id: 1,
    title: '에어로프레스 인버티드 (AeroPress Inverted)',
    brewMethod: '에어로프레스',
    filterType: '기본 1장',
    capType: '기본',
    beanAmountGrams: 16,
    waterAmountMl: 200,
    ratioText: '원두 16g / 물 200ml (1:12.5)',
    waterTempCelsius: 88,
    grindSizeMicrons: 600,
    totalTimeSeconds: 120,
    desc: '역방향(Inverted) 세팅으로 침출 후 프레스하여 오일감과 바디감이 풍부한 커피를 추출합니다.',
    isFavorite: true,
    createdAt: '2026-08-01',
    steps: [
      {
        id: 'step-1',
        phaseName: '침출 과정',
        waterAmountGrams: 200,
        durationSeconds: 90,
        description: '역방향으로 세운 에어로프레스에 16g 원두와 88℃ 물 200ml를 넣고 10회 저어줍니다.'
      },
      {
        id: 'step-2',
        phaseName: '플런징 (Press)',
        waterAmountGrams: 200,
        durationSeconds: 30,
        description: '필터캡을 결합 후 뒤집어 서버 위에 놓은 뒤 30초간 균일한 힘으로 천천히 눌러 추출합니다.'
      }
    ]
  },
  {
    id: 2,
    title: '하리오 V60 02 표준 푸어오버',
    brewMethod: 'Hario v60 02',
    filterType: 'hario 02 기본',
    beanAmountGrams: 20,
    waterAmountMl: 300,
    ratioText: '원두 20g / 물 300ml (1:15)',
    waterTempCelsius: 93,
    grindSizeMicrons: 800,
    totalTimeSeconds: 150,
    desc: '화려한 아로마와 산뜻한 산미를 극대화하는 표준 V60 4:6 추출법입니다. 깔끔한 여운을 선사합니다.',
    isFavorite: true,
    createdAt: '2026-08-02',
    steps: [
      {
        id: 'step-1',
        phaseName: '뜸들이기 (Bloom)',
        waterAmountGrams: 60,
        durationSeconds: 45,
        description: '원두 가루 전체를 적시도록 60g의 물을 나선형으로 푸어링하고 뜸을 들입니다.'
      },
      {
        id: 'step-2',
        phaseName: '1차 추출 (1st Pour)',
        waterAmountGrams: 120,
        durationSeconds: 40,
        description: '중앙에서 바깥쪽으로 부드럽게 원을 그리며 누적 120g까지 물을 붓습니다.'
      },
      {
        id: 'step-3',
        phaseName: '2차 추출 (2nd Pour)',
        waterAmountGrams: 300,
        durationSeconds: 65,
        description: '남은 물을 일정 수위로 유지하며 누적 300g까지 채우고 모두 빠질 때까지 기다립니다.'
      }
    ]
  },
  {
    id: 3,
    title: '하리오 스위치 하이브리드 추출',
    brewMethod: 'Hario swich 02',
    filterType: 'SIBARIST',
    beanAmountGrams: 18,
    waterAmountMl: 280,
    ratioText: '원두 18g / 물 280ml (1:15.5)',
    waterTempCelsius: 92,
    grindSizeMicrons: 750,
    totalTimeSeconds: 160,
    desc: '스위치를 닫고 침출 후 오픈하여 안정적인 수율과 풍부한 단맛을 확보하는 하이브리드 추출법입니다.',
    isFavorite: true,
    createdAt: '2026-08-03',
    steps: [
      {
        id: 'step-1',
        phaseName: '스위치 CLOSED 침출',
        waterAmountGrams: 150,
        durationSeconds: 60,
        description: '스위치를 닫은 상태에서 150g의 물을 붓고 1분간 침출합니다.'
      },
      {
        id: 'step-2',
        phaseName: '스위치 OPEN 드립',
        waterAmountGrams: 280,
        durationSeconds: 100,
        description: '스위치를 열어 물을 빼낸 뒤 나머지 물을 채워 추출을 마칩니다.'
      }
    ]
  },
  {
    id: 4,
    title: 'Hario Neo 02 아바카 필터 레시피',
    brewMethod: 'Hario Neo 02',
    filterType: '카펙 아바카 th3',
    beanAmountGrams: 18,
    waterAmountMl: 270,
    ratioText: '원두 18g / 물 270ml (1:15)',
    waterTempCelsius: 94,
    grindSizeMicrons: 780,
    totalTimeSeconds: 135,
    desc: '고속 유량의 카펙 아바카 TH3 필터를 활용하여 밝은 아로마와 명확한 컵 노트 표현.',
    isFavorite: false,
    createdAt: '2026-08-04',
    steps: [
      {
        id: 'step-1',
        phaseName: '뜸들이기',
        waterAmountGrams: 50,
        durationSeconds: 35,
        description: '50g 골고루 붓고 뜸들이기.'
      },
      {
        id: 'step-2',
        phaseName: '주 추출',
        waterAmountGrams: 270,
        durationSeconds: 100,
        description: '중심 위주 부드러운 유량으로 푸어링.'
      }
    ]
  },
  {
    id: 5,
    title: 'UFO 드리퍼 시그니처 드립',
    brewMethod: 'UFO',
    filterType: 'ufo 기본',
    beanAmountGrams: 20,
    waterAmountMl: 320,
    ratioText: '원두 20g / 물 320ml (1:16)',
    waterTempCelsius: 92,
    grindSizeMicrons: 850,
    totalTimeSeconds: 140,
    desc: 'UFO 드리퍼 특유의 균일한 유출구 설계와 Dedicated 필터로 단맛과 클린컵을 극대화합니다.',
    isFavorite: false,
    createdAt: '2026-08-04',
    steps: [
      {
        id: 'step-1',
        phaseName: '뜸들이기',
        waterAmountGrams: 60,
        durationSeconds: 40,
        description: '60g 원형 푸어링으로 디개싱.'
      },
      {
        id: 'step-2',
        phaseName: '완성 푸어링',
        waterAmountGrams: 320,
        durationSeconds: 100,
        description: '320g까지 센터 위주 수위 유지 푸어링.'
      }
    ]
  }
];
