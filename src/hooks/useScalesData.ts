import { useApi } from './useApi';
import { userScheduleService } from '@/api/services/userScheduleService';
import { UserScheduleStatus, ScheduleStatus } from '@/api';

export function useScalesData() {
  const {
    data: allScales,
    loading,
    error,
    refetch,
  } = useApi(
    async () => ({ 
      success: true as const, 
      data: await userScheduleService.getAllScales() 
    }), 
    {
      immediate: true,
    }
  );

  const now = new Date();

  // Filtra escalas passadas (completas ou com end_date já passou)
  const pastScales = allScales?.filter(
    (scale) => 
      scale.minhaEscala && 
      (scale.status === ScheduleStatus.Complete || 
       (scale.end_date && new Date(scale.end_date) < now))
  ) || [];

  // Filtra escalas futuras confirmadas (usuário está na escala, confirmada, ainda não passou)
  const futureConfirmedScales = allScales?.filter(
    (scale) => 
      scale.minhaEscala && 
      scale.userStatus === UserScheduleStatus.Confirmed &&
      scale.userStatus !== UserScheduleStatus.Swap_requested &&
      scale.end_date && 
      new Date(scale.end_date) >= now
  ) || [];

  // Ordena escalas passadas por data mais recente (end_date) e limita a 3
  const sortedPastScales = pastScales
    .sort((a, b) => {
      const dateA = a.end_date ? new Date(a.end_date).getTime() : 0;
      const dateB = b.end_date ? new Date(b.end_date).getTime() : 0;
      return dateB - dateA; // Mais recentes primeiro
    })
    .slice(0, 3);

  // Ordena escalas futuras por data mais recente (start_date) e limita a 3
  const sortedFutureScales = futureConfirmedScales
    .sort((a, b) => {
      const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
      const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
      return dateA - dateB; // Mais próximas primeiro (ordem crescente)
    })
    .slice(0, 3);

  return {
    escalasPassadas: sortedPastScales,
    escalasFuturas: sortedFutureScales,
    totalEscalasPassadas: pastScales.length,
    totalEscalasFuturas: futureConfirmedScales.length,
    loading,
    error,
    refetch,
  };
}
