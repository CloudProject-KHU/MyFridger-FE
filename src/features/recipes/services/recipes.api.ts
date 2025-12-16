/**
 * 레시피 API 서비스
 * - 레시피 상세 정보 조회 (GET /recipes/{id}/instruction)
 * - API 응답을 프론트엔드 타입으로 변환
 */

import { getCategoryByIngredientNameOrGuess } from '@shared/constants/ingredientCategories';
import { findIconIdByName, parseMaterialName } from '@shared/utils/ingredientUtils';
import { getAuthHeader } from '@features/auth/services/auth.storage';

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

// 레시피 추천 목록 응답 타입
export type RecipeRecommendationResponse = {
  id: number; // recommendation id (피드백용)
  recipe_id: number;
  recipe_name: string;
  thumbnail_url: string;
  recipe_pat: string;
  method: string;
  matched_materials: string[];
  missing_materials: string[];
  high_priority_materials: string[];
};

export type RecipeRecommendationListResponse = {
  result?: RecipeRecommendationResponse[];
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

// 냉장고 레시피 목록(요약) 타입
export type RecommendedRecipe = {
  id: string; // recipe_id (상세 조회에 사용)
  title: string;
  tags?: string[];
  imageUri?: string;
};



/**
 * 재료 이름에서 접두사 제거
 * "●주재료 : 감자 100g(1개)" -> "감자 100g(1개)"
 * "●소스 : 오렌지즙 15g(1큰술)" -> "오렌지즙 15g(1큰술)"
 */
function cleanMaterialName(materialName: string): string {
  // "●" 제거
  let cleaned = materialName.replace(/●/g, '').trim();
  
  // "주재료 :", "소스 :", "장식 :" 등의 패턴 제거
  // ":" 앞의 한글 단어와 ":" 뒤의 공백까지 제거
  cleaned = cleaned.replace(/^[가-힣\s]+:\s*/, '').trim();
  
  return cleaned;
}

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
  const items: RecipeItem[] = [];
  let itemIndex = 0;
  
  response.material_names
    .slice(1) // 첫 번째 항목 제외
    .forEach((materialName) => {
      // 접두사 제거 (●주재료 :, ●소스 :, ●장식 : 등)
      const cleanedName = cleanMaterialName(materialName);
      
      // 빈 문자열이면 스킵
      if (!cleanedName.trim()) {
        return;
      }
      
      const { name, amount } = parseMaterialName(cleanedName);
      // 재료 이름에서 띄어쓰기 제거 (예: "다진 마늘" -> "다진마늘")
      const nameWithoutSpaces = name.replace(/\s+/g, '');
      const category = getCategoryByIngredientNameOrGuess(nameWithoutSpaces);
      const iconId = findIconIdByName(nameWithoutSpaces, category);
      
      items.push({
        id: `material-${itemIndex + 1}`,
        name: nameWithoutSpaces,
        iconId,
        category,
        amount,
        hasStock: undefined, // API에서 제공하지 않으므로 undefined
      });
      
      itemIndex++;
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

// 냉장고 보유 식재료 기반 레시피 추천 목록 조회
type FetchRecommendedRecipesParams = {
  userId: string;
  limit?: number;
  minMatchRatio?: number;
};

export async function fetchRecommendedRecipes(
  params: FetchRecommendedRecipesParams,
): Promise<RecommendedRecipe[]> {
  const { userId, limit = 10, minMatchRatio = 0.3 } = params;

  const url = `${API_BASE_URL}/recommends/recipes`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    accept: 'application/json',
  };
  const authHeader = getAuthHeader();
  if (authHeader) {
    headers.Authorization = authHeader;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      user_id: userId,
      limit,
      min_match_ratio: minMatchRatio,
    }),
  });

  if (!response.ok) {
    throw new Error(`레시피 추천 목록 조회 실패 (${response.status})`);
  }

  const data = (await response.json()) as RecipeRecommendationListResponse;
  const list = Array.isArray(data.result) ? data.result : [];

  return list.map((item) => {
    const tags: string[] = [];
    if (item.recipe_pat) tags.push(item.recipe_pat);
    if (item.method) tags.push(item.method);

    return {
      id: String(item.recipe_id), // 상세 조회 시 /recipes/{recipe_id}/instruction 사용
      title: item.recipe_name,
      tags: tags.length > 0 ? tags : undefined,
      imageUri: item.thumbnail_url || undefined,
    };
  });
}


