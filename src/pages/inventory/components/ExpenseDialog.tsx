
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';


interface ExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  form: any;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
}

const CATEGORIES = [
  { value: 'operativo', label: 'Operativo' },
  { value: 'servicios', label: 'Servicios Básicos' },
  { value: 'nomina', label: 'Nómina / Personal' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'transporte', label: 'Transporte / Logística' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'impuestos', label: 'Impuestos / Legal' },
  { value: 'general', label: 'General / Otros' },
];

const PAYMENT_METHODS = [
  { value: 'cash_usd', label: 'Efectivo USD' },
  { value: 'cash_bs', label: 'Efectivo Bs' },
  { value: 'transfer_bs', label: 'Transferencia Bs' },
  { value: 'pago_movil', label: 'Pago Móvil' },
  { value: 'zelle', label: 'Zelle' },
  { value: 'card', label: 'Tarjeta' },
];

export function ExpenseDialog({
  isOpen,
  onOpenChange,
  isEditing,
  form,
  onSubmit,
  isSaving,
}: ExpenseDialogProps) {
  const { t } = useTranslation(['expenses', 'common']);
  const { register, setValue, watch, formState: { errors } } = form;

  const categoryValue = watch('category');
  const paymentMethodValue = watch('payment_method');
  const amountUsd = watch('amount_usd');
  const amountBs = watch('amount_bs');
  const exchangeRate = watch('exchange_rate');

  // Cálculos dinámicos cuando cambia la tasa o los montos
  const handleUsdChange = (val: number) => {
    setValue('amount_usd', val, { shouldValidate: true });
    if (exchangeRate > 0) {
      setValue('amount_bs', Number((val * exchangeRate).toFixed(2)), { shouldValidate: true });
    }
  };

  const handleBsChange = (val: number) => {
    setValue('amount_bs', val, { shouldValidate: true });
    if (exchangeRate > 0) {
      setValue('amount_usd', Number((val / exchangeRate).toFixed(2)), { shouldValidate: true });
    }
  };

  const handleRateChange = (rate: number) => {
    setValue('exchange_rate', rate, { shouldValidate: true });
    if (rate > 0 && amountUsd > 0) {
      setValue('amount_bs', Number((amountUsd * rate).toFixed(2)), { shouldValidate: true });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t('expenses.dialog.edit_title', 'Editar Gasto')
              : t('expenses.dialog.add_title', 'Registrar Gasto')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="concept">{t('expenses.form.concept', 'Concepto')}</Label>
            <Input
              id="concept"
              placeholder={t('expenses.form.concept_placeholder', 'Ej. Pago de servicio de internet')}
              {...register('concept')}
            />
            {errors.concept && <p className="text-xs text-destructive">{errors.concept.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t('expenses.form.category', 'Categoría')}</Label>
              <Select
                value={categoryValue || 'general'}
                onValueChange={(val) => setValue('category', val, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('expenses.form.payment_method', 'Método de Pago')}</Label>
              <Select
                value={paymentMethodValue || 'cash_usd'}
                onValueChange={(val) => setValue('payment_method', val, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-muted/40 rounded-lg border">
            <div className="space-y-2">
              <Label htmlFor="exchange_rate">{t('expenses.form.rate', 'Tasa (Bs/$)')}</Label>
              <Input
                id="exchange_rate"
                type="number"
                step="0.01"
                value={exchangeRate || ''}
                onChange={(e) => handleRateChange(parseFloat(e.target.value) || 0)}
              />
              {errors.exchange_rate && <p className="text-xs text-destructive">{errors.exchange_rate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount_usd">{t('expenses.form.amount_usd', 'Monto ($)')}</Label>
              <Input
                id="amount_usd"
                type="number"
                step="0.01"
                value={amountUsd || ''}
                onChange={(e) => handleUsdChange(parseFloat(e.target.value) || 0)}
              />
              {errors.amount_usd && <p className="text-xs text-destructive">{errors.amount_usd.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount_bs">{t('expenses.form.amount_bs', 'Monto (Bs)')}</Label>
              <Input
                id="amount_bs"
                type="number"
                step="0.01"
                value={amountBs || ''}
                onChange={(e) => handleBsChange(parseFloat(e.target.value) || 0)}
              />
              {errors.amount_bs && <p className="text-xs text-destructive">{errors.amount_bs.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense_date">{t('expenses.form.date', 'Fecha del Gasto')}</Label>
            <Input
              id="expense_date"
              type="date"
              {...register('expense_date')}
            />
            {errors.expense_date && <p className="text-xs text-destructive">{errors.expense_date.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('common.notes', 'Notas / Observaciones')}</Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder={t('expenses.form.notes_placeholder', 'Detalles adicionales sobre este gasto...')}
              {...register('notes')}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? t('common.saving', 'Guardando...') : t('common.save', 'Guardar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}