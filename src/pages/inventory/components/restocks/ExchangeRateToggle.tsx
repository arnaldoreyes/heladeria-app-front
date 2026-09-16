import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RefreshCw, TrendingUp, Calendar } from 'lucide-react';
import { formatBs, formatDateShort } from '@/lib/format';

interface ExchangeRateToggleProps {
  currentFormRate: number;
  activeSystemRate: number;
  activeSystemRateDate?: string;
  rateDate?: string;
  onUpdateToCurrentRate: (newRate: number) => void;
}

export function ExchangeRateToggle({
  currentFormRate,
  activeSystemRate,
  activeSystemRateDate,
  rateDate,
  onUpdateToCurrentRate,
}: ExchangeRateToggleProps) {
  const { t } = useTranslation();
  const isOutdated = currentFormRate !== activeSystemRate && activeSystemRate > 0;
  const displayDate = formatDateShort(isOutdated ? rateDate : activeSystemRateDate || rateDate);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 bg-muted/50 border rounded-lg text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3 shadow-xs transition-colors">
        <TrendingUp className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
        
        {/* Tasa actual del formulario */}
        <div className="flex items-center gap-1">
          <span className="text-slate-900 dark:text-slate-100">
            {formatBs(currentFormRate || 1)}
          </span>
        </div>

        {/* Fecha de la tasa */}
        {displayDate && (
          <div className="flex items-center gap-1 text-slate-500 border-l border-slate-200 dark:border-slate-700 pl-2">
            <Calendar className="w-3 h-3 shrink-0" />
            <span className="capitalize">{displayDate}</span>
          </div>
        )}

        {/* Botón de actualización cuando la tasa está desactualizada */}
        {isOutdated && (
          <Tooltip>
            <TooltipTrigger>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onUpdateToCurrentRate(activeSystemRate)}
                className="h-5 w-5 ml-1 text-amber-600 hover:text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-950/50 rounded-full animate-pulse"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end" className="text-xs max-w-xs space-y-0.5">
              <p>
                {t('restock.rate.updateTooltip', {
                  defaultValue: 'Actualizar a la tasa activa (Bs. {{rate}})',
                  rate: activeSystemRate.toFixed(2),
                })}
              </p>
              {activeSystemRateDate && (
                <p className="text-[10px] text-amber-300 font-normal">
                  {formatDateShort(activeSystemRateDate)}
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}