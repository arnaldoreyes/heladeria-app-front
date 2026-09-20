import { ActiveStatusSelect } from "@/components/filters/ActiveStatusSelect";
import { ResetFiltersButton } from "@/components/filters/ResetFiltersButton";


interface SupplierFiltersProps {
  activeFilter: string;
  onActiveChange: (value: string) => void;
  onReset: () => void;
  isResetDisabled: boolean;
}

export function SupplierFilters({
  activeFilter,
  onActiveChange,
  onReset,
  isResetDisabled,
}: SupplierFiltersProps) {
  return (
    <div className="grid grid-cols-1 w-full items-end gap-3">
      <ActiveStatusSelect value={activeFilter} onChange={onActiveChange} />
      <ResetFiltersButton onReset={onReset} isDisabled={isResetDisabled} />
    </div>
  );
}