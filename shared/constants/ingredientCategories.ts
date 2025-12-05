export type IngredientCategoryOption = {
  label: string;
  value: string;
};

export const INGREDIENT_CATEGORY_OPTIONS: IngredientCategoryOption[] = [
  { label: '전체보기', value: 'all' },
  { label: '채소', value: 'vegetable' },
  { label: '과일', value: 'fruit' },
  { label: '고기류', value: 'meat' },
  { label: '해산물', value: 'seafood' },
  { label: '유제품/가공', value: 'dairy_processed' },
  { label: '양념/조미료', value: 'seasoning' },
  { label: '기타', value: 'etc' },
  { label: '집밥', value: 'homemade' },
];

export const INGREDIENT_CATEGORY_LABELS: Record<string, string> = INGREDIENT_CATEGORY_OPTIONS.reduce(
  (acc, option) => {
    acc[option.value] = option.label;
    return acc;
  },
  {} as Record<string, string>,
);

// 재료 이름을 카테고리로 매핑
// OCR로 인식된 재료 이름을 자동으로 카테고리에 매핑할 때 사용
export const INGREDIENT_NAME_TO_CATEGORY: Record<string, string> = {
  // 채소 (vegetable)
  '아보카도': 'vegetable',
  '브로콜리': 'vegetable',
  '양배추': 'vegetable',
  '당근': 'vegetable',
  '고추': 'vegetable',
  '옥수수': 'vegetable',
  '가지': 'vegetable',
  '상추': 'vegetable',
  '버섯': 'vegetable',
  '양파': 'vegetable',
  '감자': 'vegetable',
  '호박': 'vegetable',
  '무': 'vegetable',
  '고구마': 'vegetable',
  '토마토': 'vegetable',
  '애호박': 'vegetable',
  '마늘': 'vegetable',
  '김치': 'vegetable',
  
  // 과일 (fruit)
  '사과': 'fruit',
  '바나나': 'fruit',
  '포도': 'fruit',
  '키위': 'fruit',
  '레몬': 'fruit',
  '망고': 'fruit',
  '멜론': 'fruit',
  '오렌지': 'fruit',
  '복숭아': 'fruit',
  '배': 'fruit',
  '파인애플': 'fruit',
  '딸기': 'fruit',
  '수박': 'fruit',
  
  // 고기류 (meat)
  '소고기': 'meat',
  '닭고기': 'meat',
  '오리고기': 'meat',
  '양고기': 'meat',
  '돼지고기': 'meat',
  '소시지': 'meat',
  
  // 해산물 (seafood)
  '조개': 'seafood',
  '게': 'seafood',
  '생선': 'seafood',
  '랍스터': 'seafood',
  '미역': 'seafood',
  '새우': 'seafood',
  '오징어': 'seafood',
  
  // 유제품/가공 (dairy_processed)
  '버터': 'dairy_processed',
  '치즈': 'dairy_processed',
  '달걀': 'dairy_processed',
  '우유': 'dairy_processed',
  '두부': 'dairy_processed',
  '만두': 'dairy_processed',
  
  // 양념/조미료 (seasoning)
  '케첩': 'seasoning',
  '머스터드': 'seasoning',
  '소금': 'seasoning',
  '참기름': 'seasoning',
  '간장': 'seasoning',
  '설탕': 'seasoning',
};

// 재료 이름으로 카테고리를 찾는 헬퍼 함수
export function getCategoryByIngredientName(name: string): string | undefined {
  return INGREDIENT_NAME_TO_CATEGORY[name];
}

// 재료 이름을 유통기한(일수)로 매핑
// 집밥(homemade)과 기타(etc)는 제외
export const INGREDIENT_NAME_TO_EXPIRY_DAYS: Record<string, number> = {
  // 채소 (vegetable)
  '아보카도': 5,
  '브로콜리': 7,
  '양배추': 14,
  '당근': 21,
  '고추': 10,
  '옥수수': 3,
  '가지': 7,
  '상추': 5,
  '버섯': 7,
  '양파': 30,
  '감자': 60,
  '호박': 14,
  '무': 14,
  '고구마': 30,
  '토마토': 7,
  '애호박': 7,
  '마늘': 30,
  '김치': 30,

  // 과일 (fruit)
  '사과': 30,
  '바나나': 5,
  '포도': 7,
  '키위': 14,
  '레몬': 21,
  '망고': 7,
  '멜론': 7,
  '오렌지': 14,
  '복숭아': 5,
  '배': 14,
  '파인애플': 5,
  '딸기': 5,
  '수박': 7,

  // 고기류 (meat) - 냉장 기준
  '소고기': 3,
  '닭고기': 2,
  '오리고기': 2,
  '양고기': 3,
  '돼지고기': 3,
  '소시지': 7,

  // 해산물 (seafood)
  '조개': 1,
  '게': 2,
  '생선': 2,
  '랍스터': 2,
  '미역': 30,
  '새우': 2,
  '오징어': 2,

  // 유제품/가공 (dairy_processed)
  '버터': 60,
  '치즈': 30,
  '달걀': 21,
  '우유': 7,
  '두부': 7,
  '만두': 30,

  // 양념/조미료 (seasoning)
  '케첩': 90,
  '머스터드': 90,
  '소금': 365,
  '참기름': 90,
  '간장': 180,
  '설탕': 365,
};

// 재료 이름으로 유통기한 일수를 찾는 헬퍼 함수
export function getExpiryDaysByIngredientName(name: string): number | undefined {
  return INGREDIENT_NAME_TO_EXPIRY_DAYS[name];
}
