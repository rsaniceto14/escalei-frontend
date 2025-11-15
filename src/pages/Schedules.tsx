import { useScales, FiltroAtivo } from '@/hooks/useSchedules';
import { ScalesHeader, ScalesTabs } from '@/components/schedules';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function Schedules() {
  const { user } = useAuth();
  const hasCreateSchedulePermission = user?.permissions?.create_scale ?? false;
  const { escalasFiltradas, filtroAtivo, loading, setFiltroAtivo, handleConfirmParticipation } = useScales();

  // Se o usuário não tem permissão, garantir que está na aba "Minhas"
  useEffect(() => {
    if (!hasCreateSchedulePermission && filtroAtivo === FiltroAtivo.Todas) {
      setFiltroAtivo(FiltroAtivo.Minhas);
    }
  }, [hasCreateSchedulePermission, filtroAtivo, setFiltroAtivo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
        <div className="text-echurch-600">Carregando escalas...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      <ScalesHeader />

      <div className="flex-1">
        <ScalesTabs
          filtroAtivo={filtroAtivo}
          onFiltroChange={setFiltroAtivo}
          escalasFiltradas={escalasFiltradas}
          onConfirmParticipation={handleConfirmParticipation}
        />
      </div>
    </div>
  );

}
