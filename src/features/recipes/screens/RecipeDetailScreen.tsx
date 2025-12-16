import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/shared/components/badges/Badge';
import ActionButton from '@/shared/components/buttons/ActionButton';
import QuantityControl from '@/shared/components/inputs/QuantityControl';
import Header from '@/shared/components/navigation/Header';
import { getIngredientIconComponent } from '@/shared/utils/ingredientIcon';
import { deleteIngredientById, fetchIngredients, updateIngredientById } from '@features/ingredients/services/ingredients.api';
import type { Ingredient } from '@features/ingredients/types';
import { fetchRecipeInstruction, type RecipeDetail } from '@features/recipes/services/recipes.api';

// 샘플 데이터 (나중에 API로 대체)
const SAMPLE_RECIPE_DETAILS: Record<string, RecipeDetail> = {
  '1': {
    id: '1',
    title: '마라감자',
    subtitle: '중국 청두 야시장 스타일의 매콤한 감자요리',
    tags: ['중식', '마라맛', '술안주', '매콤'],
    items: [
      { id: 'potato', name: '냉동감자', iconId: 'potato', category: 'vegetable', amount: '200g', hasStock: true },
      { id: 'green_onion', name: '대파', iconId: 'green_onion', category: 'vegetable', amount: '20g (1/5대)', hasStock: true },
      { id: 'mala_sauce', name: '마라소스', iconId: 'mala_sauce', category: 'seasoning', amount: '25g (1과 1/2큰술)', hasStock: true },
      { id: 'cooking_oil', name: '식용유', iconId: 'cooking_oil', category: 'seasoning', amount: '40g (1/4컵)', hasStock: false },
    ],
    steps: [
      {
        number: 1,
        description: '대파는 0.3cm 두께로 송송 썰어 준비합니다.',
      },
      {
        number: 2,
        description: '프라이팬을 강불로 예열하고 식용유를 둘러줍니다.',
      },
      {
        number: 3,
        description: '냉동감자를 넣고 전체적으로 노릇노릇해질 때까지 8-10분간 튀기듯이 굽습니다.',
        timer: '10분 00초',
      },
      {
        number: 4,
        description: '감자가 골고루 익으면 남은 기름을 따라냅니다.',
      },
      {
        number: 5,
        description: '썰어둔 대파를 넣고 1분간 볶아 향을 냅니다.',
        timer: '01분 00초',
      },
      {
        number: 6,
        description: '불을 중불로 줄이고 마라소스를 넣어 30초간 골고루 섞어줍니다.',
        timer: '00분 30초',
      },
      {
        number: 7,
        description: '감자가 마라소스와 잘 어우러지도록 한 번 더 섞어 완성합니다.',
      },
    ],
  },
  '2': {
    id: '2',
    title: '참치간장계란밥',
    tags: ['한식', '간단요리', '밥반찬'],
    items: [
      { id: 'tuna', name: '참치', iconId: 'fish', category: 'seafood', amount: '100g', hasStock: false },
      { id: 'egg', name: '계란', iconId: 'egg', category: 'dairy_processed', amount: '1개', hasStock: true },
      { id: 'soy_sauce', name: '간장', iconId: 'soy_sauce', category: 'seasoning', amount: '10g (1큰술)', hasStock: true },
      { id: 'sesame_oil', name: '참기름', iconId: 'sesame_oil', category: 'seasoning', amount: '5g (1작은술)', hasStock: true },
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
  // 라우트 파라미터로 전달된 레시피 ID 사용
  // id가 없을 때만 안전하게 기본값(39)으로 fallback
  const recipeId = id || '39';
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [userIngredients, setUserIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // API에서 레시피 상세 정보 가져오기
  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 레시피 데이터와 재료 목록을 동시에 가져오기
        const [recipeData, fetchedUserIngredients] = await Promise.all([
          fetchRecipeInstruction(recipeId),
          fetchIngredients(),
        ]);
        
        // 사용자가 보유한 재료 목록 저장
        setUserIngredients(fetchedUserIngredients);
        
        // 사용자가 보유한 재료 이름 목록 생성 (대소문자 무시, 공백 제거)
        const userIngredientNames = new Set(
          fetchedUserIngredients.map((ing) => ing.name.trim().toLowerCase())
        );
        
        // 레시피 재료에 hasStock 설정
        const itemsWithStock = recipeData.items.map((item) => {
          const itemNameLower = item.name.trim().toLowerCase();
          // "물"은 항상 보유하고 있다고 가정 (뱃지 표시 안 함)
          if (itemNameLower === '물') {
            return {
              ...item,
              hasStock: undefined, // undefined로 설정하면 뱃지가 표시되지 않음
            };
          }
          const hasStock = userIngredientNames.has(itemNameLower);
          return {
            ...item,
            hasStock,
          };
        });
        
        const recipeWithStock = {
          ...recipeData,
          items: itemsWithStock,
        };
        
        console.log('레시피 데이터 로드 완료:', {
          id: recipeWithStock.id,
          title: recipeWithStock.title,
          imageUri: recipeWithStock.imageUri,
          itemsWithStock: itemsWithStock.map((item) => ({
            name: item.name,
            hasStock: item.hasStock,
          })),
        });
        
        setRecipe(recipeWithStock);
        setImageLoadError(false); // 레시피 로드 시 이미지 에러 상태 초기화
      } catch (err) {
        console.error('레시피 상세 정보 로드 실패:', err);
        setError(err instanceof Error ? err.message : '레시피를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [recipeId]);

  // 재료 차감 아이템 초기화 (보유한 재료만, seasoning 제외)
  const initialDeductionItems = useMemo<DeductionItem[]>(() => {
    if (!recipe) return [];
    
    // 사용자가 보유한 재료를 이름으로 매핑 (대소문자 무시, 공백 제거)
    const userIngredientMap = new Map(
      userIngredients.map((ing) => [
        ing.name.trim().toLowerCase(),
        ing,
      ])
    );
    
    return recipe.items
      .filter((item) => {
        // seasoning 카테고리는 제외
        if (item.category === 'seasoning') return false;
        // 보유한 재료만 (hasStock: true)
        return item.hasStock === true;
      })
      .map((ing) => {
        // 재료 이름으로 보유 재료 찾기
        const itemNameLower = ing.name.trim().toLowerCase();
        const userIngredient = userIngredientMap.get(itemNameLower);
        const stock = userIngredient?.quantity || 0;
        
        return {
          id: ing.id,
          name: ing.name,
          iconId: ing.iconId,
          category: ing.category,
          stock: stock,
          used: 1,
          selected: true,
        };
      })
      .filter((item) => item.stock > 0); // 재고가 있는 재료만 표시
  }, [recipe?.items, userIngredients]);

  const [deductionItems, setDeductionItems] = useState<DeductionItem[]>(initialDeductionItems);

  useEffect(() => {
    setDeductionItems(initialDeductionItems);
  }, [initialDeductionItems]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFAE2C" />
          <Text style={styles.loadingText}>레시피를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !recipe) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || '레시피를 불러오는데 실패했습니다.'}
          </Text>
        </View>
      </SafeAreaView>
    );
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
      prev.map((item) => {
        if (item.id === itemId) {
          // 최소값은 1, 최대값은 보유한 개수(stock)
          const clampedValue = Math.max(1, Math.min(newValue, item.stock));
          return { ...item, used: clampedValue };
        }
        return item;
      }),
    );
  };

  const handleDeduct = async () => {
    const selectedItems = deductionItems.filter((item) => item.selected);
    const hasInsufficient = selectedItems.some((item) => item.used > item.stock);

    if (hasInsufficient) {
      return; // 재고 부족 시 차감 불가
    }

    try {
      // 사용자가 보유한 재료를 이름으로 매핑
      const userIngredientMap = new Map(
        userIngredients.map((ing) => [
          ing.name.trim().toLowerCase(),
          ing,
        ])
      );

      // 각 선택된 재료에 대해 수량 차감
      const updatePromises = selectedItems.map(async (item) => {
        const itemNameLower = item.name.trim().toLowerCase();
        const userIngredient = userIngredientMap.get(itemNameLower);
        
        if (!userIngredient) {
          console.warn(`재료를 찾을 수 없습니다: ${item.name}`);
          return;
        }

        // 새로운 수량 계산 (기존 수량 - 사용한 수량)
        const newQuantity = Math.max(0, (userIngredient.quantity || 0) - item.used);

        // 수량이 0이 되면 삭제, 0보다 크면 업데이트
        if (newQuantity === 0) {
          await deleteIngredientById(userIngredient.id);
        } else {
          await updateIngredientById(userIngredient.id, {
            quantity: newQuantity,
          });
        }
      });

      await Promise.all(updatePromises);
      
      console.log('재료 차감 완료:', selectedItems);
      handleCloseModal();
      
      // 홈 탭으로 이동
      router.push('/(tabs)');
    } catch (error) {
      console.error('재료 차감 실패:', error);
      Alert.alert(
        '차감 실패',
        '재료 차감 중 문제가 발생했습니다. 다시 시도해주세요.'
      );
    }
  };

  const selectedCount = deductionItems.filter((item) => item.selected).length;
  const hasInsufficient = deductionItems.some(
    (item) => item.selected && item.used > item.stock,
  );
  const canDeduct = selectedCount > 0 && !hasInsufficient;

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
        {recipe.imageUri && !imageLoadError ? (
          <Image
            source={{ uri: recipe.imageUri }}
            style={styles.recipeImage}
            contentFit="cover"
            onError={(error) => {
              console.error('이미지 로드 실패:', recipe.imageUri, error);
              setImageLoadError(true);
            }}
            onLoad={() => {
              console.log('이미지 로드 성공:', recipe.imageUri);
              setImageLoadError(false);
            }}
            transition={200}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>🍲</Text>
          </View>
        )}
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* 레시피 정보 섹션 */}
        <View style={styles.infoSection}>
          {/* 레시피 헤더 */}
          <View style={styles.recipeHeader}>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            {recipe.subtitle && (
              <Text style={styles.recipeSubtitle}>{recipe.subtitle}</Text>
            )}
            {recipe.tags && recipe.tags.length > 0 && (
              <View style={styles.recipeTags}>
                {recipe.tags.map((tag, index) => (
                  <Badge key={index} label={tag} variant="tag" />
                ))}
              </View>
            )}
          </View>

          {/* 재료 섹션 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>재료</Text>
            <View style={styles.ingredientsBox}>
              {recipe.items.map((item) => {
                const IconComponent = getIngredientIconComponent({
                  iconId: item.iconId,
                  category: item.category,
                } as Ingredient);
                return (
                  <View key={item.id} style={styles.ingredientRow}>
                    <View style={styles.ingredientName}>
                      {IconComponent && (
                        <View style={styles.ingredientIcon}>
                          <IconComponent width={24} height={24} />
                        </View>
                      )}
                      <View style={styles.ingredientNameTextContainer}>
                        <Text style={styles.ingredientNameText}>{item.name}</Text>
                        {item.hasStock !== undefined && (
                          <View style={styles.badgeWrapper}>
                            <Badge
                              label={item.hasStock ? '보유' : '필요'}
                              variant={item.hasStock ? 'have' : 'need'}
                            />
                          </View>
                        )}
                      </View>
                    </View>
                    {item.amount && (
                      <Text style={styles.ingredientAmount}>{item.amount}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* 조리 과정 섹션 */}
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
      <View style={styles.bottomAction}>
        <ActionButton
          label="🍳 요리 완료하기"
          onPress={handleCompletePress}
          tone="primary"
          fullWidth={true}
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

            {/* 재료 리스트 */}
            <View style={styles.modalIngredientList}>
              {deductionItems.map((item) => {
                  const IconComponent = getIngredientIconComponent({
                    iconId: item.iconId,
                    category: item.category,
                  } as Ingredient);

                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => handleToggleItem(item.id)}
                      style={[
                        styles.modalIngredientCard,
                        item.selected && styles.modalIngredientCardSelected,
                      ]}
                    >
                      {IconComponent && (
                        <View style={styles.modalCardIconContainer}>
                          <IconComponent width={40} height={40} />
                        </View>
                      )}
                      <Text style={styles.modalCardItemName}>{item.name}</Text>
                      <QuantityControl
                        value={item.used}
                        onChange={(newValue) => handleChangeQuantity(item.id, newValue)}
                        min={1}
                        max={item.stock}
                        disabled={!item.selected}
                      />
                    </Pressable>
                  );
                })}
            </View>

            <View style={styles.modalButtons}>
              <Pressable onPress={handleCloseModal} style={styles.modalBtnCancel}>
                <Text style={styles.modalBtnCancelText}>취소</Text>
              </Pressable>
              <Pressable
                onPress={handleDeduct}
                style={styles.modalBtnConfirm}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
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
  recipeImage: {
    width: '100%',
    height: '100%',
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
    paddingBottom: 100,
  },
  recipeHeader: {
    paddingTop: 24,
    paddingBottom: 0,
    marginBottom: 0,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  recipeSubtitle: {
    fontSize: 15,
    color: '#999',
    lineHeight: 22.5,
    marginBottom: 16,
  },
  recipeTags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    marginBottom: 0,
    flexWrap: 'wrap',
  },
  section: {
    paddingTop: 0,
    marginTop: 32,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  ingredientsBox: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 20,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  ingredientName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  ingredientIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientNameTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientNameText: {
    fontSize: 15,
    color: '#333',
  },
  badgeWrapper: {
    marginLeft: 8,
  },
  ingredientAmount: {
    fontSize: 14,
    color: '#666',
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
    color: '#FFAE2C',
    minWidth: 24,
  },
  stepDescription: {
    flex: 1,
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalIngredientList: {
    marginBottom: 24,
    gap: 12,
  },
  modalIngredientCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalIngredientCardSelected: {
    backgroundColor: '#FFF8F0',
    borderWidth: 1,
    borderColor: '#FFAE2C',
  },
  modalCardIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCardItemName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtnCancel: {
    flex: 1,
    padding: 16,
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
    padding: 16,
    backgroundColor: '#FFAE2C',
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

