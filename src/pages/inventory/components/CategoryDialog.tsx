import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Folder, Tag, ShoppingBag, Utensils, Coffee, Package, Grid, Sparkles, 
  Laptop, Shirt, Car, Gift, Home, Heart, Smile, Film, Book, Dumbbell, 
  Scissors, Wrench, Briefcase, CreditCard, Percent, Check
} from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DistributionRulesSlider } from '@/components/custom/DistributionRulesSlider';

import type { CategoryApiResponse } from '../interfaces/category.response';

const CATEGORY_ICONS = [
  { name: 'Tag', icon: Tag },
  { name: 'Folder', icon: Folder },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'Utensils', icon: Utensils },
  { name: 'Coffee', icon: Coffee },
  { name: 'Package', icon: Package },
  { name: 'Grid', icon: Grid },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Laptop', icon: Laptop },
  { name: 'Shirt', icon: Shirt },
  { name: 'Car', icon: Car },
  { name: 'Gift', icon: Gift },
  { name: 'Home', icon: Home },
  { name: 'Heart', icon: Heart },
  { name: 'Smile', icon: Smile },
  { name: 'Film', icon: Film },
  { name: 'Book', icon: Book },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Scissors', icon: Scissors },
  { name: 'Wrench', icon: Wrench },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'CreditCard', icon: CreditCard },
  { name: 'Percent', icon: Percent },
];

interface CategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  form: any;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  parentCategories: CategoryApiResponse[];
}

export function CategoryDialog({
  isOpen,
  onOpenChange,
  isEditing,
  form,
  onSubmit,
  isSaving,
  parentCategories,
}: CategoryDialogProps) {
  const { t } = useTranslation(['categories', 'common']);
  const { register, setValue, watch, formState: { errors } } = form;

  const businessFundPercent = watch('businessFundPercent') ?? 60;
  const personalProfitPercent = watch('personalProfitPercent') ?? 40;
  const parentIdValue = watch('parent_id');
  const iconValue = watch('icon');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t('categories.dialog.edit_title', 'Editar Categoría')
              : t('categories.dialog.add_title', 'Añadir Categoría')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('common.name', 'Nombre')}</Label>
            <Input
              id="name"
              placeholder={t('categories.form.name_placeholder', 'Ej. Bebidas y Licores')}
              {...register('name')}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t('categories.form.icon', 'Ícono de Categoría')}</Label>
            <div className="grid grid-cols-6 gap-2 p-2 border rounded-md max-h-36 overflow-y-auto bg-background">
              {CATEGORY_ICONS.map(({ name, icon: IconComponent }) => {
                const isSelected = iconValue === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setValue('icon', name, { shouldValidate: true, shouldDirty: true })}
                    className={`relative flex items-center justify-center p-2.5 rounded-md border transition-all hover:bg-accent ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                        : 'border-transparent text-muted-foreground'
                    }`}
                    title={name}
                  >
                    <IconComponent className="h-5 w-5" />
                    {isSelected && (
                      <span className="absolute top-0.5 right-0.5 flex h-2 w-2 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
            {errors.icon && <p className="text-xs text-destructive">{errors.icon.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t('categories.form.parent_category', 'Categoría Padre')}</Label>
            <Select
              value={parentIdValue || 'none'}
              onValueChange={(val) =>
                setValue('parent_id', val === 'none' ? null : val, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('categories.form.select_parent', 'Ninguna (Categoría Principal)')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {t('categories.form.none_parent', 'Ninguna (Categoría Principal)')}
                </SelectItem>
                {parentCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DistributionRulesSlider
            businessFundPercent={businessFundPercent}
            personalProfitPercent={personalProfitPercent}
            onChange={(businessVal, personalVal) => {
              setValue('reinvestment_percentage', businessVal, { shouldValidate: true, shouldDirty: true });
              setValue('profit_percentage', personalVal, { shouldValidate: true, shouldDirty: true });
            }}
          />

          <div className="space-y-2">
            <Label htmlFor="description">{t('common.description', 'Descripción')}</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder={t('categories.form.description_placeholder', 'Descripción opcional de la categoría...')}
              {...register('description')}
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