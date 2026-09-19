import { useTranslation } from 'react-i18next';
import { Slider } from '@/components/ui/slider';
import { FormSectionCard } from '../form/FormSectionCard';
import { PieChart } from 'lucide-react';

interface DistributionRulesProps {
  businessFundPercent: number;
  personalProfitPercent: number;
  onChange: (businessVal: number, personalVal: number) => void;
  step?: number;
  withCard?: boolean;
}

export function DistributionRulesSlider({
  businessFundPercent,
  personalProfitPercent,
  onChange,
  step = 5,
  withCard = true,
}: DistributionRulesProps) {
  const { t } = useTranslation();

  const content = (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{t('auth.register.businessFund')}</span>
        <span className="font-mono text-primary font-semibold">{businessFundPercent}%</span>
      </div>
      <Slider
        value={[businessFundPercent]}
        min={0}
        max={100}
        step={step}
        onValueChange={(values: number | readonly number[]) => {
          const val = Array.isArray(values) ? values[0] : values;
          onChange(val, 100 - val);
        }}
      />
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{t('auth.register.personalProfit')}</span>
        <span className="font-mono text-primary font-semibold">{personalProfitPercent}%</span>
      </div>
    </div>
  );

  // Renderizado condicional según la prop withCard
  if (!withCard) {
    return content;
  }

  return (
    <FormSectionCard
      title={t('common.distribution_rules_title', 'Reglas de distribución por defecto')}
      description={t('common.distribution_rules_subtitle', '¿Cómo se deben dividir los ingresos de las ventas?')}
      icon={PieChart}
    >
      <div className="">
        {content}
      </div>
    </FormSectionCard>
  );
}