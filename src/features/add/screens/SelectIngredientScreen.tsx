import React from 'react';
import { FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import IngredientSelectableCard from '@features/add/components/IngredientSelectableCard';
import { Ingredient } from '@features/ingredients/types';
import ActionButton from '@shared/components/buttons/ActionButton';
import SearchBar from '@shared/components/inputs/SearchBar';
import TagTabs from '@shared/components/tabs/TagTabs';
import {
  INGREDIENT_CATEGORY_OPTIONS,
} from '@shared/constants/ingredientCategories';

const SAMPLE_INGREDIENTS: Ingredient[] = [
  { id: '1', name: '체다치즈', category: 'dairy_processed' },
  { id: '2', name: '양파', category: 'vegetable' },
  { id: '3', name: '사과', category: 'fruit' },
  { id: '4', name: '돼지고기', category: 'meat' },
  { id: '5', name: '연어', category: 'seafood' },
  { id: '6', name: '간장', category: 'seasoning' },
  { id: '7', name: '감자', category: 'vegetable' },
  { id: '8', name: '당근', category: 'vegetable' },
  { id: '9', name: '토마토', category: 'vegetable' },
  { id: '10', name: '달걀', category: 'home_meal' },
  { id: '11', name: '두부', category: 'home_meal' },
  { id: '12', name: '조개', category: 'seafood' },
];

const ALREADY_ADDED_IDS = new Set(['6', '10', '11']);

const CARD_COLUMNS = 4;
const CARD_GAP = 10;
const HORIZONTAL_PADDING = 16;

const keyExtractor = (item: Ingredient) => item.id;

export default function SelectIngredientScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState(INGREDIENT_CATEGORY_OPTIONS[0].value);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const filteredIngredients = React.useMemo(() => {
    return SAMPLE_INGREDIENTS.filter((ingredient) => {
      const matchCategory =
        activeCategory === 'all' ? true : ingredient.category === activeCategory;
      const matchQuery = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchCategory && matchQuery;
    });
  }, [activeCategory, searchQuery]);

  const handleToggleIngredient = React.useCallback((ingredient: Ingredient) => {
    setSelectedIds((prev) =>
      prev.includes(ingredient.id)
        ? prev.filter((id) => id !== ingredient.id)
        : [...prev, ingredient.id],
    );
  }, []);

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
        <IngredientSelectableCard
          ingredient={item}
          selected={selectedIds.includes(item.id)}
          added={ALREADY_ADDED_IDS.has(item.id)}
          disabled={ALREADY_ADDED_IDS.has(item.id)}
          onPress={handleToggleIngredient}
        />
      </View>
    );
  };

  const selectedCount = selectedIds.length;
  const actionLabel =
    selectedCount > 0 ? `재료 추가하기 ${selectedCount}개` : '재료를 추가하세요';

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <View style={styles.container}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="재료를 검색하세요"
          containerStyle={styles.searchBar}
        />
        <TagTabs
          options={INGREDIENT_CATEGORY_OPTIONS}
          activeValue={activeCategory}
          onChange={setActiveCategory}
          containerStyle={styles.tabsContainer}
          contentStyle={styles.tabsContent}
        />
        {filteredIngredients.length > 0 ? (
          <FlatList
            data={filteredIngredients}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={CARD_COLUMNS}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={<View style={styles.listFooterSpacer} />}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>검색 결과가 없습니다.</Text>
            <Text style={styles.emptyDescription}>
              원하는 재료가 없다면 직접 입력으로 이동하세요.
            </Text>
          </View>
        )}
      </View>
      <ActionButton
        label={actionLabel}
        disabled={selectedCount === 0}
        tone={selectedCount === 0 ? 'secondary' : 'primary'}
        style={styles.actionButton}
        onPress={() => {
          // TODO: connect selection result to add store
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  searchBar: {
    marginTop: 8,
  },
  tabsContainer: {
    paddingVertical: 4,
  },
  tabsContent: {
    paddingHorizontal: 0,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    marginBottom: 0,
  },
  listContent: {
    paddingBottom: 120,
  },
  listFooterSpacer: {
    height: CARD_GAP,
  },
  cardWrapper: {
    marginBottom: CARD_GAP,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  actionButton: {
    marginHorizontal: 16,
    marginBottom: 20,
    marginTop: 16,
  },
});

