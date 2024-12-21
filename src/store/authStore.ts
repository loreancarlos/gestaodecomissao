import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types";
import { AuthService, AuthError } from "../services/authService";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  adminResetPassword: (userId: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const { user, token } = await AuthService.login(email, password);
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          //const authError = error as AuthError;
          //throw new Error(authError.message);
          throw error;
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          await AuthService.changePassword(currentPassword, newPassword);
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Falha ao alterar a senha");
        }
      },
      adminResetPassword: async (userId: string, newPassword: string) => {
        try {
          await AuthService.adminResetPassword(userId, newPassword);
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Falha ao redefinir a senha");
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
