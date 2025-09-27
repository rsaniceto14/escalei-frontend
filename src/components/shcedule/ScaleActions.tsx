import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCw, MessageCircle } from 'lucide-react';
import { Schedule, UserScheduleStatus } from '@/api';
import { formatDate } from '@/utils/scheduleUtils';

interface ScaleActionsProps {
  escala: Schedule;
  onConfirmPresence: () => void;
  onRequestSwap: () => void;
}

export const ScaleActions: React.FC<ScaleActionsProps> = ({ escala, onConfirmPresence, onRequestSwap }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {escala.status !== UserScheduleStatus.Confirmed && (
            <Button onClick={onConfirmPresence} className="w-full bg-echurch-500 hover:bg-echurch-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirmar Presença
            </Button>
          )}
          <Button onClick={onRequestSwap} variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Solicitar Troca
          </Button>

          <Link to={`/chats/escala-${escala.id}`}>
            <Button variant="outline" className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat da Escala
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações Adicionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-echurch-600">Tipo:</span>
            <span className="font-medium">{escala.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-echurch-600">Criado em:</span>
            <span className="font-medium">{formatDate(escala.created_at).date}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
