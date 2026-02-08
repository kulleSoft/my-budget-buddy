import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '@/contexts/FinanceContext';
import { BalanceCard } from '@/components/BalanceCard';
import { TransactionList } from '@/components/TransactionList';
import { TransactionForm } from '@/components/TransactionForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function HomeScreen() {
  const { transactions } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
      <div>
          <p className="text-muted-foreground text-sm">Olá! 👋</p>
          <h1 className="text-2xl font-bold">kestGastos</h1>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          size="icon"
          className="w-12 h-12 rounded-full bg-gradient-primary shadow-elevated"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Balance Card */}
      <BalanceCard />

      {/* Recent Transactions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Transações Recentes</h2>
        <TransactionList transactions={recentTransactions} />
      </div>

      {/* Transaction Form */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
}
