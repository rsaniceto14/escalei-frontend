
export const formatDate = (dateString: string) => {
  return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
};

export const getCurrentGreeting = () => {
  const currentHour = new Date().getHours();
  
  if (currentHour < 12) {
    return "Bom dia";
  } else if (currentHour < 18) {
    return "Boa tarde";
  }
  return "Boa noite";
};

export const formatFullDate = () => {
  return new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};
