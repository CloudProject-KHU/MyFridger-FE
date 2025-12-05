import React from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import CalendarIcon from '@/assets/images/calendar-grey.svg';
import QuantityControl from '@/shared/components/inputs/QuantityControl';
import { getIngredientIconComponent } from '@/shared/utils/ingredientIcon';
import { MaterialUpdateRequest, updateIngredientById } from '@features/ingredients/services/ingredients.api';
import { Ingredient } from '@features/ingredients/types';
import { Badge } from '@shared/components/badges/Badge';
import DatePickerModal from '@shared/components/calendar/DatePickerModal';
import { INGREDIENT_CATEGORY_LABELS } from '@shared/constants/ingredientCategories';

type IngredientDetailModalProps = {
  visible: boolean;
  ingredient?: Ingredient;
  onClose: () => void;
  onDelete?: (ingredient: Ingredient) => void;
  onQuantityChange?: (ingredient: Ingredient, quantity: number) => void;
  onEdit?: (ingredient: Ingredient) => void;
  onUpdated?: (ingredient: Ingredient) => void;
};

export default function IngredientDetailModal({
  visible,
  ingredient,
  onClose,
  onDelete,
  onQuantityChange,
  onEdit,
  onUpdated,
}: IngredientDetailModalProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [draftQuantity, setDraftQuantity] = React.useState(ingredient?.quantity ?? 1);
  const [draftAddedDate, setDraftAddedDate] = React.useState(
    ingredient?.addedAt ?? new Date().toISOString().split('T')[0],
  );
  const [draftExpiresOn, setDraftExpiresOn] = React.useState(
    ingredient?.expiresOn ?? new Date().toISOString().split('T')[0],
  );
  const [datePickerState, setDatePickerState] = React.useState<
    null | { field: 'added' | 'expired' }
  >(null);

  React.useEffect(() => {
    // 모달이 열릴 때마다 현재 서버 값으로 초깃값 동기화
    if (visible && ingredient) {
      setIsEditing(false);
      setDraftQuantity(ingredient.quantity ?? 1);
      setDraftAddedDate(ingredient.addedAt ?? new Date().toISOString().split('T')[0]);
      setDraftExpiresOn(ingredient.expiresOn ?? new Date().toISOString().split('T')[0]);
    }
  }, [visible, ingredient]);

  const categoryLabel = ingredient?.category
    ? INGREDIENT_CATEGORY_LABELS[ingredient.category] ?? ingredient.category
    : undefined;
  const expireBadge = resolveExpireBadge(ingredient?.expiresAt);
  const IconComponent = ingredient ? getIngredientIconComponent(ingredient) : null;

  const handleDelete = () => {
    if (ingredient && onDelete) {
      onDelete(ingredient);
    }
  };

  const handleQuantityChange = (quantity: number) => {
    setDraftQuantity(quantity);
    if (ingredient && onQuantityChange) {
      onQuantityChange(ingredient, quantity);
    }
  };

  const openDatePicker = (field: 'added' | 'expired') => {
    if (!isEditing) return;
    setDatePickerState({ field });
  };

  const handleSelectDate = (date: string) => {
    if (!datePickerState) return;
    if (datePickerState.field === 'added') {
      setDraftAddedDate(date);
    } else {
      setDraftExpiresOn(date);
    }
    setDatePickerState(null);
  };

  const handleEditOrSave = async () => {
    if (!ingredient) return;

    // 최초 클릭: 편집 모드 진입만
    if (!isEditing) {
      setIsEditing(true);
      if (onEdit) {
        onEdit(ingredient);
      }
      return;
    }

    // 편집 중일 때 다시 누르면 저장
    try {
      setIsSaving(true);

      const payload: MaterialUpdateRequest = {
        purchased_at: draftAddedDate,
        expired_at: draftExpiresOn,
        quantity: draftQuantity,
        quantity_unit: '개',
      };

      const updated = await updateIngredientById(ingredient.id, payload);
      setIsEditing(false);
      setDraftQuantity(updated.quantity ?? 1);
      setDraftAddedDate(updated.addedAt ?? draftAddedDate);
      setDraftExpiresOn(updated.expiresOn ?? draftExpiresOn);
      if (onUpdated) {
        onUpdated(updated);
      }
      Alert.alert('수정 완료', '재료 정보가 수정되었습니다.');
    } catch (error: any) {
      console.error('재료 수정 실패:', error);
      Alert.alert(
        '수정 실패',
        error?.message || '재료 수정 중 문제가 발생했습니다. 다시 시도해주세요.',
      );
    } finally {
      setIsSaving(false);
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
              {IconComponent ? <IconComponent width={60} height={60} /> : null}
            </View>
            <View style={styles.headerTexts}>
              <Text style={styles.name}>{ingredient?.name ?? ''}</Text>
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

          <QuantityRow
            label="재료 개수"
            value={isEditing ? draftQuantity : ingredient?.quantity ?? 1}
            onChange={handleQuantityChange}
            editable={isEditing}
          />
          <DetailRow
            label="추가된 날짜"
            value={formatDate(draftAddedDate)}
            editable={isEditing}
            onPress={() => openDatePicker('added')}
          />
          <DetailRow
            label="소비기한 마감"
            value={formatDate(draftExpiresOn)}
            editable={isEditing}
            onPress={() => openDatePicker('expired')}
          />

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.editButton, isSaving && styles.disabledButton]}
              onPress={handleEditOrSave}
              disabled={isSaving}
            >
              <Text style={styles.editText}>{isEditing ? '저장하기' : '수정하기'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteText}>삭제하기</Text>
            </TouchableOpacity>
          </View>
          {datePickerState && (
            <DatePickerModal
              visible={true}
              onClose={() => setDatePickerState(null)}
              onSelectDate={handleSelectDate}
              initialDate={
                datePickerState.field === 'added'
                  ? draftAddedDate
                  : draftExpiresOn
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

type DetailRowProps = {
  label: string;
  value?: string;
  editable?: boolean;
  onPress?: () => void;
};

type QuantityRowProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  editable?: boolean;
};

function QuantityRow({ label, value, onChange, editable = false }: QuantityRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <QuantityControl value={value} onChange={onChange} min={1} disabled={!editable} />
    </View>
  );
}

function DetailRow({ label, value, editable = false, onPress }: DetailRowProps) {
  const content = (
    <View style={styles.detailValue}>
      <Text style={styles.detailValueText}>{value ?? '-'}</Text>
      <CalendarIcon width={20} height={20} color="#999999" />
    </View>
  );

  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      {editable && onPress ? (
        <Pressable onPress={onPress}>{content}</Pressable>
      ) : (
        content
      )}
    </View>
  );
}

function resolveExpireBadge(expiresAt?: string) {
  if (!expiresAt) return undefined;

  const trimmed = expiresAt.trim();

  // 이미 D-7, D+1 형태인 경우
  const ddayMatch = /^D([+-]?)(\d+)$/.exec(trimmed);
  if (ddayMatch) {
    const sign = ddayMatch[1];
    const value = Number(ddayMatch[2]);
    const days = sign === '+' ? -value : value;
    // 3일 이하: 빨강, 4~7일: 주황, 8일 이상: 초록
    let variant: 'fresh' | 'medium' | 'warning';
    if (days <= 3) variant = 'warning';
    else if (days <= 7) variant = 'medium';
    else variant = 'fresh';
    
    return {
      label: `D${sign || '-'}${value}`,
      variant,
    } as const;
  }

  // 날짜 문자열이면 D-day 계산
  const targetDate = new Date(trimmed);
  if (Number.isNaN(targetDate.getTime())) {
    // 인식할 수 없는 문자열이면 그대로 노출
    return { label: expiresAt, variant: 'warning' as const };
  }

  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.ceil((targetDate.getTime() - now.getTime()) / msPerDay);

  const isExpired = diff < 0;
  const label = isExpired ? `D+${Math.abs(diff)}` : `D-${diff}`;

  // 3일 이하: 빨강, 4~7일: 주황, 8일 이상: 초록
  let variant: 'fresh' | 'medium' | 'warning';
  if (diff <= 3) variant = 'warning';
  else if (diff <= 7) variant = 'medium';
  else variant = 'fresh';

  return {
    label,
    variant,
  } as const;
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
    gap: 10,
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
    fontSize: 16,
    color: '#36383E',
    fontWeight: '500',
  },
  detailValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  detailValueText: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '500',
  },
  actionsRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
    alignSelf: 'stretch',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#ffffff',
  },
  disabledButton: {
    opacity: 0.6,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#ffffff',
  },
  editText: {
    fontSize: 16,
    color: '#111111',
    fontWeight: '600',
  },
  deleteText: {
    fontSize: 16,
    color: '#C62828',
    fontWeight: '600',
  },
});


