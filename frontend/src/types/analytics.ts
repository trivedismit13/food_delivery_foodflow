export interface CreatorDashboardResponse {
  creatorId: number;
  creatorName: string;
  period: string;
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  revenueChange: number;
  ordersChange: number;
  repeatCustomerRate: number;
  totalUniqueCustomers: number;
  followerCount: number;
  totalDrops: number;
  completedDrops: number;
  avgDropFillRate: number;
  bestSellingItem: string;
  bestDropTitle: string | null;
  bestDayOfWeek: string | null;
}

export interface InsightResponse {
  question: string;
  insight: string;
  supportingData: Record<string, unknown>;
  supportingDataKeys: string[];

  generatedAt: string;
}

export interface WeeklyTrendResponse {
  week: string;
  orders: number;
  revenue: number;
  uniqueCustomers: number;
}

export interface TopItemResponse {
  itemName: string;
  totalOrders: number;
  totalRevenue: number;
}

export interface RepeatCustomerResponse {
  repeatCustomers: number;
  totalCustomers: number;
  repeatRatePercent: number;
}

export interface DropPerformanceResponse {
  dropTitle: string;
  maxOrders: number;
  currentOrders: number;
  hoursToSellout: number;
  dropDate: string;
}

export interface BestDayResponse {
  dayOfWeek: string;
  avgFillRate: number;
  dropCount: number;
  avgOrdersPerDrop: number;
}
