import { useState, useEffect, useMemo } from 'react';
import { Schedule, UserScheduleDetail, AvailableUserSchedule, ScheduleStatus } from '@/api';
import { userScheduleService } from '@/api/services/userScheduleService';
import { scheduleService } from '@/api/services/scheduleService';
import { useScaleActions } from './useScheduleActions';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useScaleDetails = (id: string | undefined, initialEscala?: Schedule) => {
  const { user } = useAuth();
  const [escala, setEscala] = useState<Schedule>(initialEscala);
  const [participantes, setParticipantes] = useState<UserScheduleDetail[]>([]);
  const [availableUsers, setAvailableUsers] = useState<AvailableUserSchedule[]>([]);

  // Calcular permissões baseadas no status da escala e permissões do usuário
  const permissions = useMemo(() => {
    const hasCreateSchedulePermission = user?.permissions?.create_scale ?? false;
    const hasUpdateScalePermission = user?.permissions?.update_scale ?? false;
    const isDraft = escala?.status === ScheduleStatus.Draft;
    const isActive = escala?.status === ScheduleStatus.Active;

    return {
      canGenerateSchedule: isDraft && hasCreateSchedulePermission,
      canPublishSchedule: isDraft && hasUpdateScalePermission,
      isActive,
      isDraft,
    };
  }, [escala?.status, user?.permissions]);

  const fetchData = async () => {
    if (!id) return;

    const users = await userScheduleService.getUsersByScheduleId(id);
    setParticipantes(users);

    const availableUsers = await userScheduleService.getAvailableUsers();
    const filteredUsers = availableUsers.filter(user => !users.some(p => p.id === user.id));
    setAvailableUsers(filteredUsers);
  };

  const updateAllDetails = async () => {
    if (!id) return;

    // Atualizar informações da escala
    const updatedEscala = await userScheduleService.getScheduleByScheduleId(id);
    setEscala(updatedEscala);

    // Atualizar participantes
    const users = await userScheduleService.getUsersByScheduleId(id);
    setParticipantes(users);
  };

  const {
    confirmParticipation,
    requestSwap,
    addParticipants,
    removeParticipants,
    publishSchedule,
    isConfirmingPresence,
    isRequestingSwap,
    isAddingParticipants,
    isRemovingParticipants,
    isPublishing,
  } = useScaleActions();

  const handleConfirmPresence = async () => {
    if (!id) return { success: false };

    const result = await confirmParticipation(Number(id));
    if (result.success) {
      await updateAllDetails();
    }
    return result;
  };

  const handleSwap = async () => {
    if (!id) return { success: false };

    const result = await requestSwap(Number(id));
    if (result.success) {
      await updateAllDetails();
    }
    return result;
  };

  const handleAddParticipants = async (selectedUsers: string[], selectedArea: string, selectedRole: string) => {
    if (!id) return { success: false };

    const result = await addParticipants(id, selectedUsers, selectedArea, selectedRole, availableUsers);
    if (result.success) {
      await updateAllDetails();

      // Refresh available users
      const updatedAvailableUsers = await userScheduleService.getAvailableUsers();
      const filteredUsers = updatedAvailableUsers.filter(user => !participantes.some(p => p.id === user.id));
      setAvailableUsers(filteredUsers);
    }
    return result;
  };

  const handleRemoveParticipants = async (selectedParticipants: string[]) => {
    if (!id) return { success: false };

    const result = await removeParticipants(id, selectedParticipants);
    if (result.success) {
      await updateAllDetails();
    }
    return result;
  };

  const handleGenerateSchedule = async (areas: number[], roles: Array<{ role_id: number; area_id: number; count: number }>) => {
    if (!id || !user) return;

    try {
      const result = await scheduleService.generate(Number(id), {
        user_id: Number(user.id),
        areas,
        roles,
      });
      
      // Verificar estatísticas
      const stats = result.statistics || [];
      const totalRequested = stats.reduce((sum, s) => sum + s.requested, 0);
      const totalSelected = stats.reduce((sum, s) => sum + s.selected, 0);
      const unfulfilled = stats.filter(s => !s.fulfilled);

      if (unfulfilled.length > 0) {
        // Sucesso parcial - buscar nomes dos roles para mensagem mais informativa
        const { areaService } = await import('@/api/services/areaService');
        const roleNames: string[] = [];
        
        for (const stat of unfulfilled) {
          try {
            const areaRoles = await areaService.getRoles(stat.area_id);
            const role = areaRoles.find(r => r.id === stat.role_id);
            if (role) {
              roleNames.push(`${role.name} (${stat.selected}/${stat.requested})`);
            } else {
              roleNames.push(`Função ${stat.role_id} (${stat.selected}/${stat.requested})`);
            }
          } catch {
            roleNames.push(`Função ${stat.role_id} (${stat.selected}/${stat.requested})`);
          }
        }

        toast.success(`Escala gerada parcialmente! ${totalSelected} de ${totalRequested} participantes selecionados.`, {
          description: roleNames.length > 0 ? `Funções incompletas: ${roleNames.join(', ')}` : undefined,
          duration: 6000,
        });
      } else {
        toast.success('Escala gerada com sucesso!');
      }
      
      await updateAllDetails();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao gerar escala');
      throw error;
    }
  };

  const handlePublishSchedule = async () => {
    if (!id || !user?.id) return;

    const result = await publishSchedule(Number(id), Number(user.id));
    if (result.success) {
      await updateAllDetails();
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return {
    escala,
    participantes,
    availableUsers,
    updateAllDetails,
    handleConfirmPresence,
    handleSwap,
    handleAddParticipants,
    handleRemoveParticipants,
    handleGenerateSchedule,
    handlePublishSchedule,
    // Permissions
    ...permissions,
    // Loading states
    isConfirmingPresence,
    isRequestingSwap,
    isAddingParticipants,
    isRemovingParticipants,
    isPublishing,
  };
};
