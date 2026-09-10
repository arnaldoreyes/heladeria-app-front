// src/providers/CheckAuthProvider.tsx
import { useEffect, type PropsWithChildren } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';
import { checkAuthAction } from '@/pages/auth/actions/check-auth.action';
import { useAuthStore } from '@/stores/auth-store';

export const CheckAuthProvider = ({ children }: PropsWithChildren) => {
  const { authStatus, access_token, _hasHydrated, setSession, logout, setAuthStatus } = useAuthStore();

  const query = useQuery({
    queryKey: ['auth', 'check-status'],
    queryFn: checkAuthAction,
    enabled: _hasHydrated && !!access_token && authStatus === 'checking',
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!_hasHydrated || authStatus !== 'checking') return;

    if (query.isSuccess && query.data) {
      setSession({
        user: query.data.user,
        business: query.data.business,
        access_token: query.data.access_token || access_token!,
        token_type: query.data.token_type || 'Bearer',
        expires_at: query.data.expires_at,
      });
    }

    if (query.isError) {
      logout();
    }
  }, [_hasHydrated, authStatus, query.isSuccess, query.isError, query.data, access_token, setSession, logout]);

  // Manejo inmediato si no hay token al hidratar
  if (_hasHydrated && !access_token && authStatus === 'checking') {
    setAuthStatus('not-authenticated');
  }

  if (!_hasHydrated || (authStatus === 'checking' && access_token && query.isLoading)) {
    return <CustomFullScreenLoading />;
  }

  return children;
};