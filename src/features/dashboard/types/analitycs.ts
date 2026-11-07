export type ExportType = 'sales' | 'inventory' | 'financial' | 'customers' | 'shrinkage';

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month' | 'year';
  categoryId?: string;
  userId?: string;
}

// ----------------------------------------------------------------------
// 1. SECCIÓN VENTAS Y FINANZAS
// ----------------------------------------------------------------------
export interface SalesByDay {
  day: string;
  sales: number;
}

export interface HourlyTrafficItem {
  hour: string; // ej. "14:00"
  salesCount: number;
  totalAmount: number;
}

export interface ChartDataItem {
  name: string;
  value: number;
  color?: string;
}

export interface CurrencyBalance {
  usdCash: number;
  vesCash: number;
  vesDigital: number; // Pago Móvil / Punto
  zelleUsd: number;
  exchangeRate: number;
  discrepancies: number; // Fugas o descuadres cambiarios
}

export interface ExpenseItem {
  category: string;
  amount: number;
  percentage: number;
}

export interface AnalyticsSummary {
  totalSalesUsd: number;
  exchangeRate: number;
  reposicionFund: number;
  reposicionPercent: number;
  reinvencionFund: number;
  reinvencionPercent: number;
  netProfit: number;
  businessFund: number;
  businessPercent: number;
  accumulatedFugas: number;
  accountsReceivable: number; // Cuentas por cobrar
}

// ----------------------------------------------------------------------
// 2. SECCIÓN PRODUCTOS E INVENTARIO
// ----------------------------------------------------------------------
export interface TopProductItem {
  id: string;
  name: string;
  qty: number;
  revenue: number;
}

export interface InventoryValuation {
  totalItems: number;
  totalCostUsd: number;
  totalRetailValueUsd: number;
  potentialProfitUsd: number;
}

export interface DeadStockItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  lastSoldDate: string;
  tiedCapitalUsd: number;
}

export interface ShrinkageItem {
  id: string;
  productName: string;
  reason: 'expired' | 'damaged' | 'lost' | 'internal_use';
  quantity: number;
  costUsd: number;
  date: string;
}

export interface CostTrendItem {
  date: string;
  productName: string;
  previousCost: number;
  newCost: number;
  variationPercentage: number;
}

export interface InventoryAnalyticsData {
  valuation: InventoryValuation;
  lowStockCount: number;
  rotationRate: number; // Tasa de rotación de stock
  deadStock: DeadStockItem[];
  shrinkageSummary: {
    totalLossUsd: number;
    items: ShrinkageItem[];
  };
  costTrends: CostTrendItem[];
}

// ----------------------------------------------------------------------
// 3. SECCIÓN CLIENTES Y PERFORMANCE DE USUARIOS
// ----------------------------------------------------------------------
export interface TopBuyerItem {
  id: string;
  name: string;
  totalSpentUsd: number;
  totalOrders: number;
  lastPurchaseDate: string;
  rfmSegment?: 'Champion' | 'Loyal' | 'At Risk' | 'New';
}

export interface UserPerformanceItem {
  userId: string;
  userName: string;
  role: string;
  totalSalesUsd: number;
  totalTransactions: number;
  averageTicketUsd: number;
}

// ----------------------------------------------------------------------
// CONTENEDOR PRINCIPAL
// ----------------------------------------------------------------------
export interface AnalyticsInsightsData {
  strongestDay: string;
  peakHour: string;
  topProductName: string;
  topPaymentMethod: string;
}

export interface AnalyticsChartsData {
  salesByDay: SalesByDay[];
  hourlyTraffic: HourlyTrafficItem[];
  byPaymentMethod: ChartDataItem[];
  byCategory: ChartDataItem[];
  expensesBreakdown: ExpenseItem[];
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  currencyBalance: CurrencyBalance;
  insights: AnalyticsInsightsData;
  charts: AnalyticsChartsData;
  topProducts: TopProductItem[];
  inventory: InventoryAnalyticsData;
  topBuyers: TopBuyerItem[];
  userPerformance: UserPerformanceItem[];
}

export interface AnalyticsApiResponse {
  success: boolean;
  data: AnalyticsData;
  message?: string;
}

export interface ImportCsvPayload {
  csv: string;
}

export interface ImportCsvResponse {
  success: boolean;
  rowsProcessed: number;
  message?: string;
}