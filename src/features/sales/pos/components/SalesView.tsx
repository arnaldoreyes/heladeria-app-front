import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Componentes UI
import { DataTable } from '@/components/ui/data-table/DataTable';

// Hooks, Componentes & Store
import { useActiveExchangeRate } from '@/features/exchange-rates/hooks/useActiveExchangeRate';
import { useSalesColumns } from '../hooks/useSalesColumns';
import { useCartStore } from '../hooks/useCartStore';
import { ProductFilters } from '@/features/products/components/ProductFilters';
import { useProducts } from '@/features/products/hooks/useProducts';
import { ProductSalesCard } from './ProductSalesCard';

export default function SalesView() {
 
const { t } = useTranslation(['products', 'common']);
const { currentRate } = useActiveExchangeRate();
const exchangeRateValue = currentRate?.rate || 1;

  // --- Zustand Store (Carrito Local POS) ---
  const {
    items: cartItems,
    addItem,
    removeItem,
    updateQuantity,
    setExchangeRate,
  } = useCartStore();

  // Sincronizar la tasa de cambio activa con la Store de Zustand
  useEffect(() => {
    if (exchangeRateValue) {
      setExchangeRate(exchangeRateValue);
    }
  }, [exchangeRateValue, setExchangeRate]);

  const {
    products,
    isLoadingProducts,
    sorting,
    setSorting,
    page,
    setPage,
    perPage,
    setPerPage,
    totalPages,
    totalRecords,
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
  } = useProducts({
    with_stock: true,
  });

  const columns = useSalesColumns();

  return (
     <div className="space-y-4">

      {/* Tabla y Grid de Productos */}
      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoadingProducts}
        showSearch={true}
        showAdd={false}
        enableRowSelection={false}
        showFilters={true}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t('products.search_placeholder', 'Buscar productos por nombre o SKU...')}
        filterComponents={
          <ProductFilters
            categoryFilter={selectedCategory}
            onCategoryChange={(v) => v && setSelectedCategory(v)}
            activeFilter={statusFilter}
            onActiveChange={(v) => v && setStatusFilter(v)}
            stockFilter={stockFilter}
            onStockChange={(v) => v && setStockFilter(v)}
            onReset={handleResetFilters}
            isResetDisabled={hasActiveFilters}
          />
        }
        sorting={sorting}
        onSortingChange={setSorting}
        defaultViewMode="grid"
        renderGridCard={(row) => {
          const product = row.original;
          const inCartItem = cartItems.find((i) => i.product_id === product.id);
          const currentQty = inCartItem?.quantity || 0;
          return (
            <ProductSalesCard
              row={row}
              exchangeRate={exchangeRateValue}
              inCartQuantity={currentQty}
              onAddToCart={() =>
                addItem({
                  product_id: product.id,
                  product_name_snapshot: product.name,
                  unit_price_usd: product.price_usd,
                  unit_cost_usd: product.cost_usd,                  
                  max_stock: product.stock,
                  sku: product.sku,
                })
              }
              onDecrement={() => updateQuantity(product.id, currentQty - 1)}
              onRemove={() => removeItem(product.id)}
              onSelectMaxStock={() => updateQuantity(product.id, product.stock)}
            />
          );
        }}
        pagination={{
          pageIndex: page,
          pageSize: perPage,
          pageCount: totalPages,
          total: totalRecords,
        }}
        onPageChange={setPage}
        onPageSizeChange={(newPerPage) => {
          setPerPage(newPerPage);
          setPage(1);
        }}
      />      
    </div>
  );
}