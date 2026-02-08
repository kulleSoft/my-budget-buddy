import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { Shield, Eye, Bell } from 'lucide-react';

export function TermsDialog() {
  const { hasAcceptedTerms, acceptTerms } = useApp();

  if (hasAcceptedTerms) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", bounce: 0.3 }}
        className="w-full max-w-md bg-card rounded-2xl shadow-lg border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-primary p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-primary-foreground">Termos de Uso</h2>
          <p className="text-sm text-primary-foreground/80 mt-1">
            Por favor, leia antes de continuar
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Seus dados são seus</h3>
                <p className="text-xs text-muted-foreground">
                  Todos os dados financeiros são armazenados apenas no seu dispositivo.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Anúncios</h3>
                <p className="text-xs text-muted-foreground">
                  Este aplicativo exibe anúncios para manter o serviço gratuito.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ao aceitar, você concorda com nossos termos de uso e política de privacidade. 
              O app não coleta dados pessoais além do necessário para exibição de anúncios 
              personalizados. Você pode acessar os termos a qualquer momento nas configurações.
            </p>
          </div>

          <Button
            onClick={acceptTerms}
            className="w-full h-12 text-base font-semibold bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            Aceitar e Continuar
          </Button>

          <p className="text-[10px] text-center text-muted-foreground">
            Você precisa aceitar os termos para usar o aplicativo
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
