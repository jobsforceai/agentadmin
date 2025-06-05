// Token management
export const setAuthToken = (token: string): void => {
  localStorage.setItem('jf_admin_token', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('jf_admin_token');
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('jf_admin_token');
};

// User info management
export const setAdminInfo = (adminInfo: { id: string; email: string }): void => {
  localStorage.setItem('jf_admin_info', JSON.stringify(adminInfo));
};

export const getAdminInfo = (): { id: string; email: string } | null => {
  const info = localStorage.getItem('jf_admin_info');
  return info ? JSON.parse(info) : null;
};

export const removeAdminInfo = (): void => {
  localStorage.removeItem('jf_admin_info');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Clear all auth data (logout)
export const clearAuth = (): void => {
  removeAuthToken();
  removeAdminInfo();
};