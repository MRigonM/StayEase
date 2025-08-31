import axios from 'axios';
import { setTokens } from './TokenService';
import api from './AxiosInstance';

const API_URL = 'https://localhost:5000/api/';

export const loginUser = async (formData) => {
  try {
    const response = await api.post(`${API_URL}Account/Login`, formData);
    const { accessToken } = response.data;

    setTokens(accessToken);

    return { success: true, accessToken };
  } catch (error) {
    let message = 'Login failed. Please try again.';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    }

    return { success: false, message };
  }
};