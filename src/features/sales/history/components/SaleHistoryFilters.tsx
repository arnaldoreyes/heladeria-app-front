import { useTranslation } from 'react-i18next';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResetFiltersButton } from '@/components/filters/ResetFiltersButton';
import { cn } from '@/lib/utils';
import { parseStringToDate } from '@/lib/format';

interface SaleHistoryFiltersProps {
  statusFilter?: string;
  onStatusChange?: (status: string) => void;
  paymentStatusFilter?: string;
  onPaymentStatusChange?: (paymentStatus: string) => void;
  startDate?: string;
  onStartDateChange: (date: string) => void;
  endDate?: string;
  onEndDateChange: (date: string) => void;
  onReset: () => void;
  isResetDisabled: boolean;
}

export function SaleHistoryFilters({
  statusFilter = 'ALL',
  onStatusChange,
  paymentStatusFilter = 'ALL',
  onPaymentStatusChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onReset,
  isResetDisabled,
}: SaleHistoryFiltersProps) {
  const { t } = useTranslation(['sales', 'common']);

  return (
    <div className="space-y-4">
    
        {/* Estado de Venta */}
        <div className="space-y-2 w-full">
          <Label>{t('sales.status_label', 'Estado de la Venta')}</Label>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('common.all_masculine', 'Todos')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t('common.all_masculine', 'Todos')}</SelectItem>
              <SelectItem value="completed">{t('sales.status.completed', 'Completada')}</SelectItem>
              <SelectItem value="draft">{t('sales.status.draft', 'Cotización / Borrador')}</SelectItem>
              <SelectItem value="voided">{t('sales.status.voided', 'Anulada')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Estado de Pago */}
        <div className="space-y-2 w-full">
          <Label>{t('sales.payment_status_label', 'Estado del Pago')}</Label>
          <Select value={paymentStatusFilter} onValueChange={onPaymentStatusChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('common.all_masculine', 'Todos')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t('common.all_masculine', 'Todos')}</SelectItem>
              <SelectItem value="paid">{t('sales.payment_status.paid', 'Pagado')}</SelectItem>
              <SelectItem value="partial">{t('sales.payment_status.partial', 'Parcial')}</SelectItem>
              <SelectItem value="pending">{t('sales.payment_status.pending', 'Pendiente')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Fecha Desde */}
        <div className="space-y-2 w-full">
          <Label>{t('common.start_date', 'Fecha desde')}</Label>
          <Popover>
            <PopoverTrigger className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}>
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

        {/* Fecha Hasta */}
        <div className="space-y-2 w-full">
          <Label>{t('common.end_date', 'Fecha hasta')}</Label>
          <Popover>
            <PopoverTrigger className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}>
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