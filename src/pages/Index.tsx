
import { CheckCircle, AlertCircle } from "lucide-react";
import { Greeting } from "@/components/common/Greeting";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ScaleCard } from "@/components/dashboard/ScaleCard";
import { ActionButtons } from "@/components/dashboard/ActionButtons";
import { useMockData } from "@/hooks/useMockData";

export default function Index() {
  const { escalasParticipa, escalasPendentes } = useMockData();

  return (
    <div className="space-y-8">
      {/* Greeting apenas para esta página */}
      <div className="mb-2">
        <Greeting />
      </div>

      {/* Welcome Section */}
      <WelcomeSection />

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

      {/* Action Buttons */}
      <ActionButtons />
    </div>
  );
}
