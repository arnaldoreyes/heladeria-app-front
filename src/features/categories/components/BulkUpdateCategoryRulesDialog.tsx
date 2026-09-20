import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DistributionRulesSlider } from '@/components/custom/DistributionRulesSlider';
import { CategorySelect } from './CategorySelect';

import type { DistributionRuleMode, useCategories } from '../hooks/useCategories';
import type { Category } from '@/interfaces/category.interface';
import { FormSaveButton } from '@/components/form/FormSaveButton';

interface BulkUpdateCategoryRulesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  parentCategories?: Category[];
  categoriesHook: ReturnType<typeof useCategories>;
}

export function BulkUpdateCategoryRulesDialog({
  isOpen,
  onClose,
  selectedCount,
  parentCategories = [],
  categoriesHook,
}: BulkUpdateCategoryRulesDialogProps) {
  const { t } = useTranslation(['categories', 'common']);

  const DISTRIBUTION_RULE_OPTIONS = [
    {
      value: 'unchanged',
      label: t('categories.bulk.rules.unchanged', 'Sin cambios'),
      fullLabel: t('categories.bulk.rules.unchanged', 'Sin cambios'),
    },
    {
      value: 'global',
      label: t('categories.bulk.rules.global_short', 'Usar porcentajes globales'),
      fullLabel: t('categories.bulk.rules.global', 'Usar porcentajes globales del negocio (Restablecer)'),
    },
    {
      value: 'custom',
      label: t('categories.bulk.rules.custom_short', 'Porcentajes personalizados'),
      fullLabel: t('categories.bulk.rules.custom', 'Establecer porcentajes personalizados'),
    },
  ];

  const {
    bulkRulesForm,
    ruleMode,
    handleRuleModeChange,
    handleBulkRulesSubmit,
    parentIdValue,
    businessFundPercent,
    personalProfitPercent,
    isBulkUpdatingRules,
  } = categoriesHook;

  const { setValue, formState: { errors } } = bulkRulesForm;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {t('categories.bulk.edit_title', 'Editar {{count}} Categoría(s)', { count: selectedCount })}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleBulkRulesSubmit} className="space-y-6 py-2">
          {/* Categoría Padre */}
          <div className="space-y-2">
            <CategorySelect
              categories={parentCategories}
              value={parentIdValue}
              onChange={(val) => setValue('parent_id', val, { shouldValidate: true, shouldDirty: true })}
              error={errors.parent_id?.message}
            />
          </div>

          {/* Reglas de distribución masivas */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t('categories.bulk.distribution_rules', 'Reglas de distribución')}
              </Label>
              <Select value={ruleMode} onValueChange={(val: DistributionRuleMode) =>  handleRuleModeChange(val) }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('common.select_option', 'Seleccione una opción')}>
                    {DISTRIBUTION_RULE_OPTIONS.find((opt) => opt.value === ruleMode)?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {DISTRIBUTION_RULE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.fullLabel}
                    </SelectItem>
                  ))}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isBulkUpdatingRules}>
              {t('common.cancel', 'Cancelar')}
            </Button>
            <FormSaveButton isSaving={isBulkUpdatingRules} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}