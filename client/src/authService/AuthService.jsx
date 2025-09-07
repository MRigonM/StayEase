import api from './AxiosInstance';
import { setTokens } from './TokenService';

export const loginUser = async (formData) => {
  try {
    const response = await api.post('/Account/Login', formData);
    const { isSuccess, message, data } = response.data;

    if (isSuccess) {
      const accessToken = data?.accessToken || data?.token;
      if (accessToken) setTokens(accessToken);
      return { success: true, message, accessToken };
    } else {
      return { success: false, message };
    }
  } catch (error) {
    let message = 'Login failed. Please try again.';
    if (error.response?.data?.message) message = error.response.data.message;
    return { success: false, message };
  }
};
