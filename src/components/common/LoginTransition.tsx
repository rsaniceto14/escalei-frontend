
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

interface LoginTransitionProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function LoginTransition({ isVisible, onComplete }: LoginTransitionProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const timeouts = [
      setTimeout(() => setStep(1), 100),   // Mostrar loading
      setTimeout(() => setStep(2), 800),   // Mostrar sucesso
      setTimeout(() => setStep(3), 1400),  // Fade out
      setTimeout(() => onComplete(), 1800) // Completar transição
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-echurch-500 via-echurch-600 to-echurch-700">
      <div className={`transition-all duration-500 ${step >= 3 ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            {step === 0 && (
              <div className="w-full h-full border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
            
            {step === 1 && (
              <div className="w-full h-full border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
            
            {step >= 2 && (
              <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            )}
          </div>
          
          <div className="text-white space-y-2">
            {step <= 1 && (
              <>
                <h3 className="text-xl font-semibold">Autenticando...</h3>
                <p className="text-white/80">Verificando suas credenciais</p>
              </>
            )}
            
            {step >= 2 && (
              <>
                <h3 className="text-xl font-semibold">Bem-vindo!</h3>
                <p className="text-white/80">Redirecionando para o dashboard</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
