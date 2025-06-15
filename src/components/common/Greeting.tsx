
import { ChevronDown } from "lucide-react";

export function Greeting() {
  // Simular dados do usuário com informação da igreja
  // Mesmo que o userChurch seja determinado aqui, não exibiremos mais no header
  // O nome da igreja pode ser usado em outros componentes como perfil, etc se necessário

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
        {/* Removido: igreja do header */}
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

