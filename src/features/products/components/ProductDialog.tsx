import { useTranslation } from 'react-i18next';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CategorySelect } from '@/features/categories/components/CategorySelect';
import type { ProductFormData } from '../schemas/product.schema';
import type { UseFormReturn } from 'react-hook-form';
import { TagSelect } from '@/features/tags/components/TagSelect';
import { useTags } from '@/features/tags/hooks/useTags';
import { TagDialog } from '@/features/tags/components/TagDialog';
import { CategoryDialog } from '@/features/categories/components/CategoryDialog';
import { useCategories } from '@/features/categories/hooks/useCategories';

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  isEditing: boolean;
  form: UseFormReturn<ProductFormData>;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
}

export function ProductDialog({
  isOpen,
  onOpenChange,
  isEditing,
  form,
  onSubmit,
  selectedTags,
  setSelectedTags,
  isSaving,
}: ProductDialogProps) {
  const { t } = useTranslation(['products', 'common']);
  const { register, setValue, watch, formState: { errors } } = form;

  const {
    isModalOpen: isTagModalOpen,
    closeModal: closeTagModal,
    openModal: openTagModal,
    form: TagForm,
    onSubmit: onTagSubmit,
    isSaving: isTagSaving,
    isDirty: isTagDirty,
    isEditing: isTagEditing,
  } = useTags();

  const {
    categories,
    isModalOpen: isCategoryModalOpen,
    closeModal: closeCategoryModal,
    openModal: openCategoryModal,
    form: CategoryForm,
    onSubmit: onCategorySubmit,
    isSaving: isCategorySaving,
    isDirty: isCategoryDirty,
    isEditing: isCategoryEditing,
  } = useCategories();

  const categoryIdValue = watch('category_id');
  const isActiveValue = watch('is_active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit(e);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? t('products.dialog.edit_title', 'Editar Producto')
                : t('products.dialog.add_title', 'Añadir Producto')}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre del Producto */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('common.name', 'Nombre del Producto')}</Label>
              <Input
                id="name"
                placeholder={t('products.form.name_placeholder', 'Ej. Bolsa de Hielo 5kg')}
                {...register('name')}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            {/* Precios y Costos */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_usd">{t('products.price_usd', 'Precio ($ USD)')}</Label>
                <Input
                  id="price_usd"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('price_usd')}
                />
                {errors.price_usd && <p className="text-xs text-destructive">{errors.price_usd.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost_usd">{t('products.cost_usd', 'Costo ($ USD)')}</Label>
                <Input
                  id="cost_usd"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('cost_usd')}
                />
                {errors.cost_usd && <p className="text-xs text-destructive">{errors.cost_usd.message}</p>}
              </div>
            </div>

            {/* Inventario */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">{t('products.stock', 'Stock Actual')}</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  {...register('stock')}
                />
                {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_stock_alert">{t('products.min_stock_alert', 'Alerta Stock Mínimo')}</Label>
                <Input
                  id="min_stock_alert"
                  type="number"
                  placeholder="0"
                  {...register('min_stock_alert')}
                />
                {errors.min_stock_alert && (
                  <p className="text-xs text-destructive">{errors.min_stock_alert.message}</p>
                )}
              </div>
            </div>

            {/* SKU y Categoría (Organizados en Grid de 2 columnas) */}
              <div className="space-y-2">
                <Label htmlFor="sku">{t('products.sku', 'SKU / Código')}</Label>
                <Input
                  id="sku"
                  placeholder={t('products.form.sku_placeholder', 'Ej. PROD-001')}
                  {...register('sku')}
                />
                {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
              </div>

              <div className="space-y-2">
               
                <CategorySelect
                  value={categoryIdValue}
                  onChange={(val) => setValue('category_id', val === 'none' ? null : val, { shouldValidate: true })}
                  error={''}
                  onAddNewCategory={() => openCategoryModal()}
                />
            </div>

            {/* Etiquetas (Ocupa todo el ancho) */}
            <TagSelect
              value={selectedTags}
              onChange={setSelectedTags}
              onAddNewTag={() => openTagModal()}
              label="Etiquetas del Producto"
            />

            {/* Estado Activo */}
            <div className="flex flex-row items-center justify-between rounded-lg border p-3">
              <Label className="cursor-pointer" htmlFor="is_active">{t('common.active', 'Activo')}</Label>
              <Switch
                id="is_active"
                checked={isActiveValue}
                onCheckedChange={(checked) => setValue('is_active', checked, { shouldValidate: true })}
              />
            </div>

            {/* Botón de Guardar */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? t('common.saving', 'Guardando...') : t('common.save', 'Guardar')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modales Anidados */}
      <CategoryDialog
        isOpen={isCategoryModalOpen}
        onOpenChange={(open) => !open && closeCategoryModal()}
        isEditing={isCategoryEditing}
        form={CategoryForm}
        onSubmit={onCategorySubmit}
        isSaving={isCategorySaving}
        isDirty={isCategoryDirty}
        parentCategories={categories}
      />

      <TagDialog
        isOpen={isTagModalOpen}
        onOpenChange={(open) => !open && closeTagModal()}
        isEditing={isTagEditing}
        form={TagForm}
        onSubmit={onTagSubmit}
        isSaving={isTagSaving}
        isDirty={isTagDirty}
      />
    </>
  );
}