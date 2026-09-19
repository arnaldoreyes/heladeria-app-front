import { DollarSign, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormSectionCard } from '@/components/form/FormSectionCard';
import type { ExchangeRate } from '@/interfaces/exchange-rates.interface';
import { getSourceBadge } from '../utils/exchange-rate-badge';

interface ActiveExchangeRateCardProps {
  currentRate: ExchangeRate | null;
  onSync: () => void;
  isSyncing: boolean;
}

export function ActiveExchangeRateCard({
  currentRate,
  onSync,
  isSyncing,
}: ActiveExchangeRateCardProps) {
  const { t } = useTranslation();

  return (
    <FormSectionCard
      title={t('settings.exchange.currentTitle', 'Tasa Activa en el Sistema')}
      description={
        currentRate
          ? t('settings.exchange.descActive', 'Tasa vigente en uso para las operaciones del sistema.')
          : t('settings.exchange.noActiveRate', 'No hay tasa activa registrada.')
      }
      contentClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
      icon={DollarSign}
    >
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
            <div className="pt-1">{getSourceBadge(currentRate.source, t)}</div>
          </div>
        )}
      </div>

      <Button
        variant="default"
        className="w-full sm:w-auto"
        onClick={onSync}
        disabled={isSyncing}
      >
        <RefreshCw className={`mr-2 h-4 w-4 shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing
          ? t('settings.exchange.syncing', 'Sincronizando...')
          : t('settings.exchange.forceSync', 'Sincronizar BCV ahora')}
      </Button>
    </FormSectionCard>
  );
}