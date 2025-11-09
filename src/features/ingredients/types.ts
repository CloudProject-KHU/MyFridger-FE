export type IngredientCategory = 'vegetable' | 'meat' | 'seafood' | 'grain' | 'etc' | string;

export type Ingredient = {
  id: string;
  name: string;
  category?: IngredientCategory;
  expiresAt?: string;
  addedAt?: string;
  expiresOn?: string;
  memo?: string;
  imageUri?: string;
};
