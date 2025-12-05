import React from 'react';
import { View } from 'react-native';

import { Ingredient } from '@features/ingredients/types';
import IngredientCard from './IngredientCard';

export type IngredientCardSelectableProps = {
  ingredient: Ingredient;
  selected?: boolean;
  onPress?: (ingredient: Ingredient) => void;
};

export default function IngredientCardSelectable({
  ingredient,
  selected = false,
  onPress,
}: IngredientCardSelectableProps) {
  const subtitle =
    ingredient.expiresAt != null && ingredient.expiresAt.length > 0
      ? `${ingredient.expiresAt} 남음`
      : '소비기한을 입력하세요.';

  return (
    <IngredientCard
      ingredient={ingredient}
      selected={selected}
      onPress={() => onPress?.(ingredient)}
      secondaryText={subtitle}
      accessory={<View />}
    />
  );
}
