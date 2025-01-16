import { create } from 'zustand';
import axios from 'axios';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "SELLER" | "BUYER" | "ADMIN"; // Use a union type for role
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  loadUser: () => Promise<void>;
};


type RegisterData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  companyId?: string;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,

  login: async (email, password) => {
    try {
      const response = await axios.post(`http://16.16.68.79:8900/api/auth/login`, {
        email,
        password,
      });
      const { tokens, user } = response.data;

      console.log(user)

      // Save tokens in localStorage
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);

      set({
        user,
        isAuthenticated: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });

      console.log(user?.role)
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  register: async (data) => {
    try {
      await axios.post('http://16.16.68.79:8900/api/auth/register', data);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  logout: async () => {
    const { accessToken, refreshToken } = get();

    try {
      if (accessToken && refreshToken) {
        await axios.post(
          'http://16.16.68.79:8900/api/auth/logout',
          { refreshToken },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      set({
        user: null,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
      });
    }
  },

  refreshAccessToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      await get().logout();
      return;
    }

    try {
      const response = await axios.post('http://16.16.68.79:8900/api/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      set({
        accessToken,
        refreshToken: newRefreshToken,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Failed to refresh token:', error);
      await get().logout();
    }
  },

  loadUser: async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      const response = await axios.get('http://16.16.68.79:8900/api/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      set({
        user: response.data,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Failed to load user:', error);
      await get().logout();
    }
  },

  // Add methods in the Zustand store
  updateProfile: async (data: Partial<RegisterData>) => {
    const { accessToken, user } = get(); // Retrieve state from the store
  
    if (!accessToken || !user || !user.id) {
      console.error('Missing access token or user data');
      return;
    }
  
    try {
      const response = await axios.patch(
        `http://16.16.68.79:8900/api/users/${user.id}`,
        data,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
  
      // Update the user in Zustand state
      set((state) => ({ ...state, user: { ...state.user, ...response.data } }));
    } catch (error) {
      console.error('Failed to update profile:');
      throw error;
    }
  },
  
}));
