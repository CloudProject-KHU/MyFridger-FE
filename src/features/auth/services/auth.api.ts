/**
 * 인증 / 로그인 API 서비스
 * - 로그인 (POST /auth/login)
 * - 토큰 갱신 (POST /auth/token-refresh) — 스켈레톤
 *
 * 알림 API와 동일한 API Gateway URL을 사용합니다.
 */

import { ALERTS_API_BASE_URL } from '@features/alerts/services/alerts.api';
import { saveAuthTokens } from './auth.storage';

export type LoginRequest = {
  // 백엔드 스펙: { username, password }
  username: string;
  password: string;
};

// 백엔드 응답 스키마가 확정되면 구체적인 타입으로 교체합니다.
// 일단 any로 받아두고 사용하는 쪽에서 점진적으로 좁혀갈 수 있게 합니다.
export type LoginResponse = any;

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${ALERTS_API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let message = `로그인 실패 (${response.status})`;
    try {
      const errorData = await response.json();
      if (typeof (errorData as any)?.message === 'string') {
        message = (errorData as any).message;
      }
    } catch {
      // JSON 파싱 실패 시 기본 메시지 유지
    }
    throw new Error(message);
  }

  const data = (await response.json()) as LoginResponse;

  // 백엔드 응답이 일반적인 JWT 패턴이라고 가정:
  // { access_token: string; refresh_token?: string; token_type?: 'bearer' | 'Bearer' }
  const anyData = data as any;
  if (typeof anyData?.access_token === 'string') {
    saveAuthTokens({
      accessToken: anyData.access_token,
      refreshToken: anyData.refresh_token,
      tokenType: anyData.token_type ?? 'Bearer',
    });
  }

  return data;
}

// 토큰 갱신 (필요해지면 구현 확장)
export type TokenRefreshResponse = any;

export async function refreshToken(refreshToken: string): Promise<TokenRefreshResponse> {
  const response = await fetch(`${ALERTS_API_BASE_URL}/auth/token-refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`토큰 갱신 실패 (${response.status})`);
  }

  const data = (await response.json()) as TokenRefreshResponse;
  return data;
}


