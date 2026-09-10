// src/pages/settings/layouts/SettingsLayout.tsx
import { NavLink, Outlet } from 'react-router';
import { Store, CreditCard, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export default function SettingsLayout() {
  const { t } = useTranslation();

  const SETTINGS_NAV = [
    { 
      path: '/admin/settings/general', 
      label: t('settings.nav.general', 'Negocio'), 
      icon: Store 
    },
    { 
      path: '/admin/settings/payment-methods', 
      label: t('settings.nav.paymentMethods', 'Métodos de Pago'), 
      icon: CreditCard 
    },
    { 
      path: '/admin/settings/exchange-rates', 
      label: t('settings.nav.exchangeRates', 'Tasas de Cambio'), 
      icon: DollarSign 
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-6xl mx-auto w-full">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {t('settings.title', 'Configuración')}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {t('settings.description', 'Gestiona las preferencias y reglas de tu negocio.')}
        </p>
      </div>

      <div className="flex flex-col space-y-6">
        {/* Navegación tipo Tabs */}
        <div className="border-b border-border/60">
          <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide" aria-label="Tabs">
            {SETTINGS_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Contenido Dinámico (Subrutas) */}
        <main className="flex-1 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}