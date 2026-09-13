import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2,  Calendar } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { createSelectColumn } from '@/components/ui/data-table/createSelectColumn';
import { createActionsColumn } from '@/components/ui/data-table/createActionsColumn';
import { DataTableColumnHeader } from '@/components/ui/data-table/DataTableColumnHeader';
import type { ExpenseApiResponse } from '../interfaces/expense.response';

interface UseExpensesColumnsProps {
  onEdit: (expense: ExpenseApiResponse) => void;
  onDelete: (id: string) => void;
}

export function useExpensesColumns({ onEdit, onDelete }: UseExpensesColumnsProps): ColumnDef<any, ExpenseApiResponse>[] {
  const { t } = useTranslation(['expenses', 'common']);

  return useMemo(
    () => [
      createSelectColumn(),

      {
        accessorKey: 'concept',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('expenses.concept', 'Concepto')} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.original.concept}</span>
          </div>
        ),
      },

      {
        accessorKey: 'category',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('expenses.category', 'Categoría')} />
        ),
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.original.category}
          </Badge>
        ),
      },

      {
        accessorKey: 'amount_usd',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('expenses.amount_usd', 'Monto ($)')} />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-emerald-600">
            ${Number(row.original.amount_usd).toFixed(2)}
          </span>
        ),
      },

      {
        accessorKey: 'amount_bs',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('expenses.amount_bs', 'Monto (Bs)')} />
        ),
        cell: ({ row }) => (
          <span>
            Bs. {Number(row.original.amount_bs).toFixed(2)}
          </span>
        ),
      },

      {
        accessorKey: 'payment_method',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('expenses.payment_method', 'Método de Pago')} />
        ),
        cell: ({ row }) => (
          <Badge variant="secondary" className="capitalize">
            {row.original.payment_method.replace('_', ' ')}
          </Badge>
        ),
      },

      {
        accessorKey: 'expense_date',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('expenses.expense_date', 'Fecha')} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{row.original.expense_date}</span>
          </div>
        ),
      },

      createActionsColumn<ExpenseApiResponse>(
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
            onClick: (expense) => expense?.id && onDelete(expense.id),
          },
        ],
        t('common.actions', 'Acciones')
      ),
    ],
    [onEdit, onDelete, t]
  );
}