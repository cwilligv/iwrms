// storing Lightspeed tokens
const ACCESS_KEY  = 'ls_access_token';
const REFRESH_KEY = 'ls_refresh_token';
const EXPIRY_KEY  = 'ls_token_expires_at';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function getTokenExpiry() {
  const ts = localStorage.getItem(EXPIRY_KEY);
  return ts ? parseInt(ts, 10) : 0;
}

/**
 * Store new tokens and calc an expiry timestamp.
 * @param {{ access_token: string, refresh_token: string, expires_in: number }} tokens
 */
export function setTokens({ access_token, refresh_token, expires_in }) {
  const expiresAt = Date.now() + expires_in * 1000;
  localStorage.setItem(ACCESS_KEY, access_token);
  localStorage.setItem(REFRESH_KEY, refresh_token);
  localStorage.setItem(EXPIRY_KEY, expiresAt.toString());
}

export function initTokensFromEnv() {
  const at        = process.env.VUE_APP_LIGHTSPEED_ACCESS_TOKEN;
  const rt        = process.env.VUE_APP_LIGHTSPEED_REFRESH_TOKEN;
  const expiresIn = Number(process.env.VUE_APP_LIGHTSPEED_EXPIRES_IN) || 3600;

  if (at && rt
      && !localStorage.getItem(ACCESS_KEY)
      && !localStorage.getItem(REFRESH_KEY)
  ) {
    setTokens({
      access_token:  at,
      refresh_token: rt,
      expires_in:    expiresIn
    });
  }
}
