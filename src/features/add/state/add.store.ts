export type AddIngredientDraft = {
  name: string;
  category: string;
  expiresAt?: string;
  memo?: string;
  imageUri?: string;
};

export type AddIngredientState = {
  draft: AddIngredientDraft;
  selectedCategory: string;
};

export const initialAddIngredientState: AddIngredientState = {
  draft: {
    name: '',
    category: '전체',
  },
  selectedCategory: '전체',
};

export function updateDraft(
  state: AddIngredientState,
  patch: Partial<AddIngredientDraft>
): AddIngredientState {
  return {
    ...state,
    draft: {
      ...state.draft,
      ...patch,
    },
  };
}

export function selectCategory(state: AddIngredientState, category: string): AddIngredientState {
  return {
    ...state,
    selectedCategory: category,
    draft: {
      ...state.draft,
      category,
    },
  };
}

export function resetDraft(): AddIngredientState {
  return initialAddIngredientState;
}
