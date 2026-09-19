import { Bot, RefreshCw, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TFunction } from 'i18next';

export const getSourceBadge = (source?: string, t?: TFunction) => {
  const translate = t || ((key: string, fallback: string) => fallback);

  switch (source) {
    case 'system_cron':
      return (
        <Badge variant="secondary">
          <Bot className="w-3 h-3 mr-1 shrink-0" />{' '}
          {translate('settings.exchange.sourceCron', 'Automático')}
        </Badge>
      );
    case 'system_sync':
      return (
        <Badge variant="outline">
          <RefreshCw className="w-3 h-3 mr-1 shrink-0" />{' '}
          {translate('settings.exchange.sourceSync', 'Sync')}
        </Badge>
      );
    case 'manual':
      return (
        <Badge variant="default">
          <Wrench className="w-3 h-3 mr-1 shrink-0" />{' '}
          {translate('settings.exchange.sourceManual', 'Manual')}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          <Bot className="w-3 h-3 mr-1 shrink-0" />{' '}
          {translate('settings.exchange.sourceApi', 'API / BCV')}
        </Badge>
      );
  }
};