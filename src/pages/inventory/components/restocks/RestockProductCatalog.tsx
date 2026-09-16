import { useTranslation } from 'react-i18next';
import {
  Search,
  Plus,
  Filter,
  RotateCcw,
  Check,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { ProductFilters } from '../products/ProductFilters';
import { RestockProductCard } from './RestockProductCard';
import type { RestockProductCatalogProps } from '../../interfaces/catalog.types';
import { tooltipReducer } from 'recharts/types/state/tooltipSlice';

const SORT_OPTIONS = [
  { id: 'name', labelKey: 'restock.catalog.sort.fields.name', defaultLabel: 'Nombre' },
  { id: 'sku', labelKey: 'restock.catalog.sort.fields.sku', defaultLabel: 'SKU' },
  { id: 'cost_usd', labelKey: 'restock.catalog.sort.fields.costUsd', defaultLabel: 'Precio (USD)' },
  { id: 'stock', labelKey: 'restock.catalog.sort.fields.stock', defaultLabel: 'Stock' },
] as const;

export function RestockProductCatalog({
  categories,
  isLoading,
  onSelectProduct,
  onAddNewProduct,
  catalog,
}: RestockProductCatalogProps) {
  const { t } = useTranslation();

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    stockFilter,
    setStockFilter,
    statusFilter,
    setStatusFilter,
    hasActiveFilters,
    handleResetFilters,
    sortField,
    sortOrder,
    handleToggleSort,
    handleResetSort,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedProducts,
    totalProductsCount,
    itemsPerPage,
  } = catalog;

  const currentSortLabel =
    sortField === 'name'
      ? t('restock.catalog.sort.fields.name', { defaultValue: 'Nombre' })
      : sortField === 'sku'
      ? t('restock.catalog.sort.fields.sku', { defaultValue: 'SKU' })
      : sortField === 'cost_usd' || sortField === 'cost'
      ? t('restock.catalog.sort.fields.price', { defaultValue: 'Precio' })
      : t('restock.catalog.sort.fields.stock', { defaultValue: 'Stock' });

  return (
    <div className="h-1/2 md:h-full md:col-span-6 flex flex-col min-h-0 bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden">
      {/* Control Superior: Búsqueda, Ordenamiento y Filtros */}
      <div className="p-2 sm:p-3 border-b bg-background space-y-2 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder={t('restock.catalog.searchPlaceholder', { defaultValue: 'Buscar por nombre o SKU...' })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-muted/30 border-muted-foreground/20 text-xs h-8 rounded-lg"
            />
          </div>

          {/* Popover de Ordenamiento */}
          <Popover>
            <PopoverTrigger  className="h-9  border-border border  bg-background font-medium whitespace-nowrap  gap-1 rounded-[min(var(--radius-md),12px)] p-2 flex items-center justify-center">
                {sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{currentSortLabel}</span>
              
            </PopoverTrigger>
            <PopoverContent align="end" sideOffset={8} className="w-[calc(100vw-32px)] sm:w-80 p-4 space-y-3"                        >
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1">
                {t('restock.catalog.sort.title', { defaultValue: 'Ordenar por' })}
              </div>
              <div className="space-y-0.5">
                {SORT_OPTIONS.map((item) => {
                  const isActive = sortField === item.id || (item.id === 'cost_usd' && sortField === 'cost');
                  return (
                    <Button
                      key={item.id}
                      type="button"
                      variant='outline'
                      onClick={() => handleToggleSort(item.id)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-xs rounded hover:bg-muted text-left"
                    >
                      <span>{t(item.labelKey, { defaultValue: item.defaultLabel })}</span>
                      {isActive && (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
                          {sortOrder.toUpperCase()}
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
              <div className=" mt-1 pt-1">
                <Button
                  variant='outline'
                  type="button"
                  onClick={handleResetSort}
                  className="w-full text-center text-[11px] text-muted-foreground hover:text-foreground py-1 flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('restock.catalog.sort.reset', { defaultValue: 'Restablecer orden' })}</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Popover de Filtros Avanzados */}
          <Popover>
           <PopoverTrigger className="h-9  border-border border  bg-background font-medium whitespace-nowrap  gap-1 rounded-[min(var(--radius-md),12px)] h-9 w-9 flex items-center justify-center">
                <Filter className="w-3.5 h-3.5" />
              
            </PopoverTrigger>
            <PopoverContent align="end" sideOffset={8} className="w-[calc(100vw-32px)] sm:w-80 p-4 space-y-3">
              <ProductFilters
                categoryFilter={selectedCategory}
                onCategoryChange={(v) => v && setSelectedCategory(v)}
                activeFilter={statusFilter}
                onActiveChange={(v) => v && setStatusFilter(v)}
                stockFilter={stockFilter}
                onStockChange={(v) => v && setStockFilter(v)}
                categories={categories}
                onReset={handleResetFilters}
                isResetDisabled={!hasActiveFilters}
              />
            </PopoverContent>
          </Popover>

          {onAddNewProduct && (
            <Button
              type="button"
              variant="outline"
              onClick={onAddNewProduct}
              className="font-bold text-[10px] sm:text-xs uppercase h-8 px-2 sm:px-3 gap-1 border-slate-300 shrink-0 text-white bg-emerald-900 hover:bg-emerald-800"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Grid de Productos */}
      <ScrollArea className="flex-1 min-h-0 p-2 sm:p-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-32 space-y-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-800" />
            <p className="text-xs text-muted-foreground">
              {t('common.loading', { defaultValue: 'Cargando...' })}
            </p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center p-2">
            <p className="text-xs font-semibold text-muted-foreground">
              {t('restock.catalog.noProducts', { defaultValue: 'Sin productos encontrados' })}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-2">
            {paginatedProducts.map((prod) => (
              <RestockProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Paginación */}
      {totalProductsCount > 0 && (
        <div className="p-2 border-t bg-background flex items-center justify-between text-xs text-muted-foreground shrink-0">
          <span>
            {t('common.pagination.showingRange', {
              defaultValue: '{{from}} - {{to}} de {{total}}',
              from: (currentPage - 1) * itemsPerPage + 1,
              to: Math.min(currentPage * itemsPerPage, totalProductsCount),
              total: totalProductsCount,
            })}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>

            <span className="font-semibold px-2 text-[11px] min-w-[45px] text-center">
              {currentPage} / {totalPages}
            </span>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
