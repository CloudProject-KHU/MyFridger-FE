import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { INGREDIENT_CATEGORY_OPTIONS } from '@/shared/constants/ingredientCategories';
import IngredientCardSelectable from '@features/ingredients/components/IngredientCardSelectable';
import { Ingredient } from '@features/ingredients/types';
import ActionButton from '@shared/components/buttons/ActionButton';
import Header from '@shared/components/navigation/Header';
import TagTabs from '@shared/components/tabs/TagTabs';

const SAMPLE_INGREDIENTS: Ingredient[] = [
  { id: '1', name: '간장', category: 'seasoning', iconId: 'soy_sauce', expiresAt: 'D-17' },
  { id: '2', name: '양파', category: 'vegetable', iconId: 'onion', expiresAt: 'D-13' },
  { id: '3', name: '우유', category: 'dairy_processed', iconId: 'milk', expiresAt: 'D-7' },
  { id: '4', name: '상추', category: 'vegetable', iconId: 'lettuce', expiresAt: 'D-6' },
  { id: '5', name: '돼지고기', category: 'meat', iconId: 'pork', expiresAt: 'D-4' },
  { id: '6', name: '새우', category: 'seafood', iconId: 'shrimp', expiresAt: 'D-2' },
  { id: '7', name: '치즈', category: 'dairy_processed', iconId: 'cheese', expiresAt: 'D-1' },
  { id: '8', name: '진미채 볶음', category: 'homemade', iconId: 'homemade', expiresAt: 'D-8' },
  { id: '9', name: '장조림', category: 'homemade', iconId: 'homemade', expiresAt: 'D-9' },
  { id: '10', name: '사과', category: 'fruit', iconId: 'apple', expiresAt: 'D-10' },
];

const keyExtractor = (item: Ingredient) => item.id;

export default function IngredientRemoveScreen() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [activeCategory, setActiveCategory] = React.useState(
    INGREDIENT_CATEGORY_OPTIONS[0].value,
  );

  const toggleSelect = React.useCallback((ingredient: Ingredient) => {
    setSelectedIds((prev) => {
      if (prev.includes(ingredient.id)) {
        return prev.filter((id) => id !== ingredient.id);
      }
      return [...prev, ingredient.id];
    });
  }, []);

  const filteredIngredients = React.useMemo(() => {
    if (activeCategory === 'all') {
      return SAMPLE_INGREDIENTS;
    }
    return SAMPLE_INGREDIENTS.filter((ingredient) => ingredient.category === activeCategory);
  }, [activeCategory]);

  const handleDelete = React.useCallback(() => {
    // TODO: connect with ingredients state/services to remove selected ingredients.
    // For now, this is a placeholder handler.
  }, []);

  const renderItem = React.useCallback(
    ({ item }: { item: Ingredient }) => (
      <View style={styles.cardWrapper}>
        <IngredientCardSelectable
          ingredient={item}
          selected={selectedIds.includes(item.id)}
          onPress={toggleSelect}
        />
      </View>
    ),
    [selectedIds, toggleSelect],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <Header
        title="재료 삭제"
        showBackButton
        onBackPress={() => router.back()}
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
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        <ActionButton
          label={
            selectedIds.length > 0
              ? `재료 삭제하기 ${selectedIds.length}개`
              : '재료를 선택해보세요'
          }
          tone="destructive"
          disabled={selectedIds.length === 0}
          onPress={handleDelete}
          style={styles.deleteButton}
        />
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabsContainer: {
    marginBottom: 12,
  },
  tabsContent: {
    paddingHorizontal: 0,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 12,
  },
  listContent: {
    paddingBottom: 24,
    gap: 12,
  },
  cardWrapper: {
    width: '48%',
    //flex: 1,
  },
  deleteButton: {
    marginTop: 'auto',
  },
});


