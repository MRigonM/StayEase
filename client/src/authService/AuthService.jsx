import api from './AxiosInstance';
import { setTokens } from './TokenService';

export const loginUser = async (formData) => {
  try {
    const response = await api.post('/Account/Login', formData);

    const { isSuccess, message, data } = response.data;

    if (isSuccess) {
      // Adjust based on what backend actually sends
      const accessToken = data?.accessToken || data?.token;
      const userName = data?.userName || data?.email; // 👈 fallback to email if no name

      if (accessToken) {
        setTokens(accessToken, userName);
      }

      return { success: true, message, accessToken, userName };
    } else {
      return { success: false, message };
    }
  } catch (error) {
    let message = 'Login failed. Please try again.';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    return { success: false, message };
  }
};
