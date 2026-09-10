import type { ReactNode } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';

interface DataTableToolbarProps {
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  
  showAdd?: boolean;
  onAdd?: () => void;
  addLabel?: string;
  addIcon?: ReactNode;

  showFilters?: boolean;
  filterComponents?: ReactNode;
}

export function DataTableToolbar({
  showSearch = true,
  searchValue = '',
  onSearchChange,
  searchPlaceholder,
  showAdd = false,
  onAdd,
  addLabel,
  addIcon = <Plus className="mr-2 h-4 w-4" />,
  showFilters = false,
  filterComponents,
}: DataTableToolbarProps) {
  const { t } = useTranslation('datatable');

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Buscador alineado a la izquierda */}
      <div className="flex flex-1 items-center max-w-sm">
        {showSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder || t('search')}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        )}
      </div>

      {/* Botones alineados a la derecha */}
      <div className="flex items-center space-x-2">
        {showFilters && filterComponents && (
          <Dialog>
            {/* Usamos buttonVariants para darle el diseño de botón al Trigger sin usar asChild */}
            <DialogTrigger className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              <Filter className="mr-2 h-4 w-4" />
              {t('filters')}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('filters')}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {filterComponents}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {showAdd && onAdd && (
          <Button onClick={onAdd} variant="default" size="sm">
            {addIcon}
            {addLabel || t('add')}
          </Button>
        )}
      </div>
    </div>
  );
}