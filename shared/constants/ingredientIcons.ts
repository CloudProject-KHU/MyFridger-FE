/**
 * 재료 아이콘 데이터 상수
 * - 카테고리별 아이콘 목록 정의
 * - 각 카테고리의 기본 아이콘 지정
 */

export type IngredientIconEntry = {
  id: string;
  name: string;
};

export type IngredientIconCategory = {
  value: string;
  label: string;
  defaultIconId: string;
  items: IngredientIconEntry[];
};

export const INGREDIENT_ICON_CATEGORIES: IngredientIconCategory[] = [
  {
    value: 'vegetable',
    label: '채소',
    defaultIconId: 'vegetable',
    items: [
      { id: 'avocado', name: '아보카도' },
      { id: 'broccoli', name: '브로콜리' },
      { id: 'cabbage', name: '양배추' },
      { id: 'carrot', name: '당근' },
      { id: 'chili', name: '고추' },
      { id: 'corn', name: '옥수수' },
      { id: 'cucumber', name: '오이' },
      { id: 'eggplant', name: '가지' },
      { id: 'lettuce', name: '상추' },
      { id: 'mushroom', name: '버섯' },
      { id: 'onion', name: '양파' },
      { id: 'potato', name: '감자' },
      { id: 'pumpkin', name: '호박' },
      { id: 'radish', name: '무' },
      { id: 'sweet_potato', name: '고구마' },
      { id: 'tomato', name: '토마토' },
      { id: 'vegetable', name: '채소 모음' },
      { id: 'zucchini', name: '애호박' },
      { id: 'garlic', name: '마늘' },
      { id: 'kimchi', name: '김치' },
      // 새로 추가된 채소
      { id: 'scallion', name: '대파' },
      { id: 'chive', name: '쪽파' },
      { id: 'celery', name: '샐러리' },
      { id: 'bell_pepper', name: '파프리카' },
      { id: 'asparagus', name: '아스파라거스' },
      { id: 'basil', name: '바질' },
      { id: 'cilantro', name: '고수' },
      { id: 'spinach', name: '시금치' },
      { id: 'napa_cabbage', name: '알배추' },
      { id: 'parsley', name: '파슬리' },
      { id: 'water_dropwort', name: '미나리' },
      { id: 'garlic_chive', name: '부추' },
      { id: 'bean_sprout', name: '콩나물' },
      { id: 'mung_bean_sprout', name: '숙주' },
      { id: 'perilla_leaf', name: '깻잎' },
    ],
  },
  {
    value: 'fruit',
    label: '과일',
    defaultIconId: 'fruit',
    items: [
      { id: 'apple', name: '사과' },
      { id: 'banana', name: '바나나' },
      { id: 'fruit', name: '과일 모음' },
      { id: 'grape', name: '포도' },
      { id: 'kiwi', name: '키위' },
      { id: 'lemon', name: '레몬' },
      { id: 'lime', name: '라임' },
      { id: 'mango', name: '망고' },
      { id: 'melon', name: '멜론' },
      { id: 'orange', name: '오렌지' },
      { id: 'tangerine', name: '귤' },
      { id: 'peach', name: '복숭아' },
      { id: 'pear', name: '배' },
      { id: 'pineapple', name: '파인애플' },
      { id: 'strawberry', name: '딸기' },
      { id: 'watermelon', name: '수박' },
      // 새로 추가된 과일
      { id: 'grapefruit', name: '자몽' },
      { id: 'blueberry', name: '블루베리' },
      { id: 'raspberry', name: '라즈베리' },
      { id: 'cranberry', name: '크랜베리' },
      { id: 'persimmon', name: '감' },
      { id: 'plum', name: '자두' },
      { id: 'pomegranate', name: '석류' },
      { id: 'dragon_fruit', name: '용과' },
      { id: 'coconut', name: '코코넛' },
    ],
  },
  {
    value: 'meat',
    label: '고기류',
    defaultIconId: 'beef',
    items: [
      { id: 'beef', name: '소고기' },
      { id: 'chicken', name: '닭고기' },
      { id: 'duck', name: '오리고기' },
      { id: 'lamb', name: '양고기' },
      { id: 'pork', name: '돼지고기' },
      { id: 'sausage', name: '소시지' },
      // 새로 추가된 고기류
      { id: 'bacon', name: '베이컨' },
      { id: 'ham', name: '햄' },
      { id: 'beef_brisket', name: '차돌박이' },
      { id: 'beef_tenderloin', name: '안심' },
      { id: 'beef_sirloin', name: '등심' },
      { id: 'chicken_thigh', name: '닭다리살' },
      { id: 'chicken_breast', name: '닭가슴살' },
      { id: 'pork_belly', name: '삼겹살' },
      { id: 'pork_jowl', name: '항정살' },
      { id: 'pork_neck', name: '목살' },
    ],
  },
  {
    value: 'seafood',
    label: '해산물',
    defaultIconId: 'fish',
    items: [
      { id: 'clam', name: '조개' },
      { id: 'crab', name: '게' },
      { id: 'fish', name: '생선' },
      { id: 'lobster', name: '랍스터' },
      { id: 'seaweed', name: '미역' },
      { id: 'shrimp', name: '새우' },
      { id: 'squid', name: '오징어' },
      // 새로 추가된 해산물
      { id: 'mussel', name: '홍합' },
      { id: 'scallop', name: '가리비' },
      { id: 'salmon', name: '연어' },
      { id: 'abalone', name: '전복' },
      { id: 'anchovy', name: '멸치' },
      { id: 'kelp', name: '다시마' },
      { id: 'octopus', name: '낙지' },
      { id: 'octopus_large', name: '문어' },
    ],
  },
  {
    value: 'dairy_processed',
    label: '유제품/가공',
    defaultIconId: 'dairy_processed',
    items: [
      { id: 'butter', name: '버터' },
      { id: 'cheese', name: '치즈' },
      { id: 'dairy_processed', name: '유제품/가공 모음' },
      { id: 'egg', name: '달걀' },
      { id: 'milk', name: '우유' },
      { id: 'tofu', name: '두부' },
      { id: 'dumpling', name: '만두' },
      // 새로 추가된 유제품/가공
      { id: 'yogurt', name: '요거트' },
      { id: 'greek_yogurt', name: '그릭요거트' },
      { id: 'whipping_cream', name: '생크림' },
      { id: 'cream_cheese', name: '크림치즈' },
      { id: 'cheddar_cheese', name: '체다치즈' },
      { id: 'tuna_can', name: '참치캔' },
    ],
  },
  {
    value: 'seasoning',
    label: '양념/조미료',
    defaultIconId: 'seasoning',
    items: [
      { id: 'ketchup', name: '케첩' },
      { id: 'mustard', name: '머스터드' },
      { id: 'salt', name: '소금' },
      { id: 'seasoning', name: '조미료 모음' },
      { id: 'sesame_oil', name: '참기름' },
      { id: 'soy_sauce', name: '간장' },
      { id: 'sugar', name: '설탕' },
      // 새로 추가된 양념/조미료
      { id: 'pepper', name: '후추' },
      { id: 'red_pepper_powder', name: '고춧가루' },
      { id: 'gochujang', name: '고추장' },
      { id: 'doenjang', name: '된장' },
      { id: 'vinegar', name: '식초' },
      { id: 'oyster_sauce', name: '굴소스' },
      { id: 'mayonnaise', name: '마요네즈' },
      { id: 'sriracha', name: '스리라차' },
      { id: 'chili_oil', name: '고춧기름' },
      { id: 'sesame', name: '참깨' },
      { id: 'curry_powder', name: '카레가루' },
    ],
  },
  {
    value: 'etc',
    label: '기타',
    defaultIconId: 'etc',
    items: [{ id: 'etc', name: '기타' }],
  },
  {
    value: 'homemade',
    label: '집밥',
    defaultIconId: 'homemade',
    items: [{ id: 'homemade', name: '집밥 아이콘' }],
  },
];

export const INGREDIENT_ICON_CATEGORY_MAP = INGREDIENT_ICON_CATEGORIES.reduce<
  Record<string, IngredientIconCategory>
>((acc, category) => {
  acc[category.value] = category;
  return acc;
}, {});

