import { useState } from 'react';
import { userScheduleService } from '@/api/services/userScheduleService';
import { UserScheduleStatus } from '@/api';
import { toast } from 'sonner';

export const useScaleActions = () => {
  const [isConfirmingPresence, setIsConfirmingPresence] = useState(false);
  const [isRequestingSwap, setIsRequestingSwap] = useState(false);
  const [isAddingParticipants, setIsAddingParticipants] = useState(false);
  const [isRemovingParticipants, setIsRemovingParticipants] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const confirmParticipation = async (escalaId: number) => {
    setIsConfirmingPresence(true);
    try {
      await userScheduleService.updateStatus({
        schedule_id: escalaId,
        status: UserScheduleStatus.Confirmed,
      });
      toast.success('Presença confirmada com sucesso!');
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao confirmar participação:', error);
      toast.error(error?.response?.data?.message || 'Erro ao confirmar presença');
      return { success: false, error };
    } finally {
      setIsConfirmingPresence(false);
    }
  };

  const requestSwap = async (escalaId: number) => {
    setIsRequestingSwap(true);
    try {
      await userScheduleService.updateStatus({
        schedule_id: escalaId,
        status: UserScheduleStatus.Swap_requested,
      });
      toast.success('Solicitação de troca enviada com sucesso!');
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao solicitar troca:', error);
      toast.error(error?.response?.data?.message || 'Erro ao solicitar troca');
      return { success: false, error };
    } finally {
      setIsRequestingSwap(false);
    }
  };

  const addParticipants = async (
    escalaId: string,
    selectedUsers: string[],
    selectedArea: string,
    selectedRole: string,
    availableUsers: any[],
    onSuccess?: () => void
  ) => {
    setIsAddingParticipants(true);
    try {
      for (const userId of selectedUsers) {
        const user = availableUsers.find(user => user.id.toString() === userId);
        const area = user?.areas?.find((a: any) => a.name === selectedArea);
        if (area) {
          await userScheduleService.addUserToSchedule(escalaId, userId, area.id, selectedRole);
        }
      }
      toast.success(`${selectedUsers.length} participante(s) adicionado(s) com sucesso!`);
      if (onSuccess) onSuccess();
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao adicionar participantes:', error);
      toast.error(error?.response?.data?.message || 'Erro ao adicionar participantes');
      return { success: false, error };
    } finally {
      setIsAddingParticipants(false);
    }
  };

  const removeParticipants = async (
    escalaId: string,
    selectedParticipants: string[],
    onSuccess?: () => void
  ) => {
    setIsRemovingParticipants(true);
    try {
      for (const participantId of selectedParticipants) {
        await userScheduleService.removeUserFromSchedule(escalaId, participantId);
      }
      toast.success(`${selectedParticipants.length} participante(s) removido(s) com sucesso!`);
      if (onSuccess) onSuccess();
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao remover participantes:', error);
      toast.error(error?.response?.data?.message || 'Erro ao remover participantes');
      return { success: false, error };
    } finally {
      setIsRemovingParticipants(false);
    }
  };

  const publishSchedule = async (escalaId: number, userId: number, onSuccess?: () => void) => {
    setIsPublishing(true);
    try {
      const { scheduleService } = await import('@/api/services/scheduleService');
      await scheduleService.publish(escalaId, userId);
      toast.success('Escala publicada com sucesso!');
      if (onSuccess) onSuccess();
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao publicar escala:', error);
      toast.error(error?.response?.data?.message || 'Erro ao publicar escala');
      return { success: false, error };
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    confirmParticipation,
    requestSwap,
    addParticipants,
    removeParticipants,
    publishSchedule,
    // Loading states
    isConfirmingPresence,
    isRequestingSwap,
    isAddingParticipants,
    isRemovingParticipants,
    isPublishing,
  };
};
