import { userScheduleService } from '@/api/services/userScheduleService';
import { UserScheduleStatus } from '@/api';

export const useScaleActions = () => {
  const confirmParticipation = async (escalaId: number) => {
    try {
      await userScheduleService.updateStatus({
        schedule_id: escalaId,
        status: UserScheduleStatus.Confirmed,
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao confirmar participação:', error);
      return { success: false, error };
    }
  };

  const requestSwap = async (escalaId: number) => {
    try {
      await userScheduleService.updateStatus({
        schedule_id: escalaId,
        status: UserScheduleStatus.Swap_requested,
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao solicitar troca:', error);
      return { success: false, error };
    }
  };

  return {
    confirmParticipation,
    requestSwap,
  };
};
