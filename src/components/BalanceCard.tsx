import { motion } from 'framer-motion';
import { useFinance } from '@/contexts/FinanceContext';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BalanceCardProps {
  className?: string;
}

export function BalanceCard({ className }: BalanceCardProps) {
  const { getBalance, getTotalIncome, getTotalExpenses } = useFinance();
  
  const balance = getBalance();
  const income = getTotalIncome();
  const expenses = getTotalExpenses();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-gradient-primary rounded-2xl p-6 text-primary-foreground shadow-elevated", className)}
    >
      {/* Balance */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Wallet className="w-5 h-5 opacity-80" />
          <p className="text-sm opacity-80">Saldo Atual</p>
        </div>
        <h2 className={cn(
          "text-4xl font-bold tracking-tight",
          balance < 0 && "text-red-200"
        )}>
          {formatCurrency(balance)}
        </h2>
      </div>

      {/* Income / Expenses */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-success" />
            </div>
            <span className="text-xs opacity-80">Receitas</span>
          </div>
          <p className="text-lg font-semibold">
            {formatCurrency(income)}
          </p>
        </div>

        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
              <TrendingDown className="w-3 h-3 text-destructive" />
            </div>
            <span className="text-xs opacity-80">Despesas</span>
          </div>
          <p className="text-lg font-semibold">
            {formatCurrency(expenses)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
