/**
 * 재료 카테고리 상수 및 유틸리티
 * - 카테고리 옵션 정의
 * - 재료 이름 → 카테고리 매핑
 * - 재료 이름 → 유통기한 매핑
 * - 카테고리 추정 함수
 */

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
  // 새로 추가된 채소
  '대파': 'vegetable',
  '쪽파': 'vegetable',
  '샐러리': 'vegetable',
  '파프리카': 'vegetable',
  '아스파라거스': 'vegetable',
  '바질': 'vegetable',
  '고수': 'vegetable',
  '시금치': 'vegetable',
  '알배추': 'vegetable',
  '파슬리': 'vegetable',
  '미나리': 'vegetable',
  '부추': 'vegetable',
  '콩나물': 'vegetable',
  '숙주': 'vegetable',
  '깻잎': 'vegetable',
  '청양고추': 'vegetable',
  
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
  // 새로 추가된 과일
  '자몽': 'fruit',
  '블루베리': 'fruit',
  '라즈베리': 'fruit',
  '크랜베리': 'fruit',
  '감': 'fruit',
  '자두': 'fruit',
  '석류': 'fruit',
  '용과': 'fruit',
  '코코넛': 'fruit',
  '라임': 'fruit',
  '귤': 'fruit',
  
  // 고기류 (meat)
  '소고기': 'meat',
  '닭고기': 'meat',
  '오리고기': 'meat',
  '양고기': 'meat',
  '돼지고기': 'meat',
  '소시지': 'meat',
  // 새로 추가된 고기류
  '베이컨': 'meat',
  '햄': 'meat',
  '차돌박이': 'meat',
  '안심': 'meat',
  '등심': 'meat',
  '닭다리살': 'meat',
  '닭가슴살': 'meat',
  '삼겹살': 'meat',
  '항정살': 'meat',
  '목살': 'meat',
  
  // 해산물 (seafood)
  '조개': 'seafood',
  '게': 'seafood',
  '생선': 'seafood',
  '랍스터': 'seafood',
  '미역': 'seafood',
  '새우': 'seafood',
  '오징어': 'seafood',
  // 새로 추가된 해산물
  '홍합': 'seafood',
  '가리비': 'seafood',
  '연어': 'seafood',
  '전복': 'seafood',
  '멸치': 'seafood',
  '다시마': 'seafood',
  '낙지': 'seafood',
  '문어': 'seafood',
  '황태': 'seafood',
  
  // 유제품/가공 (dairy_processed)
  '버터': 'dairy_processed',
  '치즈': 'dairy_processed',
  '달걀': 'dairy_processed',
  '우유': 'dairy_processed',
  '두부': 'dairy_processed',
  '만두': 'dairy_processed',
  // 새로 추가된 유제품/가공
  '요거트': 'dairy_processed',
  '그릭요거트': 'dairy_processed',
  '생크림': 'dairy_processed',
  '크림치즈': 'dairy_processed',
  '체다치즈': 'dairy_processed',
  '참치캔': 'dairy_processed',
  
  // 양념/조미료 (seasoning)
  '케첩': 'seasoning',
  '머스터드': 'seasoning',
  '소금': 'seasoning',
  '참기름': 'seasoning',
  '간장': 'seasoning',
  '설탕': 'seasoning',
  // 새로 추가된 양념/조미료
  '후추': 'seasoning',
  '고춧가루': 'seasoning',
  '고추장': 'seasoning',
  '된장': 'seasoning',
  '식초': 'seasoning',
  '굴소스': 'seasoning',
  '마요네즈': 'seasoning',
  '스리라차': 'seasoning',
  '고춧기름': 'seasoning',
  '참깨': 'seasoning',
  '카레가루': 'seasoning',
  '다진마늘': 'seasoning',
  // 추가 조미료
  '꿀': 'seasoning',
  '까나리액젓': 'seasoning',
  '굵은소금': 'seasoning',
  '깨소금': 'seasoning',
  '데리야끼소스': 'seasoning',
  '돈까스소스': 'seasoning',
  '멸치액젓': 'seasoning',
  '물엿': 'seasoning',
  '미원': 'seasoning',
  '다시다': 'seasoning',
  '쌈장': 'seasoning',
  '올리고당': 'seasoning',
  '올리브유': 'seasoning',
  '짜강가루': 'seasoning',
  '청국장': 'seasoning',
  '초고추장': 'seasoning',
  '춘장': 'seasoning',
  '칠리소스': 'seasoning',
  '핫소스': 'seasoning',
};

// 재료 이름으로 카테고리를 찾는 헬퍼 함수
export function getCategoryByIngredientName(name: string): string | undefined {
  return INGREDIENT_NAME_TO_CATEGORY[name];
}

// 키워드 기반으로 카테고리 추정 (정확한 매칭이 없을 때 사용)
function guessCategoryByKeyword(name: string): string {
  const nameLower = name.toLowerCase();
  
  // 고기류 (meat)
  if (nameLower.includes('고기') || nameLower.includes('닭') || nameLower.includes('돼지') || nameLower.includes('소고기') || nameLower.includes('오리') || nameLower.includes('양고기') ||
      nameLower.includes('베이컨') || nameLower.includes('햄') || nameLower.includes('차돌박이') || nameLower.includes('안심') || nameLower.includes('등심') || 
      nameLower.includes('닭다리살') || nameLower.includes('닭가슴살') || nameLower.includes('삼겹살') || nameLower.includes('항정살') || nameLower.includes('목살')) {
    return 'meat';
  }
  
  // 해산물 (seafood)
  if (nameLower.includes('생선') || nameLower.includes('참치') || nameLower.includes('게') || nameLower.includes('새우') || nameLower.includes('조개') || nameLower.includes('오징어') ||
      nameLower.includes('홍합') || nameLower.includes('가리비') || nameLower.includes('연어') || nameLower.includes('전복') || nameLower.includes('멸치') || 
      nameLower.includes('다시마') || nameLower.includes('낙지') || nameLower.includes('문어') || nameLower.includes('황태')) {
    return 'seafood';
  }
  
  // 유제품/가공 (dairy_processed)
  if (nameLower.includes('두부') || nameLower.includes('요거트') || nameLower.includes('우유') || nameLower.includes('치즈') || nameLower.includes('버터') || nameLower.includes('달걀') || nameLower.includes('계란') ||
      nameLower.includes('그릭요거트') || nameLower.includes('생크림') || nameLower.includes('크림치즈') || nameLower.includes('체다치즈') || nameLower.includes('참치캔')) {
    return 'dairy_processed';
  }
  
  // 양념/조미료 (seasoning)
  if (nameLower.includes('간장') || nameLower.includes('소금') || nameLower.includes('설탕') || nameLower.includes('참기름') || nameLower.includes('고추장') || nameLower.includes('된장') || nameLower.includes('청국장') ||
      nameLower.includes('후추') || nameLower.includes('고춧가루') || nameLower.includes('굴소스') || nameLower.includes('마요네즈') || nameLower.includes('스리라차') || 
      nameLower.includes('고춧기름') || nameLower.includes('참깨') || nameLower.includes('검은깨') || nameLower.includes('깨') || nameLower.includes('카레가루') || nameLower.includes('식초') || nameLower.includes('다진마늘') ||
      nameLower.includes('꿀') || nameLower.includes('까나리액젓') || nameLower.includes('굵은소금') || nameLower.includes('깨소금') || nameLower.includes('데리야끼') || nameLower.includes('돈까스소스') ||
      nameLower.includes('멸치액젓') || nameLower.includes('물엿') || nameLower.includes('미원') || nameLower.includes('다시다') || nameLower.includes('쌈장') || nameLower.includes('올리고당') ||
      nameLower.includes('올리브유') || nameLower.includes('짜강가루') || nameLower.includes('초고추장') || nameLower.includes('춘장') || nameLower.includes('칠리소스') || nameLower.includes('핫소스')) {
    return 'seasoning';
  }
  
  // 채소 (vegetable)
  if (nameLower.includes('감자') || nameLower.includes('당근') || nameLower.includes('양파') || nameLower.includes('대파') || nameLower.includes('브로콜리') || nameLower.includes('상추') || nameLower.includes('토마토') ||
      nameLower.includes('쪽파') || nameLower.includes('샐러리') || nameLower.includes('파프리카') || nameLower.includes('아스파라거스') || nameLower.includes('바질') || nameLower.includes('고수') || 
      nameLower.includes('시금치') || nameLower.includes('알배추') || nameLower.includes('파슬리') || nameLower.includes('미나리') || nameLower.includes('부추') || 
      nameLower.includes('콩나물') || nameLower.includes('숙주') || nameLower.includes('깻잎')) {
    return 'vegetable';
  }
  
  // 과일 (fruit)
  if (nameLower.includes('사과') || nameLower.includes('바나나') || nameLower.includes('딸기') || nameLower.includes('오렌지') ||
      nameLower.includes('자몽') || nameLower.includes('블루베리') || nameLower.includes('라즈베리') || nameLower.includes('크랜베리') || nameLower.includes('감') || 
      nameLower.includes('자두') || nameLower.includes('석류') || nameLower.includes('용과') || nameLower.includes('코코넛') || nameLower.includes('라임') || nameLower.includes('귤')) {
    return 'fruit';
  }
  
  return 'etc';
}

// 재료 이름으로 카테고리를 찾거나 추정하는 함수
// 1. 정확한 매칭을 먼저 시도
// 2. 없으면 키워드 기반으로 추정
// 3. 둘 다 없으면 'etc' 반환
export function getCategoryByIngredientNameOrGuess(name: string): string {
  // 정확한 매칭 먼저 시도
  const exactMatch = getCategoryByIngredientName(name);
  if (exactMatch) {
    return exactMatch;
  }
  
  // 키워드 기반 추정
  return guessCategoryByKeyword(name);
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
  // 새로 추가된 채소
  '대파': 14,
  '쪽파': 5,
  '샐러리': 21,
  '파프리카': 14,
  '아스파라거스': 5,
  '바질': 5,
  '고수': 5,
  '시금치': 5,
  '알배추': 21,
  '파슬리': 5,
  '미나리': 4,
  '부추': 4,
  '콩나물': 3,
  '숙주': 3,
  '깻잎': 14,
  '청양고추': 10,

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
  // 새로 추가된 과일
  '자몽': 21,
  '블루베리': 14,
  '라즈베리': 5,
  '크랜베리': 28,
  '감': 7,
  '자두': 14,
  '석류': 28,
  '용과': 14,
  '코코넛': 14,
  '라임': 21,
  '귤': 14,

  // 고기류 (meat) - 냉장 기준
  '소고기': 3,
  '닭고기': 2,
  '오리고기': 2,
  '양고기': 3,
  '돼지고기': 3,
  '소시지': 7,
  // 새로 추가된 고기류
  '베이컨': 7,
  '햄': 7,
  '차돌박이': 3,
  '안심': 3,
  '등심': 3,
  '닭다리살': 2,
  '닭가슴살': 2,
  '삼겹살': 3,
  '항정살': 3,
  '목살': 3,

  // 해산물 (seafood)
  '조개': 1,
  '게': 2,
  '생선': 2,
  '랍스터': 2,
  '미역': 30,
  '새우': 2,
  '오징어': 2,
  // 새로 추가된 해산물
  '홍합': 3,
  '가리비': 3,
  '연어': 2,
  '전복': 3,
  '멸치': 180,
  '다시마': 365,
  '낙지': 2,
  '문어': 2,
  '황태': 180,

  // 유제품/가공 (dairy_processed)
  '버터': 60,
  '치즈': 30,
  '달걀': 21,
  '우유': 7,
  '두부': 7,
  '만두': 30,
  // 새로 추가된 유제품/가공
  '요거트': 21,
  '그릭요거트': 21,
  '생크림': 7,
  '크림치즈': 28,
  '체다치즈': 42,
  '참치캔': 1095,

  // 양념/조미료 (seasoning)
  '케첩': 90,
  '머스터드': 90,
  '소금': 365,
  '참기름': 90,
  '간장': 180,
  '설탕': 365,
  // 새로 추가된 양념/조미료
  '후추': 1095,
  '고춧가루': 180,
  '고추장': 180,
  '된장': 365,
  '식초': 9999,
  '굴소스': 180,
  '마요네즈': 60,
  '스리라차': 180,
  '고춧기름': 180,
  '참깨': 180,
  '카레가루': 365,
  '다진마늘': 30,
  // 추가 조미료
  '꿀': 365,
  '까나리액젓': 180,
  '굵은소금': 365,
  '깨소금': 180,
  '데리야끼소스': 180,
  '돈까스소스': 180,
  '멸치액젓': 180,
  '물엿': 365,
  '미원': 365,
  '다시다': 365,
  '쌈장': 180,
  '올리고당': 365,
  '올리브유': 180,
  '짜강가루': 365,
  '청국장': 180,
  '초고추장': 180,
  '춘장': 180,
  '칠리소스': 180,
  '핫소스': 180,
};

// 재료 이름으로 유통기한 일수를 찾는 헬퍼 함수
export function getExpiryDaysByIngredientName(name: string): number | undefined {
  return INGREDIENT_NAME_TO_EXPIRY_DAYS[name];
}
