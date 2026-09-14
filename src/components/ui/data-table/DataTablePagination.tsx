import { useTranslation, Trans } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { PaginationState } from './types';

interface DataTablePaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function DataTablePagination({
  pagination,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
  const { t } = useTranslation('datatable');
  const { pageIndex, pageSize, pageCount, total } = pagination;

  const startRecord = (pageIndex - 1) * pageSize + 1;
  const endRecord = Math.min(pageIndex * pageSize, total);

  return (
    <div className="flex flex-col items-center justify-between gap-4 px-2 py-4 sm:flex-row">
      {/* Texto de resultados */}
      <div className="text-center text-sm text-muted-foreground sm:text-left">
        {total > 0 ? (
          <Trans
            i18nKey="datatable.showing_results"
             
            values={{ start: startRecord, end: endRecord, total }}
            components={{
              strong: <span className="font-medium" />,
            }}
          />
        ) : (
          t('datatable.no_results')
        )}
      </div>

      {/* Controles de paginación */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {/* Selector de filas por página */}
        <div className="flex items-center space-x-2">
          <p className="text-xs font-medium whitespace-nowrap sm:text-sm">
            {t('datatable.rows_per_page')}
          </p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {[12, 20, 24, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Indicador de página */}
        <div className="text-xs font-medium whitespace-nowrap sm:text-sm">
          {t('datatable.page_of', { current: pageIndex, total: pageCount || 1 })}
        </div>

        {/* Botones de navegación */}
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="hidden h-8 w-8 sm:flex"
            onClick={() => onPageChange(1)}
            disabled={pageIndex <= 1}
            aria-label={t('datatable.first_page')}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex <= 1}
            aria-label={t('datatable.previous_page')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex >= pageCount}
            aria-label={t('datatable.next_page')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden h-8 w-8 sm:flex"
            onClick={() => onPageChange(pageCount)}
            disabled={pageIndex >= pageCount}
            aria-label={t('datatable.last_page')}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}