import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import type { HourlyTrafficItem } from '../types/analitycs';

interface HourlyTrafficChartProps {
  data: HourlyTrafficItem[];
  peakHour?: string;
}

export function HourlyTrafficChart({ data, peakHour }: HourlyTrafficChartProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Tráfico por Hora (Horas Pico)
          </CardTitle>
          {peakHour && (
            <span className="text-xs bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full">
              Pico: {peakHour}
            </span>
          )}
        </div>
        <CardDescription>Distribución de transacciones registradas a lo largo del día</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[230px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="hour" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as HourlyTrafficItem;
                    return (
                      <div className="rounded-lg border bg-background p-2.5 shadow-md text-xs">
                        <p className="font-semibold">{item.hour}</p>
                        <p className="text-primary font-medium mt-1">
                          Ventas: ${item.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-muted-foreground">
                          Transacciones: {item.salesCount}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="totalAmount" fill="var(--color-primary, #3b82f6)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}