import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import IngredientCard from '@features/ingredients/components/IngredientCard';
import { Ingredient } from '@features/ingredients/types';
import DeleteIcon from '@/assets/images/delete.svg';
import Header from '@/shared/components/navigation/Header';

const SAMPLE_INGREDIENTS: Ingredient[] = [
  { id: '1', name: '토마토', category: 'vegetable' },
  { id: '2', name: '양파', category: 'vegetable' },
];

const keyExtractor = (item: Ingredient) => item.id;

export default function IngredientListScreen() {
  const renderItem = ({ item }: { item: Ingredient }) => (
    <IngredientCard ingredient={item} />
  );

  const handleReset = () => {
    // TODO: connect to state management to remove all ingredients
    // For now, this is a placeholder to be implemented later.
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <Header
        title="나의 냉장고"
        rightButton={{ icon: DeleteIcon, onPress: handleReset }}
        hideDivider
      />
      <View style={styles.container}>
        <Text style={styles.title}>보유 중인 재료</Text>
        <FlatList
          data={SAMPLE_INGREDIENTS}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
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
    paddingVertical: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  listContent: {
    gap: 12,
  },
});
