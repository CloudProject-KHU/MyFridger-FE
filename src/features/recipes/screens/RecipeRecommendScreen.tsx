import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/shared/components/badges/Badge';
import Header from '@/shared/components/navigation/Header';
import {
  RecommendedRecipe,
  fetchRecommendedRecipes,
} from '@features/recipes/services/recipes.api';

const keyExtractor = (item: RecommendedRecipe) => item.id;

export default function RecipeRecommendScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = React.useState<RecommendedRecipe[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        // TODO: 실제 로그인한 사용자 ID로 교체
        const list = await fetchRecommendedRecipes({
          userId: '1',
          limit: 10,
          minMatchRatio: 0.3,
        });
        if (isMounted) {
          setRecipes(list);
        }
      } catch (e: any) {
        console.error('레시피 추천 목록 불러오기 실패:', e);
        if (isMounted) {
          setError(e?.message || '레시피 목록을 불러오는 중 문제가 발생했습니다.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCardPress = React.useCallback(
    (recipeId: string) => {
      router.push(`/recipes/${recipeId}` as never);
    },
    [router],
  );

  const renderItem = ({ item }: { item: RecommendedRecipe }) => {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => handleCardPress(item.id)}
      >
        {item.imageUri ? (
          <Image
            source={{ uri: item.imageUri }}
            style={styles.thumbnail}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>🍲</Text>
          </View>
        )}
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

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="small" color="#FFAE2C" />
          <Text style={styles.loadingText}>레시피를 불러오는 중입니다...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (recipes.length === 0) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>추천할 레시피가 없습니다.</Text>
          <Text style={styles.emptySubText}>냉장고에 재료를 더 추가해 보세요.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={recipes}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <Header title="냉장고 레시피" hideDivider />
      {renderContent()}
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
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },
  emptySubText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
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
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
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

