import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatUsd } from '@/lib/format';
import type { Product } from '@/interfaces/product.interface';

interface RestockProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const getStockBorderClass = (stock: number, minStock = 5) => {
  if (stock <= 0) return 'border-red-400';
  if (stock <= minStock) return 'border-amber-400';
  return 'border-border';
};

export const RestockProductCard = memo(function RestockProductCard({
  product,
  onSelect,
}: RestockProductCardProps) {
  const { t } = useTranslation();
  const currentStock = product.stock ?? 0;
  const minStockThreshold = product.min_stock_alert ?? 5;
  const borderClass = getStockBorderClass(currentStock, minStockThreshold);

  return (
    <div
      onClick={() => onSelect(product)}
      className={`group p-2 border rounded-xl hover:border-emerald-600/50 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between h-16 sm:h-20 relative select-none active:scale-[0.98] ${borderClass}`}
    >
      <span className="font-bold text-[10px] sm:text-xs uppercase line-clamp-2 text-slate-800 dark:text-slate-100 group-hover:text-emerald-800 leading-tight">
        {product.name}
      </span>
      <div className="flex items-center justify-between text-[9px] sm:text-[11px] mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
        <span className="text-muted-foreground font-medium">
          {t('restock.catalog.stockAbbr', { defaultValue: 'Stock' })}: {currentStock}
        </span>
        <span className="font-extrabold text-slate-900 dark:text-slate-100">
          {formatUsd(product.cost_usd || 0)}
        </span>
      </div>
    </div>
  );
});