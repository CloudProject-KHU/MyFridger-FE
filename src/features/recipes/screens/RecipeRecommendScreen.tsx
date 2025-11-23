import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import FilterIcon from '@/assets/images/filter.svg';
import Header from '@/shared/components/navigation/Header';

type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUri?: string;
};

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    title: '김치죽',
    description: '속을 든든하게 하는 간단한 김치죽!',
  },
  {
    id: '2',
    title: '참치간장계란밥',
    description: '식사 거르지 않는 초간단 식사!',
  },
  {
    id: '3',
    title: '간장두부덮밥',
    description: '간장 베이스의 두부덮밥!',
  },
  {
    id: '4',
    title: '돼지고기 고추장찌개',
    description: '간편하게 만들 수 있는 고추장찌개!',
  },
  {
    id: '5',
    title: '된장라면',
    description: '구수함의 깊이가 다른 맛!',
  },
];

const keyExtractor = (item: Recipe) => item.id;

export default function RecipeRecommendScreen() {
  const router = useRouter();

  const handleFilterPress = React.useCallback(() => {
    // TODO: 필터 기능 구현
  }, []);

  const handleCardPress = React.useCallback(
    (recipeId: string) => {
      router.push(`/recipes/${recipeId}` as never);
    },
    [router],
  );

  const renderItem = ({ item }: { item: Recipe }) => {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => handleCardPress(item.id)}
      >
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>🍲</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <Header
        title="냉장고 레시피"
        rightButton={{ icon: FilterIcon, onPress: handleFilterPress }}
        hideDivider
      />
      <FlatList
        data={SAMPLE_RECIPES}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // 탭바 높이 고려
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DBDBDB',
    gap: 16,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  cardPressed: {
    opacity: 0.7,
  },
});

