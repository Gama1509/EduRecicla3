// types/admin-dashboard.ts
export interface AdminDashboardDto {
  totalUsers: number;
  totalProducts: number;
  totalTransactions: number;
  totalSold: number;
  transactionsByType: Record<string, number>;
  transactionsByStatus: Record<string, number>;
}
