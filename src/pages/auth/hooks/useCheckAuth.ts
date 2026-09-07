import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { checkAuthAction } from '../actions/check-auth.action';

export function useCheckAuth() {
  const setSession = useAuthStore((s) => s.setSession);
  const logout = useAuthStore((s) => s.logout);
  const access_token = useAuthStore((s) => s.access_token);

  const query = useQuery({
    queryKey: ['auth', 'check'],
    queryFn: checkAuthAction,
    enabled: !!access_token, 
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 15, // 15 minutos de caché para la sesión
  });

  // Sincronizamos el resultado de TanStack Query con el store de Zustand
  useEffect(() => {
    if (query.isSuccess && query.data) {
      setSession({
        user: query.data.user,
        business: query.data.business,
        access_token: query.data.access_token || access_token!,
        token_type: query.data.token_type || 'Bearer',
        expires_at: query.data.expires_at,
      });
    }
  }, [query.isSuccess, query.data, setSession, access_token]);

  useEffect(() => {
    if (query.isError) {
      logout();
    }
  }, [query.isError, logout]);

  return {
    ...query,
    isChecking: query.isLoading && !!access_token,
  };
}