import axios from 'axios';
import { setTokens } from './TokenService';
import api from './AxiosInstance';
import {jwtDecode} from 'jwt-decode';

const API_URL = 'http://localhost:2001/api/Auth';

export const loginUser = async (formData) => {
  try {
    const response = await api.post(`${API_URL}/login`, formData);
    const { accessToken, refreshToken } = response.data;

    setTokens(accessToken, refreshToken);
  
  // const userResponese = await api.get(`${API_URL}/user`, {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });
  const decodedToken = jwtDecode(accessToken);
  const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

  localStorage.setItem('userId', userId);
    

    return { success: true, accessToken };
  } catch (error) {
    let message = 'Login failed. Please try again.';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    }

    return { success: false, message };
  }
};