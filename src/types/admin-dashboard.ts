// types/admin-dashboard.ts
export interface AdminDashboard {
  totalUsers: number;
  totalProducts: number;
  totalTransactions: number;
  totalAdminActions: number;
  totalSold: number;
  transactionsByType: Record<string, number>;
  transactionsByStatus: Record<string, number>;
}
