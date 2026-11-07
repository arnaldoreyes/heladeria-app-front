import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { InputError } from '@/components/form/InputError';
import { useTags } from '../hooks/useTags';
import { Plus, Tag as TagIcon } from 'lucide-react';
import type { Tag } from '@/interfaces/tag.interface';
import type { MultiSelectOption } from '@/components/custom/MultiselectPopover';
import { MultiSelectPopover } from '@/components/custom/MultiSelectPopover';

interface TagSelectProps {
  value: string[]; // Ahora recibe un array de IDs seleccionados
  onChange: (values: string[]) => void;
  onAddNewTag?: () => void; // Función opcional para abrir el modal de crear tag
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function TagSelect({
  value = [],
  onChange,
  onAddNewTag,
  label,
  placeholder,
  error,
  disabled = false,
  className = '',
}: TagSelectProps) {
  const { t } = useTranslation(['tags', 'common']);
  const { tags } = useTags();

  // Mapeamos los tags del hook a la estructura MultiSelectOption
  const tagOptions: MultiSelectOption[] = tags.map((tag: Tag) => ({
    id: String(tag.id),
    name: tag.name,
    color: tag.color,
  }));

  const defaultLabel = label ?? t('tags.form.tag', 'Etiquetas');
  const defaultPlaceholder = placeholder ?? t('tags.form.select', 'Seleccionar etiquetas...');

  return (
    <div className={`space-y-2 ${className}`}>
      {defaultLabel && <Label>{defaultLabel}</Label>}

      {/* Contenedor flexible en línea para el selector múltiple y el botón */}
      <div className="flex items-start gap-2 w-full">
        <div className="">
          <MultiSelectPopover
            options={tagOptions}
            selectedValues={value}
            onChange={onChange}
            placeholder={defaultPlaceholder}
            searchPlaceholder={t('tags.form.search', 'Buscar etiqueta...')}
          />
        </div>

        {/* Botón opcional para agregar una nueva etiqueta */}
        {onAddNewTag && (
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            title={t('tags.actions.add', { defaultValue: 'Agregar etiqueta' })}
            onClick={onAddNewTag}
            className="h-10 px-3 shrink-0"
          >
            <TagIcon className="w-3.5 h-3.5" />
            <Plus className="w-2.5 h-2.5 -ml-1" />
          </Button>
        )}
      </div>

      <InputError message={error} />
    </div>
  );
}