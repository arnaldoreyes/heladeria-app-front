import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DistributionRulesSlider } from '@/components/custom/DistributionRulesSlider';

import type { CategoryApiResponse } from '../../interfaces/category.response';
import {
  bulkUpdateCategoryRulesSchema,
  type BulkUpdateCategoryRulesFormData,
} from '../../schemas/category.schema';
import { CategorySelect } from '../CategorySelect';

interface BulkUpdateCategoryRulesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<BulkUpdateCategoryRulesFormData>) => void;
  isSaving: boolean;
  selectedCount: number;
  parentCategories?: CategoryApiResponse[];
}

type DistributionRuleMode = 'unchanged' | 'global' | 'custom';

export function BulkUpdateCategoryRulesDialog({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
  selectedCount,
  parentCategories = [],
}: BulkUpdateCategoryRulesDialogProps) {
  const { t } = useTranslation(['categories', 'common']);
  const [ruleMode, setRuleMode] = useState<DistributionRuleMode>('unchanged');

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BulkUpdateCategoryRulesFormData>({
    resolver: zodResolver(bulkUpdateCategoryRulesSchema),
    shouldUnregister: true,
    defaultValues: {
      parent_id: undefined,
      business_percentage: undefined,
      personal_percentage: undefined,
    },
  });

  const parentIdValue = watch('parent_id');
  const businessFundPercent = watch('business_percentage') ?? 60;
  const personalProfitPercent = watch('personal_percentage') ?? 40;

  // Mapa dinámico de textos traducidos según el idioma actual
  const ruleModeLabels: Record<DistributionRuleMode, string> = useMemo(
    () => ({
      unchanged: t('categories.bulk.rules.unchanged', 'Sin cambios'),
      global: t(
        'categories.bulk.rules.global',
        'Usar porcentajes globales del negocio (Restablecer)'
      ),
      custom: t(
        'categories.bulk.rules.custom',
        'Establecer porcentajes personalizados'
      ),
    }),
    [t]
  );

  useEffect(() => {
    if (isOpen) {
      reset({
        parent_id: undefined,
        business_percentage: undefined,
        personal_percentage: undefined,
      });
      setRuleMode('unchanged');
    }
  }, [isOpen, reset]);

  const handleRuleModeChange = (mode: DistributionRuleMode) => {
    setRuleMode(mode);
    if (mode === 'unchanged') {
      setValue('business_percentage', undefined, { shouldValidate: true, shouldDirty: true });
      setValue('personal_percentage', undefined, { shouldValidate: true, shouldDirty: true });
    } else if (mode === 'global') {
      setValue('business_percentage', null, { shouldValidate: true, shouldDirty: true });
      setValue('personal_percentage', null, { shouldValidate: true, shouldDirty: true });
    } else if (mode === 'custom') {
      setValue('business_percentage', 60, { shouldValidate: true, shouldDirty: true });
      setValue('personal_percentage', 40, { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleFormSubmit = (data: BulkUpdateCategoryRulesFormData) => {
    const payload: Partial<BulkUpdateCategoryRulesFormData> = {};

    if (data.parent_id !== undefined) {
      payload.parent_id = data.parent_id;
    }

    if (ruleMode === 'global') {
      payload.business_percentage = null;
      payload.personal_percentage = null;
    } else if (ruleMode === 'custom') {
      payload.business_percentage = data.business_percentage;
      payload.personal_percentage = data.personal_percentage;
    }

    onSubmit(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {t('categories.bulk.edit_title', 'Editar {{count}} Categoría(s)', {
              count: selectedCount,
            })}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-2">
          {/* Categoría Padre */}
          <div className="space-y-2">
            <CategorySelect
              categories={parentCategories}
              value={parentIdValue}
              onChange={(val) => setValue('parent_id', val, { shouldValidate: true, shouldDirty: true })}
              error={errors.parent_id?.message}
            />
            {errors.parent_id && (
              <p className="text-xs text-destructive">{errors.parent_id.message}</p>
            )}
          </div>

          {/* Reglas de distribución masivas */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t('categories.bulk.distribution_rules', 'Reglas de distribución')}
              </Label>
              <Select
                value={ruleMode}
                onValueChange={(val: DistributionRuleMode) => handleRuleModeChange(val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t('common.select_option', 'Seleccione una opción')}
                  >
                    {ruleModeLabels[ruleMode]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unchanged">{ruleModeLabels.unchanged}</SelectItem>
                  <SelectItem value="global">{ruleModeLabels.global}</SelectItem>
                  <SelectItem value="custom">{ruleModeLabels.custom}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {ruleMode === 'custom' && (
              <div className="pt-2">
                <DistributionRulesSlider
                  businessFundPercent={businessFundPercent}
                  personalProfitPercent={personalProfitPercent}
                  onChange={(businessVal, personalVal) => {
                    setValue('business_percentage', businessVal, { shouldValidate: true, shouldDirty: true });
                    setValue('personal_percentage', personalVal, { shouldValidate: true, shouldDirty: true });
                  }}
                />
              </div>
            )}
          </div>

          {errors.root && (
            <p className="text-xs text-destructive">{errors.root.message}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              {t('common.cancel', 'Cancelar')}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? t('common.saving', 'Guardando...') : t('common.save', 'Guardar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}