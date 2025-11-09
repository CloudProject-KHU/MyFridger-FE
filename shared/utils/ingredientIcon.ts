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

