import React from 'react';
import { Calendar } from 'lucide-react';
import { FiltroAtivo } from '@/hooks/useSchedules';

interface EmptyStateProps {
  filtroAtivo: FiltroAtivo;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ filtroAtivo }) => {
  return (
    <div className="text-center py-12">
      <Calendar className="w-16 h-16 mx-auto mb-4 text-echurch-300" />
      <h3 className="text-lg font-semibold text-echurch-600 mb-2">
        {filtroAtivo === FiltroAtivo.Minhas ? 'Você não está em nenhuma escala' : 'Nenhuma escala encontrada'}
      </h3>
      <p className="text-echurch-500 mb-4">
        {filtroAtivo === FiltroAtivo.Minhas
          ? 'Entre em contato com a liderança para ser incluído nas escalas.'
          : 'Não há escalas cadastradas no momento.'}
      </p>
    </div>
  );
};
