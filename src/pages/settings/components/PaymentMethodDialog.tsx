import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { t } from 'i18next';

interface PaymentMethodDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  form: any;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  paymentTypes: any[];
}

export function PaymentMethodDialog({
  isOpen,
  onOpenChange,
  isEditing,
  form,
  onSubmit,
  isSaving,
  paymentTypes,
}: PaymentMethodDialogProps) {
  const { register, setValue, watch, formState: { errors } } = form;

  const currencyValue = watch('currency');
  const paymentTypeIdValue = watch('payment_type_id');
  const isActiveValue = watch('is_active');

  const selectedPaymentType = paymentTypes.find((type: any) => type.id === paymentTypeIdValue);
  const paymentCode = selectedPaymentType?.code;

  const showEmailField = ['binance', 'paypal', 'zelle'].includes(paymentCode);
  const showBankFields = ['pago_movil', 'transfer_bs', 'transfer_usd'].includes(paymentCode);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('settings.payments.edit', 'Editar Método de Pago') : t('settings.payments.add', 'Añadir Método')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('settings.payments.form.type', 'Tipo de Pago (Zelle, Pago Móvil, etc)')}</Label>
            <Select value={paymentTypeIdValue} onValueChange={(val) => setValue('payment_type_id', val, { shouldValidate: true })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('common.select_placeholder', 'Seleccione un tipo...')}>
                  {selectedPaymentType ? selectedPaymentType.name : t('common.select_placeholder', 'Seleccione un tipo...')}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {paymentTypes.map((type: any) => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.payment_type_id && <p className="text-xs text-destructive">{errors.payment_type_id.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('settings.payments.form.name', 'Nombre Público')}</Label>
              <Input id="name" placeholder={t('settings.payments.form.name_ph', 'Ej. Pago Móvil Banesco')} {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t('common.currency', 'Moneda')}</Label>
              <Select value={currencyValue} onValueChange={(val) => setValue('currency', val, { shouldValidate: true })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="VES">{t('common.currencies.ves', 'Bolívares (VES)')}</SelectItem>
                  <SelectItem value="USD">{t('common.currencies.usd', 'Dólares (USD)')}</SelectItem>
                  <SelectItem value="EUR">{t('common.currencies.eur', 'Euros (EUR)')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showEmailField && (
              <div className="col-span-2 space-y-2">
                <Label htmlFor="email">{t('settings.payments.form.email', 'Correo electrónico')}</Label>
                <Input id="email" type="email" placeholder={t('settings.payments.form.email_ph', 'Ej. pago@empresa.com')} {...register('email')} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
            )}

            {showBankFields && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bank_name">{t('settings.payments.form.bank', 'Banco')}</Label>
                  <Input id="bank_name" placeholder={t('settings.payments.form.bank_ph', 'Ej. Banesco')} {...register('bank_name')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account_number">{t('settings.payments.form.account', 'Número de Cuenta / Teléfono')}</Label>
                  <Input id="account_number" placeholder={t('settings.payments.form.account_ph', 'Ej. 04141234567')} {...register('account_number')} />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="id_document">{t('settings.payments.form.document', 'Cédula / RIF')}</Label>
                  <Input id="id_document" placeholder={t('settings.payments.form.document_ph', 'Ej. V-12345678')} {...register('id_document')} />
                </div>
              </>
            )}
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-3 mt-4">
            <Label className="cursor-pointer" htmlFor="is_active">{t('common.active', 'Activo')}</Label>
            <Switch id="is_active" checked={isActiveValue} onCheckedChange={(checked) => setValue('is_active', checked, { shouldValidate: true })} />
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