import { clearTokens, getAccessToken, getRefreshToken, setAccessToken } from './auth';

export function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
}

async function tryParseJson(res: Response): Promise<any | null> {
  try {
    return await res.clone().json();
  } catch {
    return null;
  }
}

export async function refreshAccessToken(apiBase: string): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const res = await fetch(`${apiBase}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  const access = data?.access;
  if (!access) return null;

  setAccessToken(access);
  return access;
}

export type ApiFetchOptions = RequestInit & {
  apiBase?: string;
  /** Called if refresh fails and we clear tokens. */
  onAuthFailure?: () => void;
};

export async function apiFetch(path: string, options: ApiFetchOptions = {}): Promise<Response> {
  const apiBase = options.apiBase || getApiBase();
  const url = path.startsWith('http') ? path : `${apiBase}${path.startsWith('/') ? '' : '/'}${path}`;

  const doFetch = async () => {
    const access = getAccessToken();
    const headers: HeadersInit = {
      ...(options.headers || {}),
    };
    if (access) headers['Authorization'] = `Bearer ${access}`;

    return fetch(url, {
      ...options,
      headers,
    });
  };

  // If we have a refresh token but no access token (e.g., hard reload), refresh first.
  if (!getAccessToken() && getRefreshToken()) {
    await refreshAccessToken(apiBase);
  }

  let res = await doFetch();
  if (res.status !== 401) return res;

  const body = await tryParseJson(res);
  const code = body?.code;
  const isTokenNotValid = code === 'token_not_valid' || body?.detail?.toString?.().toLowerCase?.().includes?.('token');
  if (!isTokenNotValid) return res;

  // Try refresh once
  const newAccess = await refreshAccessToken(apiBase);
  if (!newAccess) {
    clearTokens();
    options.onAuthFailure?.();
    return res;
  }

  // Retry once with refreshed access token
  res = await doFetch();
  if (res.status === 401) {
    // Refresh token could be revoked/expired; force re-login.
    clearTokens();
    options.onAuthFailure?.();
  }

  return res;
}
