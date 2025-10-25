import { useApi } from './useApi';
import { userScheduleService } from '@/api/services/userScheduleService';
import { UserScheduleStatus } from '@/api';

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

  // Filtra escalas confirmadas (status === 'Confirmado')
  const confirmedScales = allScales?.filter(
    (scale) => scale.status === UserScheduleStatus.Confirmed
  ) || [];

  // Filtra escalas pendentes (usuário está na escala mas status !== 'Confirmado')
  const pendingScales = allScales?.filter(
    (scale) => scale.minhaEscala && scale.status !== UserScheduleStatus.Confirmed
  ) || [];

  return {
    escalasParticipa: confirmedScales,
    escalasPendentes: pendingScales,
    loading,
    error,
    refetch,
  };
}
