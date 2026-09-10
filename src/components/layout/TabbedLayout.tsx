import { NavLink, Outlet } from 'react-router';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  path: string;
  label: string;
  icon?: LucideIcon;
}

interface TabbedLayoutProps {
  title: string;
  description?: string;
  navItems: NavItem[];
}

export function TabbedLayout({ title, description, navItems }: TabbedLayoutProps) {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 max-w-6xl mx-auto w-full">
      {/* Encabezado */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        )}
      </div>

      <div className="flex flex-col space-y-4">
        {/* Navegación optimizada: Estilo "Segmented Control" en móvil / Pestañas clásicas en desktop */}
        <div className="bg-muted/50 p-1.5 sm:bg-transparent sm:border-b sm:border-border/60 rounded-xl sm:rounded-none">
          <nav className="flex justify-around sm:justify-start sm:space-x-6" aria-label="Tabs">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={item.label} // Añade tooltip nativo útil para accesibilidad y hover
                  className={({ isActive }) =>
                    cn(
                      // En móvil: botones compactos centrados con fondo sutil al estar activo. En desktop: pestañas con borde inferior.
                      'flex items-center justify-center sm:justify-start gap-2.5 p-3 sm:py-3 sm:px-1 rounded-lg sm:rounded-none sm:border-b-2 transition-all flex-1 sm:flex-initial',
                      isActive
                        ? 'bg-background sm:bg-transparent sm:border-primary text-primary shadow-sm sm:shadow-none font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50 sm:hover:bg-transparent'
                    )
                  }
                >
                  {Icon && <Icon className="h-5 w-5 shrink-0" />}
                  {/* Oculto en móvil (solo muestra ícono), visible desde pantallas 'sm' en adelante */}
                  <span className="hidden sm:inline text-sm">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Contenido Dinámico */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}