import { Ingredient, IngredientCategory } from '@features/ingredients/types';
import { INGREDIENT_ICON_CATEGORIES } from '@shared/constants/ingredientIcons';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://13.124.139.199';

// ---- 공통 타입 & 매퍼 ----

type MaterialResponse = {
  id: number;
  name: string;
  image_url?: string;
  price?: number;
  currency?: string;
  category?: string;
  purchased_at?: string;
  expired_at?: string;
  quantity?: number;
  quantity_unit?: string;
};

type MaterialManualRequest = {
  name: string;
  category?: string;
  purchased_at: string;
  expired_at: string;
  quantity: number;
  // 스웨거 스키마 기준으로 필수인 price, currency 추가
  price: number;
  currency: string;
  user_id: string;
  quantity_unit?: string;
};

// PATCH /materials/{id} 에 사용할 업데이트 payload (부분 업데이트이므로 모두 optional)
export type MaterialUpdateRequest = {
  name?: string;
  image_url?: string | null;
  price?: number;
  currency?: string;
  category?: string;
  purchased_at?: string;
  expired_at?: string;
  quantity?: number;
  quantity_unit?: string;
};

function mapCategory(category?: string): IngredientCategory | undefined {
  if (!category) return undefined;
  // 백엔드 category 문자열을 그대로 사용하되, 우리 쪽 타입에 맞추기 위해 as 단언
  return category as IngredientCategory;
}

// 재료 이름으로 iconId를 찾는 함수
function findIconIdByName(name: string, category?: string): string | undefined {
  // 카테고리가 있으면 해당 카테고리에서 먼저 찾기
  if (category) {
    const categoryData = INGREDIENT_ICON_CATEGORIES.find((cat) => cat.value === category);
    if (categoryData) {
      const item = categoryData.items.find((item) => item.name === name);
      if (item) return item.id;
    }
  }

  // 카테고리 없거나 못 찾았으면 전체에서 찾기
  for (const categoryData of INGREDIENT_ICON_CATEGORIES) {
    const item = categoryData.items.find((item) => item.name === name);
    if (item) return item.id;
  }

  return undefined;
}

function mapMaterialToIngredient(material: MaterialResponse): Ingredient {
  // 재료 이름으로 iconId 찾기
  const iconId = findIconIdByName(material.name, material.category);

  return {
    id: String(material.id),
    name: material.name,
    category: mapCategory(material.category),
    iconId: iconId,
    quantity: material.quantity,
    addedAt: material.purchased_at,
    expiresOn: material.expired_at,
    // 홈 리스트/카드에서 공통으로 사용하는 expiresAt 에도 날짜를 넣어두면
    // D-day 배지와 정렬 로직이 그대로 동작한다.
    expiresAt: material.expired_at,
    imageUri: material.image_url,
  };
}

// ---- 재료 목록 조회 (/materials) ----
// 스웨거 스키마:
// {
//   "result": [ { ...MaterialResponse } ],
//   "next_cursor": "string",
//   "has_next": true,
//   "size": 0
// }

type MaterialsListResponse = {
  result?: MaterialResponse[];
  next_cursor?: string | null;
  has_next?: boolean;
  size?: number;
};

export async function fetchIngredients(): Promise<Ingredient[]> {
  const allItems: MaterialResponse[] = [];
  let cursor: string | null = null;
  let hasMore = true;

  // 모든 페이지를 가져올 때까지 반복
  while (hasMore) {
    // cursor가 있으면 쿼리 파라미터로 추가
    const url = cursor
      ? `${API_BASE_URL}/materials?cursor=${encodeURIComponent(cursor)}`
      : `${API_BASE_URL}/materials`;

    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`재료 목록 조회 실패 (${response.status})`);
    }

    const data = (await response.json()) as MaterialsListResponse;
    const items = Array.isArray(data.result) ? data.result : [];
    allItems.push(...items);

    // 다음 페이지가 있는지 확인
    hasMore = data.has_next === true && data.next_cursor != null;
    cursor = data.next_cursor || null;
  }

  return allItems.map(mapMaterialToIngredient);
}

// ---- 개별 재료 조회 (/materials/{id}) ----

export async function fetchIngredientById(id: string | number): Promise<Ingredient> {
  const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`재료 조회 실패 (${response.status})`);
  }

  const data = (await response.json()) as MaterialResponse;
  return mapMaterialToIngredient(data);
}

// ---- 재료 삭제 (/materials/{id}) ----

export async function deleteIngredientById(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`재료 삭제 실패 (${response.status})`);
  }
}

// ---- 재료 일괄 삭제 (/materials?id=1&id=2...) ----

export async function bulkDeleteIngredients(ids: Array<string | number>): Promise<void> {
  if (ids.length === 0) return;

  const query = ids.map((id) => `id=${encodeURIComponent(String(id))}`).join('&');
  const response = await fetch(`${API_BASE_URL}/materials?${query}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`재료 일괄 삭제 실패 (${response.status})`);
  }
}

// ---- 재료 수정 (/materials/{id}) ----

export async function updateIngredientById(
  id: string | number,
  payload: MaterialUpdateRequest,
): Promise<Ingredient> {
  const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`재료 수정 실패 (${response.status})`);
  }

  const data = (await response.json()) as MaterialResponse;
  return mapMaterialToIngredient(data);
}

// ---- 재료 수동 등록 (/materials/manual) ----

export async function createMaterialManual(payload: MaterialManualRequest): Promise<Ingredient> {
  const response = await fetch(`${API_BASE_URL}/materials/manual`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = `재료 등록 실패 (${response.status})`;
    try {
      const errorData = await response.json();
      const anyData = errorData as any;
      if (typeof anyData?.message === 'string') {
        message = anyData.message;
      } else if (Array.isArray(anyData?.detail)) {
        // FastAPI 스타일의 validation error 를 사람이 읽을 수 있게 변환
        const first = anyData.detail[0];
        if (first) {
          const loc = Array.isArray(first.loc) ? first.loc.join('.') : first.loc;
          const msg = first.msg ?? JSON.stringify(first);
          message = `${loc}: ${msg}`;
        }
      } else {
        message = JSON.stringify(anyData);
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const data = (await response.json()) as MaterialResponse;
  return mapMaterialToIngredient(data);
}

// ---- 영수증 OCR로 재료 등록 (/materials/receipt) ----
// 스웨거 스키마:
// POST /materials/receipt
// Content-Type: multipart/form-data
// Body: { file: binary }
// Response 201: MaterialResponse[]

export async function createMaterialsFromReceipt(
  fileUri: string,
  fileName?: string,
  mimeType?: string,
): Promise<Ingredient[]> {
  // React Native에서 FormData 생성
  const formData = new FormData();
  
  // 파일 URI 정규화 (iOS는 file:// 제거, Android는 유지)
  // expo-camera는 이미 올바른 형식으로 URI를 반환하지만, 안전을 위해 정규화
  let normalizedUri = fileUri;
  if (normalizedUri.startsWith('file://')) {
    // iOS에서는 file://를 제거해야 할 수도 있지만, 
    // React Native FormData는 file://를 포함한 URI를 받아들입니다
    normalizedUri = normalizedUri;
  }
  
  // MIME 타입 결정: 전달받은 mimeType을 우선 사용, 없으면 파일 확장자로 추정
  let finalMimeType = mimeType;
  if (!finalMimeType) {
    const fileExtension = fileName?.split('.').pop()?.toLowerCase() || 'jpg';
    if (fileExtension === 'png') {
      finalMimeType = 'image/png';
    } else if (fileExtension === 'jpeg' || fileExtension === 'jpg') {
      finalMimeType = 'image/jpeg';
    } else if (fileExtension === 'webp') {
      finalMimeType = 'image/webp';
    } else if (fileExtension === 'heic' || fileExtension === 'heif') {
      // HEIC 파일은 JPEG로 변환되거나 서버가 지원하지 않을 수 있으므로
      // 일반적으로 JPEG로 변환해서 전송
      finalMimeType = 'image/jpeg';
    } else {
      finalMimeType = 'image/jpeg'; // 기본값
    }
  }
  
  // 파일 확장자 결정 (파일 이름이 없을 때 사용)
  const fileExtension = fileName?.split('.').pop()?.toLowerCase() || 'jpg';
  
  // FormData에 파일 추가
  // React Native FormData 형식: { uri, type, name }
  // HEIC 파일의 경우 서버가 지원하지 않을 수 있으므로, 
  // expo-image-picker가 이미 JPEG로 변환했을 가능성이 높음
  formData.append('file', {
    uri: normalizedUri,
    type: finalMimeType,
    name: fileName || `receipt.${fileExtension}`,
  } as any);

  console.log('OCR API 호출:', {
    uri: normalizedUri,
    type: finalMimeType,
    name: fileName || `receipt.${fileExtension}`,
    apiUrl: `${API_BASE_URL}/materials/receipt`,
  });

  const response = await fetch(`${API_BASE_URL}/materials/receipt`, {
    method: 'POST',
    headers: {
      // FormData를 사용할 때는 Content-Type을 명시하지 않습니다
      // React Native가 자동으로 multipart/form-data와 boundary를 설정합니다
    },
    body: formData,
  });

  if (!response.ok) {
    let message = `영수증 OCR 실패 (${response.status})`;
    let errorDetails: any = null;
    
    try {
      const errorText = await response.text();
      console.error('OCR API 에러 응답:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        // JSON 파싱 실패 시 텍스트 그대로 사용
        errorDetails = { raw: errorText };
      }
      
      const anyData = errorDetails as any;
      if (typeof anyData?.message === 'string') {
        message = anyData.message;
      } else if (typeof anyData?.detail === 'string') {
        message = anyData.detail;
      } else if (Array.isArray(anyData?.detail)) {
        // FastAPI 스타일의 validation error 를 사람이 읽을 수 있게 변환
        const first = anyData.detail[0];
        if (first) {
          const loc = Array.isArray(first.loc) ? first.loc.join('.') : first.loc;
          const msg = first.msg ?? JSON.stringify(first);
          message = `${loc}: ${msg}`;
        }
      } else if (anyData?.raw) {
        message = `서버 오류: ${anyData.raw.substring(0, 200)}`;
      } else {
        message = JSON.stringify(anyData);
      }
    } catch (parseError) {
      console.error('에러 응답 파싱 실패:', parseError);
    }
    
    throw new Error(message);
  }

  const data = (await response.json()) as MaterialResponse[];
  return data.map(mapMaterialToIngredient);
}

