import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Package,
  Download,
  Wallet,
  PiggyBank,
  Loader2,
  Boxes,
  Users,
  HandCoins,
} from 'lucide-react';

import { formatUsd, formatBs } from '@/lib/format';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalytics } from './hooks/useAnalytics';
import type { AnalyticsFilters } from './types/analitycs';

import { AnalyticsMetrics, type MetricCardItem } from './components/analytics-metrics';
import { AnalyticsInsights } from './components/analytics-insights';
import { AnalyticsCharts } from './components/analytics-charts';
import { AnalyticsTopProducts } from './components/analytics-top-products';
import { AnalyticsDataTools } from './components/analytics-data-tools';
import { ImportDataDialog } from './components/import-data-dialog';

// Nuevos componentes de analítica integrada
import { CurrencyBalanceCard } from './components/currency-balance-card';
import { HourlyTrafficChart } from './components/hourly-traffic-chart';
import { InventoryValuationCard } from './components/inventory-valuation-card';
import { DeadStockTable } from './components/dead-stock-table';
import { ShrinkageSummaryCard } from './components/shrinkage-summary-card';
import { TopBuyersTable } from './components/top-buyers-table';

export default function AnalyticsPage() {
  const { t } = useTranslation(['analytics', 'common']);
  const [filters] = useState<AnalyticsFilters>({});
  

  const {
    analyticsData,
    isLoadingAnalytics,
    importOpen,
    setImportOpen,
    importData,
    setImportData,
    handleExport,
    isExporting,
    handleImport,
    isImporting,
  } = useAnalytics(filters);

  if (isLoadingAnalytics) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Fallbacks seguros con valores por defecto
  const totalSalesUsd = analyticsData?.summary.totalSalesUsd ?? 0;
  const exchangeRate = analyticsData?.summary.exchangeRate ?? 1;
  const reposicionFund = analyticsData?.summary.reposicionFund ?? 0;
  const reinvencionFund = analyticsData?.summary.reinvencionFund ?? 0;
  const netProfit = analyticsData?.summary.netProfit ?? 0;
  const businessFund = analyticsData?.summary.businessFund ?? 0;
  const accumulatedFugas = analyticsData?.summary.accumulatedFugas ?? 0;
  const accountsReceivable = analyticsData?.summary.accountsReceivable ?? 0;

  const metricCards: MetricCardItem[] = [
    {
      label: t('analytics.metrics.total_sales', 'Total Sales'),
      value: formatUsd(totalSalesUsd),
      sub: formatBs(totalSalesUsd * exchangeRate),
      icon: DollarSign,
      color: 'text-primary',
    },
    {
      label: t('analytics.metrics.net_profit', 'Net Profit'),
      value: formatUsd(netProfit),
      sub: 'Sales minus cost',
      icon: TrendingUp,
      color: 'text-emerald-600',
    },
    {
      label: t('analytics.metrics.reposicion', 'Reposición Fund'),
      value: formatUsd(reposicionFund),
      sub: `${analyticsData?.summary.reposicionPercent ?? 0}% of cost`,
      icon: Package,
      color: 'text-amber-600',
    },
    {
      label: t('analytics.metrics.reinvencion', 'Reinvención Fund'),
      value: formatUsd(reinvencionFund),
      sub: `${analyticsData?.summary.reinvencionPercent ?? 0}% of profit`,
      icon: PiggyBank,
      color: 'text-violet-600',
    },
    {
      label: t('analytics.metrics.business_fund', 'Business Fund'),
      value: formatUsd(businessFund),
      sub: `${analyticsData?.summary.businessPercent ?? 0}% of sales`,
      icon: Wallet,
      color: 'text-blue-600',
    },
    {
      label: t('analytics.metrics.accounts_receivable', 'Cuentas x Cobrar'),
      value: formatUsd(accountsReceivable),
      sub: 'Créditos pendientes',
      icon: HandCoins,
      color: 'text-orange-600',
    },
  ];

  const defaultCurrencyBalance = {
    usdCash: 0,
    vesCash: 0,
    vesDigital: 0,
    zelleUsd: 0,
    exchangeRate,
    discrepancies: accumulatedFugas,
  };

  const defaultValuation = {
    totalItems: 0,
    totalCostUsd: 0,
    totalRetailValueUsd: 0,
    potentialProfitUsd: 0,
  };

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold lg:text-2xl">
            {t('analytics.title', 'Financial Analytics')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('analytics.subtitle', 'Revenue breakdown, inventory health, demand insights, and data tools.')}
          </p>
        </div>
      </div>

      <AnalyticsMetrics metrics={metricCards} />

      <AnalyticsInsights
        strongestDay={analyticsData?.insights.strongestDay || '—'}
        peakHour={analyticsData?.insights.peakHour || '—'}
        topProductName={analyticsData?.insights.topProductName || '—'}
      />

      <Tabs defaultValue="finance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex md:grid-cols-none">
          <TabsTrigger value="finance">
            <BarChart3 className="mr-2 h-4 w-4" />
            {t('analytics.tabs.finance', 'Finanzas & Ventas')}
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Boxes className="mr-2 h-4 w-4" />
            {t('analytics.tabs.inventory', 'Inventario & Mermas')}
          </TabsTrigger>
          <TabsTrigger value="customers">
            <Users className="mr-2 h-4 w-4" />
            {t('analytics.tabs.customers', 'Clientes & Top')}
          </TabsTrigger>
          <TabsTrigger value="data">
            <Download className="mr-2 h-4 w-4" />
            {t('analytics.tabs.data_tools', 'Data Tools')}
          </TabsTrigger>
        </TabsList>

        {/* PESTAÑA 1: FINANZAS & VENTAS */}
        <TabsContent value="finance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <CurrencyBalanceCard
              balance={analyticsData?.currencyBalance || defaultCurrencyBalance}
            />
            <HourlyTrafficChart
              data={analyticsData?.charts.hourlyTraffic || []}
              peakHour={analyticsData?.insights.peakHour}
            />
          </div>

          <AnalyticsCharts
            salesByDay={analyticsData?.charts.salesByDay || []}
            distributionData={analyticsData?.charts.distributionData || []}
            costData={analyticsData?.charts.costData || []}
          />
        </TabsContent>

        {/* PESTAÑA 2: INVENTARIO & MERMAS */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <InventoryValuationCard
              valuation={analyticsData?.inventory?.valuation || defaultValuation}
              lowStockCount={analyticsData?.inventory?.lowStockCount || 0}
              rotationRate={analyticsData?.inventory?.rotationRate || 0}
            />
            <ShrinkageSummaryCard
              items={analyticsData?.inventory?.shrinkageSummary?.items || []}
              totalLossUsd={analyticsData?.inventory?.shrinkageSummary?.totalLossUsd || 0}
            />
          </div>

          <DeadStockTable items={analyticsData?.inventory?.deadStock || []} />
        </TabsContent>

        {/* PESTAÑA 3: CLIENTES & TOP PRODUCTOS */}
        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <AnalyticsTopProducts products={analyticsData?.topProducts || []} />
            <TopBuyersTable buyers={analyticsData?.topBuyers || []} />
          </div>
        </TabsContent>

        {/* PESTAÑA 4: HERRAMIENTAS DE DATOS */}
        <TabsContent value="data" className="space-y-4">
          <AnalyticsDataTools
            onExport={handleExport}
            isExporting={isExporting}
            onOpenImport={() => setImportOpen(true)}
          />
        </TabsContent>
      </Tabs>

      <ImportDataDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        importData={importData}
        onImportDataChange={setImportData}
        onImport={handleImport}
        isImporting={isImporting}
      />
    </div>
  );
}