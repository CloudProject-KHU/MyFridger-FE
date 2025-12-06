/**
 * 레시피 API 서비스
 * - 레시피 상세 정보 조회 (GET /recipes/{id}/instruction)
 * - API 응답을 프론트엔드 타입으로 변환
 */

import { getCategoryByIngredientNameOrGuess } from '@shared/constants/ingredientCategories';
import { findIconIdByName, parseMaterialName } from '@shared/utils/ingredientUtils';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://13.124.139.199';

// API 응답 타입
export type RecipeInstructionResponse = {
  recipe_id: number;
  recipe_pat: string;
  method: string;
  recipe_name: string;
  thumbnail_url: string;
  instructions: string[];
  material_names: string[];
  image_url: string[];
};

// 프론트엔드 타입
export type RecipeItem = {
  id: string;
  name: string;
  iconId?: string;
  category: string;
  amount?: string;
  hasStock?: boolean;
};

export type RecipeStep = {
  number: number;
  description: string;
  timer?: string;
};

export type RecipeDetail = {
  id: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  imageUri?: string;
  items: RecipeItem[];
  steps: RecipeStep[];
};



// API 응답을 프론트엔드 타입으로 변환
function mapRecipeInstructionToDetail(response: RecipeInstructionResponse): RecipeDetail {
  // 태그 생성 (recipe_pat, method)
  const tags: string[] = [];
  if (response.recipe_pat) {
    tags.push(response.recipe_pat);
  }
  if (response.method) {
    tags.push(response.method);
  }

  // 재료 매핑 (첫 번째 항목 제외 - 레시피 이름이므로)
  const items: RecipeItem[] = response.material_names
    .slice(1) // 첫 번째 항목 제외
    .map((materialName, index) => {
      const { name, amount } = parseMaterialName(materialName);
      const category = getCategoryByIngredientNameOrGuess(name);
      const iconId = findIconIdByName(name, category);
      
      return {
        id: `material-${index + 1}`, // 인덱스는 1부터 시작 (첫 번째 제외했으므로)
        name,
        iconId,
        category,
        amount,
        hasStock: undefined, // API에서 제공하지 않으므로 undefined
      };
    });

  // 조리 과정 매핑
  const steps: RecipeStep[] = response.instructions.map((instruction, index) => {
    // 번호 제거 (이미 "1. ", "2. " 형태로 포함되어 있을 수 있음)
    let cleanDescription = instruction.replace(/^\d+\.\s*/, '').trim();
    // 줄바꿈(\n)을 공백으로 치환
    cleanDescription = cleanDescription.replace(/\n/g, ' ');
    
    return {
      number: index + 1,
      description: cleanDescription,
    };
  });

  const result = {
    id: String(response.recipe_id),
    title: response.recipe_name,
    tags: tags.length > 0 ? tags : undefined,
    imageUri: response.thumbnail_url || undefined,
    items,
    steps,
  };
  
  console.log('API 응답 매핑 결과:', {
    thumbnail_url: response.thumbnail_url,
    imageUri: result.imageUri,
  });
  
  return result;
}

// 레시피 상세 정보 가져오기
export async function fetchRecipeInstruction(recipeId: string | number): Promise<RecipeDetail> {
  const url = `${API_BASE_URL}/recipes/${recipeId}/instruction`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`레시피 상세 정보 조회 실패 (${response.status})`);
  }

  const data = (await response.json()) as RecipeInstructionResponse;
  return mapRecipeInstructionToDetail(data);
}

