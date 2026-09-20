import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { createSelectColumn } from '@/components/ui/data-table/createSelectColumn';
import { createActionsColumn } from '@/components/ui/data-table/createActionsColumn';
import { DataTableColumnHeader } from '@/components/ui/data-table/DataTableColumnHeader';
import type { PaymentMethod } from '@/interfaces/payment-methods.interface';
import { PaymentMethodQrDialog } from '../components/PaymentMethodQrDialog';

interface UsePaymentMethodsColumnsProps {
  onEdit: (method: PaymentMethod) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function usePaymentMethodsColumns({
  onEdit,
  onDelete,
  onToggleStatus,
}: UsePaymentMethodsColumnsProps): ColumnDef<any, PaymentMethod, any>[] {
  const { t } = useTranslation(['settings', 'common']);

  return useMemo(
    () => [
      createSelectColumn<PaymentMethod>(),

      {
        accessorKey: 'name',
        meta: { title: t('common.name', 'Nombre') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('common.name', 'Nombre')} />
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },

      {
        accessorKey: 'currency',
        meta: { title: t('common.currency', 'Moneda') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('common.currency', 'Moneda')} />
        ),
        cell: ({ row }) => (
          <Badge variant={row.original.currency === 'USD' ? 'default' : 'secondary'}>
            {row.original.currency}
          </Badge>
        ),
      },

      {
        id: 'type.name',
        accessorKey: 'type.name',
        meta: { title: t('settings.payments.type', 'Tipo de Pago') },
        //enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('settings.payments.type', 'Tipo de Pago')} />
        ),
        cell: ({ row }) => {
          const typeName = row.original.type?.name;
          return (
            <Badge variant="outline" className="font-normal">
              {typeName || t('common.n_a', 'N/A')}
            </Badge>
          );
        },
      },

      // Nueva Columna QR
      {
        id: 'qr',
        meta: { title: t('settings.payments.qr', 'QR') },
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={ t('settings.payments.qr', 'QR')} />
        ),
        cell: ({ row }) => {
          const method = row.original;
          const hasQr = Boolean(method.qr_code_url || method.account_number || method.id_document);

          

          if (!hasQr || row.original.type?.code == 'cash_bs' || row.original.type?.code == 'cash_usd') {
            return <span className="text-xs text-muted-foreground">{t('common.n_a', 'N/A')}</span>;
          }

          return (
            <PaymentMethodQrDialog
              qrCodeUrl={method.qr_code_url}
              bankName={method.bank_name}
              idDocument={method.id_document}
              accountNumber={method.account_number}
            />
          );
        },
      },

      // Columna Estado con el Switch integrado
      {
        accessorKey: 'is_active',
        meta: { title: t('common.status', 'Estado') },
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={ t('common.status', 'Estado')} />
        ),
        cell: ({ row }) => {
          const method = row.original;
          return (
            <div className="flex items-center gap-2">
              <Switch
                checked={method.is_active}
                onCheckedChange={() => onToggleStatus(method.id)}
                aria-label={t('settings.payments.toggle_status', 'Cambiar estado')}
              />
              <span className="text-xs text-muted-foreground">
                {method.is_active
                  ? t('common.active', 'Activo')
                  : t('common.inactive', 'Inactivo')}
              </span>
            </div>
          );
        },
      },

      createActionsColumn<PaymentMethod>(
        [
          {
            label: t('common.edit', 'Editar'),
            icon: <Edit className="h-4 w-4" />,
            onClick: onEdit,
          },
          {
            label: t('common.delete', 'Eliminar'),
            icon: <Trash2 className="h-4 w-4" />,
            variant: 'destructive',
            onClick: (method) => method?.id && onDelete(method.id),
          },
        ],
        t('common.actions', 'Acciones')
      ),
    ],
    [onEdit, onDelete, onToggleStatus, t]
  );
}