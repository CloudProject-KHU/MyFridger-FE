import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ingredient } from '@features/ingredients/types';
import { getIngredientIconComponent } from '@/shared/utils/ingredientIcon';

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
        added && styles.addedOverlay,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={styles.iconWrapper}>
        {IconComponent ? <IconComponent width={52} height={52} /> : null}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {ingredient.name}
      </Text>
      {added ? (
        <View style={styles.addedBadge}>
          <Text style={styles.overlayText}>{'이미\n추가됨'}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DBDBDB',
    //backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  selected: {
    borderColor: '#999999',
    backgroundColor: '#DBDBDB',
  },
  pressed: {
    opacity: 0.9,
  },
  addedOverlay: {
    borderColor: '#111827',
    backgroundColor: '#1F293780',
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111111',
  },
  addedBadge: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 16,
  },
});


