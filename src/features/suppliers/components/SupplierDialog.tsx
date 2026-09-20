import { useTranslation } from 'react-i18next';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { UseFormReturn } from 'react-hook-form';
import type { SupplierFormData } from '../schemas/supplier.schema';
import { InputError } from '@/components/form/InputError';
import { FormSaveButton } from '@/components/form/FormSaveButton';

interface SupplierDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  form: UseFormReturn<SupplierFormData>
  isSaving: boolean;
  isDirty: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const TAX_TYPES = [
  { value: 'J', label: 'J - Jurídico' },
  { value: 'V', label: 'V - Venezolano' },
  { value: 'E', label: 'E - Extranjero' },
  { value: 'G', label: 'G - Gubernamental' },
  { value: 'P', label: 'P - Pasaporte' },
];

export function SupplierDialog({
  isOpen,
  onOpenChange,
  isEditing,
  form,
  onSubmit,
  isSaving,
  isDirty,
}: SupplierDialogProps) {
  const { t } = useTranslation(['suppliers', 'common']);
  const { register, setValue, watch, formState: { errors } } = form;

  const taxTypeValue = watch('tax_type');
  const isActiveValue = watch('is_active');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t('suppliers.dialog.edit_title', 'Editar Proveedor')
              : t('suppliers.dialog.add_title', 'Añadir Proveedor')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Nombre / Razón Social */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('suppliers.form.name', 'Nombre / Razón Social')}</Label>
            <Input
              id="name"
              placeholder={t('suppliers.form.name_placeholder', 'Ej. Distribuidora Polar, C.A.')}
              {...register('name')}
            />
          <InputError message={errors.name?.message} />  
          </div>

          {/* Documento Fiscal (Tipo + Número) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2 col-span-1">
              <Label>{t('suppliers.form.tax_type', 'Tipo Doc.')}</Label>
              <Select
                value={taxTypeValue || 'J'}
                onValueChange={(val) => setValue('tax_type', val, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TAX_TYPES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.tax_type?.message} />  
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="tax_id">{t('suppliers.form.tax_id', 'Número de Documento (RUT/RIF)')}</Label>
              <Input
                id="tax_id"
                placeholder={t('suppliers.form.tax_id_placeholder', 'Ej. 12345678-9')}
                {...register('tax_id')}
              />
            <InputError message={errors.tax_id?.message} />  
            </div>
          </div>

          {/* Persona de Contacto & Teléfono */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="contact_name">{t('suppliers.form.contact_name', 'Contacto Principal')}</Label>
              <Input
                id="contact_name"
                placeholder={t('suppliers.form.contact_placeholder', 'Ej. Juan Pérez')}
                {...register('contact_name')}
              />
              <InputError message={errors.contact_name?.message} />  
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('suppliers.form.phone', 'Teléfono')}</Label>
              <Input
                id="phone"
                placeholder={t('suppliers.form.phone_placeholder', 'Ej. +58 412-1234567')}
                {...register('phone')}
              />
              <InputError message={errors.phone?.message} />  
            </div>
          </div>

          {/* Email & Ciudad */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="email">{t('suppliers.form.email', 'Correo Electrónico')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('suppliers.form.email_placeholder', 'contacto@proveedor.com')}
                {...register('email')}
              />
            <InputError message={errors.email?.message} />  
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">{t('suppliers.form.city', 'Ciudad')}</Label>
              <Input
                id="city"
                placeholder={t('suppliers.form.city_placeholder', 'Ej. Caracas')}
                {...register('city')}
              />
              <InputError message={errors.city?.message} />  
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="address">{t('suppliers.form.address', 'Dirección Fiscal')}</Label>
            <Textarea
              id="address"
              rows={2}
              placeholder={t('suppliers.form.address_placeholder', 'Dirección completa del proveedor...')}
              {...register('address')}
            />
            <InputError message={errors.address?.message} />  
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t('suppliers.form.notes', 'Notas Adicionales')}</Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder={t('suppliers.form.notes_placeholder', 'Condiciones de pago, horarios de entrega, etc.')}
              {...register('notes')}
            />
            <InputError message={errors.notes?.message} />  
          </div>

          {/* Estado Activo / Inactivo */}
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="is_active_switch">{t('common.status', 'Estado')}</Label>
              <p className="text-xs text-muted-foreground">
                {isActiveValue
                  ? t('suppliers.form.status_active', 'Proveedor disponible para compras')
                  : t('suppliers.form.status_inactive', 'Proveedor deshabilitado')}
              </p>
            </div>
            <Switch
              id="is_active_switch"
              checked={isActiveValue}
              onCheckedChange={(checked) => setValue('is_active', checked)}
            /> 
          </div>

          <div className="flex justify-end pt-4">
            <FormSaveButton isSaving={isSaving} isDirty={isDirty} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}