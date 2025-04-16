import axios from 'axios';
import { getAccessToken, setTokens, clearTokens, getRefreshToken } from './TokenService';


const api = axios.create({
  baseURL: 'http://localhost:2001/api',
  withCredentials: true,
});


// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// const refreshToken = async () => {
//   try {
//     const currentRefreshToken = getRefreshToken();
//     const res = await api.post(
//       '/Auth/refresh',
//       { refreshToken: currentRefreshToken },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const { accessToken, refreshToken: newRefreshToken } = res.data;

//     setTokens(accessToken, newRefreshToken);
//     api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

//     return accessToken;
//   } catch (err) {
//     clearTokens();
//     throw err;
//   }
// };

// // ✅ This is the key: Interceptor that handles 401 errors
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers['Authorization'] = `Bearer ${token}`;
//             return api(originalRequest);
//           })
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       return new Promise(async (resolve, reject) => {
//         try {
//           const newAccessToken = await refreshToken();
//           originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//           processQueue(null, newAccessToken);
//           resolve(api(originalRequest));
//         } catch (err) {
//           processQueue(err, null);
//           reject(err);
//         } finally {
//           isRefreshing = false;
//         }
//       });
//     }

//     return Promise.reject(error);
//   }
// );


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
    // console.log('Using refresh token:', currentRefreshToken);

    const res = await api.post(
      'http://localhost:2001/api/Auth/refresh',
      { refreshToken: currentRefreshToken }, 
    {
    headers: {
      'Content-Type': 'application/json', 
    },
        
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = res.data;

    // console.log('New access token:', accessToken);

    setTokens(accessToken, newRefreshToken);

    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    return accessToken;
  } catch (err) {
    console.error('Failed to refresh token:', err.response?.data || err.message);
    clearTokens();
    throw err;
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
