import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ActiveStatusSelect } from '@/components/filters/ActiveStatusSelect';
import { ResetFiltersButton } from '@/components/filters/ResetFiltersButton';
import { MultiSelectPopover } from '@/components/custom/MultiSelectPopover';
import type { MultiSelectOption } from '@/components/custom/MultiselectPopover';

interface ProductFiltersProps {
  categoriesFilter: string[];
  onCategoriesChange: (values: string[]) => void;
  categoryOptions: MultiSelectOption[];
  
  tagsFilter: string[];
  onTagsChange: (values: string[]) => void;
  tagOptions: MultiSelectOption[];

  activeFilter: string;
  onActiveChange: (value: string) => void;
  stockFilter: string;
  onStockChange: (value: string) => void;
  onReset: () => void;
  isResetDisabled: boolean;
}

export function ProductFilters({
  categoriesFilter,
  onCategoriesChange,
  categoryOptions,
  tagsFilter,
  onTagsChange,
  tagOptions,
  activeFilter,
  onActiveChange,
  stockFilter,
  onStockChange,
  onReset,
  isResetDisabled,
}: ProductFiltersProps) {
  const { t } = useTranslation(['products', 'common']);

  return (
    <div className="grid grid-cols-1 w-full items-end gap-3">
      {/* Múltiples Categorías en Árbol */}
      <div className="space-y-1.5">
        <Label>{t('products.categories', 'Categorías')}</Label>
        <MultiSelectPopover
          options={categoryOptions}
          selectedValues={categoriesFilter}
          onChange={onCategoriesChange}
          placeholder="Todas las categorías"
          searchPlaceholder="Buscar categoría..."
        />
      </div>

      {/* Múltiples Tags */}
      <div className="space-y-1.5">
        <Label>{t('products.tags', 'Etiquetas')}</Label>
        <MultiSelectPopover
          options={tagOptions}
          selectedValues={tagsFilter}
          onChange={onTagsChange}
          placeholder="Todas las etiquetas"
          searchPlaceholder="Buscar etiqueta..."
        />
      </div>

      {/* Stock */}
      <div className="space-y-1.5">
        <Label>{t('products.stock_status', 'Existencia')}</Label>
        <Select value={stockFilter} onValueChange={onStockChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('products.stock_status', 'Existencia')}>
              {stockFilter === 'ALL' && t('common.all_statuses', 'Todos')}
              {stockFilter === 'true' && t('common.with_stock', 'Con Stock')}
              {stockFilter === 'false' && t('common.without_stock', 'Sin Stock')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('common.all_statuses', 'Todos')}</SelectItem>
            <SelectItem value="true">{t('common.with_stock', 'Con Stock')}</SelectItem>
            <SelectItem value="false">{t('common.without_stock', 'Sin Stock')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estado & Reset */}
      <div className=" gap-2">
        <div className="">
          <ActiveStatusSelect value={activeFilter} onChange={onActiveChange} />
        </div>
        <ResetFiltersButton onReset={onReset} isDisabled={isResetDisabled} />
      </div>
    </div>
  );
}