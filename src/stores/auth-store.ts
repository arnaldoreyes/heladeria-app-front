import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/interfaces/user.interface';

export type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';

interface AuthState {
  // Properties
  user: User | null;
  token: string | null;
  authStatus: AuthStatus;

  // Getters
  isAdmin: () => boolean;

  // Actions
  setSession: (user: User, token: string) => void;
  logout: () => void;
  setAuthStatus: (status: AuthStatus) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      token: null,
      authStatus: 'checking',

      // Getters
      isAdmin: () => {
        const user = get().user;
        if (!user) return false;
        return Array.isArray(user.roles) ? user.roles.includes('admin') : false;
      },

      // Actions
      setSession: (user, token) => {
        set({
          user,
          token,
          authStatus: 'authenticated',
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          authStatus: 'not-authenticated',
        });
      },

      setAuthStatus: (status) => {
        set({ authStatus: status });
      },
    }),
    {
      name: 'app-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);