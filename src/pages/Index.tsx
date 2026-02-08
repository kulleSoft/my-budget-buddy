import { useState } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { FinanceProvider } from '@/contexts/FinanceContext';
import { BottomNavigation, TabId } from '@/components/BottomNavigation';
import { TermsDialog } from '@/components/TermsDialog';
import { HomeScreen } from '@/screens/HomeScreen';
import { ExpensesScreen } from '@/screens/ExpensesScreen';
import { IncomeScreen } from '@/screens/IncomeScreen';
import { ReportsScreen } from '@/screens/ReportsScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { AnimatePresence, motion } from 'framer-motion';

function AppContent() {
  const { hasAcceptedTerms } = useApp();
  const [activeTab, setActiveTab] = useState<TabId>('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'expenses':
        return <ExpensesScreen />;
      case 'income':
        return <IncomeScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <>
      <TermsDialog />
      
      {hasAcceptedTerms && (
        <div className="min-h-screen pb-20">
          <main className="p-4 max-w-lg mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          </main>
          
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      )}
    </>
  );
}

const Index = () => {
  return (
    <AppProvider>
      <FinanceProvider>
        <AppContent />
      </FinanceProvider>
    </AppProvider>
  );
};

export default Index;
