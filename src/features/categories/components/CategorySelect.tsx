import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCategories } from '../hooks/useCategories';
import { Plus, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { flattenCategoryTree } from '../utils/category-tree.utils';

interface CategorySelectProps {
  value: string | number | null | undefined;
  onChange: (value: string | null) => void;
  onAddNewCategory?: () => void;
  label?: string;
  placeholder?: string;
  noneOptionLabel?: string;
  showNoneOption?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function CategorySelect({
  value,
  onChange,
  onAddNewCategory,
  label,
  placeholder,
  noneOptionLabel,
  showNoneOption = true,
  error,
  disabled = false,
  className = '',
}: CategorySelectProps) {
  const { t } = useTranslation(['restocks', 'common']);

  const { categories } = useCategories();

  // Aplanamos y ordenamos las categorías en formato de árbol con su respectiva profundidad (depth)
  const flattenedCategories = useMemo(() => {
    return flattenCategoryTree(categories || []);
  }, [categories]);

  const stringValue = value !== null && value !== undefined && value !== '' ? String(value) : 'ALL';

  const selectedCategory = useMemo(() => {
    return flattenedCategories.find((cat) => String(cat.id) === stringValue);
  }, [flattenedCategories, stringValue]);

  const defaultLabel = label ?? t('restocks.Category_name', 'Categoría');
  const defaultPlaceholder = placeholder ?? t('restocks.filter_Category', 'Seleccionar categoría');
  const defaultNoneLabel = noneOptionLabel ?? t('common.all_categories', 'Todas las Categorías');
  

  return (
    <div className={`space-y-2 ${className}`}>
      {defaultLabel && <Label>{defaultLabel}</Label>}
      
      {/* Contenedor flexible en línea */}
      <div className="flex items-start gap-2 w-full">
        <div className="flex-1 ">
          <Select
            value={stringValue}
            onValueChange={(val) => onChange(val === 'ALL' ? null : val)}
            disabled={disabled}
            
          >
            <SelectTrigger className="w-full  min-h-10 py-1.5 px-3 ">
              <SelectValue placeholder={defaultPlaceholder}>
                {selectedCategory ? selectedCategory.name : defaultNoneLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {showNoneOption && (
                <SelectItem value="ALL">{defaultNoneLabel}</SelectItem>
              )}
              {flattenedCategories.map((cat) => {
                // Generamos un prefijo visual de indentación según el nivel (depth)
                const paddingLeft = cat.depth ? `${cat.depth * 16 + 8}px` : '8px';
                return (
                  <SelectItem key={cat.id} value={String(cat.id)}  style={{ paddingLeft }}>
                     {cat.depth ? `└─ ${cat.name}` : cat.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>

        {/* Botón alineado a la derecha del Select */}
        {onAddNewCategory && (
          <Button
            type="button"
            variant="outline"
            title={t('restock.catalog.addCategory', { defaultValue: 'Agregar categoría' })}
            onClick={onAddNewCategory}
            className="h-10 px-3 shrink-0"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <Plus className="w-2.5 h-2.5 -ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}