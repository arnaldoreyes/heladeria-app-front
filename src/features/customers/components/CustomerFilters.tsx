import { ActiveStatusSelect } from '@/components/filters/ActiveStatusSelect';
import { ResetFiltersButton } from '@/components/filters/ResetFiltersButton';

interface CustomerFiltersProps {
  activeFilter: string;
  onActiveChange: (value: string) => void;
  onReset: () => void;
  isResetDisabled: boolean;
}

export function CustomerFilters({
  activeFilter,
  onActiveChange,
  onReset,
  isResetDisabled,
}: CustomerFiltersProps) {
  return (
    <div className="w-full items-end gap-3">
      <ActiveStatusSelect value={activeFilter} onChange={onActiveChange} />
      <ResetFiltersButton onReset={onReset} isDisabled={isResetDisabled} />
    </div>
  );
}