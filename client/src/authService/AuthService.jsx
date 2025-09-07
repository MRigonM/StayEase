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

export const forgetPassword = async (email) => {
  try {
    const response = await api.post("/Account/ForgetPassword", { email });
    const { isSuccess, message, data } = response.data;
    return { success: isSuccess, message, data }; // data = token
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to send reset email";
    return { success: false, message: msg };
  }
};

// Reset Password
export const resetPassword = async (resetData) => {
  try {
    const response = await api.put("/Account/ResetPassword", resetData);
    const { isSuccess, message, errors, data } = response.data;

    if (isSuccess) return { success: true, message };

    // handle errors object or array
    let errorMessage = message;
    if (!errorMessage && errors) {
      errorMessage = Array.isArray(errors)
          ? errors.map(e => e.description || JSON.stringify(e)).join(", ")
          : errors;
    }
    if (!errorMessage && data) errorMessage = data;

    return { success: false, message: errorMessage || "Reset failed." };
  } catch (error) {
    const msg = error.response?.data?.message || "Reset failed.";
    return { success: false, message: msg };
  }
};