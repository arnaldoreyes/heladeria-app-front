import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Folder, Tag, ShoppingBag, Utensils, Coffee, Package, Grid, Sparkles, 
  Laptop, Shirt, Car, Gift, Home, Heart, Smile, Film, Book, Dumbbell, 
  Scissors, Wrench, Briefcase, CreditCard, Percent, Search
} from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { DistributionRulesSlider } from '@/components/custom/DistributionRulesSlider';

import type { CategoryApiResponse } from '../../interfaces/category.response';
import { CategorySelect } from '../CategorySelect';

const CATEGORY_ICONS = [
  { name: 'Tag', icon: Tag, label: 'Etiqueta' },
  { name: 'Folder', icon: Folder, label: 'Carpeta' },
  { name: 'ShoppingBag', icon: ShoppingBag, label: 'Compras' },
  { name: 'Utensils', icon: Utensils, label: 'Comida' },
  { name: 'Coffee', icon: Coffee, label: 'Café' },
  { name: 'Package', icon: Package, label: 'Paquete' },
  { name: 'Grid', icon: Grid, label: 'Cuadrícula' },
  { name: 'Sparkles', icon: Sparkles, label: 'Especial' },
  { name: 'Laptop', icon: Laptop, label: 'Tecnología' },
  { name: 'Shirt', icon: Shirt, label: 'Ropa' },
  { name: 'Car', icon: Car, label: 'Vehículo' },
  { name: 'Gift', icon: Gift, label: 'Regalo' },
  { name: 'Home', icon: Home, label: 'Hogar' },
  { name: 'Heart', icon: Heart, label: 'Favorito' },
  { name: 'Smile', icon: Smile, label: 'General' },
  { name: 'Film', icon: Film, label: 'Entretenimiento' },
  { name: 'Book', icon: Book, label: 'Educación' },
  { name: 'Dumbbell', icon: Dumbbell, label: 'Deporte' },
  { name: 'Scissors', icon: Scissors, label: 'Belleza/Oficios' },
  { name: 'Wrench', icon: Wrench, label: 'Herramientas' },
  { name: 'Briefcase', icon: Briefcase, label: 'Negocio' },
  { name: 'CreditCard', icon: CreditCard, label: 'Pagos' },
  { name: 'Percent', icon: Percent, label: 'Porcentaje' },
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

  const [iconSearch, setIconSearch] = useState('');

  const reinvestmentPercent = watch('reinvestment_percentage');
  const profitPercent = watch('profit_percentage');
  const parentIdValue = watch('parent_id');
  const iconValue = watch('icon');

  useEffect(() => {
    if (!isOpen) {
      setIconSearch('');
    }
  }, [isOpen]);

  const isGlobal = isEditing ? reinvestmentPercent === null || reinvestmentPercent === undefined : true;

  const handleGlobalChange = (checked: boolean) => {
    if (checked) {
      setValue('reinvestment_percentage', null, { shouldValidate: true, shouldDirty: true });
      setValue('profit_percentage', null, { shouldValidate: true, shouldDirty: true });
    } else {
      setValue('reinvestment_percentage', 60, { shouldValidate: true, shouldDirty: true });
      setValue('profit_percentage', 40, { shouldValidate: true, shouldDirty: true });
    }
  };

  const filteredIcons = useMemo(() => {
    if (!iconSearch.trim()) return CATEGORY_ICONS;
    const query = iconSearch.toLowerCase();
    return CATEGORY_ICONS.filter(
      (item) => item.name.toLowerCase().includes(query) || item.label.toLowerCase().includes(query)
    );
  }, [iconSearch]);

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

          {/* Selector de Íconos */}
          <div className="space-y-2">
            <Label>{t('categories.form.icon', 'Ícono de Categoría')}</Label>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ícono..."
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-2 border rounded-md max-h-48 overflow-y-auto bg-background">
              {filteredIcons.length > 0 ? (
                filteredIcons.map(({ name, icon: IconComponent, label }) => {
                  const isSelected = iconValue === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setValue('icon', name, { shouldValidate: true, shouldDirty: true })}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-md border transition-all hover:bg-accent group ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                          : 'border-border/60 text-muted-foreground hover:text-foreground'
                      }`}
                      title={label}
                    >
                      <IconComponent className="h-5 w-5 mb-1" />
                      <span className="text-[10px] truncate w-full text-center">{label}</span>
                      {isSelected && (
                        <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full py-6 text-center text-xs text-muted-foreground">
                  No se encontraron íconos
                </div>
              )}
            </div>
            {errors.icon && <p className="text-xs text-destructive">{errors.icon.message}</p>}
          </div>

          {/* Selector de Categorías Reutilizable */}
          <CategorySelect
            categories={parentCategories}
            value={parentIdValue}
            onChange={(val) => setValue('parent_id', val, { shouldValidate: true, shouldDirty: true })}
            error={errors.parent_id?.message}
          />

          {/* Reglas de distribución */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="use_global_rules"
                checked={isGlobal}
                onCheckedChange={(checked) => handleGlobalChange(Boolean(checked))}
              />
              <Label htmlFor="use_global_rules" className="cursor-pointer font-medium text-sm">
                Usar reglas de distribución globales del negocio
              </Label>
            </div>

            {!isGlobal && (
              <div className="pt-2">
                <DistributionRulesSlider
                  businessFundPercent={reinvestmentPercent ?? 60}
                  personalProfitPercent={profitPercent ?? 40}
                  onChange={(businessVal, personalVal) => {
                    setValue('reinvestment_percentage', businessVal, { shouldValidate: true, shouldDirty: true });
                    setValue('profit_percentage', personalVal, { shouldValidate: true, shouldDirty: true });
                  }}
                />
              </div>
            )}
          </div>

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