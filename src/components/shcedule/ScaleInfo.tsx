import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin } from 'lucide-react';
import { Schedule } from '@/api';
import { formatDate, getStatusColor } from '@/utils/scheduleUtils';

interface ScaleInfoProps {
  escala: Schedule;
}

export const ScaleInfo: React.FC<ScaleInfoProps> = ({ escala }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Informações Gerais
          {escala.status && <Badge className={getStatusColor(escala.status)}>{escala.status}</Badge>}
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
      </CardContent>
    </Card>
  );
};
