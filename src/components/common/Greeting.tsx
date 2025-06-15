
import { ChevronDown } from "lucide-react";

export function Greeting() {
  // Simular dados do usuário com informação da igreja
  const userChurch = localStorage.getItem("userRole") === "admin" 
    ? "Igreja Batista Central - Administrador"
    : "Igreja Batista Central";
  
  const currentHour = new Date().getHours();
  let greeting = "Boa noite";
  
  if (currentHour < 12) {
    greeting = "Bom dia";
  } else if (currentHour < 18) {
    greeting = "Boa tarde";
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <h1 className="text-xl lg:text-2xl font-bold text-echurch-700">
          {greeting}, Maria! 
        </h1>
        <div className="flex items-center gap-1 px-3 py-1 bg-echurch-100 rounded-full">
          <span className="text-xs font-medium text-echurch-600">⛪ {userChurch}</span>
          <ChevronDown className="w-3 h-3 text-echurch-500" />
        </div>
      </div>
      <p className="text-sm text-echurch-500 mt-1">
        {new Date().toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
    </div>
  );
}
