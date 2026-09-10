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

      // Ventas y Clientes (Cajeros, Dueños, Superadmin)
      { path: 'sales', Component: /* SalesList */ () => <div>Ventas</div> },
      { path: 'sales/new', Component: /* POSInterface */ () => <div>Nueva Venta (Punto de Venta)</div> },
      { path: 'sales/:id', Component: /* SaleDetails */ () => <div>Detalle Venta</div> },
      
      { path: 'customers', Component: /* CustomersList */ () => <div>Clientes</div> },
      { path: 'customers/new', Component: /* CustomerForm */ () => <div>Nuevo Cliente</div> },
      { path: 'customers/:id/edit', Component: /* CustomerForm */ () => <div>Editar Cliente</div> },

      // Catálogo (Productos y Categorías)
      { path: 'products', Component: /* ProductsList */ () => <div>Productos</div> },
      { path: 'products/new', Component: /* ProductForm */ () => <div>Nuevo Producto</div> },
      { path: 'products/:id/edit', Component: /* ProductForm */ () => <div>Editar Producto</div> },
      
      { path: 'categories', Component: /* CategoriesList */ () => <div>Categorías</div> },

      // Inventario y Abastecimiento
      { path: 'inventory', Component: /* InventoryMovements */ () => <div>Movimientos de Inventario</div> },
      { path: 'restocks', Component: /* RestocksList */ () => <div>Reabastecimientos (Compras)</div> },
      { path: 'restocks/new', Component: /* RestockForm */ () => <div>Nueva Compra</div> },

      // Finanzas (Gastos)
      { path: 'expenses', Component: /* ExpensesList */ () => <div>Gastos</div> },
      { path: 'expenses/new', Component: /* ExpenseForm */ () => <div>Nuevo Gasto</div> },

      // Equipo (Usuarios)
      { path: 'users', Component: /* UsersList */ () => <div>Usuarios / Empleados</div> },
      { path: 'users/new', Component: /* UserForm */ () => <div>Nuevo Usuario</div> },
      { path: 'users/:id/edit', Component: /* UserForm */ () => <div>Editar Usuario</div> },

      // Configuración del Negocio
      { path: 'settings', Component:  SettingsLayout, 
        children: [
          // Subrutas para las pestañas de configuración
          { index: true, element: <Navigate to="general" replace /> },
          
          { path: 'general', Component: BusinessSettings },
          { path: 'payment-methods', Component:  PaymentMethodsConfig },
          { path: 'exchange-rates', Component:  ExchangeRatesConfig },  
           
        ]
      },

      //Solo Superadmin
      { path: 'businesses', Component: /* BusinessesList */ () => <div>Gestión de Empresas (Multi-tenant)</div> },
      { path: 'roles', Component: /* RolesList */ () => <div>Roles y Permisos</div> },
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