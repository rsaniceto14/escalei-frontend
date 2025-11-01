
import { CheckCircle, AlertCircle } from "lucide-react";
import { Handouts } from "@/components/dashboard/Handouts";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ScaleCard } from "@/components/dashboard/ScaleCard";
import { useScalesData } from "@/hooks/useScalesData";

export default function Index() {
  const { escalasParticipa = [], escalasPendentes = [], loading, error } = useScalesData();

  return (
    <div className="space-y-8">
      {/* Handouts Section */}
      <Handouts />

      {/* Quick Actions */}
      <QuickActions />

      {/* Scales Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScaleCard
          title="Suas Escalas Confirmadas"
          icon={<CheckCircle className="w-5 h-5 text-green-500" />}
          scales={escalasParticipa}
          variant="confirmed"
          emptyMessage="Nenhuma escala confirmada"
          emptyDescription="Suas próximas escalas aparecerão aqui"
        />

        <ScaleCard
          title="Pendências de Confirmação"
          icon={<AlertCircle className="w-5 h-5 text-yellow-500" />}
          scales={escalasPendentes}
          variant="pending"
          emptyMessage="Nenhuma pendência!"
          emptyDescription="Você está em dia com suas escalas"
        />
      </div>
    </div>
  );
}
