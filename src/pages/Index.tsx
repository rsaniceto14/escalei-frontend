
import { History, Calendar } from "lucide-react";
import { Handouts } from "@/components/dashboard/Handouts";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ScaleCard } from "@/components/dashboard/ScaleCard";
import { useScalesData } from "@/hooks/useScalesData";
import { useScaleActions } from "@/hooks/useScheduleActions";
import { useState } from "react";

export default function Index() {
  const { 
    escalasPassadas = [], 
    escalasFuturas = [],
    totalEscalasPassadas = 0,
    totalEscalasFuturas = 0,
    loading, 
    error,
    refetch 
  } = useScalesData();
  
  const { requestSwap, isRequestingSwap } = useScaleActions();
  const [requestingSwapId, setRequestingSwapId] = useState<number | null>(null);

  const handleRequestSwap = async (escalaId: number) => {
    setRequestingSwapId(escalaId);
    const result = await requestSwap(escalaId);
    if (result.success) {
      await refetch();
    }
    setRequestingSwapId(null);
  };

  return (
    <div className="space-y-8 min-w-0 w-full">
      {/* Handouts Section */}
      <Handouts />

      {/* Quick Actions */}
      <QuickActions />

      {/* Scales Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScaleCard
          title="Suas Escalas"
          icon={<Calendar className="w-5 h-5 text-blue-500" />}
          scales={escalasFuturas}
          variant="swap"
          emptyMessage="Nenhuma escala futura"
          emptyDescription="Suas próximas escalas aparecerão aqui"
          onRequestSwap={handleRequestSwap}
          isRequestingSwap={isRequestingSwap}
          requestingSwapId={requestingSwapId}
          maxItems={3}
          totalItems={totalEscalasFuturas}
          showMoreLink="/schedules"
        />

        <ScaleCard
          title="Escalas Passadas"
          icon={<History className="w-5 h-5 text-gray-500" />}
          scales={escalasPassadas}
          variant="past"
          emptyMessage="Nenhuma escala passada"
          emptyDescription="Suas escalas realizadas aparecerão aqui"
          maxItems={3}
          totalItems={totalEscalasPassadas}
          showMoreLink="/schedules"
        />
      </div>
    </div>
  );
}
