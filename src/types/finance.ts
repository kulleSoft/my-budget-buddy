export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'food'
  | 'transport'
  | 'housing'
  | 'leisure'
  | 'health'
  | 'education'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: Category;
  date: string; // ISO date string
  createdAt: string;
}

export interface CategoryInfo {
  id: Category;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'food', label: 'Alimentação', icon: 'Utensils', color: 'category-food' },
  { id: 'transport', label: 'Transporte', icon: 'Car', color: 'category-transport' },
  { id: 'housing', label: 'Moradia', icon: 'Home', color: 'category-housing' },
  { id: 'leisure', label: 'Lazer', icon: 'Gamepad2', color: 'category-leisure' },
  { id: 'health', label: 'Saúde', icon: 'Heart', color: 'category-health' },
  { id: 'education', label: 'Educação', icon: 'GraduationCap', color: 'category-education' },
  { id: 'other', label: 'Outros', icon: 'MoreHorizontal', color: 'category-other' },
];

export const getCategoryInfo = (category: Category): CategoryInfo => {
  return CATEGORIES.find(c => c.id === category) || CATEGORIES[6];
};

export type ViewPeriod = 'day' | 'month' | 'year';
