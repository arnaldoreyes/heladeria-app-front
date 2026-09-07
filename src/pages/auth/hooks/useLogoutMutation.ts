import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/auth-store';
import { logoutAction } from '../actions/logout.action';

export function useLogoutMutation() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const logoutStore = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: logoutAction,
    
    // Tanto en éxito como en error, limpiamos localmente para asegurar que el usuario salga
    onSettled: () => {
      logoutStore();
    },

    onSuccess: () => {
      toast.success(t('auth.toast.loggedOut') || 'Sesión cerrada correctamente');
      navigate('/login', { replace: true });
    },
    
    onError: (error) => {
      console.error('Logout error:', error);
      toast.error(t('auth.toast.logoutError') || 'Sesión cerrada localmente');
      navigate('/login', { replace: true });
    },
  });
}