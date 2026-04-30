const TOKEN_KEY = "cataloggi_dashboard_token";
const TOKEN_EXPIRES_AT_KEY = "cataloggi_dashboard_token_expires_at";

export function getToken(): string | null {
  const expiresAt = sessionStorage.getItem(TOKEN_EXPIRES_AT_KEY);

  if (expiresAt && Date.parse(expiresAt) <= Date.now()) {
    clearToken();
    return null;
  }

  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, expiresAt?: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);

  if (expiresAt) {
    sessionStorage.setItem(TOKEN_EXPIRES_AT_KEY, expiresAt);
  } else {
    sessionStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
  }
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
}
