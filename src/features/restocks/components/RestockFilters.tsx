import { useTranslation } from 'react-i18next';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ResetFiltersButton } from '@/components/filters/ResetFiltersButton';
import { cn } from '@/lib/utils'
import { parseStringToDate } from '@/lib/format';
import { SupplierSelect } from '@/features/suppliers/components/SupplierSelect';

interface RestockFiltersProps {
  supplierFilter: string;
  onSupplierChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => string;
  startDate?: string;
  onStartDateChange: (date: string) => void;
  endDate?: string;
  onEndDateChange: (date: string) => void;
  onReset: () => void;
  isResetDisabled: boolean;
}

export function RestockFilters({
  supplierFilter,
  onSupplierChange,
  statusFilter,
  onStatusChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onReset,
  isResetDisabled,
}: RestockFiltersProps) {
  const { t } = useTranslation(['restocks', 'common']);

  // Mapeo de texto legible para los estados
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return t('restocks.status_completed', 'Facturado');
      case 'pending':
      case 'draft':
        return t('restocks.status_draft', 'Cotizado');
      case 'ALL':
      default:
        return t('common.all_statuses', 'Todos');
    }
  };

  return (
    <div className="space-y-4">
      {/* Proveedor */}
      <SupplierSelect
        value={supplierFilter === 'ALL' ? null : supplierFilter}
        onChange={(val) => onSupplierChange(val || 'ALL')}
      />

      {/* Estado */}
      <div className="space-y-2 w-full">
        <Label>{t('restocks.status', 'Estado')}</Label>
        <Select value={statusFilter} onValueChange={(val) => onStatusChange(val ?? '')} >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('restocks.status', 'Estado')}>
              {getStatusLabel(statusFilter)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('common.all_statuses', 'Todos')}</SelectItem>
            <SelectItem value="completed">{getStatusLabel('completed')}</SelectItem>
            <SelectItem value="draft">{getStatusLabel('draft')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fecha Inicio */}
        <div className="space-y-2 w-full">
          <Label>{t('common.start_date', 'Fecha desde')}</Label>
          <Popover>
            <PopoverTrigger className={cn('w-full justify-start text-left font-normal',  !startDate && 'text-muted-foreground')}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? startDate : <span>{t('common.pick_date', 'Seleccionar')}</span>}
              
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parseStringToDate(startDate)}
                onSelect={(date) => {
                  onStartDateChange(date ? format(date, 'yyyy-MM-dd') : '');
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Fecha Fin */}
        <div className="space-y-2 w-full">
          <Label>{t('common.end_date', 'Fecha hasta')}</Label>
          <Popover>
            <PopoverTrigger className={cn('w-full justify-start text-left font-normal',!endDate && 'text-muted-foreground' )}  >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? endDate : <span>{t('common.pick_date', 'Seleccionar')}</span>}              
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parseStringToDate(endDate)}
                onSelect={(date) => {
                  onEndDateChange(date ? format(date, 'yyyy-MM-dd') : '');
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Botón Reset */}
      <ResetFiltersButton onReset={onReset} isDisabled={isResetDisabled} />
    </div>
  );
}