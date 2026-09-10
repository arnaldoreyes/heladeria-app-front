import { Store, CreditCard, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TabbedLayout, type NavItem } from '@/components/layout/TabbedLayout';

export default function SettingsLayout() {
  const { t } = useTranslation();

  const SETTINGS_NAV : NavItem[]= [
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
      <TabbedLayout
        title={t('settings.title', 'Configuración')}
        description= {t('settings.description', 'Gestiona las preferencias y reglas de tu negocio.')}
        navItems={SETTINGS_NAV}
      />
  );
}