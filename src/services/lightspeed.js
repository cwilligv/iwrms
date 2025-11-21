import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  getTokenExpiry,
  setTokens,
  initTokensFromEnv
} from './lightspeedToken';

// Seed localStorage from .env on first load
initTokensFromEnv();

const oauthUrl     = process.env.VUE_APP_LIGHTSPEED_OAUTH_URL;
const clientId     = process.env.VUE_APP_LIGHTSPEED_CLIENT_ID;
const clientSecret = process.env.VUE_APP_LIGHTSPEED_CLIENT_SECRET;
const grantType    = process.env.VUE_APP_LIGHTSPEED_GRANT_TYPE;

async function refreshToken() {
  // lightspeed uses basic auth header with client credentials
  const basicAuth = btoa(`${clientId}:${clientSecret}`);

  // lightspeed needs form-encode for grant_type and refresh_token
  const params = new URLSearchParams();
  params.append('grant_type',    grantType);
  params.append('refresh_token', getRefreshToken());

  const resp = await axios.post(oauthUrl, params, {
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': `Basic ${basicAuth}`
    }
  });

  setTokens(resp.data);
  return resp.data.access_token;
}

const lightspeedApi = axios.create({
  baseURL: process.env.VUE_APP_LIGHTSPEED_BASE_URL
});

lightspeedApi.interceptors.request.use(
  async config => {
    const expiry = getTokenExpiry();
    // Refresh if token expires within 60s
    if (Date.now() > expiry - 60 * 1000) {
      const newToken = await refreshToken();
      config.headers.Authorization = `Bearer ${newToken}`;
    } else {
      config.headers.Authorization = `Bearer ${getAccessToken()}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default lightspeedApi;
