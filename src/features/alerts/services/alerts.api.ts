/**
 * 알림 API 서비스
 * - 소비기한 알림 목록 조회 (GET /alerts)
 *
 * 알림 API는 메인 백엔드와 다른 베이스 URL을 사용합니다.
 * EXPO_PUBLIC_ALERTS_API_BASE_URL 환경변수가 있으면 그것을 사용하고,
 * 없으면 기본값으로 주어진 API Gateway URL을 사용합니다.
 */

export const ALERTS_API_BASE_URL =
  process.env.EXPO_PUBLIC_ALERTS_API_BASE_URL ||
  'https://hogpbcvdle.execute-api.ap-northeast-2.amazonaws.com';

// ----- 타입 정의 -----

export type AlertItem = {
  alert_id: string;
  material_id: number | string;
  user_id: string;
  material_name: string;
  expiration_date: string; // 'YYYY-MM-DD'
  d_day_label: string; // 예: 'D-Day', 'D-3'
  days_remaining: number;
  is_sent: boolean;
  created_at?: string;
};

export type AlertsGroupedResponse = {
  groups: {
    // key: 'D-Day', 'D-3' 같은 라벨
    [dDayLabel: string]: AlertItem[];
  };
};

// UI에서 다루기 편하도록 평탄화한 형태
export type AlertFlatItem = AlertItem & {
  groupKey: string; // d_day_label와 동일하지만, 그룹 키로 사용
};

import { getAuthHeader } from '@features/auth/services/auth.storage';

/**
 * 소비기한 알림 목록 조회 (그룹 형태 그대로 반환)
 * - D-Day, D-n 등으로 그룹화된 알림 목록을 반환
 * - GET /alerts
 * - Request Body / Query Parameter 없음
 */
export async function fetchAlerts(): Promise<AlertsGroupedResponse> {
  const headers: Record<string, string> = {};
  const authHeader = getAuthHeader();
  if (authHeader) {
    headers.Authorization = authHeader;
  }

  const response = await fetch(`${ALERTS_API_BASE_URL}/alerts`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`알림 목록 조회 실패 (${response.status})`);
  }

  const data = (await response.json()) as AlertsGroupedResponse;
  return data;
}

/**
 * 그룹 응답을 화면에서 쓰기 좋은 1차원 리스트로 변환
 * - 예: FlatList로 D-Day, D-3 섹션을 그리거나, 전체 알림을 한 번에 보여줄 때 사용
 */
export function flattenAlerts(response: AlertsGroupedResponse): AlertFlatItem[] {
  const items: AlertFlatItem[] = [];

  Object.entries(response.groups || {}).forEach(([groupKey, groupItems]) => {
    groupItems.forEach((item) => {
      items.push({
        ...item,
        groupKey,
      });
    });
  });

  return items;
}



