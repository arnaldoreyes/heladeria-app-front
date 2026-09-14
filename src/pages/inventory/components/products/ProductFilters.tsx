import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ActiveStatusSelect } from '@/components/filters/ActiveStatusSelect';
import { ResetFiltersButton } from '@/components/filters/ResetFiltersButton';

interface ProductFiltersProps {
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  activeFilter: string;
  onActiveChange: (value: string) => void;
  stockFilter: string;
  onStockChange: (value: string) => void;
  categories?: Array<{ id: string | number; name?: string; label?: string }>;
  onReset: () => void;
  isResetDisabled: boolean;
}

export function ProductFilters({
  categoryFilter,
  onCategoryChange,
  activeFilter,
  onActiveChange,
  stockFilter,
  onStockChange,
  categories = [],
  onReset,
  isResetDisabled,
}: ProductFiltersProps) {
  const { t } = useTranslation(['products', 'common']);

  return (
    <div className="grid grid-cols-1 w-full items-end gap-3">
      {/* Categoria */}
      <div className="space-y-1.5">
        <Label>{t('products.categories', 'Categorías')}</Label>
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('products.categories', 'Categorías')}>
              {categoryFilter === 'ALL'
                ? t('products.all_categories', 'Todas las categorías')
                : categories.find((c) => String(c.id) === categoryFilter)?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">
              {t('products.all_categories', 'Todas las categorías')}
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name || cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      {/* Estado (Activo/Inactivo) */}
      <ActiveStatusSelect value={activeFilter} onChange={onActiveChange} />

      {/* Reset */}
      <ResetFiltersButton onReset={onReset} isDisabled={isResetDisabled} />
    </div>
  );
}