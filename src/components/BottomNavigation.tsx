import { motion } from 'framer-motion';
import { 
  Home, 
  TrendingDown, 
  TrendingUp, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabId = 'home' | 'expenses' | 'income' | 'reports' | 'settings';

interface BottomNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs = [
  { id: 'home' as TabId, label: 'Início', icon: Home },
  { id: 'expenses' as TabId, label: 'Gastos', icon: TrendingDown },
  { id: 'income' as TabId, label: 'Receitas', icon: TrendingUp },
  { id: 'reports' as TabId, label: 'Relatórios', icon: BarChart3 },
  { id: 'settings' as TabId, label: 'Config', icon: Settings },
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-x-2 -top-0.5 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon className={cn(
                "w-5 h-5 transition-transform",
                isActive && "scale-110"
              )} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
