import { useState, useEffect } from 'react';
import { Schedule } from '@/api';
import { userScheduleService } from '@/api/services/userScheduleService';
import { useScaleActions } from './useScheduleActions';

export enum FiltroAtivo {
  Todas = 'todas',
  Minhas = 'minhas',
}

export const useScales = () => {
  const [escalas, setEscalas] = useState<Schedule[]>([]);
  const [escalasFiltradas, setEscalasFiltradas] = useState<Schedule[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroAtivo>(FiltroAtivo.Todas);
  const [loading, setLoading] = useState(true);

  const { confirmParticipation } = useScaleActions();

  const loadScales = async () => {
    try {
      setLoading(true);
      const todasEscalas = await userScheduleService.getAllScales();
      setEscalas(todasEscalas);
    } catch (error) {
      console.error('Erro ao carregar escalas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarEscalas = () => {
    if (filtroAtivo === FiltroAtivo.Minhas) {
      setEscalasFiltradas(escalas.filter(escala => escala.minhaEscala));
    } else {
      setEscalasFiltradas(escalas);
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
  }, []);

  useEffect(() => {
    filtrarEscalas();
  }, [filtroAtivo, escalas]);

  return {
    escalas,
    escalasFiltradas,
    filtroAtivo,
    loading,
    setFiltroAtivo,
    loadScales,
    handleConfirmParticipation,
  };
};
