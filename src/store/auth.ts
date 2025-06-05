import { create } from 'zustand';
import { loginAdmin } from '../lib/api';
import { clearAuth, getAdminInfo, isAuthenticated, setAdminInfo, setAuthToken } from '../lib/auth';

interface AuthState {
  isAuthenticated: boolean;
  adminInfo: { id: string; email: string } | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: isAuthenticated(),
  adminInfo: getAdminInfo(),
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginAdmin(email, password);
      setAuthToken(response.token);
      setAdminInfo(response.admin);
      set({ 
        isAuthenticated: true, 
        adminInfo: response.admin,
        isLoading: false 
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to login. Please check your credentials.';
      set({ 
        isAuthenticated: false, 
        adminInfo: null, 
        isLoading: false, 
        error: errorMessage 
      });
      return false;
    }
  },
  
  logout: () => {
    clearAuth();
    set({ 
      isAuthenticated: false, 
      adminInfo: null, 
      error: null 
    });
  },
  
  checkAuth: () => {
    const authStatus = isAuthenticated();
    const adminInfo = getAdminInfo();
    set({ 
      isAuthenticated: authStatus, 
      adminInfo: adminInfo 
    });
  }
}));