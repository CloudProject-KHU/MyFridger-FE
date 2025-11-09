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
      { id: 'mango', name: '망고' },
      { id: 'melon', name: '멜론' },
      { id: 'orange', name: '오렌지' },
      { id: 'peach', name: '복숭아' },
      { id: 'pear', name: '배' },
      { id: 'pineapple', name: '파인애플' },
      { id: 'strawberry', name: '딸기' },
      { id: 'watermelon', name: '수박' },
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

