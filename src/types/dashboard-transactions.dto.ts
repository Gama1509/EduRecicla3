export enum TransactionType {
  SALE = "Sale",
  DONATION = "Donation",
}

export enum TransactionStatus {
  PENDING = "Pending",
  IN_PROGRESS = "InProgress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

// DTO para usar en el front
export interface DashboardTransactionsDto{
  id: string;
  product: string;
  seller: string;   // nombre del vendedor
  buyer: string;    // nombre del comprador
  status: TransactionStatus;
  type: TransactionType;
  totalPrice: number;
  quantityRequested: number;
  quantityDelivered: number;
  date: string;
}