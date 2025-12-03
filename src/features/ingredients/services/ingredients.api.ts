import { Ingredient, IngredientCategory } from '@features/ingredients/types';

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

function mapMaterialToIngredient(material: MaterialResponse): Ingredient {
  return {
    id: String(material.id),
    name: material.name,
    category: mapCategory(material.category),
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
  const response = await fetch(`${API_BASE_URL}/materials`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`재료 목록 조회 실패 (${response.status})`);
  }

  const data = (await response.json()) as MaterialsListResponse;
  const items = Array.isArray(data.result) ? data.result : [];
  return items.map(mapMaterialToIngredient);
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

