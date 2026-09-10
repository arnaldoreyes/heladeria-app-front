import { useTranslation } from 'react-i18next';
import { RefreshCw, DollarSign, History, Sliders, User, Bot, Wrench } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useExchangeRates } from './hooks/useExchgeRates';

export default function ExchangeRatesConfig() {
  const { t } = useTranslation();
  const {
    currentRate,
    history,
    isLoading,
    form: { register, setValue, formState: { errors } },
    bcvModeValue,
    currencyUsedValue,
    ratePolicyValue,
    handleSubmitConfig,
    handleSyncBCV,
    isSaving,
    isSyncing,
  } = useExchangeRates();

  const getSourceBadge = (source?: string) => {
    switch (source) {
      case 'system_cron':
        return <Badge variant="secondary"><Bot className="w-3 h-3 mr-1 shrink-0" /> {t('settings.exchange.sourceCron', 'Automático')}</Badge>;
      case 'system_sync':
        return <Badge variant="outline"><RefreshCw className="w-3 h-3 mr-1 shrink-0" /> {t('settings.exchange.sourceSync', 'Sync')}</Badge>;
      case 'manual':
        return <Badge variant="default"><Wrench className="w-3 h-3 mr-1 shrink-0" /> {t('settings.exchange.sourceManual', 'Manual')}</Badge>;
      default:
        return <Badge variant="outline"><Bot className="w-3 h-3 mr-1 shrink-0" /> {t('settings.exchange.sourceApi', 'API / BCV')}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div>
        <h3 className="text-lg font-medium">{t('settings.exchange.title', 'Tasas de Cambio')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('settings.exchange.desc', 'Gestiona la tasa de conversión, moneda y política de actualización del sistema.')}
        </p>
      </div>

      {/* TASA ACTIVA */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary shrink-0" />
            {t('settings.exchange.currentTitle', 'Tasa Activa en el Sistema')}
          </CardTitle>
          <CardDescription>
            {currentRate
              ? t('settings.exchange.descActive', 'Tasa vigente en uso para las operaciones del sistema.')
              : t('settings.exchange.noActiveRate', 'No hay tasa activa registrada.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {currentRate ? `Bs. ${Number(currentRate.rate).toFixed(2)}` : 'N/A'}
              </div>
              {currentRate?.currency && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  {currentRate.currency}
                </Badge>
              )}
            </div>
            {currentRate && (
              <div className="text-xs text-muted-foreground space-y-0.5">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-medium">{t('settings.exchange.effectiveAt', 'Válida para:')}</span>
                  {new Date(currentRate.effective_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-medium">{t('settings.exchange.createdAt', 'Actualizada:')}</span>
                  {new Date(currentRate.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </div>
                <div className="pt-1">
                  {getSourceBadge(currentRate.source)}
                </div>
              </div>
            )}
          </div>

          <Button
            variant="default"
            className="w-full sm:w-auto"
            onClick={handleSyncBCV}
            disabled={isSyncing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? t('settings.exchange.syncing', 'Sincronizando...') : t('settings.exchange.forceSync', 'Sincronizar BCV ahora')}
          </Button>
        </CardContent>
      </Card>

      {/* CONFIGURACIÓN E HISTORIAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Formulario de Configuración */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sliders className="h-5 w-5 text-muted-foreground shrink-0" />
              {t('settings.exchange.configTitle', 'Configuración de Tasa')}
            </CardTitle>
            <CardDescription>
              {t('settings.exchange.configDesc', 'Ajusta los parámetros principales de las tasas.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitConfig} className="space-y-6">
              
              {/* Moneda Base */}
              <div className="space-y-3">
                <Label>{t('settings.exchange.currencyUsedLabel', 'Moneda Base a Usar')}</Label>
                <RadioGroup
                  value={currencyUsedValue}
                  onValueChange={(val) => setValue('currency_used', val, { shouldValidate: true })}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="USD" id="currency-usd" />
                    <Label htmlFor="currency-usd" className="font-normal cursor-pointer">USD ($)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="EUR" id="currency-eur" />
                    <Label htmlFor="currency-eur" className="font-normal cursor-pointer">EUR (€)</Label>
                  </div>
                </RadioGroup>
                {errors.currency_used && <p className="text-xs text-destructive">{errors.currency_used.message}</p>}
              </div>

              {/* Modo de Tasa */}
              <div className="space-y-3">
                <Label>{t('settings.business.bcvMode', 'Modo de Tasa (Automático vs Manual)')}</Label>
                <RadioGroup
                  value={bcvModeValue}
                  onValueChange={(val) => setValue('bcv_mode', val as 'auto' | 'manual', { shouldValidate: true })}
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
                {errors.bcv_mode && <p className="text-xs text-destructive">{errors.bcv_mode.message}</p>}
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
                  {errors.rate && <p className="text-xs text-destructive">{errors.rate.message}</p>}
                </div>
              )}

              {/* Política de Sincronización */}
              {bcvModeValue !== 'manual' && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">{t('settings.exchange.ratePolicyLabel', 'Política de Sincronización de Tasa')}</Label>
                  <RadioGroup
                    value={ratePolicyValue}
                    onValueChange={(val) => setValue('rate_policy', val as any, { shouldValidate: true })}
                    className="flex flex-col space-y-3 pt-1"
                  >
                    {/* Estricta */}
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="strict" id="policy-strict" className="mt-1 shrink-0" />
                      <div className="space-y-1 cursor-pointer" onClick={() => setValue('rate_policy', 'strict', { shouldValidate: true })}>
                        <Label htmlFor="policy-strict" className="font-medium cursor-pointer">
                          {t('settings.exchange.policies.strict.title', 'Estricta (Conservadora de Fines de Semana)')}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {t('settings.exchange.policies.strict.desc', 'Mantiene la tasa actual. Durante el fin de semana congela la tasa del viernes hasta el lunes a las 00:00.')}
                        </p>
                      </div>
                    </div>

                    {/* Inmediata */}
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="immediate" id="policy-immediate" className="mt-1 shrink-0" />
                      <div className="space-y-1 cursor-pointer" onClick={() => setValue('rate_policy', 'immediate', { shouldValidate: true })}>
                        <Label htmlFor="policy-immediate" className="font-medium cursor-pointer">
                          {t('settings.exchange.policies.immediate.title', 'Inmediata (Actualización en Vivo)')}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {t('settings.exchange.policies.immediate.desc', 'Apenas el BCV publica la tasa (aprox. 4:00 PM), la adopta de inmediato sin importar si es fin de semana o feriado.')}
                        </p>
                      </div>
                    </div>

                    {/* Smart Holiday */}
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="smart_holiday" id="policy-smart-holiday" className="mt-1 shrink-0" />
                      <div className="space-y-1 cursor-pointer" onClick={() => setValue('rate_policy', 'smart_holiday', { shouldValidate: true })}>
                        <Label htmlFor="policy-smart-holiday" className="font-medium cursor-pointer">
                          {t('settings.exchange.policies.smartHoliday.title', 'Inteligente con Feriados (Intermedia)')}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {t('settings.exchange.policies.smartHoliday.desc', 'De lunes a viernes usa la tasa del día. Sábados, domingos o feriados usa automáticamente la tasa futura si ya está cargada.')}
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                  {errors.rate_policy && <p className="text-xs text-destructive">{errors.rate_policy.message}</p>}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? t('common.saving', 'Guardando...') : t('common.saveChanges', 'Guardar Cambios')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Historial Reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground shrink-0" />
              {t('settings.exchange.historyTitle', 'Historial Reciente')}
            </CardTitle>
            <CardDescription>
              {t('settings.exchange.historyDesc', 'Últimos registros de cambio en el sistema.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-10 border border-dashed rounded-md bg-muted/20">
                {t('settings.exchange.emptyHistory', 'El historial de tasas aparecerá aquí.')}
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">
                          Bs. {Number(item.rate).toFixed(2)}
                        </span>
                        {item.currency && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                            {item.currency}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="font-medium">{t('settings.exchange.effectiveAt', 'Válida para:')}</span>
                          {new Date(item.effective_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="font-medium">{t('settings.exchange.createdAt', 'Actualizada:')}</span>
                          {new Date(item.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                        {item.user && (
                          <div className="flex items-center gap-1 mt-1 text-xs flex-wrap">
                            <User className="w-3 h-3 text-muted-foreground shrink-0" /> 
                            <span>{item.user.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center self-start sm:self-center">
                      {getSourceBadge(item.source)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}