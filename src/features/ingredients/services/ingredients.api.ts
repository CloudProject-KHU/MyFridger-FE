import { Ingredient } from '@features/ingredients/types';

export async function fetchIngredients(): Promise<Ingredient[]> {
  // TODO: AWS API 연동 예정
  return [];
}

export async function createIngredient(payload: Ingredient): Promise<Ingredient> {
  // TODO: AWS API 연동 예정
  return payload;
}
