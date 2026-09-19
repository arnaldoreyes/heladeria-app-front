import { type Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, MoreVertical, User, Phone, Mail } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Customer } from '@/interfaces/customer.interface';

interface CustomerGridCardProps<TData> {
  row: Row<TData>;
  onEdit?: (customer: Customer) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

export function CustomerGridCard<TData>({
  row,
  onEdit,
  onDelete,
  onToggleStatus,
}: CustomerGridCardProps<TData>) {
  const { t } = useTranslation(['customers', 'common']);
  const customer = row.original as unknown as Customer;
  const isSelected = row.getIsSelected();

  return (
    <Card
      className={cn(
        'relative h-full transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between border overflow-hidden',
        isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'
      )}
    >
      <CardHeader className="p-4 pb-3 flex flex-row items-start justify-between space-y-0 gap-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="p-2.5 rounded-lg bg-muted/80 flex-shrink-0">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="text-base font-semibold tracking-tight truncate" title={customer.name}>
              {customer.name}
            </h3>
            <span className="text-xs text-muted-foreground truncate">
              {customer.id_document || t('common.n_a', 'N/A')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => row.toggleSelected(!!checked)}
            aria-label="Seleccionar cliente"
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
                  <DropdownMenuItem onClick={() => onEdit(customer)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t('common.edit', 'Editar')}
                  </DropdownMenuItem>
                )}
                {onDelete && customer.id && (
                  <DropdownMenuItem
                    onClick={() => onDelete(customer.id!)}
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

      <CardContent className="p-4 pt-0 space-y-3 flex-1 flex flex-col justify-end">
        <div className="space-y-1 text-xs text-muted-foreground">
          {customer.email && (
            <div className="flex items-center gap-1.5 truncate">
              <Mail className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{customer.email}</span>
            </div>
          )}
          {customer.phone && (
            <div className="flex items-center gap-1.5 truncate">
              <Phone className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{customer.phone}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <span className="text-xs font-medium text-muted-foreground">
            {t('common.status', 'Estado')}
          </span>

          <div className="flex items-center gap-2">
            {onToggleStatus && customer.id && (
              <Switch
                checked={customer.is_active}
                onCheckedChange={() => onToggleStatus(customer.id!)}
                aria-label={t('customers.toggle_status', 'Cambiar estado')}
              />
            )}
            <span className="text-xs text-muted-foreground">
              {customer.is_active
                ? t('common.active', 'Activo')
                : t('common.inactive', 'Inactivo')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}