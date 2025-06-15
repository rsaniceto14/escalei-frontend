
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
    if (hour < 12) return { text: "Bom dia", emoji: "🌅" };
    if (hour < 18) return { text: "Boa tarde", emoji: "☀️" };
    return { text: "Boa noite", emoji: "🌙" };
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const greeting = getGreeting();

  return (
    <div className="space-y-1">
      <h1 className="text-xl lg:text-2xl font-bold text-echurch-700 flex items-center gap-2">
        <span className="text-2xl">{greeting.emoji}</span>
        {greeting.text}, {usuario.nome}!
      </h1>
      <p className="text-sm lg:text-base text-echurch-600 capitalize">
        {formatDate()}
      </p>
    </div>
  );
}
