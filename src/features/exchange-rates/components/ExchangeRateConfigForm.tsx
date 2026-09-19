import { Sliders } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Controller, type UseFormReturn } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormSaveButton } from '@/components/form/FormSaveButton';
import { FormSectionCard } from '@/components/form/FormSectionCard';
import type { UpdateExchangeConfigPayload } from '../schemas/exchange-rate.schema';

interface ExchangeRateConfigFormProps {
  form: UseFormReturn<UpdateExchangeConfigPayload>;
  bcvModeValue: 'auto' | 'manual';
  ratePolicyValue: string;
  handleSubmitConfig: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSaving: boolean;
  isDirty: boolean;
}

export function ExchangeRateConfigForm({
  form,
  bcvModeValue,
  handleSubmitConfig,
  isSaving,
  isDirty,
}: ExchangeRateConfigFormProps) {
  const { t } = useTranslation();
  const { register, control, formState: { errors } } = form;

  return (
    <FormSectionCard
      title={t('settings.exchange.configTitle', 'Configuración de Tasa')}
      description={t('settings.exchange.configDesc', 'Ajusta los parámetros principales de las tasas.')}
      contentClassName=""
      icon={Sliders}
    >
      <form onSubmit={handleSubmitConfig} className="space-y-6">
        {/* Modo de Tasa */}
        <div className="space-y-3">
          <Label>{t('settings.business.bcvMode', 'Modo de Tasa (Automático vs Manual)')}</Label>
          <Controller
            name="bcv_mode"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-col sm:flex-row gap-3 sm:gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="auto" id="bcv-auto" />
                  <Label htmlFor="bcv-auto" className="font-normal cursor-pointer">
                    {t('settings.business.bcvAuto', 'Automático (BCV)')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="bcv-manual" />
                  <Label htmlFor="bcv-manual" className="font-normal cursor-pointer">
                    {t('settings.business.bcvManual', 'Fijar Manualmente')}
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.bcv_mode && (
            <p className="text-xs text-destructive">{errors.bcv_mode.message as string}</p>
          )}
        </div>

        {/* Tasa Manual */}
        {bcvModeValue === 'manual' && (
          <div className="space-y-2 animate-in fade-in-50 duration-200">
            <Label htmlFor="rate">{t('settings.business.manualRate', 'Tasa Manual Configurada')}</Label>
            <Input
              id="rate"
              type="number"
              step="0.01"
              placeholder={t('settings.exchange.manualRatePlaceholder', 'Ej. 38.50')}
              {...register('rate', { valueAsNumber: true })}
            />
            {errors.rate && (
              <p className="text-xs text-destructive">{errors.rate.message as string}</p>
            )}
          </div>
        )}

        {/* Política de Sincronización */}
        {bcvModeValue !== 'manual' && (
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              {t('settings.exchange.ratePolicyLabel', 'Política de Sincronización de Tasa')}
            </Label>
            <Controller
              name="rate_policy"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-col space-y-3 pt-1"
                >
                  {/* Estricta */}
                  <div 
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => field.onChange('strict')}
                  >
                    <RadioGroupItem value="strict" id="policy-strict" className="mt-1 shrink-0" />
                    <div className="space-y-1">
                      <Label htmlFor="policy-strict" className="font-medium cursor-pointer">
                        {t('settings.exchange.policies.strict.title', 'Estricta (Conservadora de Fines de Semana)')}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {t(
                          'settings.exchange.policies.strict.desc',
                          'Mantiene la tasa actual. Durante el fin de semana congela la tasa del viernes hasta el lunes a las 00:00.'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Inmediata */}
                  <div 
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => field.onChange('immediate')}
                  >
                    <RadioGroupItem value="immediate" id="policy-immediate" className="mt-1 shrink-0" />
                    <div className="space-y-1">
                      <Label htmlFor="policy-immediate" className="font-medium cursor-pointer">
                        {t('settings.exchange.policies.immediate.title', 'Inmediata (Actualización en Vivo)')}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {t(
                          'settings.exchange.policies.immediate.desc',
                          'Apenas el BCV publica la tasa (aprox. 4:00 PM), la adopta de inmediato sin importar si es fin de semana o feriado.'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Smart Holiday */}
                  <div 
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => field.onChange('smart_holiday')}
                  >
                    <RadioGroupItem value="smart_holiday" id="policy-smart-holiday" className="mt-1 shrink-0" />
                    <div className="space-y-1">
                      <Label htmlFor="policy-smart-holiday" className="font-medium cursor-pointer">
                        {t('settings.exchange.policies.smartHoliday.title', 'Inteligente con Feriados (Intermedia)')}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {t(
                          'settings.exchange.policies.smartHoliday.desc',
                          'De lunes a viernes usa la tasa del día. Sábados, domingos o feriados usa automáticamente la tasa futura si ya está cargada.'
                        )}
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.rate_policy && (
              <p className="text-xs text-destructive">{errors.rate_policy.message as string}</p>
            )}
          </div>
        )}

        <FormSaveButton isSaving={isSaving} isDirty={isDirty} />
      </form>
    </FormSectionCard>
  );
}