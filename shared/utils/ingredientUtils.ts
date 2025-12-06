/**
 * 재료 관련 유틸리티 함수
 * - 재료 이름 파싱 (이름/용량 분리)
 * - 재료 이름으로 아이콘 ID 찾기
 */

import { INGREDIENT_ICON_CATEGORIES } from '@shared/constants/ingredientIcons';

/**
 * 재료 이름에서 이름과 용량을 파싱
 * @param materialName 예: "두부 120g(1/3모)" 또는 "냉스프"
 * @returns { name: string, amount?: string }
 * 
 * @example
 * parseMaterialName("두부 120g(1/3모)") // { name: "두부", amount: "120g(1/3모)" }
 * parseMaterialName("냉스프") // { name: "냉스프", amount: undefined }
 */
export function parseMaterialName(materialName: string): { name: string; amount?: string } {
  // 숫자나 괄호가 포함된 경우 용량으로 간주
  const hasAmount = /\d|\(|g|ml|개|컵|큰술|작은술/.test(materialName);
  
  if (hasAmount) {
    // 공백으로 분리 시도
    const parts = materialName.split(/\s+/);
    if (parts.length >= 2) {
      const name = parts[0];
      const amount = parts.slice(1).join(' ');
      return { name, amount };
    }
    // 공백이 없으면 전체를 이름으로
    return { name: materialName };
  }
  
  return { name: materialName };
}

/**
 * 재료 이름으로 아이콘 ID 찾기
 * @param name 재료 이름 (예: "두부", "간장")
 * @param category 재료 카테고리 (선택적, 있으면 해당 카테고리 내에서 먼저 검색)
 * @returns 아이콘 ID 또는 undefined
 * 
 * @example
 * findIconIdByName("두부", "dairy_processed") // "tofu"
 * findIconIdByName("간장") // "soy_sauce"
 */
export function findIconIdByName(name: string, category?: string): string | undefined {
  // 1. 카테고리가 주어지면 해당 카테고리 내에서 검색
  if (category) {
    const categoryConfig = INGREDIENT_ICON_CATEGORIES.find(cat => cat.value === category);
    if (categoryConfig) {
      const item = categoryConfig.items.find(item => item.name === name);
      if (item) return item.id;
    }
  }

  // 2. 카테고리가 없거나 해당 카테고리에서 못 찾으면 전체에서 검색
  for (const categoryConfig of INGREDIENT_ICON_CATEGORIES) {
    const item = categoryConfig.items.find(item => item.name === name);
    if (item) return item.id;
  }

  return undefined;
}


