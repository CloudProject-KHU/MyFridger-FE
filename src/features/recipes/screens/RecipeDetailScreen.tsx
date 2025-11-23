import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SquareCheckIcon from '@/assets/images/square-check.svg';
import ActionButton from '@/shared/components/buttons/ActionButton';
import QuantityControl from '@/shared/components/inputs/QuantityControl';
import Header from '@/shared/components/navigation/Header';
import { getIngredientIconComponent } from '@/shared/utils/ingredientIcon';
import type { Ingredient } from '@features/ingredients/types';

type RecipeIngredient = {
  id: string;
  name: string;
  iconId?: string;
  category?: string;
};

type RecipeSeasoning = {
  id: string;
  name: string;
  iconId?: string;
};

type RecipeStep = {
  number: number;
  description: string;
};

type RecipeDetail = {
  id: string;
  title: string;
  description: string;
  imageUri?: string;
  ingredients: RecipeIngredient[];
  seasonings: RecipeSeasoning[];
  steps: RecipeStep[];
};

// 샘플 데이터 (나중에 API로 대체)
const SAMPLE_RECIPE_DETAILS: Record<string, RecipeDetail> = {
  '1': {
    id: '1',
    title: '김치죽',
    description: '속을 든든하게 하는 간단한 김치죽!',
    ingredients: [
      { id: 'kimchi', name: '김치', iconId: 'kimchi', category: 'vegetable' },
    ],
    seasonings: [
      { id: 'garlic', name: '다진마늘', iconId: 'garlic' },
      { id: 'soy_sauce', name: '간장', iconId: 'soy_sauce' },
      { id: 'sesame_oil', name: '참기름', iconId: 'sesame_oil' },
    ],
    steps: [
      {
        number: 1,
        description: '김치를 적당한 크기로 썰어주세요.',
      },
      {
        number: 2,
        description: '냄비에 물을 넣고 끓인 후 김치를 넣어주세요.',
      },
      {
        number: 3,
        description: '쌀을 넣고 저어가며 죽이 될 때까지 끓여주세요.',
      },
    ],
  },
  '2': {
    id: '2',
    title: '참치간장계란밥',
    description: '식사 거르지 않는 초간단 식사!',
    ingredients: [
      { id: 'tuna', name: '참치', iconId: 'fish', category: 'seafood' },
      { id: 'egg', name: '계란', iconId: 'egg', category: 'dairy_processed' },
    ],
    seasonings: [
      { id: 'soy_sauce', name: '간장', iconId: 'soy_sauce' },
      { id: 'sesame_oil', name: '참기름', iconId: 'sesame_oil' },
    ],
    steps: [
      {
        number: 1,
        description: '참치캔을 열고 기름을 제거해주세요.',
      },
      {
        number: 2,
        description: '계란을 풀어서 간장과 참기름을 넣고 섞어주세요.',
      },
      {
        number: 3,
        description: '밥 위에 참치와 계란을 올려주세요.',
      },
    ],
  },
  '3': {
    id: '3',
    title: '간장두부덮밥',
    description: '간장 베이스의 두부덮밥!',
    ingredients: [
      { id: 'tofu', name: '두부', iconId: 'tofu', category: 'dairy_processed' },
    ],
    seasonings: [
      { id: 'soy_sauce', name: '간장', iconId: 'soy_sauce' },
      { id: 'garlic', name: '다진마늘', iconId: 'garlic' },
      { id: 'sesame_oil', name: '참기름', iconId: 'sesame_oil' },
    ],
    steps: [
      {
        number: 1,
        description: '두부를 적당한 크기로 썰어주세요.',
      },
      {
        number: 2,
        description: '간장, 다진마늘, 참기름을 섞어 양념장을 만드세요.',
      },
      {
        number: 3,
        description: '두부를 볶다가 양념장을 넣고 볶아주세요.',
      },
    ],
  },
  '4': {
    id: '4',
    title: '돼지고기 고추장찌개',
    description: '간편하게 만들 수 있는 고추장찌개!',
    ingredients: [
      { id: 'pork', name: '돼지고기', iconId: 'pork', category: 'meat' },
    ],
    seasonings: [
      { id: 'ketchup', name: '고추장', iconId: 'ketchup' },
      { id: 'garlic', name: '다진마늘', iconId: 'garlic' },
      { id: 'soy_sauce', name: '간장', iconId: 'soy_sauce' },
    ],
    steps: [
      {
        number: 1,
        description: '돼지고기를 적당한 크기로 썰어주세요.',
      },
      {
        number: 2,
        description: '고추장, 다진마늘, 간장을 넣고 끓여주세요.',
      },
      {
        number: 3,
        description: '돼지고기를 넣고 익을 때까지 끓여주세요.',
      },
    ],
  },
  '5': {
    id: '5',
    title: '된장라면',
    description: '구수함의 깊이가 다른 맛!',
    ingredients: [],
    seasonings: [
      { id: 'soy_sauce', name: '된장', iconId: 'soy_sauce' },
    ],
    steps: [
      {
        number: 1,
        description: '물을 끓여주세요.',
      },
      {
        number: 2,
        description: '된장을 풀어주세요.',
      },
      {
        number: 3,
        description: '라면을 넣고 끓여주세요.',
      },
    ],
  },
};

// 샘플 냉장고 재료 데이터 (나중에 실제 데이터로 대체)
const SAMPLE_FRIDGE_INGREDIENTS: Record<string, { stock: number }> = {
  kimchi: { stock: 3 },
  onion: { stock: 2 },
  carrot: { stock: 1 },
  egg: { stock: 10 },
  tofu: { stock: 5 },
  pork: { stock: 2 },
  tuna: { stock: 0 },
  fish: { stock: 0 },
};

type DeductionItem = {
  id: string;
  name: string;
  iconId?: string;
  category?: string;
  stock: number;
  used: number;
  selected: boolean;
};

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const recipe = SAMPLE_RECIPE_DETAILS[id || '1'];
  const [modalVisible, setModalVisible] = useState(false);

  // 재료 차감 아이템 초기화
  const initialDeductionItems = useMemo<DeductionItem[]>(() => {
    return recipe.ingredients.map((ing) => {
      const fridgeData = SAMPLE_FRIDGE_INGREDIENTS[ing.id] || { stock: 0 };
      return {
        id: ing.id,
        name: ing.name,
        iconId: ing.iconId,
        category: ing.category,
        stock: fridgeData.stock,
        used: 1,
        selected: true,
      };
    });
  }, [recipe.ingredients]);

  const [deductionItems, setDeductionItems] = useState<DeductionItem[]>(initialDeductionItems);

  if (!recipe) {
    return null;
  }

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleCompletePress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    // 모달 닫을 때 초기화
    setDeductionItems(initialDeductionItems);
  };

  const handleToggleItem = (itemId: string) => {
    setDeductionItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, selected: !item.selected } : item)),
    );
  };

  const handleChangeQuantity = (itemId: string, newValue: number) => {
    setDeductionItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, used: newValue } : item)),
    );
  };

  const handleDeduct = () => {
    const selectedItems = deductionItems.filter((item) => item.selected);
    const hasInsufficient = selectedItems.some((item) => item.used > item.stock);

    if (hasInsufficient) {
      return; // 재고 부족 시 차감 불가
    }

    // TODO: 실제 재료 차감 로직 구현
    console.log('재료 차감:', selectedItems);
    handleCloseModal();
  };

  const selectedCount = deductionItems.filter((item) => item.selected).length;
  const hasInsufficient = deductionItems.some(
    (item) => item.selected && item.used > item.stock,
  );
  const canDeduct = selectedCount > 0 && !hasInsufficient;

  // 조미료 아이템 너비 계산 (3개씩 정렬, 양옆 패딩 16, 아이템 간격 16)
  const seasoningItemWidth = (screenWidth - 16 * 2 - 16 * 2) / 3;

  const renderIngredientIcon = (ingredient: RecipeIngredient) => {
    const IconComponent = getIngredientIconComponent({
      iconId: ingredient.iconId,
      category: ingredient.category,
    } as Ingredient);
    return IconComponent ? <IconComponent width={40} height={40} /> : null;
  };

  const renderSeasoningIcon = (seasoning: RecipeSeasoning) => {
    const IconComponent = getIngredientIconComponent({
      iconId: seasoning.iconId,
    } as Ingredient);
    return IconComponent ? <IconComponent width={40} height={40} /> : null;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <Header title="" showBackButton onBackPress={handleBackPress} hideDivider />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 이미지 섹션 */}
        <View style={styles.imageSection}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>🍲</Text>
          </View>
        </View>

        {/* 레시피 정보 섹션 */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{recipe.title}</Text>
              <Text style={styles.description}>{recipe.description}</Text>
            </View>
            {/* 북마크 아이콘 (나중에 추가) */}
            <View style={styles.bookmarkPlaceholder} />
          </View>

          {/* 식재료 섹션 */}
          {recipe.ingredients.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>식재료</Text>
              <View style={styles.ingredientList}>
                {recipe.ingredients.map((ingredient) => (
                  <View key={ingredient.id} style={styles.ingredientItem}>
                    {renderIngredientIcon(ingredient)}
                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 조미료 섹션 */}
          {recipe.seasonings.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>조미료</Text>
              <View style={styles.seasoningGrid}>
                {recipe.seasonings.map((seasoning) => (
                  <View
                    key={seasoning.id}
                    style={[styles.seasoningItem, { width: seasoningItemWidth }]}
                  >
                    {renderSeasoningIcon(seasoning)}
                    <Text style={styles.seasoningName}>{seasoning.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 레시피 섹션 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>레시피</Text>
            <View style={styles.stepsList}>
              {recipe.steps.map((step) => (
                <View key={step.number} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{step.number}</Text>
                  </View>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <ActionButton
          label="레시피를 만들어먹었어요!"
          onPress={handleCompletePress}
          tone="primary"
        />
      </View>

      {/* 재료 차감 모달 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>재료 차감 확인</Text>
            <Text style={styles.modalDescription}>다음 재료를 냉장고에서 차감할까요?</Text>

            {/* 경고 메시지 */}
            {hasInsufficient && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>⚠️ 일부 재료의 재고가 부족합니다</Text>
              </View>
            )}

            {/* 재료 리스트 */}
            <View style={styles.modalIngredientList}>
              {deductionItems.map((item) => {
                const isInsufficient = item.selected && item.used > item.stock;
                const IconComponent = getIngredientIconComponent({
                  iconId: item.iconId,
                  category: item.category,
                } as Ingredient);

                return (
                  <View key={item.id} style={styles.modalIngredientItem}>
                    <View style={styles.modalIngredientLeft}>
                      <Pressable
                        onPress={() => handleToggleItem(item.id)}
                        style={styles.modalCheckboxContainer}
                      >
                        {item.selected ? (
                          <SquareCheckIcon width={20} height={20} color="#5B7FFF" />
                        ) : (
                          <View style={styles.modalCheckboxUnchecked} />
                        )}
                      </Pressable>
                      {IconComponent && (
                        <View style={styles.modalItemIconContainer}>
                          <IconComponent width={32} height={32} />
                        </View>
                      )}
                      <View style={styles.modalItemInfo}>
                        <Text style={styles.modalItemName}>{item.name}</Text>
                        <Text
                          style={[
                            styles.modalItemStock,
                            isInsufficient && styles.modalItemStockWarning,
                          ]}
                        >
                          재고 {item.stock}개
                        </Text>
                      </View>
                    </View>
                    <QuantityControl
                      value={item.used}
                      onChange={(newValue) => handleChangeQuantity(item.id, newValue)}
                      min={1}
                      max={item.stock}
                    />
                  </View>
                );
              })}
            </View>

            <View style={styles.modalButtons}>
              <Pressable onPress={handleCloseModal} style={styles.modalBtnCancel}>
                <Text style={styles.modalBtnCancelText}>취소</Text>
              </Pressable>
              <Pressable
                onPress={handleDeduct}
                disabled={!canDeduct}
                style={[styles.modalBtnConfirm, !canDeduct && styles.modalBtnDisabled]}
              >
                <Text style={styles.modalBtnConfirmText}>차감하기</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    width: '100%',
    height: 300,
    backgroundColor: '#F3F4F6',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 80,
  },
  infoSection: {
    padding: 16,
    paddingBottom: 24,
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 10,
    paddingBottom: 10, // 탭바 높이 고려
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  bookmarkPlaceholder: {
    width: 24,
    height: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 16,
  },
  ingredientList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ingredientName: {
    fontSize: 16,
    color: '#111111',
  },
  seasoningGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  seasoningItem: {
    alignItems: 'center',
    gap: 8,
  },
  seasoningName: {
    fontSize: 14,
    color: '#111111',
    textAlign: 'center',
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF8A65',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stepDescription: {
    flex: 1,
    fontSize: 16,
    color: '#111111',
    lineHeight: 24,
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111111',
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
    textAlign: 'center',
  },
  warningBox: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 13,
    color: '#E65100',
  },
  modalIngredientList: {
    marginBottom: 20,
  },
  modalIngredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalIngredientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modalCheckboxContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCheckboxUnchecked: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  modalItemIconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalItemInfo: {
    flex: 1,
  },
  modalItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  modalItemStock: {
    fontSize: 12,
    color: '#999',
  },
  modalItemStockWarning: {
    color: '#FF6B6B',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  modalBtnCancel: {
    flex: 1,
    padding: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  modalBtnConfirm: {
    flex: 1,
    padding: 14,
    backgroundColor: '#5B7FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnConfirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
  modalBtnDisabled: {
    opacity: 0.4,
  },
});

