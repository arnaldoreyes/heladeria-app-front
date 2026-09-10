import { useTranslation } from 'react-i18next';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface DistributionRulesProps {
  businessFundPercent: number;
  personalProfitPercent: number;
  onChange: (businessVal: number, personalVal: number) => void;
  step?: number;
}

export function DistributionRulesSlider({
  businessFundPercent,
  personalProfitPercent,
  onChange,
  step = 5,
}: DistributionRulesProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('auth.register.distributionRulesTitle')}</CardTitle>
        <CardDescription> {t('auth.register.distributionRulesSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">      
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{t('auth.register.businessFund')}</span>
            <span className="font-mono text-primary">{businessFundPercent}%</span>
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
            <span className="font-mono text-primary">{personalProfitPercent}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}