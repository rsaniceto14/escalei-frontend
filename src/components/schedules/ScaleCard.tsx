import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Eye } from 'lucide-react';
import { Schedule } from '@/api';
import { formatDateForList, getScheduleStatusColor, getScheduleStatusLabel, getTipoColor } from '@/utils/scheduleUtils';

interface ScaleCardProps {
  escala: Schedule;
  isMyScale?: boolean;
  onConfirmParticipation?: (escalaId: number) => void;
}

export const ScaleCard: React.FC<ScaleCardProps> = ({ escala, isMyScale = false, onConfirmParticipation }) => {
  const { date: startDate, time: startTime } = formatDateForList(escala.start_date);
  const { date: endDate, time: endTime } = formatDateForList(escala.end_date);

  return (
    <Card className={`hover:shadow-md transition-shadow ${isMyScale ? 'border-l-4 border-l-echurch-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-echurch-700">{escala.name}</CardTitle>
          <div className="flex gap-2">
            <Badge className={getTipoColor(escala.type)}>{escala.type}</Badge>
            {escala.status && (
              <Badge className={getScheduleStatusColor(escala.status)}>
                {getScheduleStatusLabel(escala.status)}
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>{escala.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
          <div className="flex items-center gap-2 text-echurch-600">
            <Calendar className="w-4 h-4" />
            <span>Início: {startDate}</span>
          </div>
          <div className="flex items-center gap-2 text-echurch-600">
            <Clock className="w-4 h-4" />
            <span>{startTime}</span>
          </div>
          <div className="flex items-center gap-2 text-echurch-600">
            <Calendar className="w-4 h-4" />
            <span>Fim: {endDate}</span>
          </div>
          <div className="flex items-center gap-2 text-echurch-600">
            <Clock className="w-4 h-4" />
            <span>{endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-echurch-600">
            <MapPin className="w-4 h-4" />
            <span>{escala.local}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-echurch-100">
          <div className="text-sm text-echurch-500">{/* Placeholder para informações adicionais */}</div>
          <div className="flex gap-2">
            {!escala.minhaEscala && onConfirmParticipation && (
              <Button
                size="sm"
                className="bg-echurch-500 hover:bg-echurch-600"
                onClick={() => onConfirmParticipation(escala.id)}
              >
                Confirmar Participação
              </Button>
            )}
            <Link to={`/schedules/${escala.id}`} state={{ escala }}>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Ver Detalhes
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
