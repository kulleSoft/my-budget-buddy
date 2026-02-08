import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '@/contexts/FinanceContext';
import { TransactionList } from '@/components/TransactionList';
import { TransactionForm } from '@/components/TransactionForm';
import { Button } from '@/components/ui/button';
import { Plus, TrendingDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, Category } from '@/types/finance';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export function ExpensesScreen() {
  const { transactions, getTotalExpenses } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  // Filter expenses
  const now = new Date();
  const monthStart = startOfMonth(subMonths(now, selectedMonth));
  const monthEnd = endOfMonth(subMonths(now, selectedMonth));

  const expenses = transactions.filter(t => {
    if (t.type !== 'expense') return false;
    const date = new Date(t.date);
    if (date < monthStart || date > monthEnd) return false;
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    return true;
  });

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const months = [
    { value: 0, label: 'Este mês' },
    { value: 1, label: 'Mês passado' },
    { value: 2, label: 'Há 2 meses' },
    { value: 3, label: 'Há 3 meses' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Gastos</h1>
          <p className="text-muted-foreground text-sm">Gerencie suas despesas</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          size="icon"
          className="w-12 h-12 rounded-full bg-gradient-expense shadow-elevated"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Total Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-expense rounded-2xl p-6 text-destructive-foreground"
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingDown className="w-5 h-5 opacity-80" />
          <p className="text-sm opacity-80">Total de Gastos</p>
        </div>
        <h2 className="text-3xl font-bold">{formatCurrency(totalExpenses)}</h2>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-3">
        <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(Number(v))}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value.toString()}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Expenses List */}
      <TransactionList transactions={expenses} />

      {/* Transaction Form */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        defaultType="expense"
      />
    </div>
  );
}
