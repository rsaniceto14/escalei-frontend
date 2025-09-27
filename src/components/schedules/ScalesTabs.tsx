import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Schedule } from '@/api';
import { FiltroAtivo } from '@/hooks/useSchedules';
import { ScalesList } from './ScalesList';
import { EmptyState } from './EmptyState';

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
  return (
    <Tabs value={filtroAtivo} onValueChange={value => onFiltroChange(value as FiltroAtivo)} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value={FiltroAtivo.Todas}>Todas as Escalas</TabsTrigger>
        <TabsTrigger value={FiltroAtivo.Minhas}>Minhas Escalas</TabsTrigger>
      </TabsList>

      <TabsContent value={FiltroAtivo.Todas} className="space-y-4">
        {escalasFiltradas.length > 0 ? (
          <ScalesList escalas={escalasFiltradas} onConfirmParticipation={onConfirmParticipation} />
        ) : (
          <EmptyState filtroAtivo={filtroAtivo} />
        )}
      </TabsContent>

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
