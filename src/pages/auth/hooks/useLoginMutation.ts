import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/auth-store';
import { loginAction } from '../actions/login.action'; 
import type { LoginValues } from '../schemas/login.schema';
import type { AuthResponse } from '../interfaces/auth.response';

export function useLoginMutation() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Usamos el método correcto que definimos en el store
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: ({ email, password }: LoginValues) => loginAction(email, password),
    
    onSuccess: (data: AuthResponse) => {
      setSession({
        user: data.user,
        business: data.business,
        access_token: data.access_token,
        token_type: data.token_type,
        expires_at: data.expires_at,
      });

      toast.success(t('auth.toast.welcomeBack'));
      navigate('/admin', { replace: true });
    },
    
    onError: (error) => {
      console.error('Login error:', error);
      toast.error(t('auth.toast.invalidCredentials'));
    },
  });
}