import { Ingredient } from '@features/ingredients/types';

export type IngredientsState = {
  items: Ingredient[];
};

export const initialIngredientsState: IngredientsState = {
  items: [],
};

export function addIngredient(state: IngredientsState, ingredient: Ingredient): IngredientsState {
  return {
    ...state,
    items: [...state.items, ingredient],
  };
}

export function removeIngredient(state: IngredientsState, ingredientId: string): IngredientsState {
  return {
    ...state,
    items: state.items.filter((item) => item.id !== ingredientId),
  };
}

export function updateIngredient(state: IngredientsState, ingredient: Ingredient): IngredientsState {
  return {
    ...state,
    items: state.items.map((item) => (item.id === ingredient.id ? ingredient : item)),
  };
}
