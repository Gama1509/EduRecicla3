// @/types/transaction.ts
export interface Transaction {
  id: number;
  type: 'Sold' | 'Bought' | 'Donated';
  item: string;
  date: string;
  amount: number;
}
