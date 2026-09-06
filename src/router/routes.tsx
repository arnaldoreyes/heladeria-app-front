import { createBrowserRouter, Navigate } from 'react-router';

import LoginPage from '@/pages/auth/LoginPage';
import LogoutPage from '@/pages/auth/LogoutPage';
import ErrorPage from '@/pages/errors/ErrorPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { NotAuthenticatedRoute } from './guards/ProtectedRoutes';

export const router = createBrowserRouter([
  // Rutas Públicas     
  {
    path: '/auth', 
    element: <NotAuthenticatedRoute><AuthLayout /></NotAuthenticatedRoute>,
    ErrorBoundary: ErrorPage,
    children: [
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage }
    ],
  },

  // Rutas Protegidas (Dashboard / Admin Pages)
  {
    path: '/admin',
    ErrorBoundary: ErrorPage,
    children: [
      // Acción de Cierre de Sesión
      {
        path: 'logout',
        Component: LogoutPage,
      },
      
    
    ],
  },
  {
    path: '/',
    element: <Navigate to="/auth/login" />,
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);