import { UserScheduleStatus, ScheduleType, ScheduleStatus } from '@/api';

export const formatDate = (dateString: string) => {
  const isoString = dateString.replace(' ', 'T');
  const date = new Date(isoString);
  return {
    date: date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    time: date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};

export const formatDateForList = (dateString: string) => {
  const isoString = dateString.replace(' ', 'T');
  const date = new Date(isoString);
  return {
    date: date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }),
    time: date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};

export const getStatusColor = (status: UserScheduleStatus) => {
  switch (status) {
    case UserScheduleStatus.Confirmed:
      return 'bg-green-100 text-green-800 border-green-200';
    case UserScheduleStatus.Swap_requested:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getScheduleStatusColor = (status: ScheduleStatus) => {
  switch (status) {
    case ScheduleStatus.Draft:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case ScheduleStatus.Active:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case ScheduleStatus.Complete:
      return 'bg-green-100 text-green-800 border-green-200';
    case ScheduleStatus.Deleted:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getScheduleStatusLabel = (status: ScheduleStatus): string => {
  switch (status) {
    case ScheduleStatus.Draft:
      return 'Rascunho';
    case ScheduleStatus.Active:
      return 'Ativa';
    case ScheduleStatus.Complete:
      return 'Completa';
    case ScheduleStatus.Deleted:
      return 'Deletada';
    default:
      return 'Desconhecido';
  }
};

export const getTipoColor = (tipo: ScheduleType) => {
  switch (tipo) {
    case ScheduleType.Louvor:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case ScheduleType.Geral:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
