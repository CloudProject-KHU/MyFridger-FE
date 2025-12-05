import React from 'react';
import { Alert, FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import IngredientSelectableCard from '@features/add/components/IngredientSelectableCard';
import { Ingredient } from '@features/ingredients/types';
import { createMaterialManual } from '@features/ingredients/services/ingredients.api';
import { fetchIngredients } from '@features/ingredients/services/ingredients.api';
import ActionButton from '@shared/components/buttons/ActionButton';
import SearchBar from '@shared/components/inputs/SearchBar';
import TagTabs from '@shared/components/tabs/TagTabs';
import {
  INGREDIENT_CATEGORY_OPTIONS,
} from '@shared/constants/ingredientCategories';
import { INGREDIENT_ICON_CATEGORIES } from '@shared/constants/ingredientIcons';

// ingredientIcons.ts의 데이터를 기반으로 모든 재료 목록 생성
// "모음", "아이콘" 같은 것들은 제외
const ALL_INGREDIENTS: Ingredient[] = INGREDIENT_ICON_CATEGORIES.flatMap((category) =>
  category.items
    .filter((item) => !item.name.includes('모음') && !item.name.includes('아이콘'))
    .map((item, index) => ({
      id: `${category.value}-${item.id}`,
      name: item.name,
      category: category.value as Ingredient['category'],
      iconId: item.id,
    }))
);

const CARD_COLUMNS = 4;
const CARD_GAP = 10;
const HORIZONTAL_PADDING = 16;

const keyExtractor = (item: Ingredient) => item.id;

export default function SearchAddScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState(INGREDIENT_CATEGORY_OPTIONS[0].value);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [alreadyAddedIds, setAlreadyAddedIds] = React.useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // 서버에서 이미 추가된 재료 목록 가져오기
  React.useEffect(() => {
    (async () => {
      try {
        const existingIngredients = await fetchIngredients();
        // 재료 이름으로 매칭하여 이미 추가된 재료 ID 추출
        const addedNames = new Set(existingIngredients.map((ing) => ing.name));
        const addedIds = ALL_INGREDIENTS.filter((ing) => addedNames.has(ing.name)).map((ing) => ing.id);
        setAlreadyAddedIds(new Set(addedIds));
      } catch (error) {
        console.error('재료 목록 불러오기 실패:', error);
      }
    })();
  }, []);

  const filteredIngredients = React.useMemo(() => {
    return ALL_INGREDIENTS.filter((ingredient) => {
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
          added={alreadyAddedIds.has(item.id)}
          disabled={alreadyAddedIds.has(item.id)}
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
        disabled={selectedCount === 0 || isSubmitting}
        tone={selectedCount === 0 ? 'secondary' : 'primary'}
        style={styles.actionButton}
        onPress={async () => {
          if (selectedCount === 0) return;

          setIsSubmitting(true);
          try {
            const selectedIngredients = ALL_INGREDIENTS.filter((ing) =>
              selectedIds.includes(ing.id),
            );

            // 선택한 재료들을 서버에 추가
            const today = new Date().toISOString();
            const results = await Promise.all(
              selectedIngredients.map((ingredient) =>
                createMaterialManual({
                  name: ingredient.name,
                  category: ingredient.category || undefined,
                  purchased_at: today,
                  expired_at: today, // 기본값, 나중에 수정 가능
                  quantity: 1,
                  price: 0,
                  currency: 'KRW',
                  user_id: '1', // TODO: 실제 로그인한 사용자 ID로 교체
                  quantity_unit: '개',
                }),
              ),
            );

            console.log('재료 추가 완료:', results);

            Alert.alert('추가 완료', `${selectedCount}개의 재료가 추가되었습니다.`, [
              {
                text: '확인',
                onPress: () => {
                  // 홈 화면으로 이동
                  router.push('/(tabs)');
                },
              },
            ]);
          } catch (error: any) {
            console.error('재료 추가 실패:', error);
            Alert.alert(
              '추가 실패',
              error?.message || '재료 추가 중 문제가 발생했습니다. 다시 시도해주세요.',
            );
          } finally {
            setIsSubmitting(false);
          }
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

