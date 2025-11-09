import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ingredient } from '@features/ingredients/types';
import { Badge } from '@shared/components/badges/Badge';
import { INGREDIENT_CATEGORY_LABELS } from '@shared/constants/ingredientCategories';
import { getIngredientIconComponent } from '@/shared/utils/ingredientIcon';

type ExpireBadge = {
  label: string;
  variant: Parameters<typeof Badge>[0]['variant'];
};

function resolveCategoryLabel(category?: string) {
  if (!category) return undefined;
  return INGREDIENT_CATEGORY_LABELS[category] ?? category;
}

function resolveExpireBadge(expiresAt?: string): ExpireBadge | undefined {
  if (!expiresAt) return undefined;

  const ddayMatch = /^D([+-]?)(\d+)$/.exec(expiresAt.trim());
  if (ddayMatch) {
    const sign = ddayMatch[1];
    const value = Number(ddayMatch[2]);
    const days = sign === '+' ? -value : value;
    return {
      label: `D${sign || '-'}${value}`,
      variant: days <= 3 ? 'warning' : 'fresh',
    };
  }

  const targetDate = new Date(expiresAt);
  if (Number.isNaN(targetDate.getTime())) {
    return undefined;
  }

  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.ceil((targetDate.getTime() - now.getTime()) / msPerDay);

  const isExpired = diff < 0;
  const label = isExpired ? `D+${Math.abs(diff)}` : `D-${diff}`;
  return {
    label,
    variant: diff <= 7 ? 'warning' : 'fresh',
  };
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
  const badge = resolveExpireBadge(ingredient.expiresAt);
  const IconComponent = getIngredientIconComponent(ingredient);

  const content = (
    <>
      <View style={styles.iconWrapper}>
        {IconComponent ? <IconComponent width={52} height={52} /> : null}
      </View>
      <View style={styles.accessoryWrapper}>
        {accessory ? (
          <View style={styles.accessory}>{accessory}</View>
        ) : (
          badge && (
            <View style={styles.badgeWrapper}>
              <Badge label={badge.label} variant={badge.variant} />
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#DBDBDB',
    alignItems: 'flex-start',
    gap: 12,
    minHeight: 120,
  },
  selected: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF1F0',
  },
  pressed: {
    opacity: 0.9,
  },
  iconWrapper: {
    width: 48,
    height: 48,
  },
  accessoryWrapper: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  accessory: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeWrapper: {
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111111',
    marginLeft: 4,
  },
});
