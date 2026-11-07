import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatUsd } from '@/lib/format';

interface SalesByDay {
  day: string;
  sales: number;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface AnalyticsChartsProps {
  salesByDay: SalesByDay[];
  distributionData: ChartDataItem[];
  costData: ChartDataItem[];
}

export function AnalyticsCharts({
  salesByDay,
  distributionData,
  costData,
}: AnalyticsChartsProps) {
const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sales by Day of Week</CardTitle>
            <CardDescription>Revenue distribution across the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesByDay}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  formatter={(v: number) => formatUsd(v)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="sales" fill="hsl(199 89% 48%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Distribution</CardTitle>
            <CardDescription>How sales revenue is allocated</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart width={400} height={300}>
  <Pie
    data={distributionData}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={80}
    label={(e) => `${e.name}: ${formatUsd(e.value)}`}
    
    // Ajusta el color del texto de la etiqueta
    labelLine={{ stroke: '#6B7280' }} // Color de la línea guía
  >
    {distributionData.map((d, i) => (
      <Cell key={i} fill={d.color || COLORS[i % COLORS.length]} />
    ))}
  </Pie>

  {/* Estilos para el Tooltip en modo claro/oscuro */}
  <Tooltip 
    formatter={(v: number) => formatUsd(v)}
    contentStyle={{
      backgroundColor: '#1F2937', // Fondo oscuro (Tailwind bg-gray-800)
      borderColor: '#374151',     // Borde (Tailwind border-gray-700)
      borderRadius: '0.375rem',
      color: '#F9FAFB'            // Texto claro
    }}
    itemStyle={{ color: '#F9FAFB' }}
  />

  {/* Estilo para la Leyenda */}
  <Legend 
    wrapperStyle={{ color: '#9CA3AF', paddingTop: '10px' }} // Texto gris claro
  />
</PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cost & Profit Breakdown</CardTitle>
          <CardDescription>Fund allocation from cost and profit</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={costData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" className="text-xs" />
              <YAxis dataKey="name" type="category" className="text-xs" width={120} />
              <Tooltip formatter={(v: number) => formatUsd(v)} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {costData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}