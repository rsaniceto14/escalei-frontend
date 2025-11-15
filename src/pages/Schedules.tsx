import { useScales, FiltroAtivo } from '@/hooks/useSchedules';
import { ScalesHeader, ScalesTabs } from '@/components/schedules';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function Schedules() {
  const { user } = useAuth();
  const hasCreateSchedulePermission = user?.permissions?.create_scale ?? false;
  const { escalasFiltradas, filtroAtivo, loading, setFiltroAtivo } = useScales();

  // Se o usuário não tem permissão, garantir que está na aba "Minhas"
  useEffect(() => {
    if (!hasCreateSchedulePermission && filtroAtivo === FiltroAtivo.Todas) {
      setFiltroAtivo(FiltroAtivo.Minhas);
    }
  }, [hasCreateSchedulePermission, filtroAtivo, setFiltroAtivo]);

  return (
    <div className="flex flex-col w-full min-h-screen min-w-0 overflow-x-hidden">
      <ScalesHeader />

      <div className="flex-1 min-w-0 mt-8">
        <ScalesTabs
          filtroAtivo={filtroAtivo}
          onFiltroChange={setFiltroAtivo}
          escalasFiltradas={escalasFiltradas}
          loading={loading}
        />
      </div>
    </div>
  );

}
