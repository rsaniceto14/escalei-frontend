
import { ReactNode } from "react";
import { Hand } from "lucide-react";

export function WelcomeSection() {
  return (
    <div className="bg-gradient-to-r from-echurch-500 via-echurch-600 to-echurch-700 rounded-xl p-6 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Hand className="w-8 h-8 text-white hover:animate-bounce transition-all duration-300 hover:scale-110 cursor-pointer" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-echurch-100 bg-clip-text text-transparent">
              Bem-vindo ao Escalei!
            </h2>
            <p className="text-echurch-100">Gerencie suas escalas e participe ativamente da igreja.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
