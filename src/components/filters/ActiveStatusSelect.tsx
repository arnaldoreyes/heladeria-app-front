
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ActiveStatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ActiveStatusSelect({ value, onChange, label }: ActiveStatusSelectProps) {
  const { t } = useTranslation(['common']);

  return (
    <div className="space-y-1.5">
      <Label>{label || t('common.status', 'Estado')}</Label>
      <Select value={value} onValueChange={(val) => val && onChange(val)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={label || t('common.status', 'Estado')}>
            {value === 'ALL' && t('common.all_statuses', 'Todos los estados')}
            {value === 'active' && t('common.active', 'Activos')}
            {value === 'inactive' && t('common.inactive', 'Inactivos')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t('common.all_statuses', 'Todos los estados')}</SelectItem>
          <SelectItem value="active">{t('common.active', 'Activos')}</SelectItem>
          <SelectItem value="inactive">{t('common.inactive', 'Inactivos')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}