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
  { label: '집밥', value: 'home_meal' },
];

export const INGREDIENT_CATEGORY_LABELS: Record<string, string> = INGREDIENT_CATEGORY_OPTIONS.reduce(
  (acc, option) => {
    acc[option.value] = option.label;
    return acc;
  },
  {} as Record<string, string>,
);



