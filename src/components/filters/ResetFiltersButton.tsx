import { useTranslation } from 'react-i18next';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResetFiltersButtonProps {
  onReset: () => void;
  isDisabled: boolean;
}

export function ResetFiltersButton({ onReset, isDisabled }: ResetFiltersButtonProps) {
  const { t } = useTranslation(['common']);

  return (
    <Button
      variant="outline"
      onClick={onReset}
      className="w-full flex items-center gap-2 mt-2"
      disabled={isDisabled}
    >
      <RotateCcw className="h-4 w-4" />
      {t('common.reset_filters', 'Limpiar Filtros')}
    </Button>
  );
}