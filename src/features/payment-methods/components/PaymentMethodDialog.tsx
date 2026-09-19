import { useTranslation } from 'react-i18next';
import { QrCode, X, Upload } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { PaymentMethodType } from '@/interfaces/payment-methods.interface';
import type { UseFormReturn } from 'react-hook-form';
import type { PaymentMethodFormData } from '../schemas/payment-methods.schema';
import { InputError } from '@/components/form/InputError';
import { FormSaveButton } from '@/components/form/FormSaveButton';
import { usePaymentMethodDialog } from '../hooks/usePaymentMethodDialog';

interface PaymentMethodDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  form: UseFormReturn<PaymentMethodFormData>;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  isDirty: boolean;
  paymentTypes?: PaymentMethodType[];
}

export function PaymentMethodDialog({
  isOpen,
  onOpenChange,
  isEditing,
  form,
  onSubmit,
  isSaving,
  isDirty,
  paymentTypes = [],
}: PaymentMethodDialogProps) {
  const { register } = form;
  const { t } = useTranslation(['settings', 'common']);

  const {
    values: { currencyValue, paymentTypeIdValue, isActiveValue, selectedPaymentType, qrPreviewUrl },
    flags: { showEmailField, showBankFields, showQrField },
    errors,
    handlers: {
      handleFileChange,
      handleClearQr,
      handleSelectPaymentType,
      handleSelectCurrency,
      handleToggleActive,
    },
  } = usePaymentMethodDialog({ form, paymentTypes });

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
            <Label>{t('settings.payments.form.type', 'Tipo de Pago')}</Label>
            <Select value={paymentTypeIdValue} onValueChange={handleSelectPaymentType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('common.select_placeholder', 'Seleccione un tipo...')}>
                  {selectedPaymentType ? selectedPaymentType.name : t('common.select_placeholder', 'Seleccione un tipo...')}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {paymentTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputError message={errors.payment_type_id?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('settings.payments.form.name', 'Nombre Público')}</Label>
              <Input id="name" placeholder={t('settings.payments.form.name_ph', 'Ej. Pago Móvil Banesco')} {...register('name')} />
              <InputError message={errors.name?.message} />
            </div>

            <div className="space-y-2">
              <Label>{t('common.currency', 'Moneda')}</Label>
              <Select value={currencyValue} onValueChange={handleSelectCurrency}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="VES">{t('common.currencies.ves', 'Bolívares (VES)')}</SelectItem>
                  <SelectItem value="USD">{t('common.currencies.usd', 'Dólares (USD)')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showEmailField && (
              <div className="col-span-2 space-y-2">
                <Label htmlFor="email">{t('settings.payments.form.email', 'Correo electrónico')}</Label>
                <Input id="email" type="email" placeholder={t('settings.payments.form.email_ph', 'Ej. pago@empresa.com')} {...register('email')} />
                <InputError message={errors.email?.message} />
              </div>
            )}

            {showBankFields && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bank_name">{t('settings.payments.form.bank', 'Banco')}</Label>
                  <Input id="bank_name" placeholder={t('settings.payments.form.bank_ph', 'Ej. Banesco')} {...register('bank_name')} />
                  <InputError message={errors.bank_name?.message} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account_number">{t('settings.payments.form.account', 'Número de Cuenta / Teléfono')}</Label>
                  <Input id="account_number" placeholder={t('settings.payments.form.account_ph', 'Ej. 04141234567')} {...register('account_number')} />
                  <InputError message={errors.account_number?.message} />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="id_document">{t('settings.payments.form.document', 'Cédula / RIF')}</Label>
                  <Input id="id_document" placeholder={t('settings.payments.form.document_ph', 'Ej. V-12345678')} {...register('id_document')} />
                  <InputError message={errors.id_document?.message} />
                </div>
              </>
            )}

            {showQrField && (
              <div className="col-span-2 space-y-2 border-t pt-3 mt-2">
                <Label>{t('settings.payments.form.qr_code', 'Código QR del Pago')}</Label>
                
                {qrPreviewUrl ? (
                  <div className="relative flex flex-col items-center justify-center p-3 border rounded-lg bg-muted/30">
                    <img
                      src={qrPreviewUrl}
                      alt="Vista previa QR"
                      className="max-h-48 w-auto object-contain rounded-md border shadow-sm bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="flex gap-2 mt-3">
                      <Label
                        htmlFor="qr_file"
                        className="cursor-pointer inline-flex items-center gap-1.5 text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8 px-3 rounded-md transition-colors"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {t('common.change_image', 'Cambiar imagen')}
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClearQr}
                        className="text-destructive h-8 text-xs"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        {t('common.remove', 'Quitar')}
                      </Button>
                      <InputError message={errors.qr_code_url?.message} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="qr_file"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors border-muted-foreground/25"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <QrCode className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          <span className="font-semibold">{t('common.click_to_upload', 'Haz clic para subir')}</span> {t('common.or_drag_drop', 'o arrastra una imagen')}
                        </p>
                      </div>
                    </label>
                  </div>
                )}

                <Input
                  id="qr_file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-3 mt-4">
            <Label className="cursor-pointer" htmlFor="is_active">{t('common.active', 'Activo')}</Label>
            <Switch id="is_active" checked={isActiveValue} onCheckedChange={handleToggleActive} />
          </div>

          <div className="flex justify-end pt-4">
            <FormSaveButton isSaving={isSaving} isDirty={isDirty} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}