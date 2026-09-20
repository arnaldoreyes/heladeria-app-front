import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Category } from '@/interfaces/category.interface';
import { InputError } from '@/components/form/InputError';

interface ParentCategorySelectProps {
  categories: Category[];
  value: string | number | null | undefined;
  onChange: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  noneOptionLabel?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function CategorySelect({
  categories,
  value,
  onChange,
  label,
  placeholder,
  noneOptionLabel,
  error,
  disabled = false,
  className = '',
}: ParentCategorySelectProps) {
  const { t } = useTranslation(['categories', 'common']);

  const stringValue = value !== null && value !== undefined && value !== '' ? String(value) : 'none';

  const selectedCategory = useMemo(() => {
    return categories.find((cat) => String(cat.id) === stringValue);
  }, [categories, stringValue]);

  const defaultLabel = label ?? t('categories.form.category', 'Categoría');
  const defaultPlaceholder = placeholder ?? t('categories.form.select', 'Ninguna (Categoría Principal)');
  const defaultNoneLabel = noneOptionLabel ?? t('categories.form.none', 'Ninguna (Categoría Principal)');

  return (
    <div className={`space-y-2 ${className}`}>
      {defaultLabel && <Label>{defaultLabel}</Label>}
      <Select
        value={stringValue}
        onValueChange={(val) => onChange(val === 'none' ? null : val)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={defaultPlaceholder}>
            {selectedCategory ? selectedCategory.name : defaultNoneLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">{defaultNoneLabel}</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={String(cat.id)}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <InputError message={error} />
    </div>
  );
}