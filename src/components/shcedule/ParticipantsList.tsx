import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { UserScheduleDetail } from '@/api';
import { getStatusColor } from '@/utils/scheduleUtils';

interface ParticipantsListProps {
  participantes: UserScheduleDetail[];
  isSelectionMode: boolean;
  selectedParticipants: string[];
  onSelectionModeChange: (mode: boolean) => void;
  onSelectedParticipantsChange: (selected: string[]) => void;
  onAddParticipants: () => void;
  onRemoveParticipants: () => void;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participantes,
  isSelectionMode,
  selectedParticipants,
  onSelectionModeChange,
  onSelectedParticipantsChange,
  onAddParticipants,
  onRemoveParticipants,
}) => {
  const handleSelectAll = () => {
    if (selectedParticipants.length === participantes.length) {
      onSelectedParticipantsChange([]);
    } else {
      onSelectedParticipantsChange(participantes.map(p => p.id.toString()));
    }
  };

  const handleParticipantClick = (participantId: string) => {
    if (!isSelectionMode) return;

    if (selectedParticipants.includes(participantId)) {
      onSelectedParticipantsChange(selectedParticipants.filter(id => id !== participantId));
    } else {
      onSelectedParticipantsChange([...selectedParticipants, participantId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Participantes ({participantes.length})
          <div className="flex items-center gap-2">
            {!isSelectionMode ? (
              <>
                <Button onClick={() => onSelectionModeChange(true)} variant="destructive" size="sm">
                  <MinusCircle className="w-4 h-4 mr-2" />
                  Remover Participantes
                </Button>
                <Button onClick={onAddParticipants} variant="outline" size="sm">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Adicionar Participantes
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onRemoveParticipants}
                  variant="destructive"
                  size="sm"
                  disabled={selectedParticipants.length === 0}
                >
                  Remover ({selectedParticipants.length})
                </Button>
                <Button
                  onClick={() => {
                    onSelectionModeChange(false);
                    onSelectedParticipantsChange([]);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isSelectionMode && participantes.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">
              {selectedParticipants.length} selecionado
              {selectedParticipants.length !== 1 ? 's' : ''}
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleSelectAll} className="text-xs h-6 px-2 ml-auto">
              {selectedParticipants.length === participantes.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
            </Button>
          </div>
        )}
        <div className="space-y-3">
          {participantes.map(participante => (
            <div
              key={participante.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                isSelectionMode
                  ? selectedParticipants.includes(participante.id.toString())
                    ? 'bg-echurch-100 border border-echurch-300 cursor-pointer'
                    : 'bg-echurch-50 border border-transparent cursor-pointer hover:bg-echurch-100'
                  : 'bg-echurch-50'
              }`}
              onClick={() => handleParticipantClick(participante.id.toString())}
            >
              <div className="flex items-center gap-3">
                {isSelectionMode && (
                  <Checkbox
                    checked={selectedParticipants.includes(participante.id.toString())}
                    onChange={() => {}} // Handled by onClick
                    className="pointer-events-none"
                  />
                )}
                <Avatar>
                  <AvatarFallback className="bg-echurch-200 text-echurch-700">
                    {participante.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{participante.name}</p>
                  <p className="text-sm text-echurch-600">{participante.area}</p>
                </div>
              </div>
              <Badge className={getStatusColor(participante.statusSchedule)}>{participante.statusSchedule}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
