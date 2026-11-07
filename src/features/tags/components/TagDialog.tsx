import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormSaveButton } from '@/components/form/FormSaveButton';
import { InputError } from '@/components/form/InputError';
import type { UseFormReturn } from 'react-hook-form';
import type { TagFormData } from '../schemas/tag.schema';

interface TagDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  form: UseFormReturn<TagFormData>;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  isDirty: boolean;
}

const PRESET_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280'];

export function TagDialog({
  isOpen,
  onOpenChange,
  isEditing,
  form,
  onSubmit,
  isSaving,
  isDirty,
}: TagDialogProps) {
  const { t } = useTranslation(['tags', 'common']);
  const { register, watch, setValue, formState: { errors } } = form;

  const colorValue = watch('color') || '#3b82f6';
  const isActiveValue = watch('is_active') ?? true;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t('tags.dialog.edit_title', 'Editar Etiqueta')
              : t('tags.dialog.add_title', 'Añadir Etiqueta')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('common.name', 'Nombre')}</Label>
            <Input
              id="name"
              placeholder={t('tags.form.name_placeholder', 'Ej. Frio, Oferta')}
              {...register('name')}
            />
            <InputError message={errors.name?.message} />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color">{t('tags.form.color', 'Color de etiqueta')}</Label>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-10 rounded-md overflow-hidden border border-input shadow-sm cursor-pointer">
                <input
                  type="color"
                  id="color"
                  value={colorValue}
                  onChange={(e) => setValue('color', e.target.value, { shouldValidate: true, shouldDirty: true })}
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0"
                />
              </div>
              <Input
                value={colorValue}
                onChange={(e) => setValue('color', e.target.value, { shouldValidate: true, shouldDirty: true })}
                placeholder="#3b82f6"
                className="font-mono uppercase"
              />
            </div>
            <div className="flex gap-2 pt-1">
              {PRESET_COLORS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setValue('color', hex, { shouldValidate: true, shouldDirty: true })}
                  className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 ${
                    colorValue === hex ? 'ring-2 ring-offset-2 ring-primary' : ''
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            <InputError message={errors.color?.message} />
          </div>

          {/* Activo / Inactivo */}
          <div className="flex flex-row items-center justify-between rounded-lg border p-3">
            <Label className="cursor-pointer" htmlFor="is_active">
              {t('common.active', 'Activo')}
            </Label>
            <Switch
              id="is_active"
              checked={isActiveValue}
              onCheckedChange={(checked) => setValue('is_active', checked, { shouldValidate: true })}
            />
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-end pt-4">
            <FormSaveButton isSaving={isSaving} isDirty={isDirty} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}