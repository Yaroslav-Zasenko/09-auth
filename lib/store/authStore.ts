// lib/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { User } from "@/types/user";
import * as clientApi from "@/lib/api/clientApi";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  register: (credentials: clientApi.AuthCredentials) => Promise<void>;
  login: (credentials: clientApi.AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
  clearAuth: () => void;
  clearIsAuthenticated: () => void; // Додано для сумісності з AuthNavigation
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const user = await clientApi.register(credentials);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: unknown) {
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.message
            : "Помилка реєстрації";
          set({
            error: errorMessage || "Помилка реєстрації",
            isLoading: false,
          });
          throw error;
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const user = await clientApi.login(credentials);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: unknown) {
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.message
            : "Помилка входу";
          set({
            error: errorMessage || "Помилка входу",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await clientApi.logout();
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error: unknown) {
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.message
            : "Помилка виходу";
          set({
            error: errorMessage || "Помилка виходу",
            isLoading: false,
          });
          throw error;
        }
      },

      checkSession: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await clientApi.checkSession();
          set({ user, isAuthenticated: !!user, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      clearAuth: () => set({ user: null, isAuthenticated: false, error: null }),

      clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
