import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PlusIcon from '@/assets/images/plus.svg';
import IngredientSelectableCard from '@features/add/components/IngredientSelectableCard';
import { createMaterialManual, fetchIngredients } from '@features/ingredients/services/ingredients.api';
import { Ingredient } from '@features/ingredients/types';
import ActionButton from '@shared/components/buttons/ActionButton';
import SearchBar from '@shared/components/inputs/SearchBar';
import TagTabs from '@shared/components/tabs/TagTabs';
import {
  INGREDIENT_CATEGORY_OPTIONS,
  getExpiryDaysByIngredientName,
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
        <Pressable
          style={styles.suggestionCard}
          onPress={() => router.push('/add/form')}
        >
          <View style={styles.suggestionContent}>
            <View style={styles.suggestionIcon}>
              <Text style={styles.suggestionIconEmoji}>💡</Text>
            </View>
            <View style={styles.suggestionTexts}>
              <Text style={styles.suggestionTitle}>찾는 재료가 없나요?</Text>
              <Text style={styles.suggestionSubtitle}>재료나 반찬을 직접 추가해보세요!</Text>
            </View>
          </View>
          <Pressable
            style={styles.suggestionButton}
            onPress={() => router.push('/add/form')}
          >
            <PlusIcon width={20} height={20} color="#FFFFFF" />
          </Pressable>
        </Pressable>
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
        tone="primary"
        style={styles.actionButton}
        onPress={async () => {
          if (selectedCount === 0) return;

          setIsSubmitting(true);
          try {
            const selectedIngredients = ALL_INGREDIENTS.filter((ing) =>
              selectedIds.includes(ing.id),
            );

            // 선택한 재료들을 서버에 추가
            const today = new Date();
            const todayISO = today.toISOString();
            
            const results = await Promise.all(
              selectedIngredients.map((ingredient) => {
                // 재료 이름으로 유통기한 일수 찾기
                const expiryDays = getExpiryDaysByIngredientName(ingredient.name);
                
                // 유통기한 계산: 오늘 날짜 + 유통기한 일수
                const expiredAt = expiryDays
                  ? new Date(today.getTime() + expiryDays * 24 * 60 * 60 * 1000).toISOString()
                  : todayISO; // 매핑이 없으면 오늘 날짜 (집밥, 기타 등)

                return createMaterialManual({
                  name: ingredient.name,
                  category: ingredient.category || undefined,
                  purchased_at: todayISO,
                  expired_at: expiredAt,
                  quantity: 1,
                  price: 0,
                  currency: 'KRW',
                  user_id: '1', // TODO: 실제 로그인한 사용자 ID로 교체
                  quantity_unit: '개',
                });
              }),
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
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#FFE5B8',
    backgroundColor: '#FFF8E7',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginTop: 4,
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionIconEmoji: {
    fontSize: 32,
  },
  suggestionTexts: {
    flex: 1,
    gap: 4,
  },
  suggestionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
  },
  suggestionSubtitle: {
    fontSize: 13,
    color: '#666666',
  },
  suggestionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFAE2C',
    alignItems: 'center',
    justifyContent: 'center',
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

