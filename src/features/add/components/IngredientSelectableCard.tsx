import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getIngredientIconComponent } from '@/shared/utils/ingredientIcon';
import { Ingredient } from '@features/ingredients/types';

export type IngredientSelectableCardProps = {
  ingredient: Ingredient;
  selected?: boolean;
  disabled?: boolean;
  added?: boolean;
  onPress?: (ingredient: Ingredient) => void;
};

export default function IngredientSelectableCard({
  ingredient,
  selected = false,
  disabled = false,
  added = false,
  onPress,
}: IngredientSelectableCardProps) {
  const IconComponent = getIngredientIconComponent(ingredient);

  const handlePress = () => {
    if (disabled || added) return;
    onPress?.(ingredient);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        selected && styles.selected,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={[styles.iconWrapper, added && styles.iconWrapperAdded]}>
        {IconComponent ? <IconComponent width={38} height={38} /> : null}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {ingredient.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    //borderWidth: 1,
    borderColor: '#DBDBDB',
    //backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
    //gap: 8,
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  selected: {
    borderColor: '#999999',
    backgroundColor: '#FFF3E0',
  },
  pressed: {
    opacity: 0.9,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperAdded: {
    opacity: 0.08,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#36383E',
  },
});


