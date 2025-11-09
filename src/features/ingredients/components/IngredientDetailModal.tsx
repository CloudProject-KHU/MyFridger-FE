import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import CalendarIcon from '@/assets/images/calandar.svg';
import DeleteIcon from '@/assets/images/delete.svg';
import CheeseIcon from '@/assets/images/ingredients/cheese.svg';
import { Ingredient } from '@features/ingredients/types';
import { Badge } from '@shared/components/badges/Badge';
import { INGREDIENT_CATEGORY_LABELS } from '@shared/constants/ingredientCategories';

type IngredientDetailModalProps = {
  visible: boolean;
  ingredient?: Ingredient;
  onClose: () => void;
  onDelete?: (ingredient: Ingredient) => void;
};

export default function IngredientDetailModal({
  visible,
  ingredient,
  onClose,
  onDelete,
}: IngredientDetailModalProps) {
  if (!ingredient) {
    return null;
  }

  const categoryLabel = ingredient.category
    ? INGREDIENT_CATEGORY_LABELS[ingredient.category] ?? ingredient.category
    : undefined;
  const expireBadge = resolveExpireBadge(ingredient.expiresAt);

  const handleDelete = () => {
    if (ingredient && onDelete) {
      onDelete(ingredient);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <CheeseIcon width={60} height={60} />
            </View>
            <View style={styles.headerTexts}>
              <Text style={styles.name}>{ingredient.name}</Text>
              <View style={styles.badges}>
                {categoryLabel ? (
                  <Badge label={categoryLabel} variant="category" />
                ) : null}
                {expireBadge ? (
                  <Badge label={expireBadge.label} variant={expireBadge.variant} />
                ) : null}
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <DetailRow
            label="추가된 날짜"
            value={formatDate(ingredient.addedAt)}
          />
          <DetailRow
            label="소비기한 마감"
            value={formatDate(ingredient.expiresOn)}
          />

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <DeleteIcon width={20} height={20} color="#C62828" />
            <Text style={styles.deleteText}>삭제하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

type DetailRowProps = {
  label: string;
  value?: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <View style={styles.detailValue}>
        <Text style={styles.detailValueText}>{value ?? '-'}</Text>
        <CalendarIcon width={20} height={20} color="#999999" />
      </View>
    </View>
  );
}

function resolveExpireBadge(expiresAt?: string) {
  if (!expiresAt) return undefined;

  const ddayMatch = /^D([+-]?)(\d+)$/.exec(expiresAt.trim());
  if (ddayMatch) {
    const sign = ddayMatch[1];
    const value = Number(ddayMatch[2]);
    const days = sign === '+' ? -value : value;
    return {
      label: `D${sign || '-'}${value}`,
      variant: days <= 3 ? 'warning' : 'fresh',
    } as const;
  }

  return { label: expiresAt, variant: 'warning' as const };
}

function formatDate(date?: string) {
  if (!date) return undefined;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return `${parsed.getFullYear()}년 ${String(parsed.getMonth() + 1).padStart(2, '0')}월 ${String(
    parsed.getDate(),
  ).padStart(2, '0')}일`;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 20,
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#DBDBDB',
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 60,
    height: 60,
    //borderRadius: 16,
    //backgroundColor: '#FFF7E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTexts: {
    flex: 1,
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
  },
  badges: {
    flexDirection: 'row',
    gap: 10,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  detailValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  detailValueText: {
    fontSize: 15,
    color: '#999999',
  },
  deleteButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
    paddingVertical: 12,
  },
  deleteText: {
    fontSize: 16,
    color: '#C62828',
    fontWeight: '600',
  },
});


