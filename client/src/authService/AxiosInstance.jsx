import axios from 'axios';
import { getAccessToken, setTokens, clearTokens, getRefreshToken } from './TokenService';

const api = axios.create({
  baseURL: 'http://localhost:2001/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;

const refreshToken = async () => {
  if (isRefreshing) return;
  isRefreshing = true;

  try {
    const currentRefreshToken = getRefreshToken(); 
    console.log('Using refresh token:', currentRefreshToken);

    const res = await axios.post(
      'http://localhost:2001/api/Auth/refresh',
      currentRefreshToken,
      {
        withCredentials: true,
        headers: {
            'Content-Type': 'text/plain', 
          },
          transformRequest: [(data, headers) => {
            return data; // 
          }],
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = res.data;
    console.log('New access token:', accessToken);

    setTokens(accessToken, newRefreshToken);

    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } catch (err) {
    console.error('Failed to refresh token:', err.response?.data || err.message);
    debugger;
    clearTokens();
    // window.location.href = '/login';
  } finally {
    isRefreshing = false;
  }
};

setInterval(() => {
  const token = getAccessToken();
  if (token) {
    refreshToken();
  }
}, 30000); 

export default api;
