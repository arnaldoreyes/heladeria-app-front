
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface MetricCardItem {
  label: string;
  value: string;
  sub: string;
  icon: any;
  color: string;
}

interface AnalyticsMetricsProps {
  metrics: MetricCardItem[];
}

export function AnalyticsMetrics({ metrics }: AnalyticsMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <Card key={m.label}>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {m.label}
                </span>
                <Icon className={cn('h-4 w-4', m.color)} />
              </div>
              <p className="font-mono text-lg font-bold">{m.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{m.sub}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}