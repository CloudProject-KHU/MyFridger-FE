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
    name: '체다치즈',
    category: 'dairy_processed',
    expiresAt: 'D-3',
    addedAt: '2025-10-01',
    expiresOn: '2025-10-29',
  },
  {
    id: '2',
    name: '체다치즈',
    category: 'dairy_processed',
    expiresAt: 'D-3',
    addedAt: '2025-10-01',
    expiresOn: '2025-10-29',
  },
  {
    id: '3',
    name: '체다치즈',
    category: 'dairy_processed',
    expiresAt: 'D-3',
    addedAt: '2025-10-01',
    expiresOn: '2025-10-29',
  },
  {
    id: '4',
    name: '체다치즈',
    category: 'dairy_processed',
    expiresAt: 'D-3',
    addedAt: '2025-10-01',
    expiresOn: '2025-10-29',
  },
  {
    id: '5',
    name: '체다치즈',
    category: 'dairy_processed',
    expiresAt: 'D-3',
    addedAt: '2025-10-01',
    expiresOn: '2025-10-29',
  },
  {
    id: '6',
    name: '체다치즈',
    category: 'dairy_processed',
    expiresAt: 'D-3',
    addedAt: '2025-10-01',
    expiresOn: '2025-10-29',
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
    if (activeCategory === 'all') {
      return SAMPLE_INGREDIENTS;
    }
    return SAMPLE_INGREDIENTS.filter((ingredient) => ingredient.category === activeCategory);
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
