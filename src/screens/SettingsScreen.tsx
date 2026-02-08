import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useFinance } from '@/contexts/FinanceContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Moon, 
  Sun, 
  FileText, 
  Trash2, 
  Shield,
  ChevronRight,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsScreen() {
  const { isDarkMode, toggleDarkMode } = useApp();
  const { clearAllData, transactions } = useFinance();
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground text-sm">Personalize seu app</p>
      </motion.div>

      {/* Settings List */}
      <div className="space-y-3">
        {/* Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-xl p-4 shadow-card border border-border flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-secondary-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-secondary-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium">Modo Escuro</p>
              <p className="text-xs text-muted-foreground">
                {isDarkMode ? 'Ativado' : 'Desativado'}
              </p>
            </div>
          </div>
          <Switch
            checked={isDarkMode}
            onCheckedChange={toggleDarkMode}
          />
        </motion.div>

        {/* View Terms */}
        <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
          <DialogTrigger asChild>
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className="w-full bg-card rounded-xl p-4 shadow-card border border-border flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <FileText className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-medium">Termos de Uso</p>
                  <p className="text-xs text-muted-foreground">Leia os termos do app</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Termos de Uso
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm text-muted-foreground">
              <section>
                <h3 className="font-semibold text-foreground mb-2">1. Sobre o Aplicativo</h3>
                <p>
                  O Meus Gastos é um aplicativo de controle financeiro pessoal que permite 
                  registrar e visualizar suas receitas e despesas de forma simples e organizada.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2">2. Armazenamento de Dados</h3>
                <p>
                  Todos os seus dados financeiros são armazenados localmente no seu dispositivo. 
                  Não coletamos, transmitimos ou armazenamos suas informações em servidores externos.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2">3. Anúncios</h3>
                <p>
                  Este aplicativo exibe anúncios para manter o serviço gratuito. Os anúncios podem 
                  ser personalizados com base em informações não identificáveis do dispositivo.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2">4. Privacidade</h3>
                <p>
                  Respeitamos sua privacidade. O aplicativo não tem acesso às suas contas bancárias 
                  ou quaisquer outros dados financeiros além do que você inserir manualmente.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2">5. Responsabilidade</h3>
                <p>
                  O aplicativo é uma ferramenta auxiliar de organização financeira. Não nos 
                  responsabilizamos por decisões financeiras tomadas com base nas informações 
                  exibidas.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2">6. Atualizações</h3>
                <p>
                  Estes termos podem ser atualizados periodicamente. Recomendamos verificar 
                  esta página regularmente.
                </p>
              </section>
            </div>
          </DialogContent>
        </Dialog>

        {/* Clear Data */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full bg-card rounded-xl p-4 shadow-card border border-border flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-destructive">Redefinir Dados</p>
                  <p className="text-xs text-muted-foreground">
                    {transactions.length} transações salvas
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso irá excluir permanentemente 
                todas as suas transações ({transactions.length} registros).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={clearAllData}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir Tudo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-muted rounded-xl p-4 text-center"
      >
        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-primary rounded-xl flex items-center justify-center">
          <Info className="w-6 h-6 text-primary-foreground" />
        </div>
        <h3 className="font-semibold">Meus Gastos</h3>
        <p className="text-xs text-muted-foreground mt-1">Versão 1.0.0</p>
        <p className="text-xs text-muted-foreground mt-3">
          Desenvolvido com ❤️ para ajudar você a organizar suas finanças.
        </p>
      </motion.div>
    </div>
  );
}
