import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { t } from 'i18next';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  count?: number;
  title?: string;
  description?: string;
}

export function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  count = 1,
  title,
  description,
}: ConfirmDeleteDialogProps) {
  const isBulk = count > 1;

  const defaultTitle = isBulk
    ? t('common.confirm_bulk_delete_title', 'Eliminar registros seleccionados')
    : t('common.confirm_delete_title', '¿Estás seguro?');

  const defaultDescription = isBulk
    ? t(
        'common.confirm_bulk_delete_desc',
        `Vas a eliminar ${count} registros. Esta acción no se puede deshacer.`
      )
    : t(
        'common.confirm_delete_desc',
        'Esta acción no se puede deshacer. El registro será eliminado permanentemente.'
      );

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || defaultTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} onClick={onClose}>
            {t('common.cancel', 'Cancelar')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isBulk
              ? t('common.delete_all', 'Eliminar Todos')
              : t('common.delete', 'Eliminar')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}