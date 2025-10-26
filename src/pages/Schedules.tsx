import { useScales } from '@/hooks/useSchedules';
import { ScalesHeader, ScalesTabs } from '@/components/schedules';
import { Loader2 } from 'lucide-react';

export default function Schedules() {
  const { escalasFiltradas, filtroAtivo, loading, setFiltroAtivo, handleConfirmParticipation } = useScales();

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
