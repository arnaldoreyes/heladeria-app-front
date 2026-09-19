import { History, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { FormSectionCard } from '@/components/form/FormSectionCard';
import type { ExchangeRate } from '@/interfaces/exchange-rates.interface';
import { getSourceBadge } from '../utils/exchange-rate-badge';

interface ExchangeRateHistoryCardProps {
  history: ExchangeRate[];
}

export function ExchangeRateHistoryCard({ history }: ExchangeRateHistoryCardProps) {
  const { t } = useTranslation();

  return (
    <FormSectionCard
      title={t('settings.exchange.historyTitle', 'Historial Reciente')}
      description={t('settings.exchange.historyDesc', 'Últimos registros de cambio en el sistema.')}
      contentClassName=""
      icon={History}
    >
      {history.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-10 border border-dashed rounded-md bg-muted/20">
          {t('settings.exchange.emptyHistory', 'El historial de tasas aparecerá aquí.')}
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {history.map((item: ExchangeRate) => (
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
                {getSourceBadge(item.source, t)}
              </div>
            </div>
          ))}
        </div>
      )}
    </FormSectionCard>
  );
}