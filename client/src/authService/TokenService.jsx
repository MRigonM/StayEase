const ACCESS_TOKEN_KEY = 'accessToken';
const USER_NAME_KEY = 'userName';

export const setTokens = (accessToken, userName) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (userName) {
    localStorage.setItem(USER_NAME_KEY, userName);
  }
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getUserName = () => {
  return localStorage.getItem(USER_NAME_KEY);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_NAME_KEY);
};
