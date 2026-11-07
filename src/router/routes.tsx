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
import InventoryLayout from '@/pages/inventory/InventoryLayout';
import ProductsList from '@/features/products/components/ProductsList';
import RestockList from '@/features/restocks/components/RestockList';
import SuppliersList from '@/features/suppliers/components/SuppliersList';
//import ExpensesList from '@/pages/inventory/ExpensesList';
import { BusinessSettingForm } from '@/features/business/components/BusinessSettingForm';
import PaymentMethodsView from '@/features/payment-methods/components/PaymentMethodsView';
import ExchangeRatesForm from '@/features/exchange-rates/components/ExchangeRatesForm';
import CustomersView from '@/features/customers/components/CustomerView';
import CategoriesList from '@/features/categories/components/CategoriesList';
import SalesLayout from '@/pages/sales/SalesLayout';
import SalesHistoryList from '@/features/sales/history/components/SalesHistoryList'
import SalesView from '@/features/sales/pos/components/SalesView'
import TagsList from '@/features/tags/components/TagList';

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
        Component: SalesLayout, 
        children: [
          { path: 'pos',  Component: SalesView },
          { path: 'history', Component: SalesHistoryList },
          { path: 'customers', Component: CustomersView },      
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
          { path: 'tags', Component: TagsList },         
          { path: 'restocks', Component:  RestockList },
          { path: 'suppliers', Component:  SuppliersList },
          { path: 'history', Component: /* InventoryMovements */ () => <div>Movimientos</div> },
          //{ path: 'expenses', Component:  ExpensesList},
        ]
      },

      // Configuración del Negocio
      { path: 'settings', Component:  SettingsLayout, 
        children: [
          { index: true, element: <Navigate to="general" replace /> },         
          { path: 'general', Component: BusinessSettingForm },
          { path: 'payment-methods', Component:  PaymentMethodsView },
          { path: 'exchange-rates', Component:  ExchangeRatesForm },  
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