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

import DislikeIcon from '@/assets/images/dislike.svg';
import LikeIcon from '@/assets/images/like.svg';
import SquareCheckIcon from '@/assets/images/square-check.svg';
import ActionButton from '@/shared/components/buttons/ActionButton';
import QuantityControl from '@/shared/components/inputs/QuantityControl';
import Header from '@/shared/components/navigation/Header';
import { getIngredientIconComponent } from '@/shared/utils/ingredientIcon';
import type { Ingredient } from '@features/ingredients/types';

type RecipeItem = {
  id: string;
  name: string;
  iconId?: string;
  category: string;
};

type RecipeStep = {
  number: number;
  description: string;
};

type RecipeDetail = {
  id: string;
  title: string;
  imageUri?: string;
  items: RecipeItem[];
  steps: RecipeStep[];
};

// 샘플 데이터 (나중에 API로 대체)
const SAMPLE_RECIPE_DETAILS: Record<string, RecipeDetail> = {
  '1': {
    id: '1',
    title: '김치죽',
    items: [
      { id: 'kimchi', name: '김치', iconId: 'kimchi', category: 'vegetable' },
      { id: 'garlic', name: '다진마늘', iconId: 'garlic', category: 'seasoning' },
      { id: 'soy_sauce', name: '간장', iconId: 'soy_sauce', category: 'seasoning' },
      { id: 'sesame_oil', name: '참기름', iconId: 'sesame_oil', category: 'seasoning' },
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
    items: [
      { id: 'tuna', name: '참치', iconId: 'fish', category: 'seafood' },
      { id: 'egg', name: '계란', iconId: 'egg', category: 'dairy_processed' },
      { id: 'soy_sauce', name: '간장', iconId: 'soy_sauce', category: 'seasoning' },
      { id: 'sesame_oil', name: '참기름', iconId: 'sesame_oil', category: 'seasoning' },
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
    items: [
      { id: 'tofu', name: '두부', iconId: 'tofu', category: 'dairy_processed' },
      { id: 'soy_sauce', name: '간장', iconId: 'soy_sauce', category: 'seasoning' },
      { id: 'garlic', name: '다진마늘', iconId: 'garlic', category: 'seasoning' },
      { id: 'sesame_oil', name: '참기름', iconId: 'sesame_oil', category: 'seasoning' },
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
    items: [
      { id: 'pork', name: '돼지고기', iconId: 'pork', category: 'meat' },
      { id: 'ketchup', name: '고추장', iconId: 'ketchup', category: 'seasoning' },
      { id: 'garlic', name: '다진마늘', iconId: 'garlic', category: 'seasoning' },
      { id: 'soy_sauce', name: '간장', iconId: 'soy_sauce', category: 'seasoning' },
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
    items: [
      { id: 'soy_sauce', name: '된장', iconId: 'soy_sauce', category: 'seasoning' },
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
  const [userFeedback, setUserFeedback] = useState<'like' | 'dislike' | null>(null);

  // 재료 차감 아이템 초기화 (식재료만, 조미료 제외)
  const initialDeductionItems = useMemo<DeductionItem[]>(() => {
    return recipe.items
      .filter((item) => item.category !== 'seasoning')
      .map((ing) => {
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
  }, [recipe.items]);

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

  // 조미료/식재료 아이템 너비 계산 (4개씩 정렬, 양옆 패딩 16, 아이템 간격 20)
  const itemWidth = (screenWidth - 16 * 2 - 20 * 3) / 4;

  // 카테고리로 필터링
  const ingredients = recipe.items.filter((item) => item.category !== 'seasoning');
  const seasonings = recipe.items.filter((item) => item.category === 'seasoning');

  const renderItemIcon = (item: RecipeItem) => {
    const IconComponent = getIngredientIconComponent({
      iconId: item.iconId,
      category: item.category,
    } as Ingredient);
    return IconComponent ? <IconComponent width={40} height={40} /> : null;
  };

  const toggleLike = () => {
    if (userFeedback === 'like') {
      setUserFeedback(null);
    } else {
      setUserFeedback('like');
    }
  };

  const toggleDislike = () => {
    if (userFeedback === 'dislike') {
      setUserFeedback(null);
    } else {
      setUserFeedback('dislike');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <View style={styles.imageSection}>
        <View style={styles.headerOverlay}>
          <Header
            title=""
            showBackButton
            onBackPress={handleBackPress}
            hideDivider
            transparent
          />
        </View>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>🍲</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* 레시피 정보 섹션 */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{recipe.title}</Text>
            <View style={styles.feedbackButtons}>
              <Pressable
                onPress={toggleLike}
                style={[
                  styles.feedbackButton,
                  userFeedback === 'like' && styles.feedbackButtonActiveLike,
                ]}
              >
                <LikeIcon width={24} height={24} color={userFeedback === 'like' ? '#2196F3' : '#000'} />
              </Pressable>
              <Pressable
                onPress={toggleDislike}
                style={[
                  styles.feedbackButton,
                  userFeedback === 'dislike' && styles.feedbackButtonActiveDislike,
                ]}
              >
                <DislikeIcon width={24} height={24} color={userFeedback === 'dislike' ? '#F44336' : '#000'} />
              </Pressable>
            </View>
          </View>

          {/* 식재료 섹션 */}
          {ingredients.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>식재료</Text>
              <View style={styles.seasoningGrid}>
                {ingredients.map((item) => (
                  <View
                    key={item.id}
                    style={[styles.seasoningItem, { width: itemWidth }]}
                  >
                    <View style={styles.seasoningIconContainer}>
                      {renderItemIcon(item)}
                    </View>
                    <Text style={styles.seasoningName}>{item.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 조미료 섹션 */}
          {seasonings.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>조미료</Text>
              <View style={styles.seasoningGrid}>
                {seasonings.map((item) => (
                  <View
                    key={item.id}
                    style={[styles.seasoningItem, { width: itemWidth }]}
                  >
                    <View style={styles.seasoningIconContainer}>
                      {renderItemIcon(item)}
                    </View>
                    <Text style={styles.seasoningName}>{item.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 레시피 섹션 */}
          <View style={styles.recipeStepsSection}>
            <Text style={styles.sectionTitle}>레시피</Text>
            <View style={styles.stepsList}>
              {recipe.steps.map((step) => (
                <View key={step.number} style={styles.stepItem}>
                  <Text style={styles.stepNumber}>{step.number}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <ActionButton
          label="레시피 만들어먹었어요!"
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
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    width: '100%',
    height: 300,
    backgroundColor: '#FF6B35',
    position: 'relative',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
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
    backgroundColor: '#fff',
    borderRadius: 24,
    marginTop: -24,
    padding: 24,
    paddingBottom: 32,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  feedbackButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackButtonActiveLike: {
    backgroundColor: '#E3F2FD',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  feedbackButtonActiveDislike: {
    backgroundColor: '#FFEBEE',
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  description: {
    fontSize: 15,
    color: '#999',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
    fontWeight: '500',
  },
  seasoningGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 32,
  },
  seasoningItem: {
    alignItems: 'center',
    gap: 8,
  },
  seasoningIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seasoningName: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  recipeStepsSection: {
    marginBottom: 80,
  },
  stepsList: {
    gap: 0,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  stepNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9A56',
    minWidth: 24,
  },
  stepDescription: {
    flex: 1,
    fontSize: 15,
    color: '#666',
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

