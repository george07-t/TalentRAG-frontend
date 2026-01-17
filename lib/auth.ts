export type AuthTokens = {
  access: string;
  refresh: string;
};

const ACCESS_KEY = 'talentrag_access';
const REFRESH_KEY = 'talentrag_refresh';

function hasWindow(): boolean {
  return typeof window !== 'undefined';
}

export function getAccessToken(): string | null {
  if (!hasWindow()) return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (!hasWindow()) return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(tokens: AuthTokens) {
  if (!hasWindow()) return;
  localStorage.setItem(ACCESS_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

export function setAccessToken(access: string) {
  if (!hasWindow()) return;
  localStorage.setItem(ACCESS_KEY, access);
}

export function clearTokens() {
  if (!hasWindow()) return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function isLoggedIn(): boolean {
  return !!getRefreshToken() || !!getAccessToken();
}
