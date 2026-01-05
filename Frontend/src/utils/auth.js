const TOKEN_KEY = "token";
const USER_KEY = "user";

export const saveAuth = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

/* ✅ ADD THIS */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
