import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Schedule } from '@/api';
import { FiltroAtivo } from '@/hooks/useSchedules';
import { ScalesList } from './ScalesList';
import { EmptyState } from './EmptyState';
import { useAuth } from '@/context/AuthContext';

interface ScalesTabsProps {
  filtroAtivo: FiltroAtivo;
  onFiltroChange: (filtro: FiltroAtivo) => void;
  escalasFiltradas: Schedule[];
  onConfirmParticipation?: (escalaId: number) => void;
}

export const ScalesTabs: React.FC<ScalesTabsProps> = ({
  filtroAtivo,
  onFiltroChange,
  escalasFiltradas,
  onConfirmParticipation,
}) => {
  const { user } = useAuth();
  const hasCreateSchedulePermission = user?.permissions?.create_scale ?? false;

  return (
    <Tabs value={filtroAtivo} onValueChange={value => onFiltroChange(value as FiltroAtivo)} className="space-y-6">
      <TabsList className={hasCreateSchedulePermission ? "grid w-full grid-cols-2" : "grid w-full grid-cols-1"}>
        {hasCreateSchedulePermission && (
          <TabsTrigger value={FiltroAtivo.Todas}>Todas as Escalas</TabsTrigger>
        )}
        <TabsTrigger value={FiltroAtivo.Minhas}>Minhas Escalas</TabsTrigger>
      </TabsList>

      {hasCreateSchedulePermission && (
        <TabsContent value={FiltroAtivo.Todas} className="space-y-4">
          {escalasFiltradas.length > 0 ? (
            <ScalesList escalas={escalasFiltradas} onConfirmParticipation={onConfirmParticipation} />
          ) : (
            <EmptyState filtroAtivo={filtroAtivo} />
          )}
        </TabsContent>
      )}

      <TabsContent value={FiltroAtivo.Minhas} className="space-y-4">
        {escalasFiltradas.length > 0 ? (
          <ScalesList escalas={escalasFiltradas} isMyScales={true} onConfirmParticipation={onConfirmParticipation} />
        ) : (
          <EmptyState filtroAtivo={filtroAtivo} />
        )}
      </TabsContent>
    </Tabs>
  );
};
