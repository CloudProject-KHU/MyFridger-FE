import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CarrotIcon from '@/assets/images/character/carrot-happy.svg';
import DeleteIcon from '@/assets/images/icons/delete.svg';
import Header from '@/shared/components/navigation/Header';
import TagTabs from '@/shared/components/tabs/TagTabs';
import { INGREDIENT_CATEGORY_OPTIONS } from '@/shared/constants/ingredientCategories';
import IngredientCard from '@features/ingredients/components/IngredientCard';
import IngredientDetailModal from '@features/ingredients/components/IngredientDetailModal';
import {
  deleteIngredientById,
  fetchIngredientById,
  fetchIngredients,
} from '@features/ingredients/services/ingredients.api';
import { Ingredient } from '@features/ingredients/types';

const CARD_COLUMNS = 4;
const CARD_GAP = 10;
const HORIZONTAL_PADDING = 16;

const keyExtractor = (item: Ingredient) => item.id;

export default function IngredientListScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();
  const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
  const [activeCategory, setActiveCategory] = React.useState(
    INGREDIENT_CATEGORY_OPTIONS[0].value,
  );
  const [selectedIngredient, setSelectedIngredient] = React.useState<Ingredient | null>(null);
  const [isDetailVisible, setDetailVisible] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      (async () => {
        try {
          const list = await fetchIngredients();
          if (isActive) {
            setIngredients(list);
          }
        } catch (error) {
          console.error('재료 목록 불러오기 실패:', error);
        }
      })();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const filteredIngredients = React.useMemo(() => {
    // "물"은 재료 목록에서 제외
    const filtered = ingredients.filter((ingredient) => 
      ingredient.name.trim().toLowerCase() !== '물'
    );
    
    const source =
      activeCategory === 'all'
        ? filtered
        : filtered.filter((ingredient) => ingredient.category === activeCategory);

    const parseExpiry = (expiresAt?: string) => {
      if (!expiresAt) return Number.POSITIVE_INFINITY;
      const trimmed = expiresAt.trim();

      // D± 패턴인 경우 그대로 처리
      const ddayMatch = /^D([+-]?)(\d+)$/.exec(trimmed);
      if (ddayMatch) {
        const sign = ddayMatch[1];
        const value = Number(ddayMatch[2]);
        if (sign === '+') {
          return -value; // 이미 지난 것 우선
        }
        return value; // 남은 일수
      }

      // 날짜 문자열인 경우 D-day 계산
      const targetDate = new Date(trimmed);
      if (Number.isNaN(targetDate.getTime())) {
        return Number.POSITIVE_INFINITY;
      }
      const now = new Date();
      const msPerDay = 1000 * 60 * 60 * 24;
      const diff = Math.ceil((targetDate.getTime() - now.getTime()) / msPerDay);
      return diff;
    };

    return [...source].sort((a, b) => parseExpiry(a.expiresAt) - parseExpiry(b.expiresAt));
  }, [activeCategory, ingredients]);

  const handleSelectIngredient = async (ingredient: Ingredient) => {
    try {
      // 서버에서 최신 데이터 다시 가져오기
      const fresh = await fetchIngredientById(ingredient.id);
      setSelectedIngredient(fresh);
    } catch (error) {
      console.error('재료 상세 불러오기 실패, 기존 데이터 사용:', error);
      setSelectedIngredient(ingredient);
    }
    setDetailVisible(true);
  };

  const cardWidth = React.useMemo(() => {
    const containerWidth = screenWidth - HORIZONTAL_PADDING * 2;
    return (containerWidth - CARD_GAP * (CARD_COLUMNS - 1)) / CARD_COLUMNS;
  }, [screenWidth]);

  const renderItem = ({ item, index }: { item: Ingredient; index: number }) => {
    const isLastInRow = (index + 1) % CARD_COLUMNS === 0;
    return (
      <View
        style={[
          styles.cardWrapper,
          {
            width: cardWidth,
            marginRight: isLastInRow ? 0 : CARD_GAP,
          },
        ]}
      >
        <IngredientCard ingredient={item} onPress={() => handleSelectIngredient(item)} />
      </View>
    );
  };

  const handleNavigateToRemove = React.useCallback(() => {
    router.push('/ingredients/remove');
  }, [router]);

  const handleNavigateToSettings = React.useCallback(() => {
    router.push('/settings');
  }, [router]);

  const handleDeleteIngredient = async (ingredient: Ingredient) => {
    Alert.alert('삭제하기', `'${ingredient.name}' 재료를 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteIngredientById(ingredient.id);
            setIngredients((prev) => prev.filter((item) => item.id !== ingredient.id));
            setDetailVisible(false);
            setSelectedIngredient(null);
          } catch (error) {
            console.error('재료 삭제 실패:', error);
            Alert.alert('삭제 실패', '재료 삭제 중 문제가 발생했습니다. 다시 시도해주세요.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <Header
        title="나의 냉장고"
        rightButton={
          ingredients.length > 0
            ? { icon: DeleteIcon, onPress: handleNavigateToRemove }
            : undefined
        }
        hideDivider
      />
      <View style={styles.container}>
        {ingredients.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyImageContainer}>
              <CarrotIcon width={250} height={250} />
            </View>
            <Text style={styles.emptyTitle}>냉장고가 비었어요!</Text>
            <Text style={styles.emptyDescription}>
              아래 버튼으로 재료를 추가하고{'\n'}바로 만들 수 있는 레시피를 확인 해보세요!
            </Text>
          </View>
        ) : (
          <>
            <TagTabs
              options={INGREDIENT_CATEGORY_OPTIONS}
              activeValue={activeCategory}
              onChange={setActiveCategory}
              containerStyle={styles.tabsContainer}
              contentStyle={styles.tabsContent}
            />
            <FlatList
              data={filteredIngredients}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              numColumns={CARD_COLUMNS}
              columnWrapperStyle={styles.columnWrapper}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </View>
      <IngredientDetailModal
        visible={isDetailVisible}
        ingredient={selectedIngredient ?? undefined}
        onClose={() => {
          setDetailVisible(false);
          setSelectedIngredient(null);
        }}
        onDelete={handleDeleteIngredient}
        onUpdated={(updated) => {
          setIngredients((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item)),
          );
          setSelectedIngredient(updated);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingVertical: 8,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tabsContent: {
    paddingHorizontal: 0,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    marginBottom: 0,
  },
  listContent: {
    paddingBottom: 100, // 탭바 높이 고려
    paddingHorizontal: 16,
  },
  cardWrapper: {
    marginBottom: CARD_GAP,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 32,
    paddingTop: 120,
  },
  emptyImageContainer: {
    marginBottom: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
