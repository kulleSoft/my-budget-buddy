import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useFinance } from '@/contexts/FinanceContext';
import { CATEGORIES, TransactionType, Category } from '@/types/finance';
import { X, CalendarIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
}

export function TransactionForm({ isOpen, onClose, defaultType = 'expense' }: TransactionFormProps) {
  const { addTransaction } = useFinance();
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [date, setDate] = useState<Date>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    addTransaction({
      type,
      amount: parsedAmount,
      description: description.trim() || (type === 'income' ? 'Receita' : 'Gasto'),
      category,
      date: date.toISOString(),
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('other');
    setDate(new Date());
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-lg border-t border-border max-h-[90vh] overflow-auto"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-4">
              <h2 className="text-lg font-semibold">Nova Transação</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-4 pb-8 space-y-5">
              {/* Type Toggle */}
              <div className="flex gap-2 p-1 bg-muted rounded-xl">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all",
                    type === 'expense' 
                      ? "bg-destructive text-destructive-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <TrendingDown className="w-4 h-4" />
                  Gasto
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all",
                    type === 'income' 
                      ? "bg-success text-success-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <TrendingUp className="w-4 h-4" />
                  Receita
                </button>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-14 text-2xl font-bold text-center"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Ex: Almoço no restaurante"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="flex items-center gap-2">
                          <span 
                            className={cn("w-3 h-3 rounded-full")}
                            style={{ backgroundColor: `hsl(var(--${cat.color}))` }}
                          />
                          {cat.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => d && setDate(d)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className={cn(
                  "w-full h-14 text-lg font-semibold",
                  type === 'expense' ? "bg-gradient-expense" : "bg-gradient-income"
                )}
              >
                Adicionar {type === 'expense' ? 'Gasto' : 'Receita'}
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
