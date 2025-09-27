import React from 'react';
import { Schedule } from '@/api';
import { ScaleCard } from './ScaleCard';

interface ScalesListProps {
  escalas: Schedule[];
  isMyScales?: boolean;
  onConfirmParticipation?: (escalaId: number) => void;
}

export const ScalesList: React.FC<ScalesListProps> = ({ escalas, isMyScales = false, onConfirmParticipation }) => {
  return (
    <div className="grid gap-4">
      {escalas.map(escala => (
        <ScaleCard
          key={escala.id}
          escala={escala}
          isMyScale={isMyScales}
          onConfirmParticipation={onConfirmParticipation}
        />
      ))}
    </div>
  );
};
