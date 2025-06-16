
import { ReactNode } from "react";

export function WelcomeSection() {
  return (
    <div className="bg-gradient-to-r from-echurch-500 via-echurch-600 to-echurch-700 rounded-xl p-6 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl animate-bounce">👋</span>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-echurch-100 bg-clip-text text-transparent">
              Bem-vindo ao e-Church!
            </h2>
            <p className="text-echurch-100">Gerencie suas escalas e participe ativamente da igreja.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
