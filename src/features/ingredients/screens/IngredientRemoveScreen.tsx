import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import IngredientCardSelectable from '@features/ingredients/components/IngredientCardSelectable';
import { Ingredient } from '@features/ingredients/types';
import ActionButton from '@shared/components/buttons/ActionButton';
import Header from '@shared/components/navigation/Header';
import {
  fetchIngredients,
  bulkDeleteIngredients,
} from '@features/ingredients/services/ingredients.api';

const CARD_COLUMNS = 4;
const CARD_GAP = 10;
const HORIZONTAL_PADDING = 16;

const keyExtractor = (item: Ingredient) => item.id;

export default function IngredientRemoveScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();
  const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

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

  // 홈탭과 동일한 정렬 로직 적용 (소비기한 임박한 순서)
  const filteredIngredients = React.useMemo(() => {
    // "물"은 재료 목록에서 제외
    const filtered = ingredients.filter((ingredient) => 
      ingredient.name.trim().toLowerCase() !== '물'
    );
    
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

    return [...filtered].sort((a, b) => parseExpiry(a.expiresAt) - parseExpiry(b.expiresAt));
  }, [ingredients]);

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

  const cardWidth = React.useMemo(() => {
    const containerWidth = screenWidth - HORIZONTAL_PADDING * 2;
    return (containerWidth - CARD_GAP * (CARD_COLUMNS - 1)) / CARD_COLUMNS;
  }, [screenWidth]);

  const renderItem = React.useCallback(
    ({ item, index }: { item: Ingredient; index: number }) => {
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
          <IngredientCardSelectable
            ingredient={item}
            selected={selectedIds.includes(item.id)}
            onPress={toggleSelect}
          />
        </View>
      );
    },
    [selectedIds, toggleSelect, cardWidth],
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
        <FlatList
          data={filteredIngredients}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={CARD_COLUMNS}
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
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 8,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    marginBottom: 0,
  },
  listContent: {
    paddingBottom: 120,
  },
  cardWrapper: {
    marginBottom: CARD_GAP,
  },
  deleteButton: {
    marginTop: 'auto',
  },
});


