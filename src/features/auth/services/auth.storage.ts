import { createMemoryStorage } from '@shared/libs/storage/mmkv';

const storage = createMemoryStorage('auth');

// 메모리 상에 현재 토큰을 함께 보관해서,
// 같은 JS 런타임 안에서는 항상 Authorization 헤더를 붙일 수 있도록 한다.
// (dev 환경의 Fast Refresh나 스토리지 구현 변경 등의 영향을 최소화)
let currentTokens: AuthTokens | null = null;

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_TYPE_KEY = 'token_type';

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
};

export function saveAuthTokens(tokens: AuthTokens) {
  currentTokens = tokens;
  storage.set(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) {
    storage.set(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
  if (tokens.tokenType) {
    storage.set(TOKEN_TYPE_KEY, tokens.tokenType);
  }
}

export function getAccessToken(): string | undefined {
  if (currentTokens?.accessToken) {
    return currentTokens.accessToken;
  }
  return storage.getString(ACCESS_TOKEN_KEY);
}

export function getAuthHeader(): string | undefined {
  const accessToken = getAccessToken();
  if (!accessToken) return undefined;

  const tokenType = currentTokens?.tokenType ?? storage.getString(TOKEN_TYPE_KEY) ?? 'Bearer';
  return `${tokenType} ${accessToken}`;
}

export function clearAuthTokens() {
  currentTokens = null;
  storage.remove(ACCESS_TOKEN_KEY);
  storage.remove(REFRESH_TOKEN_KEY);
  storage.remove(TOKEN_TYPE_KEY);
}


