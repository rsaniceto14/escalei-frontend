import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin } from 'lucide-react';
import { Schedule } from '@/api';
import { formatDate, getScheduleStatusColor, getScheduleStatusLabel } from '@/utils/scheduleUtils';

interface ScaleInfoProps {
  escala: Schedule;
}

export const ScaleInfo: React.FC<ScaleInfoProps> = ({ escala }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Informações Gerais
          {escala.status && (
            <Badge className={getScheduleStatusColor(escala.status)}>
              {getScheduleStatusLabel(escala.status)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-echurch-500" />
            <div>
              <p className="font-medium">Data de Início</p>
              <p className="text-sm text-echurch-600 capitalize">{formatDate(escala.start_date).date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-echurch-500" />
            <div>
              <p className="font-medium">Data de Fim</p>
              <p className="text-sm text-echurch-600 capitalize">{formatDate(escala.end_date).date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-echurch-500" />
            <div>
              <p className="font-medium">Local</p>
              <p className="text-sm text-echurch-600">{escala.local}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <p className="font-medium mb-2">Descrição</p>
          <p className="text-sm text-echurch-600">{escala.description}</p>
        </div>

        {escala.observation && (
          <>
            <Separator />
            <div>
              <p className="font-medium mb-2">Observação</p>
              <p className="text-sm text-echurch-600">{escala.observation}</p>
            </div>
          </>
        )}

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-echurch-600">Tipo:</span>
            <span className="font-medium">{escala.type}</span>
          </div>
          {escala.created_at && (
            <div className="flex justify-between">
              <span className="text-echurch-600">Criado em:</span>
              <span className="font-medium">{formatDate(escala.created_at).date}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
