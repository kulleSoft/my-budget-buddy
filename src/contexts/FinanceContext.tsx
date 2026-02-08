import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, TransactionType, Category } from '@/types/finance';

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  getBalance: () => number;
  getTotalIncome: (startDate?: Date, endDate?: Date) => number;
  getTotalExpenses: (startDate?: Date, endDate?: Date) => number;
  getTransactionsByCategory: (category: Category, startDate?: Date, endDate?: Date) => Transaction[];
  getTransactionsByPeriod: (startDate: Date, endDate: Date) => Transaction[];
  clearAllData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEY = 'finance_transactions';

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading transactions:', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const filterByDateRange = (items: Transaction[], startDate?: Date, endDate?: Date) => {
    if (!startDate && !endDate) return items;
    return items.filter(t => {
      const date = new Date(t.date);
      if (startDate && date < startDate) return false;
      if (endDate && date > endDate) return false;
      return true;
    });
  };

  const getBalance = () => {
    return transactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);
  };

  const getTotalIncome = (startDate?: Date, endDate?: Date) => {
    const filtered = filterByDateRange(
      transactions.filter(t => t.type === 'income'),
      startDate,
      endDate
    );
    return filtered.reduce((acc, t) => acc + t.amount, 0);
  };

  const getTotalExpenses = (startDate?: Date, endDate?: Date) => {
    const filtered = filterByDateRange(
      transactions.filter(t => t.type === 'expense'),
      startDate,
      endDate
    );
    return filtered.reduce((acc, t) => acc + t.amount, 0);
  };

  const getTransactionsByCategory = (category: Category, startDate?: Date, endDate?: Date) => {
    return filterByDateRange(
      transactions.filter(t => t.category === category),
      startDate,
      endDate
    );
  };

  const getTransactionsByPeriod = (startDate: Date, endDate: Date) => {
    return filterByDateRange(transactions, startDate, endDate);
  };

  const clearAllData = () => {
    setTransactions([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        getBalance,
        getTotalIncome,
        getTotalExpenses,
        getTransactionsByCategory,
        getTransactionsByPeriod,
        clearAllData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
