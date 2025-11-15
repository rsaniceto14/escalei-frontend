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
}

export const ScaleCard: React.FC<ScaleCardProps> = ({ escala, isMyScale = false }) => {
  const { date: startDate, time: startTime } = formatDateForList(escala.start_date);
  const { date: endDate, time: endTime } = formatDateForList(escala.end_date);

  return (
    <Card className={`hover:shadow-md transition-shadow min-w-0 ${isMyScale ? 'border-l-4 border-l-echurch-500' : ''}`}>
      <CardHeader className="pb-3 min-w-0">
        <div className="flex justify-between items-start gap-2 min-w-0">
          <CardTitle className="text-lg text-echurch-700 break-words flex-1 min-w-0">{escala.name}</CardTitle>
          <div className="flex gap-2 flex-shrink-0">
            <Badge className={getTipoColor(escala.type)}>{escala.type}</Badge>
            {escala.status && (
              <Badge className={getScheduleStatusColor(escala.status)}>
                {getScheduleStatusLabel(escala.status)}
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="break-words">{escala.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
          <div className="flex items-center gap-2 text-echurch-600 min-w-0">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="break-words min-w-0">Início: {startDate}</span>
          </div>
          <div className="flex items-center gap-2 text-echurch-600 min-w-0">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="break-words min-w-0">{startTime}</span>
          </div>
          <div className="flex items-center gap-2 text-echurch-600 min-w-0">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="break-words min-w-0">Fim: {endDate}</span>
          </div>
          <div className="flex items-center gap-2 text-echurch-600 min-w-0">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="break-words min-w-0">{endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-echurch-600 min-w-0">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="break-words min-w-0">{escala.local}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 pt-2 border-t border-echurch-100 min-w-0">
          <div className="text-sm text-echurch-500 min-w-0">{/* Placeholder para informações adicionais */}</div>
          <div className="flex gap-2 flex-shrink-0">
            <Link to={`/schedules/${escala.id}`} state={{ escala }} className="flex-shrink-0">
              <Button variant="outline" size="sm" className="whitespace-nowrap">
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
