
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

interface LoginTransitionProps {
  isVisible: boolean;
  loginStatus: 'idle' | 'pending' | 'success' | 'error';
}


export function LoginTransition({ isVisible, loginStatus }: LoginTransitionProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    if (loginStatus === 'pending') {
      setStep(1)
    }

    if (loginStatus === 'success') {
      setStep(2)
    }

  }, [isVisible, loginStatus]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-all bg-gradient-to-br from-echurch-500 via-echurch-400/90 to-echurch-700 animate-fade-in">
      <div className={`transition-all duration-500 ${step >= 3 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="bg-white/15 shadow-2xl backdrop-blur-lg rounded-2xl px-10 py-9 min-w-[270px] text-center border border-white/25 flex flex-col items-center">
          <div className="w-[85px] h-[85px] mx-auto mb-6 relative flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full border-[5px] ${step < 2 ? "border-white/35 border-t-white animate-spin" : "border-green-500 shadow-md"} `} />
            {step >= 2 && (
              <div className="w-full h-full bg-green-500/95 rounded-full flex items-center justify-center animate-scale-in shadow-lg">
                <CheckCircle className="w-11 h-11 text-white drop-shadow-lg" />
              </div>
            )}
          </div>
          {/* Animated texts */}
          <div className="text-white space-y-2">
            {step <= 1 && (
              <>
                <h3 className="text-2xl md:text-2xl font-extrabold tracking-tight animate-fade-in">Aguarde um instante...</h3>
                <p className="text-white/80 text-base md:text-lg animate-fade-in">Confirmando credenciais</p>
              </>
            )}
            {step >= 2 && (
              <>
                <h3 className="text-2xl font-extrabold tracking-tight animate-scale-in">Bem-vindo!</h3>
                <p className="text-white/80 text-base md:text-lg animate-fade-in">Acesso autorizado</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
