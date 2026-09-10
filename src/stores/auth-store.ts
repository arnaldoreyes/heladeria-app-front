import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/interfaces/user.interface';
import type { BusinessFormData } from '@/pages/settings/schemas/settings.schema';

export type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';

interface LoginPayload {
  user: User;
  business: BusinessFormData;
  access_token: string;
  token_type: string;
  expires_at: string;
}

interface AuthState {
  // Properties
  user: User | null;
  business: BusinessFormData | null;
  access_token: string | null;
  token_type: string | null;
  expires_at: string | null;
  authStatus: AuthStatus;
  _hasHydrated: boolean; 

  // Getters
  isAdmin: () => boolean;

  // Actions
  setSession: (payload: LoginPayload) => void;
  logout: () => void;
  setAuthStatus: (status: AuthStatus) => void;
  setHasHydrated: (hydrated: boolean) => void; 
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      business: null,
      access_token: null,
      token_type: null,
      expires_at: null,
      authStatus: 'checking',
      _hasHydrated: false, // NUEVO

      isAdmin: () => {
        const user = get().user;
        if (!user) return false;
        const roles = (user as any).roles || [(user as any).role];
        return Array.isArray(roles)
          ? roles.some((r: string) => ['admin', 'Superadmin', 'owner'].includes(r))
          : false;
      },

      setSession: ({ user, business, access_token, token_type, expires_at }) => {
        set({
          user,
          business,
          access_token,
          token_type,
          expires_at,
          authStatus: 'authenticated',
        });
      },

      logout: () => {
        set({
          user: null,
          business: null,
          access_token: null,
          token_type: null,
          expires_at: null,
          authStatus: 'not-authenticated',
        });
      },

      setAuthStatus: (status) => {
        set({ authStatus: status });
      },

      setHasHydrated: (hydrated) => {
        set({ _hasHydrated: hydrated });
      },
    }),
    {
      name: 'app-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        business: state.business,
        access_token: state.access_token,
        token_type: state.token_type,
        expires_at: state.expires_at,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);