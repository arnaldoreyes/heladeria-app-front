import { useEffect } from 'react';
import { useLogoutMutation } from './hooks/useLogoutMutation';

export default function LogoutPage() {
  const { mutate: logout } = useLogoutMutation();

  useEffect(() => {
    logout();
  }, [logout]);

  return null;
}