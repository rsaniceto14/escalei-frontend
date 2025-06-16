
interface Scale {
  nome: string;
  data: string;
  horario: string;
  local: string;
  tipo: string;
  status: string;
}

export function useMockData() {
  const escalasParticipa: Scale[] = [
    { 
      nome: "Culto Domingo Manhã", 
      data: "2025-06-16", 
      horario: "09:00",
      local: "Igreja Central",
      tipo: "Geral",
      status: "Confirmada"
    },
    { 
      nome: "Reunião de Oração", 
      data: "2025-06-20", 
      horario: "20:00",
      local: "On-line",
      tipo: "Geral", 
      status: "Confirmada"
    },
  ];
  
  const escalasPendentes: Scale[] = [
    { 
      nome: "Louvor Sábado", 
      data: "2025-06-22", 
      horario: "19:30",
      local: "Igreja Central",
      tipo: "Louvor",
      status: "Pendente"
    },
  ];

  return {
    escalasParticipa,
    escalasPendentes
  };
}
