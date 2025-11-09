import React, { useMemo } from 'react';

import TagTabs from '@shared/components/tabs/TagTabs';

export type IngredientCategoryTabsProps = {
  categories: string[];
  activeCategory?: string;
  onChange?: (category: string) => void;
};

export default function IngredientCategoryTabs({
  categories,
  activeCategory,
  onChange,
}: IngredientCategoryTabsProps) {
  const options = useMemo(
    () =>
      categories.map((category) => ({
        label: category,
        value: category,
      })),
    [categories],
  );

  return (
    <TagTabs
      options={options}
      activeValue={activeCategory}
      onChange={onChange}
    />
  );
}
