import { useState, useEffect } from 'react';
import { Schedule } from '@/api';
import { userScheduleService } from '@/api/services/userScheduleService';
import { useScaleActions } from './useScheduleActions';

export enum FiltroAtivo {
  Todas = 'todas',
  Minhas = 'minhas',
}

export const useScales = () => {
  const [escalasFiltradas, setEscalasFiltradas] = useState<Schedule[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroAtivo>(FiltroAtivo.Todas);
  const [loading, setLoading] = useState(true);

  const { confirmParticipation } = useScaleActions();

  const loadAllSchedules = async () => {
    try {
      setLoading(true);
      const todasEscalas = await userScheduleService.getAllScales();
      // Ordenar por created_at DESC (mais recentes primeiro) como fallback
      const sorted = todasEscalas.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      setEscalasFiltradas(sorted);
    } catch (error) {
      console.error('Erro ao carregar escalas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMySchedules = async () => {
    try {
      setLoading(true);
      const minhasEscalas = await userScheduleService.getMySchedules();
      // Ordenar por created_at DESC (mais recentes primeiro) como fallback
      const sorted = minhasEscalas.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      setEscalasFiltradas(sorted);
    } catch (error) {
      console.error('Erro ao carregar minhas escalas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadScales = async () => {
    if (filtroAtivo === FiltroAtivo.Minhas) {
      await loadMySchedules();
    } else {
      await loadAllSchedules();
    }
  };

  const handleConfirmParticipation = async (escalaId: number) => {
    const result = await confirmParticipation(escalaId);
    if (result.success) {
      await loadScales();
    }
    return result;
  };

  useEffect(() => {
    loadScales();
  }, [filtroAtivo]);

  return {
    escalasFiltradas,
    filtroAtivo,
    loading,
    setFiltroAtivo,
    loadScales,
    handleConfirmParticipation,
  };
};
