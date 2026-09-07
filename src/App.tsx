// src/App.tsx
import { RouterProvider } from "react-router";
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { router } from "./router/routes";
import { queryClient } from "./lib/query-client";
import { CheckAuthProvider } from "./providers/CheckAuthProvider";
import { useThemeStore } from "./stores/theme-store";

import './index.css';
import './i18n';

// Inicializar tema al cargar la app
useThemeStore.getState().setTheme(useThemeStore.getState().theme);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <Toaster />
        <CheckAuthProvider>
          <RouterProvider router={router} />
        </CheckAuthProvider>
    </QueryClientProvider>
  );
}