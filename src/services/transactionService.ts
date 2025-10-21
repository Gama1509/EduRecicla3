// @/services/transactionService.ts
import { transactions } from '@/data/transactions';
import { Transaction } from '@/types/transaction';

export const getTransactions = (): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(transactions);
    }, 500); // Simulate network delay
  });
};
