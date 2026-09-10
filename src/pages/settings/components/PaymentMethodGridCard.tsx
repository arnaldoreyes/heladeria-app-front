import { type Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, MoreVertical, Wallet, CreditCard, Banknote } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { PaymentMethodFormData } from '../schemas/settings.schema';

interface PaymentMethodGridCardProps<TData> {
  row: Row<TData>;
  onEdit?: (method: PaymentMethodFormData) => void;
  onDelete?: (id: string) => void;
}

function getPaymentIcon(typeOrName?: string) {
  const text = (typeOrName || '').toLowerCase();
  if (text.includes('tarjeta') || text.includes('card') || text.includes('stripe')) {
    return <CreditCard className="w-4 h-4 text-muted-foreground" />;
  }
  if (text.includes('efectivo') || text.includes('cash')) {
    return <Banknote className="w-4 h-4 text-muted-foreground" />;
  }
  return <Wallet className="w-4 h-4 text-muted-foreground" />;
}

export function PaymentMethodGridCard<TData>({
  row,
  onEdit,
  onDelete,
}: PaymentMethodGridCardProps<TData>) {
  const { t } = useTranslation(['settings', 'common']);
  const method = row.original as unknown as PaymentMethodFormData;
  const isSelected = row.getIsSelected();

  return (
    <Card
      className={cn(
        'relative h-full transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between border overflow-hidden',
        isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'
      )}
    >
      {/* HEADER DE LA TARJETA */}
      <CardHeader className="p-4 pb-3 flex flex-row items-start justify-between space-y-0 gap-2">
        {/* Izquierda: Icono, Nombre y Tipo */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="p-2.5 rounded-lg bg-muted/80 flex-shrink-0">
            {getPaymentIcon(method.type?.name || method.name)}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="text-base font-semibold tracking-tight truncate" title={method.name}>
              {method.name}
            </h3>
            <span className="text-xs text-muted-foreground truncate">
              {method.type?.name || t('common.n_a', 'N/A')}
            </span>
          </div>
        </div>

        {/* Derecha: Checkbox + Menú de Acciones */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => row.toggleSelected(!!checked)}
            aria-label="Seleccionar método de pago"
            className="data-[state=checked]:bg-primary"
          />

          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">{t('common.actions', 'Acciones')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(method)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t('common.edit', 'Editar')}
                  </DropdownMenuItem>
                )}
                {onDelete && method.id && (
                  <DropdownMenuItem
                    onClick={() => onDelete(method.id!)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('common.delete', 'Eliminar')}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      {/* FOOTER / DETALLES DE LA TARJETA */}
      <CardContent className="p-4 pt-0 space-y-3 flex-1 flex flex-col justify-end">
        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          {/* Moneda */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {t('common.currency', 'Moneda')}:
            </span>
            <Badge variant={method.currency === 'USD' ? 'default' : 'secondary'} className="text-xs font-semibold">
              {method.currency}
            </Badge>
          </div>

          {/* Estado */}
          <Badge
            variant={method.is_active ? 'outline' : 'destructive'}
            className={cn(
              'text-xs font-medium',
              method.is_active && 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
            )}
          >
            {method.is_active
              ? t('common.active', 'Activo')
              : t('common.inactive', 'Inactivo')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}