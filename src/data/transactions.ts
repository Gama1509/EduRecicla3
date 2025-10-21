// @/data/transactions.ts
import { Transaction } from "@/types/transaction";

export const transactions: Transaction[] = [
    { id: 1, type: 'Sold', item: 'Refurbished Dell Laptop', date: '2023-10-15', amount: 250 },
    { id: 2, type: 'Bought', item: 'Samsung Galaxy Tablet', date: '2023-10-12', amount: -150 },
    { id: 3, type: 'Donated', item: 'HP 24-inch Monitor', date: '2023-10-10', amount: 0 },
  ];
