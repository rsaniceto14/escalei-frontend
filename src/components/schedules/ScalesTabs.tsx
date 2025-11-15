import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Schedule } from '@/api';
import { FiltroAtivo } from '@/hooks/useSchedules';
import { ScalesList } from './ScalesList';
import { EmptyState } from './EmptyState';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ScalesTabsProps {
  filtroAtivo: FiltroAtivo;
  onFiltroChange: (filtro: FiltroAtivo) => void;
  escalasFiltradas: Schedule[];
  loading?: boolean;
}

export const ScalesTabs: React.FC<ScalesTabsProps> = ({
  filtroAtivo,
  onFiltroChange,
  escalasFiltradas,
  loading = false,
}) => {
  const { user } = useAuth();
  const hasCreateSchedulePermission = user?.permissions?.create_scale ?? false;

  return (
    <Tabs value={filtroAtivo} onValueChange={value => onFiltroChange(value as FiltroAtivo)} className="space-y-6 min-w-0">
      <TabsList className={hasCreateSchedulePermission ? "grid w-full grid-cols-2 min-w-0" : "grid w-full grid-cols-1 min-w-0"}>
        {hasCreateSchedulePermission && (
          <TabsTrigger 
            value={FiltroAtivo.Todas} 
            className="min-w-0 text-xs sm:text-sm transition-all duration-300 ease-in-out data-[state=active]:font-semibold data-[state=active]:text-sm sm:data-[state=active]:text-base data-[state=active]:shadow-md data-[state=active]:py-2"
          >
            Todas as Escalas
          </TabsTrigger>
        )}
        <TabsTrigger 
          value={FiltroAtivo.Minhas} 
          className="min-w-0 text-xs sm:text-sm transition-all duration-300 ease-in-out data-[state=active]:font-semibold data-[state=active]:text-sm sm:data-[state=active]:text-base data-[state=active]:shadow-md data-[state=active]:py-2"
        >
          Minhas Escalas
        </TabsTrigger>
      </TabsList>

      {hasCreateSchedulePermission && (
        <TabsContent value={FiltroAtivo.Todas} className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-echurch-500" />
              <span className="ml-2 text-echurch-600">Carregando escalas...</span>
            </div>
          ) : escalasFiltradas.length > 0 ? (
            <ScalesList escalas={escalasFiltradas} />
          ) : (
            <EmptyState filtroAtivo={filtroAtivo} />
          )}
        </TabsContent>
      )}

      <TabsContent value={FiltroAtivo.Minhas} className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-echurch-500" />
            <span className="ml-2 text-echurch-600">Carregando escalas...</span>
          </div>
        ) : escalasFiltradas.length > 0 ? (
          <ScalesList escalas={escalasFiltradas} isMyScales={true} />
        ) : (
          <EmptyState filtroAtivo={filtroAtivo} />
        )}
      </TabsContent>
    </Tabs>
  );
};
