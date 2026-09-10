import { Link, useLocation, Navigate, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Snowflake,
  BarChart3,
  ShoppingCart,
  Package,
  Settings,
  LogOut,
  Moon,
  Sun,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { useLogoutMutation } from '@/pages/auth/hooks/useLogoutMutation';
import { useThemeStore } from '@/stores/theme-store';
import { useExchangeRates } from '@/pages/settings/hooks/useExchgeRates';

const NAV_ITEMS = [
  { href: '/admin/dashboard', labelKey: 'nav.analytics', defaultLabel: 'Analytics', icon: BarChart3, roles: ['superadmin', 'owner'] },
  { href: '/admin/sales/new', labelKey: 'nav.pos', defaultLabel: 'Point of Sale', icon: ShoppingCart, roles: ['superadmin', 'owner', 'cashier'] },
  { href: '/admin/inventory', labelKey: 'nav.inventory', defaultLabel: 'Inventory', icon: Package, roles: ['superadmin', 'owner'] },
  { href: '/admin/settings', labelKey: 'nav.settings', defaultLabel: 'Settings', icon: Settings, roles: ['superadmin', 'owner'] },
];

export function AppLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { mutate: logout, isPending } = useLogoutMutation();
  const { currentRate } = useExchangeRates();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const userRoles: string[] = Array.isArray((user as any).roles) 
    ? (user as any).roles 
    : [(user as any).role].filter(Boolean);

  const items = NAV_ITEMS.filter((i) => i.roles.some((r) => userRoles.includes(r)));
  const bottomNavItems = items.slice(0, 5);
  
  // Ruta por defecto para el logo (primer enlace disponible o fallback)
  const defaultHomeRoute = items[0]?.href || '/admin/sales/new';

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen bg-background max-w-full overflow-x-hidden">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-border/60 bg-card lg:flex shrink-0">
        <Link 
          to={defaultHomeRoute} 
          className="flex items-center gap-3 border-b border-border/60 px-6 py-5 hover:bg-muted/40 transition-colors"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Snowflake className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-none truncate">Ice King</p>
            <p className="mt-1 text-xs text-muted-foreground truncate">POS Engine</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{t(item.labelKey, item.defaultLabel)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/60 p-3">
          <div className="mb-3 rounded-lg bg-muted/50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground truncate">
                {t('settings.exchange.currentTitle', 'Tasa Activa en el Sistema')}
              </span>
              {currentRate?.currency && (
                <small className="shrink-0 font-mono text-[10px]">
                  {currentRate.currency}
                </small>
              )}
            </div>

            <div className="font-mono text-xl font-extrabold text-primary tracking-tight truncate">
              {currentRate ? `Bs. ${Number(currentRate.rate).toFixed(2)}` : 'N/A'}
            </div>
          </div>

          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {userRoles.join(', ')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="hidden h-4 w-4 dark:block" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground shrink-0"
              onClick={handleLogout}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-card/80 px-4 py-3 backdrop-blur lg:hidden">
          <Link to={defaultHomeRoute} className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
              <Snowflake className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold truncate">Ice King</span>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            {currentRate?.rate && (
              <div className="rounded-full bg-muted px-2.5 py-1 text-xs font-mono font-semibold truncate max-w-[110px]">
                Bs. {Number(currentRate.rate).toFixed(2)}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="hidden h-4 w-4 dark:block" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground shrink-0"
              onClick={handleLogout}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </Button>
          </div>
        </header>

        <main className="flex-1 pb-20 lg:pb-0 overflow-x-hidden">
          <Outlet />
        </main>

        {/* Mobile bottom navigation */}
        <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-30 flex items-stretch justify-around border-t border-border/60 bg-card/95 backdrop-blur lg:hidden px-2">
          {bottomNavItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors min-w-0',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate text-[10px] sm:text-xs w-full text-center px-0.5">
                  {t(item.labelKey, item.defaultLabel)}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}