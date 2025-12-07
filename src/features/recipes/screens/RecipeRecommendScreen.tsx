import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/shared/components/badges/Badge';
import Header from '@/shared/components/navigation/Header';

type Recipe = {
  id: string;
  title: string;
  tags?: string[];
  imageUri?: string;
};

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    title: '김치죽',
    tags: ['국&찌개', '끓이기'],
  },
  {
    id: '2',
    title: '참치간장계란밥',
    tags: ['밥반찬', '볶기'],
  },
  {
    id: '3',
    title: '간장두부덮밥',
    tags: ['밥반찬', '볶기'],
  },
  {
    id: '4',
    title: '돼지고기 고추장찌개',
    tags: ['국&찌개', '끓이기'],
  },
  {
    id: '5',
    title: '된장라면',
    tags: ['면요리', '끓이기'],
  },
];

const keyExtractor = (item: Recipe) => item.id;

export default function RecipeRecommendScreen() {
  const router = useRouter();

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
          {item.tags && item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.map((tag, index) => (
                <Badge key={index} label={tag} variant="tag" />
              ))}
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <Header
        title="냉장고 레시피"
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
    padding: 24,
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
    gap: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cardPressed: {
    opacity: 0.7,
  },
});

