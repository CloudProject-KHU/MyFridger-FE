export type IngredientCategory =
  | 'vegetable'
  | 'fruit'
  | 'meat'
  | 'seafood'
  | 'dairy_processed'
  | 'seasoning'
  | 'etc'
  | 'homemade'
  | string;

export type Ingredient = {
  id: string;
  name: string;
  category?: IngredientCategory;
  iconId?: string;
  quantity?: number;
  expiresAt?: string;
  addedAt?: string;
  expiresOn?: string;
  memo?: string;
  imageUri?: string;
};
