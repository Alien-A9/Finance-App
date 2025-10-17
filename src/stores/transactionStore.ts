import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Transaction } from '@shared/types';
import { api } from '@/lib/api-client';
type TransactionState = {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  addTransaction: (newTransaction: Omit<Transaction, 'id'>) => Promise<Transaction>;
};
export const useTransactionStore = create<TransactionState>()(
  immer((set) => ({
    transactions: [],
    isLoading: true,
    error: null,
    fetchTransactions: async () => {
      try {
        set({ isLoading: true, error: null });
        const response = await api<{ items: Transaction[] }>('/api/transactions');
        set((state) => {
          state.transactions = response.items;
          state.isLoading = false;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
        set({ isLoading: false, error: errorMessage });
        console.error(errorMessage);
      }
    },
    addTransaction: async (newTransaction) => {
      try {
        const createdTransaction = await api<Transaction>('/api/transactions', {
          method: 'POST',
          body: JSON.stringify(newTransaction),
        });
        set((state) => {
          state.transactions.unshift(createdTransaction);
          // Keep transactions sorted by date
          state.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
        return createdTransaction;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add transaction';
        set({ error: errorMessage });
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
  }))
);