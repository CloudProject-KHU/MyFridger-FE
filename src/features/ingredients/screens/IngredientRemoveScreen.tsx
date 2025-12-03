import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { INGREDIENT_CATEGORY_OPTIONS } from '@/shared/constants/ingredientCategories';
import IngredientCardSelectable from '@features/ingredients/components/IngredientCardSelectable';
import { Ingredient } from '@features/ingredients/types';
import ActionButton from '@shared/components/buttons/ActionButton';
import Header from '@shared/components/navigation/Header';
import TagTabs from '@shared/components/tabs/TagTabs';
import {
  fetchIngredients,
  bulkDeleteIngredients,
} from '@features/ingredients/services/ingredients.api';

const keyExtractor = (item: Ingredient) => item.id;

export default function IngredientRemoveScreen() {
  const router = useRouter();
  const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [activeCategory, setActiveCategory] = React.useState(
    INGREDIENT_CATEGORY_OPTIONS[0].value,
  );

  React.useEffect(() => {
    (async () => {
      try {
        const list = await fetchIngredients();
        setIngredients(list);
      } catch (error) {
        console.error('재료 목록 불러오기 실패(삭제 화면):', error);
      }
    })();
  }, []);

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
      return ingredients;
    }
    return ingredients.filter((ingredient) => ingredient.category === activeCategory);
  }, [activeCategory, ingredients]);

  const handleDelete = React.useCallback(() => {
    if (selectedIds.length === 0) return;

    const targets = ingredients.filter((item) => selectedIds.includes(item.id));
    Alert.alert(
      '재료 삭제',
      `${targets.length}개의 재료를 삭제할까요?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await bulkDeleteIngredients(targets.map((item) => item.id));
              setIngredients((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
              setSelectedIds([]);
            } catch (error) {
              console.error('재료 일괄 삭제 실패:', error);
              Alert.alert('삭제 실패', '재료 삭제 중 문제가 발생했습니다. 다시 시도해주세요.');
            }
          },
        },
      ],
    );
  }, [ingredients, selectedIds]);

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


