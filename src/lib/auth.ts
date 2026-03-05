const SESSION_COOKIE_NAME = 'admin_session';

export type AstroCookies = {
  get(name: string): { value: string } | undefined;
  set(name: string, value: string, options?: { httpOnly?: boolean; secure?: boolean; sameSite?: 'lax' | 'strict' | 'none'; path?: string; maxAge?: number }): void;
  delete(name: string): void;
};

/**
 * Get the session token from the cookie. Returns null if not authenticated.
 */
export function getSession(cookies: AstroCookies): string | null {
  const cookie = cookies.get(SESSION_COOKIE_NAME);
  if (!cookie?.value) return null;
  try {
    return Buffer.from(cookie.value, 'base64').toString('utf-8');
  } catch {
    return null;
  }
}

/**
 * Set the session cookie with the GitHub access token.
 */
export function setSession(cookies: AstroCookies, token: string): void {
  const value = Buffer.from(token, 'utf-8').toString('base64');
  cookies.set(SESSION_COOKIE_NAME, value, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear the session cookie.
 */
export function clearSession(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE_NAME);
}
