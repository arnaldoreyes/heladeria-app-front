import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/auth-store';
import { registerAction } from '../actions/register.action';
import type { RegisterValues } from '../schemas/register.schema';
import type { AuthResponse } from '../interfaces/auth.response';

export function useRegisterMutation() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (data: RegisterValues) => registerAction(data),
    
    onSuccess: (data: AuthResponse) => {
      setSession({
        user: data.user,
        business: data.business,
        access_token: data.access_token,
        token_type: data.token_type,
        expires_at: data.expires_at,
      });
      toast.success(t('auth.toast.welcomeBack') || '¡Registro exitoso!');
      navigate('/admin', { replace: true });
    },
    
    onError: (error) => {
      console.error('Register error:', error);
      toast.error(t('auth.toast.invalidCredentials') || 'Error al registrar el negocio.');
    },
  });
}