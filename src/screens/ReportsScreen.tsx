import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '@/contexts/FinanceContext';
import { CATEGORIES, Category, ViewPeriod } from '@/types/finance';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip 
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { startOfMonth, endOfMonth, startOfYear, endOfYear, startOfDay, endOfDay, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart3 } from 'lucide-react';

export function ReportsScreen() {
  const { transactions } = useFinance();
  const [period, setPeriod] = useState<ViewPeriod>('month');
  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  // Get date range based on period
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (period) {
    case 'day':
      startDate = startOfDay(now);
      endDate = endOfDay(now);
      break;
    case 'year':
      startDate = startOfYear(now);
      endDate = endOfYear(now);
      break;
    case 'month':
    default:
      startDate = startOfMonth(subMonths(now, selectedMonth));
      endDate = endOfMonth(subMonths(now, selectedMonth));
      break;
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= startDate && date <= endDate;
  });

  const expenses = filteredTransactions.filter(t => t.type === 'expense');
  const incomes = filteredTransactions.filter(t => t.type === 'income');

  // Calculate totals by category
  const categoryData = CATEGORIES.map(cat => {
    const total = expenses
      .filter(t => t.category === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      name: cat.label,
      value: total,
      color: `hsl(var(--${cat.color}))`,
    };
  }).filter(d => d.value > 0);

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);

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

  // Bar chart data for monthly comparison
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const monthDate = subMonths(now, 5 - i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    
    const monthExpenses = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && date >= monthStart && date <= monthEnd;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthIncome = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'income' && date >= monthStart && date <= monthEnd;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      name: format(monthDate, 'MMM', { locale: ptBR }),
      gastos: monthExpenses,
      receitas: monthIncome,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground text-sm">Visualize suas finanças</p>
      </motion.div>

      {/* Period Selector */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as ViewPeriod)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="day">Dia</TabsTrigger>
          <TabsTrigger value="month">Mês</TabsTrigger>
          <TabsTrigger value="year">Ano</TabsTrigger>
        </TabsList>
      </Tabs>

      {period === 'month' && (
        <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(Number(v))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o mês" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value.toString()}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-xl p-4 shadow-card border border-border"
        >
          <p className="text-xs text-muted-foreground mb-1">Receitas</p>
          <p className="text-lg font-bold text-success">{formatCurrency(totalIncome)}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-xl p-4 shadow-card border border-border"
        >
          <p className="text-xs text-muted-foreground mb-1">Gastos</p>
          <p className="text-lg font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
        </motion.div>
      </div>

      {/* Pie Chart - Expenses by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl p-4 shadow-card border border-border"
      >
        <h3 className="font-semibold mb-4">Gastos por Categoria</h3>
        {categoryData.length > 0 ? (
          <>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs truncate">{cat.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {((cat.value / totalExpenses) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Sem dados para exibir</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Bar Chart - Monthly Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-4 shadow-card border border-border"
      >
        <h3 className="font-semibold mb-4">Comparativo Mensal</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="receitas" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastos" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-xs">Receitas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-xs">Gastos</span>
          </div>
        </div>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-xl p-4 shadow-card border border-border"
      >
        <h3 className="font-semibold mb-4">Detalhes por Categoria</h3>
        <div className="space-y-3">
          {CATEGORIES.map(cat => {
            const catTotal = expenses
              .filter(t => t.category === cat.id)
              .reduce((sum, t) => sum + t.amount, 0);
            
            if (catTotal === 0) return null;

            const percentage = totalExpenses > 0 ? (catTotal / totalExpenses) * 100 : 0;

            return (
              <div key={cat.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{cat.label}</span>
                  <span className="font-medium">{formatCurrency(catTotal)}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: `hsl(var(--${cat.color}))`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
