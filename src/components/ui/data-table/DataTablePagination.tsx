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
    <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 gap-4">
      <div className="text-sm text-muted-foreground">
        {total > 0 ? (
          <Trans
            i18nKey="showing_results"
            t={t}
            values={{ start: startRecord, end: endRecord, total }}
            components={[<span key="dummy" />, <span className="font-medium" key="count" />] as const}
          />
        ) : (
          t('no_results')
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{t('rows_per_page')}</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 15, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm font-medium">
          {t('page_of', { current: pageIndex, total: pageCount || 1 })}
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(1)}
            disabled={pageIndex <= 1}
            aria-label={t('first_page')}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex <= 1}
            aria-label={t('previous_page')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex >= pageCount}
            aria-label={t('next_page')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(pageCount)}
            disabled={pageIndex >= pageCount}
            aria-label={t('last_page')}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}