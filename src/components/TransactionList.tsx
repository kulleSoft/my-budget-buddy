import { motion } from 'framer-motion';
import { Transaction, getCategoryInfo } from '@/types/finance';
import { useFinance } from '@/contexts/FinanceContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  showDelete?: boolean;
}

export function TransactionList({ transactions, showDelete = true }: TransactionListProps) {
  const { deleteTransaction } = useFinance();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <TrendingDown className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">Nenhuma transação encontrada</p>
      </div>
    );
  }

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = format(new Date(transaction.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">
            {format(new Date(date), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </h3>
          <div className="space-y-2">
            {groupedTransactions[date].map((transaction, index) => {
              const category = getCategoryInfo(transaction.category);
              
              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl p-4 shadow-card border border-border flex items-center gap-3"
                >
                  {/* Category Icon */}
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground"
                    style={{ backgroundColor: `hsl(var(--${category.color}))` }}
                  >
                    {getIcon(category.icon)}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{category.label}</p>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className={cn(
                      "font-semibold flex items-center gap-1",
                      transaction.type === 'income' ? "text-success" : "text-destructive"
                    )}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount).replace('R$', '').trim()}
                    </p>
                  </div>

                  {/* Delete Button */}
                  {showDelete && (
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
