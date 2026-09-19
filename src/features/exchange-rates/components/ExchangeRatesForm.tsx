import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { useActiveExchangeRate } from '../hooks/useActiveExchangeRate';
import { useExchangeRates } from '../hooks/useExchangeRates';

import { ActiveExchangeRateCard } from './ActiveExchangeRateCard';
import { ExchangeRateConfigForm } from './ExchangeRateConfigForm';
import { ExchangeRateHistoryCard } from './ExchangeRateHistoryCard';

export default function ExchangeRatesForm() {
  const { t } = useTranslation();
  const { currentRate } = useActiveExchangeRate();
  const {
    isLoading,
    history,
    form,
    bcvModeValue,
    ratePolicyValue,
    handleSubmitConfig,
    handleSyncBCV,
    isSaving,
    isDirty,
    isSyncing,
  } = useExchangeRates();

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
    <div className="space-y-6 max-w-full">
      <div>
        <h3 className="text-lg font-medium">{t('settings.exchange.title', 'Tasas de Cambio')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('settings.exchange.desc', 'Gestiona la tasa de conversión, moneda y política de actualización del sistema.')}
        </p>
      </div>

      {/* 1. Tasa Activa */}
      <ActiveExchangeRateCard
        currentRate={currentRate}
        onSync={handleSyncBCV}
        isSyncing={isSyncing}
      />

      {/* 2. Configuración e Historial */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExchangeRateConfigForm
          form={form}
          bcvModeValue={bcvModeValue}
          ratePolicyValue={ratePolicyValue}
          handleSubmitConfig={handleSubmitConfig}
          isSaving={isSaving}
          isDirty={isDirty}
        />
        <ExchangeRateHistoryCard history={history} />
      </div>
    </div>
  );
}