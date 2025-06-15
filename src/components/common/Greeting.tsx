
import { useState, useEffect } from "react";

export function Greeting() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Simulação - em produção viria do contexto/estado global
  const usuario = {
    nome: "Maria Oliveira"
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="space-y-1">
      <h1 className="text-xl lg:text-2xl font-bold text-echurch-700">
        {getGreeting()}, {usuario.nome}!
      </h1>
      <p className="text-sm lg:text-base text-echurch-600 capitalize">
        {formatDate()}
      </p>
    </div>
  );
}
