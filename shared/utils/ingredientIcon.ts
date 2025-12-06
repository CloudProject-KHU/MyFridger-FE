/**
 * 재료 아이콘 컴포넌트 유틸리티
 * - 재료 정보로부터 적절한 아이콘 컴포넌트 반환
 * - iconId가 있으면 해당 아이콘, 없으면 카테고리 기본 아이콘 사용
 */

import { INGREDIENT_ICON_COMPONENTS } from '@/shared/constants/ingredientIconComponents';
import { INGREDIENT_ICON_CATEGORY_MAP } from '@/shared/constants/ingredientIcons';
import type { Ingredient } from '@features/ingredients/types';

export function getIngredientIconId(ingredient: Ingredient): string {
  if (ingredient.iconId && INGREDIENT_ICON_COMPONENTS[ingredient.iconId]) {
    return ingredient.iconId;
  }

  if (ingredient.category) {
    const categoryConfig = INGREDIENT_ICON_CATEGORY_MAP[ingredient.category];
    if (categoryConfig) {
      const fallbackId = categoryConfig.defaultIconId;
      if (INGREDIENT_ICON_COMPONENTS[fallbackId]) {
        return fallbackId;
      }
    }
  }

  return 'etc';
}

export function getIngredientIconComponent(ingredient: Ingredient) {
  const iconId = getIngredientIconId(ingredient);
  return INGREDIENT_ICON_COMPONENTS[iconId];
}

