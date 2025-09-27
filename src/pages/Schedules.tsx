import { useScales } from '@/hooks/useSchedules';
import { ScalesHeader, ScalesTabs } from '@/components/schedules';

export default function Schedules() {
  const { escalasFiltradas, filtroAtivo, loading, setFiltroAtivo, handleConfirmParticipation } = useScales();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-echurch-600">Carregando escalas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScalesHeader />

      <ScalesTabs
        filtroAtivo={filtroAtivo}
        onFiltroChange={setFiltroAtivo}
        escalasFiltradas={escalasFiltradas}
        onConfirmParticipation={handleConfirmParticipation}
      />
    </div>
  );
}
