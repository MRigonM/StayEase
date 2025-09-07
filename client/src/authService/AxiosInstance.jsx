    import axios from 'axios';
    import { getAccessToken, clearTokens } from './TokenService';

    const api = axios.create({
      baseURL: 'https://localhost:5000/api',
      withCredentials: true,
    });

    api.interceptors.request.use((config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    api.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            clearTokens();
          }
          return Promise.reject(error);
        }
    );

    export default api;
