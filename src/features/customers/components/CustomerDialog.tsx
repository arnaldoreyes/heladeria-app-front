import { useTranslation } from 'react-i18next';
import type { UseFormReturn } from 'react-hook-form';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { InputError } from '@/components/form/InputError';
import { FormSaveButton } from '@/components/form/FormSaveButton';
import type { CustomerFormData } from '../schemas/customer.schema';

interface CustomerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  form: UseFormReturn<CustomerFormData>;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  isDirty: boolean;
}

export function CustomerDialog({
  isOpen,
  onOpenChange,
  isEditing,
  form,
  onSubmit,
  isSaving,
  isDirty,
}: CustomerDialogProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const { t } = useTranslation(['customers', 'common']);

  const isActiveValue = watch('is_active');
  const typeDocumentValue = watch('type_document');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing 
              ? t('customers.edit_title', 'Editar Cliente') 
              : t('customers.add_title', 'Nuevo Cliente')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Nombre Completo */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('common.name', 'Nombre completo')} *</Label>
            <Input
              id="name"
              placeholder={t('customers.form.name_ph', 'Ej. Juan Pérez')}
              {...register('name')}
            />
            <InputError message={errors.name?.message} />
          </div>

          {/* Documento de Identidad (type_document + id_document) */}
          <div className="space-y-2">
            <Label>{t('customers.id_document', 'Documento de Identidad')}</Label>
            <div className="grid grid-cols-3 gap-2">
              <Select
                value={typeDocumentValue || 'V'}
                onValueChange={(val) => setValue('type_document', val, { shouldDirty: true, shouldValidate: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="V">V - Venezolano</SelectItem>
                  <SelectItem value="E">E - Extranjero</SelectItem>
                  <SelectItem value="J">J - Jurídico</SelectItem>
                  <SelectItem value="G">G - Gubernamental</SelectItem>
                  <SelectItem value="P">P - Pasaporte</SelectItem>
                </SelectContent>
              </Select>

              <div className="col-span-2">
                <Input
                  id="id_document"
                  placeholder={t('customers.form.id_document_ph', 'Ej. 12345678')}
                  {...register('id_document')}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <InputError message={errors.type_document?.message} />
              <div className="col-span-2">
                <InputError message={errors.id_document?.message} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="phone">{t('common.phone', 'Teléfono')}</Label>
              <Input
                id="phone"
                placeholder={t('customers.form.phone_ph', 'Ej. 04141234567')}
                {...register('phone')}
              />
              <InputError message={errors.phone?.message} />
            </div>

            {/* Límite de Crédito USD */}
            <div className="space-y-2">
              <Label htmlFor="credit_limit_usd">{t('customers.credit_limit_usd', 'Límite de Crédito ($)')}</Label>
              <Input
                id="credit_limit_usd"
                type="number"
                step="0.01"
                min="0"
                placeholder={t('customers.form.credit_limit_ph', 'Ej. 100.00')}
                {...register('credit_limit_usd', { valueAsNumber: true })}
              />
              <InputError message={errors.credit_limit_usd?.message} />
            </div>
          </div>

          {/* Correo electrónico */}
          <div className="space-y-2">
            <Label htmlFor="email">{t('common.email', 'Correo electrónico')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('customers.form.email_ph', 'Ej. cliente@correo.com')}
              {...register('email')}
            />
            <InputError message={errors.email?.message} />
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="address">{t('common.address', 'Dirección')}</Label>
            <Textarea
              id="address"
              rows={3}
              placeholder={t('customers.form.address_ph', 'Ej. Av. Principal, Calle 4, San Cristóbal')}
              {...register('address')}
            />
            <InputError message={errors.address?.message} />
          </div>

          {/* Estado Activo / Inactivo */}
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 mt-4">
            <Label className="cursor-pointer" htmlFor="is_active">
              {t('common.active', 'Activo')}
            </Label>
            <Switch
              id="is_active"
              checked={isActiveValue}
              onCheckedChange={(checked) => setValue('is_active', checked, { shouldDirty: true })}
            />
          </div>

          {/* Botón de Guardar */}
          <div className="flex justify-end pt-4">
            <FormSaveButton isSaving={isSaving} isDirty={isDirty} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}