import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, Trash2 } from 'lucide-react';
import { UserScheduleDetail } from '@/api';
import { getStatusColor } from '@/utils/scheduleUtils';

interface ParticipantsListProps {
  participantes: UserScheduleDetail[];
  selectedParticipants: string[];
  onSelectedParticipantsChange: (selected: string[]) => void;
  onAddParticipants: () => void;
  onRemoveParticipants?: () => void;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participantes,
  selectedParticipants,
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
    if (selectedParticipants.includes(participantId)) {
      onSelectedParticipantsChange(selectedParticipants.filter(id => id !== participantId));
    } else {
      onSelectedParticipantsChange([...selectedParticipants, participantId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col gap-3">
          <span>Participantes ({participantes.length})</span>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {onRemoveParticipants && (
              <Button
                onClick={onRemoveParticipants}
                variant="destructive"
                size="sm"
                disabled={selectedParticipants.length === 0}
                className="w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remover ({selectedParticipants.length})
              </Button>
            )}
            <Button onClick={onAddParticipants} variant="outline" size="sm" className="w-full sm:w-auto">
              <PlusCircle className="w-4 h-4 mr-2" />
              Adicionar Participantes
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {participantes.length > 0 && (
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
              className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                selectedParticipants.includes(participante.id.toString())
                  ? 'bg-echurch-100 border border-echurch-300'
                  : 'bg-echurch-50 border border-transparent hover:bg-echurch-100'
              }`}
              onClick={() => handleParticipantClick(participante.id.toString())}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedParticipants.includes(participante.id.toString())}
                  onChange={() => {}} // Handled by onClick
                  className="pointer-events-none"
                />
                <Avatar>
                  {participante.photo_url ? (
                    <AvatarImage src={participante.photo_url} alt={participante.name} />
                  ) : null}
                  <AvatarFallback className="bg-echurch-200 text-echurch-700">
                    {participante.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{participante.name}</p>
                  <p className="text-sm text-echurch-600">
                    {participante.area}
                    {participante.role && ` • ${participante.role}`}
                  </p>
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
