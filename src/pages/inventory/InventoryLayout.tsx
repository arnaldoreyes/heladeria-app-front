import { Store, Tags, ShoppingCart, ArrowRightLeft, Users, Receipt } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TabbedLayout, type NavItem } from '@/components/layout/TabbedLayout';

export default function InventoryLayout() {
  const { t } = useTranslation();

  const INVENTORY_NAV: NavItem[] = [
    { 
      path: '/admin/inventory/products', 
      label: t('inventory.nav.products', 'Productos'), 
      icon: Store 
    },
    { 
      path: '/admin/inventory/categories', 
      label: t('inventory.nav.categories', 'Categorías'), 
      icon: Tags 
    },
    { 
      path: '/admin/inventory/suppliers', 
      label: t('inventory.nav.suppliers', 'Proveedores'), 
      icon: Users
    },
    { 
      path: '/admin/inventory/restocks', 
      label: t('inventory.nav.restocks', 'Reabastecimientos'), 
      icon: ShoppingCart 
    },
    { 
      path: '/admin/inventory/history', 
      label: t('inventory.nav.history', 'Movimientos'), 
      icon: ArrowRightLeft 
    },
  ];

  return (
    <TabbedLayout 
      title={t('inventory.title', 'Inventario')}
      description={t('inventory.description', 'Gestiona tu catálogo, compras y movimientos de stock.')}
      navItems={INVENTORY_NAV}
    />
  );
}