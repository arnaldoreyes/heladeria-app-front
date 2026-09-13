import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Receipt, Calendar, CreditCard } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import type { ExpenseApiResponse } from '../interfaces/expense.response';

interface ExpenseGridCardProps {
  row: ExpenseApiResponse;
  onEdit: (expense: ExpenseApiResponse) => void;
  onDelete: (id: string) => void;
}

export function ExpenseGridCard({ row, onEdit, onDelete }: ExpenseGridCardProps) {
  const { t } = useTranslation(['expenses', 'common']);

  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{row.concept}</CardTitle>
              <Badge variant="outline" className="text-xs capitalize mt-1">
                {row.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm pb-4">
        <div className="flex justify-between items-baseline border-b pb-2">
          <span className="text-muted-foreground">{t('expenses.amount', 'Monto')}:</span>
          <div className="text-right">
            <div className="text-base font-bold text-emerald-600">
              ${Number(row.amount_usd).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              Bs. {Number(row.amount_bs).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CreditCard className="h-3.5 w-3.5" />
            <span className="capitalize">{row.payment_method.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{row.expense_date}</span>
          </div>
        </div>

        {row.notes && (
          <p className="text-xs text-muted-foreground line-clamp-2 italic">
            "{row.notes}"
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t flex justify-end gap-1">
        <Button size="sm" variant="ghost" onClick={() => onEdit(row)}>
          <Edit className="h-4 w-4 mr-1" />
          {t('common.edit', 'Editar')}
        </Button>
        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onDelete(row.id)}>
          <Trash2 className="h-4 w-4 mr-1" />
          {t('common.delete', 'Eliminar')}
        </Button>
      </CardFooter>
    </Card>
  );
}