import { useMemo, useState } from 'react';
import { History, Store, Users, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { TabbedLayout, type NavItem } from '@/components/layout/TabbedLayout';

// Store & Hooks
import { useCartStore } from '@/features/sales/pos/hooks/useCartStore';
import { useActiveExchangeRate } from '@/features/exchange-rates/hooks/useActiveExchangeRate';
import { PosCheckoutDialog } from '@/features/sales/pos/components/PosCheckoutDialog';

export default function SalesLayout() {
  const { t } = useTranslation();

  // Estados de Modales / Drawers
  const [cartOpen, setCartOpen] = useState(false);

  // Zustand Store
  const { items: cartItems, updateQuantity, removeItem, clearCart, getTotalUsd, getTotalBs } = useCartStore();
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Tasa de cambio & Ventas de hoy
  const { currentRate } = useActiveExchangeRate();
  const exchangeRateValue = currentRate?.rate || 1;


  const salesNavItems: NavItem[] = useMemo(
    () => [
      {
        path: '/admin/sales/pos',
        label: t('sales.nav.sales', 'Venta Directa'),
        icon: Store,
      },
      {
        path: '/admin/sales/history',
        label: t('sales.nav.history', 'Historial de Ventas'),
        icon: History,
      },
      {
        path: '/admin/sales/customers',
        label: t('sales.nav.customers', 'Clientes'),
        icon: Users,
      },
    ],
    [t]
  );

  return (
    <>
      <TabbedLayout
        title={t('sales.title', 'Ventas')}
        description={t(
          'sales.description',
          'Registra nuevas ventas, consulta el historial de transacciones y gestiona tus clientes.'
        )}
        navItems={salesNavItems}
        headerActions={
          <>
            <Button size="sm" onClick={() => setCartOpen(true)} className="relative">
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Carrito</span>
              {totalItemsCount > 0 && (
                <span className="ml-1.5 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-bold text-primary-foreground">
                  {totalItemsCount}
                </span>
              )}
            </Button>
          </>
        }
      />

      {/* Slideout Lateral - Carrito */}
      <PosCheckoutDialog
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cartItems}
        totalUsd={getTotalUsd()}
        totalBs={getTotalBs()}
        exchangeRate={exchangeRateValue}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
      />

    </>
  );
}