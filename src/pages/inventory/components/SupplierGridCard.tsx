import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Truck, Mail, Phone, MapPin, User } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import type { SupplierApiResponse } from '../interfaces/supplier.response';

interface SupplierGridCardProps {
  row: SupplierApiResponse;
  onEdit: (supplier: SupplierApiResponse) => void;
  onDelete: (id: string) => void;
}

export function SupplierGridCard({ row, onEdit, onDelete }: SupplierGridCardProps) {
  const { t } = useTranslation(['suppliers', 'common']);

  const taxLabel = row.tax_id
    ? row.tax_type
      ? `${row.tax_type}-${row.tax_id}`
      : row.tax_id
    : null;

  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{row.name}</CardTitle>
              {taxLabel && (
                <Badge variant="outline" className="font-mono text-xs mt-1">
                  {taxLabel}
                </Badge>
              )}
            </div>
          </div>
          <Badge variant={row.is_active ? 'default' : 'secondary'}>
            {row.is_active ? t('common.active', 'Activo') : t('common.inactive', 'Inactivo')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-muted-foreground pb-4">
        {row.contact_name && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate">{row.contact_name}</span>
          </div>
        )}
        {row.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{row.phone}</span>
          </div>
        )}
        {row.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0" />
            <span className="truncate">{row.email}</span>
          </div>
        )}
        {row.city && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{row.city}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t flex justify-end gap-1">
        <Button size="sm" variant="ghost" onClick={() => onEdit(row)}>
          <Edit className="h-4 w-4 mr-1" />
          {t('common.edit', 'Editar')}
        </Button>
        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onDelete(row.id)}>
          <Trash2 className="h-4 w-4 mr-1" />
          {t('common.delete', 'Eliminar')}
        </Button>
      </CardFooter>
    </Card>
  );
}