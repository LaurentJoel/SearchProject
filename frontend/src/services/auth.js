// services/auth.js
export const setAuth = (token, userData = null) => {
  localStorage.setItem('adminToken', token);
  if (userData) {
    localStorage.setItem('adminUser', JSON.stringify(userData));
  }
};

export const clearAuth = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('adminUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};

export const getToken = () => {
  return localStorage.getItem('adminToken');
};