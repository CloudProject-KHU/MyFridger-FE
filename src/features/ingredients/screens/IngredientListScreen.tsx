import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DeleteIcon from '@/assets/images/delete.svg';
import Header from '@/shared/components/navigation/Header';
import TagTabs from '@/shared/components/tabs/TagTabs';
import { INGREDIENT_CATEGORY_OPTIONS } from '@/shared/constants/ingredientCategories';
import IngredientCard from '@features/ingredients/components/IngredientCard';
import IngredientDetailModal from '@features/ingredients/components/IngredientDetailModal';
import { Ingredient } from '@features/ingredients/types';

const SAMPLE_INGREDIENTS: Ingredient[] = [
  {
    id: '1',
    name: '간장',
    category: 'seasoning',
    iconId: 'soy_sauce',
    expiresAt: 'D-17',
    addedAt: '2025-10-10',
    expiresOn: '2026-04-10',
  },
  {
    id: '2',
    name: '양파',
    category: 'vegetable',
    iconId: 'onion',
    expiresAt: 'D-13',
    addedAt: '2025-10-12',
    expiresOn: '2025-11-01',
  },
  {
    id: '3',
    name: '우유',
    category: 'dairy_processed',
    iconId: 'milk',
    expiresAt: 'D-7',
    addedAt: '2025-10-20',
    expiresOn: '2025-10-27',
  },
  {
    id: '4',
    name: '상추',
    category: 'vegetable',
    iconId: 'lettuce',
    expiresAt: 'D-6',
    addedAt: '2025-10-22',
    expiresOn: '2025-10-28',
  },
  {
    id: '5',
    name: '돼지고기',
    category: 'meat',
    iconId: 'pork',
    expiresAt: 'D-4',
    addedAt: '2025-10-21',
    expiresOn: '2025-10-25',
  },
  {
    id: '6',
    name: '새우',
    category: 'seafood',
    iconId: 'shrimp',
    expiresAt: 'D-2',
    addedAt: '2025-10-24',
    expiresOn: '2025-10-27',
  },
  {
    id: '7',
    name: '치즈',
    category: 'dairy_processed',
    iconId: 'cheese',
    expiresAt: 'D-1',
    addedAt: '2025-10-23',
    expiresOn: '2025-10-26',
  },
  {
    id: '8',
    name: '진미채 볶음',
    category: 'homemade',
    iconId: 'homemade',
    expiresAt: 'D-12',
    addedAt: '2025-10-29',
    expiresOn: '2025-11-11',
  },
  {
    id: '9',
    name: '사과',
    category: 'fruit',
    iconId: 'apple',
    expiresAt: 'D-10',
    addedAt: '2025-10-05',
    expiresOn: '2025-11-05',
  },
  {
    id: '10',
    name: '장조림',
    category: 'homemade',
    iconId: 'homemade',
    expiresAt: 'D-30',
    addedAt: '2025-10-29',
    expiresOn: '2025-11-29',
  },
];

const CARD_COLUMNS = 2;
const CARD_GAP = 12;
const HORIZONTAL_PADDING = 16;

const keyExtractor = (item: Ingredient) => item.id;

export default function IngredientListScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = React.useState(
    INGREDIENT_CATEGORY_OPTIONS[0].value,
  );
  const [selectedIngredient, setSelectedIngredient] = React.useState<Ingredient | null>(null);
  const [isDetailVisible, setDetailVisible] = React.useState(false);

  const filteredIngredients = React.useMemo(() => {
    const filtered =
      activeCategory === 'all'
        ? SAMPLE_INGREDIENTS
        : SAMPLE_INGREDIENTS.filter((ingredient) => ingredient.category === activeCategory);

    const parseExpiry = (expiresAt?: string) => {
      if (!expiresAt) return Number.POSITIVE_INFINITY;
      const match = /^D([+-]?)(\d+)$/.exec(expiresAt.trim());
      if (!match) return Number.POSITIVE_INFINITY;
      const sign = match[1];
      const value = Number(match[2]);
      // D-5 -> { sign: '', value: 5 } => 5 days left, but we sort ascending so use positive
      // D+2 -> expired 2 days ago => return -2 to keep at top
      if (sign === '+') {
        return -value; // expired -> highest priority
      }
      const remaining = value;
      return remaining;
    };

    return [...filtered].sort((a, b) => parseExpiry(a.expiresAt) - parseExpiry(b.expiresAt));
  }, [activeCategory]);

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <Header
        title="나의 냉장고"
        rightButton={{ icon: DeleteIcon, onPress: handleNavigateToRemove }}
        hideDivider
      />
      <View style={styles.container}>
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
      </View>
      <IngredientDetailModal
        visible={isDetailVisible}
        ingredient={selectedIngredient ?? undefined}
        onClose={() => {
          setDetailVisible(false);
          setSelectedIngredient(null);
        }}
        onDelete={() => {
          // TODO: connect delete handler
          setDetailVisible(false);
          setSelectedIngredient(null);
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
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  cardWrapper: {
    marginBottom: CARD_GAP,
  },
});
