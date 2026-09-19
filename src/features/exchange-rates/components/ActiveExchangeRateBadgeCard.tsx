import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ExchangeRate } from '@/interfaces/exchange-rates.interface';

interface CompactExchangeRateCardProps {
  currentRate: ExchangeRate | null;
  className?: string;
}

export function CompactExchangeRateCard({
  currentRate,
  className = '',
}: CompactExchangeRateCardProps) {
  const { t } = useTranslation();

  return (
    <Card className={`p-4 shadow-sm border border-border/60 ${className}`}>
      <CardContent className="p-0 space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
          <span>{t('settings.exchange.currentTitle', 'Tasa Activa en el Sistema')}</span>
          {currentRate?.currency && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-semibold uppercase">
              {currentRate.currency}
            </Badge>
          )}
        </div>
        <div className="text-2xl font-bold tracking-tight text-foreground pt-0.5">
          {currentRate ? `Bs. ${Number(currentRate.rate).toFixed(2)}` : 'N/A'}
        </div>
      </CardContent>
    </Card>
  );
}