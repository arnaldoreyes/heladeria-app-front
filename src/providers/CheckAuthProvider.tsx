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
    if (!_hasHydrated) return;

    if (!access_token && authStatus === 'checking') {
      setAuthStatus('not-authenticated');
      return;
    }

    if (query.isSuccess && query.data && authStatus === 'checking') {
      setSession({
        user: query.data.user,
        business: query.data.business,
        access_token: query.data.access_token || access_token!,
        token_type: query.data.token_type || 'Bearer',
        expires_at: query.data.expires_at,
      });
    }

    if (query.isError && authStatus === 'checking') {
      logout();
    }
  }, [_hasHydrated, access_token, authStatus, query.isSuccess, query.data, query.isError, setSession, logout, setAuthStatus]);

  if (!_hasHydrated || (query.isLoading && !!access_token && authStatus === 'checking')) {
    return <CustomFullScreenLoading />;
  }

  if (authStatus === 'checking' && access_token) {
    return <CustomFullScreenLoading />;
  }

  return children;
};