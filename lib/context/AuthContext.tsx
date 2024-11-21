"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>; // Zustand handles the global state; no need for additional Context.
};

export const useAuth = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  return {
    token,
    user,
    isAuthenticated: !!token,
    login: (token: string, user: { email: string }) => {
      setToken(token);
      setUser(user);
    },
    logout,
  };
};
