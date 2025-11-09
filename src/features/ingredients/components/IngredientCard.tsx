import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Ingredient } from '@features/ingredients/types';

export type IngredientCardProps = {
  ingredient: Ingredient;
};

export default function IngredientCard({ ingredient }: IngredientCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{ingredient.name}</Text>
      {ingredient.category && <Text style={styles.category}>{ingredient.category}</Text>}
      {ingredient.expiresAt && <Text style={styles.expireLabel}>유통기한 {ingredient.expiresAt}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  expireLabel: {
    fontSize: 13,
    color: '#ef4444',
  },
});
