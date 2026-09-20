import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { bulkUpdateValuesSchema, type BulkUpdateValuesFormData } from '../schemas/product.schema';
interface BulkUpdateValuesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BulkUpdateValuesFormData) => void;
  isSaving: boolean;
  selectedCount: number;
}

export function BulkUpdateValuesDialog({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
  selectedCount,
}: BulkUpdateValuesDialogProps) {
  const { t } = useTranslation(['products', 'common']);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BulkUpdateValuesFormData>({
    resolver: zodResolver(bulkUpdateValuesSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        price_usd: undefined,
        cost_usd: undefined,
        stock: undefined,
        min_stock_alert: undefined,
      });
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  
  const handleFormSubmit = (data: BulkUpdateValuesFormData) => {
    const payload: BulkUpdateValuesFormData = {};
    if (data.price_usd !== undefined && !isNaN(Number(data.price_usd))) payload.price_usd = Number(data.price_usd);
    if (data.cost_usd !== undefined && !isNaN(Number(data.cost_usd))) payload.cost_usd = Number(data.cost_usd);
    if (data.stock !== undefined && !isNaN(Number(data.stock))) payload.stock = Number(data.stock);
    if (data.min_stock_alert !== undefined && !isNaN(Number(data.min_stock_alert))) payload.min_stock_alert = Number(data.min_stock_alert);

    onSubmit(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {t('products.bulk_edit_title', 'Editar Valores Masivamente')} ({selectedCount})
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-2">
          <p className="text-xs text-muted-foreground">
            {t('products.bulk_edit_help', 'Solo se actualizarán los campos que modifiques.')}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price_usd">{t('products.price_usd', 'Precio ($ USD)')}</Label>
              <Input
                id="price_usd"
                type="number"
                step="0.01"
                placeholder="Dejar igual"
                {...register('price_usd')}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cost_usd">{t('products.cost_usd', 'Costo ($ USD)')}</Label>
              <Input
                id="cost_usd"
                type="number"
                step="0.01"
                placeholder="Dejar igual"
                {...register('cost_usd')}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="stock">{t('products.stock', 'Stock Actual')}</Label>
              <Input
                id="stock"
                type="number"
                placeholder="Dejar igual"
                {...register('stock')}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="min_stock_alert">{t('products.min_stock_alert', 'Alerta Stock Mínimo')}</Label>
              <Input
                id="min_stock_alert"
                type="number"
                placeholder="Dejar igual"
                {...register('min_stock_alert')}
              />
            </div>
          </div>

          {errors.root && (
            <p className="text-xs text-destructive">{errors.root.message}</p>
          )}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSaving}>
              {t('common.cancel', 'Cancelar')}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? t('common.saving', 'Guardando...') : t('common.save', 'Guardar Cambios')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}