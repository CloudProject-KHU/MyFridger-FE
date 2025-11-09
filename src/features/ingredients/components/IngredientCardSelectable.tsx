import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Ingredient } from '@features/ingredients/types';

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
  return (
    <Pressable
      style={[styles.container, selected && styles.selected]}
      onPress={() => onPress?.(ingredient)}>
      <Text style={styles.name}>{ingredient.name}</Text>
      {ingredient.category && <Text style={styles.category}>{ingredient.category}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    gap: 4,
  },
  selected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  category: {
    fontSize: 12,
    color: '#666',
  },
});
