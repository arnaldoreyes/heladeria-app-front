import { createBrowserRouter, Navigate } from 'react-router';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import LogoutPage from '@/pages/auth/LogoutPage';

// Layouts & Guards
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import ErrorPage from '@/pages/errors/ErrorPage';
import { AdminRoute, NotAuthenticatedRoute } from './guards/ProtectedRoutes';
import SettingsLayout from '@/pages/settings/SettingsLayout';
import BusinessSettings from '@/pages/settings/BusinessSettings';
import PaymentMethodsConfig from '@/pages/settings/PaymentMethodsConfig';
import ExchangeRatesConfig from '@/pages/settings/ExchangeRatesConfig';
import InventoryLayout from '@/pages/inventory/InventoryLayout';
import ProductsList from '@/pages/inventory/ProductsList';
import CategoriesList from '@/pages/inventory/CategoryList';
import SuppliersList from '@/pages/inventory/SuppliersList';
import ExpensesList from '@/pages/inventory/ExpensesList';

// AdminPages

export const router = createBrowserRouter([
  // ==========================================
  // RUTAS PÚBLICAS / AUTENTICACIÓN
  // ==========================================
  {
    path: '/auth', 
    element: <NotAuthenticatedRoute><AuthLayout /></NotAuthenticatedRoute>,
    ErrorBoundary: ErrorPage,
    children: [
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage }
    ],
  },

  // ==========================================
  // RUTAS PROTEGIDAS (DASHBOARD / ADMIN)
  // ==========================================
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AppLayout />
      </AdminRoute>
    ),
    ErrorBoundary: ErrorPage,
    children: [
      // Redirigir /admin a /admin/dashboard
      { index: true, element: <Navigate to="dashboard" replace /> },
      
      //Cerrar sesión
      { path: 'logout', Component: LogoutPage },
      
      // Dashboard (Analytics)
      { path: 'dashboard', Component: /* DashboardPage */ () => <div>Dashboard</div> },

      // Ventas y Clientes
      { 
        path: 'sales', 
        Component: InventoryLayout, 
        children: [
          {  index: true,  Component: /* SalesList */ () => <div>Ventas</div> },
          { path: 'history', Component: /* InventoryMovements */ () => <div>Ventas</div> },
          { path: 'customers', Component: /* CustomersList */ () => <div>Clientes</div> },
        ]
      },
     
      // Catálogo (Productos y Categorías)
      { 
        path: 'inventory', 
        Component: InventoryLayout, 
        children: [
          { index: true, element: <Navigate to="products" replace /> },
          { path: 'products', Component: ProductsList },      
          { path: 'categories', Component: CategoriesList },      
          { path: 'suppliers', Component:  SuppliersList },
          { path: 'history', Component: /* InventoryMovements */ () => <div>Movimientos</div> },
          { path: 'expenses', Component:  ExpensesList},
        ]
      },

      // Configuración del Negocio
      { path: 'settings', Component:  SettingsLayout, 
        children: [
          { index: true, element: <Navigate to="general" replace /> },         
          { path: 'general', Component: BusinessSettings },
          { path: 'payment-methods', Component:  PaymentMethodsConfig },
          { path: 'exchange-rates', Component:  ExchangeRatesConfig },  
          { path: 'users', Component: /* UsersList */ () => <div>Usuarios / Empleados</div> },           
        ]
      },
    ],
  },
  
  // ==========================================
  // RUTAS COMODÍN / FALLBACK
  // ==========================================
  {
    path: '/',
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);