import { Outlet } from 'react-router';
import { BrandPanel } from '../BrandPanel';
import { CustomFullScreenLoading } from '../custom/CustomFullScreenLoading';
import { useCheckAuth } from '@/pages/auth/hooks/useCheckAuth';
import { useAuthStore } from '@/stores/auth-store';

export function AuthLayout() {
   const token = useAuthStore((s) => s.token);
    const { isChecking } = useCheckAuth();
  
    // Si hay un token guardado pero la query sigue validando, mostramos un loader
    if (token && isChecking) {
      return (
        <CustomFullScreenLoading />
      );
    }
   
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-accent/30 lg:flex-row">
        <BrandPanel />
        <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
            <Outlet />
        </div>
    </div>
  );
}