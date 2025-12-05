import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getIngredientIconComponent } from '@/shared/utils/ingredientIcon';
import { Ingredient } from '@features/ingredients/types';
import { CircleBadge } from '@shared/components/badges/CircleBadge';
import { INGREDIENT_CATEGORY_LABELS } from '@shared/constants/ingredientCategories';

type ExpireBadgeVariant = 'fresh' | 'medium' | 'warning';

function resolveCategoryLabel(category?: string) {
  if (!category) return undefined;
  return INGREDIENT_CATEGORY_LABELS[category] ?? category;
}

function resolveExpireBadgeVariant(expiresAt?: string): ExpireBadgeVariant | undefined {
  if (!expiresAt) return undefined;

  const ddayMatch = /^D([+-]?)(\d+)$/.exec(expiresAt.trim());
  if (ddayMatch) {
    const sign = ddayMatch[1];
    const value = Number(ddayMatch[2]);
    const days = sign === '+' ? -value : value;
    // 3일 이하: 빨강, 4~7일: 주황, 8일 이상: undefined (뱃지 표시 안 함)
    if (days <= 3) return 'warning';
    if (days <= 7) return 'medium';
    return undefined; // 8일 이상은 뱃지 표시 안 함
  }

  const targetDate = new Date(expiresAt);
  if (Number.isNaN(targetDate.getTime())) {
    return undefined;
  }

  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.ceil((targetDate.getTime() - now.getTime()) / msPerDay);

  // 3일 이하: 빨강, 4~7일: 주황, 8일 이상: undefined (뱃지 표시 안 함)
  if (diff <= 3) return 'warning';
  if (diff <= 7) return 'medium';
  return undefined; // 8일 이상은 뱃지 표시 안 함
}

export type IngredientCardProps = {
  ingredient: Ingredient;
  accessory?: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  secondaryText?: string;
};

export default function IngredientCard({
  ingredient,
  accessory,
  selected = false,
  onPress,
}: IngredientCardProps) {
  const badgeVariant = resolveExpireBadgeVariant(ingredient.expiresAt);
  const IconComponent = getIngredientIconComponent(ingredient);

  const content = (
    <>
      <View style={styles.iconWrapper}>
        {IconComponent ? <IconComponent width={38} height={38} /> : null}
      </View>
      <View style={styles.accessoryWrapper}>
        {accessory ? (
          <View style={styles.accessory}>{accessory}</View>
        ) : (
          badgeVariant && (
            <View style={styles.badgeWrapper}>
              <CircleBadge variant={badgeVariant} size={8} />
            </View>
          )
        )}
      </View>
      <Text style={styles.name}>{ingredient.name}</Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.container,
          selected && styles.selected,
          pressed && styles.pressed,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.container, selected && styles.selected]}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    //borderWidth: 1,
    borderColor: '#DBDBDB',
    alignItems: 'center',
    justifyContent: 'center',
    //gap: 1,
    position: 'relative',
  },
  selected: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF1F0',
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
  accessoryWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  accessory: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeWrapper: {
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#36383E',
    textAlign: 'center',
  },
});
