import { useState, useEffect } from 'react';
import { Schedule, UserScheduleDetail, AvailableUserSchedule } from '@/api';
import { userScheduleService } from '@/api/services/userScheduleService';
import { useScaleActions } from './useScheduleActions';

export const useScaleDetails = (id: string | undefined, initialEscala?: Schedule) => {
  const [escala, setEscala] = useState<Schedule>(initialEscala);
  const [participantes, setParticipantes] = useState<UserScheduleDetail[]>([]);
  const [availableUsers, setAvailableUsers] = useState<AvailableUserSchedule[]>([]);

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

  const { confirmParticipation, requestSwap } = useScaleActions();

  const handleConfirmPresence = async () => {
    if (!id) return;

    const result = await confirmParticipation(Number(id));
    if (result.success) {
      await updateAllDetails();
    }
  };

  const handleSwap = async () => {
    if (!id) return;

    const result = await requestSwap(Number(id));
    if (result.success) {
      await updateAllDetails();
    }
  };

  const handleAddParticipants = async (selectedUsers: string[], selectedArea: string) => {
    if (!id) return;

    for (const userId of selectedUsers) {
      const user = availableUsers.find(user => user.id.toString() === userId);
      const area = user?.areas?.find(a => a.name === selectedArea);
      if (area) {
        await userScheduleService.addUserToSchedule(id, userId, area.id);
      }
    }

    await updateAllDetails();

    // Refresh available users
    const updatedAvailableUsers = await userScheduleService.getAvailableUsers();
    const filteredUsers = updatedAvailableUsers.filter(user => !participantes.some(p => p.id === user.id));
    setAvailableUsers(filteredUsers);
  };

  const handleRemoveParticipants = async (selectedParticipants: string[]) => {
    if (!id) return;

    for (const participantId of selectedParticipants) {
      await userScheduleService.removeUserFromSchedule(id, participantId);
    }
    await updateAllDetails();
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
  };
};
