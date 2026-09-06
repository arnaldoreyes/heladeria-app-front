import { RouterProvider } from "react-router";
import { type PropsWithChildren } from 'react';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

import { router } from "./router/routes";
import './index.css'
import './i18n' 

import { Toaster } from 'sonner';

import { CustomFullScreenLoading } from "./components/custom/CustomFullScreenLoading";
import { checkAuthAction } from "./pages/auth/actions/check-auth.action";
import { useAuthStore } from "./stores/auth-store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const CheckAuthProvider = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();

  const { isLoading } = useQuery({
    queryKey: ['auth', 'check-status'],
    queryFn: checkAuthAction,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: authStatus === 'authenticated' ? 1000 * 60 * 1.5 : false,
  });

  if (isLoading || authStatus === 'checking') {
    return <CustomFullScreenLoading />;
  }

  return children;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />

      <CheckAuthProvider>
        <RouterProvider router={router} />
      </CheckAuthProvider>

    </QueryClientProvider>
  )
}