// lib/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: { email: string } | null;
  setToken: (token: string) => void;
  setUser: (user: { email: string }) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () =>
        set({
          token: null,
          user: null,
        }),
    }),
    {
      name: "auth-storage", // Name for localStorage
    }
  )
);
