import { ActiveStatusSelect } from '@/components/filters/ActiveStatusSelect';
import { ResetFiltersButton } from '@/components/filters/ResetFiltersButton';

interface TagFiltersProps {
  activeFilter: string;
  onActiveChange: (value: string) => void;
  onReset: () => void;
  isResetDisabled: boolean;
}

export function TagFilters({
  activeFilter,
  onActiveChange,
  onReset,
  isResetDisabled,
}: TagFiltersProps) {

  return (
    <div className="grid grid-cols-1 w-full items-end gap-3">
      {/* Estado (Activo/Inactivo) */}
      <ActiveStatusSelect value={activeFilter} onChange={onActiveChange} />

      {/* Reset */}
      <ResetFiltersButton onReset={onReset} isDisabled={isResetDisabled} />
    </div>
  );
}