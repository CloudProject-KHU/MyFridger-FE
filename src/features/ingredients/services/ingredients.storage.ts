import { Ingredient } from '@features/ingredients/types';
import { createMemoryStorage } from '@shared/libs/storage/mmkv';

const storage = createMemoryStorage('ingredients');

export async function loadIngredients(): Promise<Ingredient[]> {
  return storage.get<Ingredient[]>('items') ?? [];
}

export async function saveIngredients(items: Ingredient[]): Promise<void> {
  storage.set('items', items);
}

export async function clearIngredients(): Promise<void> {
  storage.remove('items');
}
