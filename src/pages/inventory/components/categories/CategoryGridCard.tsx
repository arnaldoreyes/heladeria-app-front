import { type Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, MoreVertical, Folder, Package, Layers } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface CategoryItemData {
  id: string;
  business_id?: string;
  parent_id?: string | null;
  name: string;
  description?: string | null;
  icon?: string | null;
  profit_percentage?: number | null;
  reinvestment_percentage?: number | null;
  products_count?: number;
  parent?: { name: string } | null;
  created_at?: string;
  updated_at?: string;
}

interface CategoryGridCardProps<TData> {
  row: Row<TData>;
  onEdit?: (category: CategoryItemData) => void;
  onDelete?: (id: string) => void;
  onClick?: (category: CategoryItemData) => void;
}

export function CategoryGridCard<TData>({
  row,
  onEdit,
  onDelete,
  onClick,
}: CategoryGridCardProps<TData>) {
  const { t } = useTranslation(['categories', 'common']);
  const category = row.original as unknown as CategoryItemData;
  const isSelected = row.getIsSelected();

  const productsCount = category.products_count ?? 0;
  const parentName = category.parent?.name;

  return (
    <Card
      onClick={() => onClick?.(category)}
      className={cn(
        'relative h-full group cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between border overflow-hidden bg-card p-3 rounded-2xl',
        isSelected
          ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
          : 'border-border hover:border-primary/50'
      )}
    >
      {/* SECCIÓN SUPERIOR: HERO LISO CON CÍRCULO CENTRADO */}
      <div className="relative w-full h-24 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border/50 flex items-center justify-center overflow-hidden transition-colors duration-200">
        {/* Checkbox */}
        <div
          className="absolute top-2.5 left-2.5 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => row.toggleSelected(!!checked)}
            aria-label="Seleccionar categoría"
            className="bg-background/80 backdrop-blur-sm data-[state=checked]:bg-primary h-5 w-5 rounded-md border-muted-foreground/40 cursor-pointer"
          />
        </div>

        {/* Menú Opciones */}
        {(onEdit || onDelete) && (
          <div
            className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">{t('common.actions', 'Acciones')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {onEdit && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => onEdit(category)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {t('common.edit', 'Editar')}
                  </DropdownMenuItem>
                )}
                {onDelete && category.id && (
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => onDelete(category.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('common.delete', 'Eliminar')}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Círculo Flotante del Icono */}
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-xs">
          {category.icon ? (
            <span className="material-symbols-outlined text-2xl select-none leading-none">
              {category.icon}
            </span>
          ) : (
            <Folder className="w-5 h-5 text-primary" />
          )}
        </div>
      </div>

      {/* DETALLES DE LA CATEGORÍA */}
      <CardContent className="p-1 pt-3 space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Categoría Padre */}
          {parentName && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
              <Layers className="w-3 h-3 text-muted-foreground/70" />
              <span className="truncate">{parentName}</span>
            </div>
          )}

          {/* Nombre */}
          <h3
            className="text-base font-bold text-foreground tracking-tight leading-snug line-clamp-1 uppercase group-hover:text-primary transition-colors duration-150"
            title={category.name}
          >
            {category.name}
          </h3>

          {/* Descripción */}
          {category.description ? (
            <p
              className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[2rem]"
              title={category.description}
            >
              {category.description}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground/40 italic mt-1 min-h-[2rem]">
              {t('categories.noDescription', 'Sin descripción')}
            </p>
          )}
        </div>

        {/* PIE DE PÁGINA */}
        <div className="pt-2">
          <div className="h-[1px] w-full bg-border/60 mb-2.5" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Package className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-bold text-foreground">{productsCount}</span>
              <span className="text-[11px]">
                {t('categories.products', 'productos')}
              </span>
            </div>

            {category.profit_percentage !== null &&
              category.profit_percentage !== undefined && (
                <Badge
                  variant="secondary"
                  className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                >
                  +{category.profit_percentage}%
                </Badge>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}