import { Calendar, Clock, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AnalyticsInsightsProps {
  strongestDay: string;
  peakHour: string;
  topProductName: string;
}

export function AnalyticsInsights({
  strongestDay,
  peakHour,
  topProductName,
}: AnalyticsInsightsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Strongest Sales Day</p>
            <p className="text-lg font-bold">{strongestDay}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Peak Sales Hour</p>
            <p className="text-lg font-bold">{peakHour}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Top Product</p>
            <p className="truncate text-lg font-bold">{topProductName}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}