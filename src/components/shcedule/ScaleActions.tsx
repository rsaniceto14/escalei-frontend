import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCw, MessageCircle, Sparkles, Loader2, Send } from 'lucide-react';
import { Schedule, UserScheduleStatus, ScheduleStatus } from '@/api';

interface ScaleActionsProps {
  escala: Schedule;
  onConfirmPresence: () => void;
  onRequestSwap: () => void;
  onGenerateSchedule?: () => void;
  onPublishSchedule?: () => void;
  isGenerating?: boolean;
  canGenerateSchedule?: boolean;
  canPublishSchedule?: boolean;
  isConfirmingPresence?: boolean;
  isPublishing?: boolean;
}

export const ScaleActions: React.FC<ScaleActionsProps> = ({ 
  escala, 
  onConfirmPresence, 
  onRequestSwap,
  onGenerateSchedule,
  onPublishSchedule,
  isGenerating = false,
  canGenerateSchedule = false,
  canPublishSchedule = false,
  isConfirmingPresence = false,
  isPublishing = false,
}) => {
  const isActive = escala.status === ScheduleStatus.Active;
  const isDraft = escala.status === ScheduleStatus.Draft;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {canPublishSchedule && isDraft && onPublishSchedule && (
            <Button 
              onClick={onPublishSchedule} 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Publicar Escala
                </>
              )}
            </Button>
          )}
          
          {canGenerateSchedule && onGenerateSchedule && !isActive && (
            <Button 
              onClick={onGenerateSchedule} 
              className="w-full bg-echurch-500 hover:bg-echurch-600"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar Escala Automática
                </>
              )}
            </Button>
          )}
          
          {escala.userStatus !== UserScheduleStatus.Confirmed && !isActive && (
            <Button 
              onClick={onConfirmPresence} 
              className="w-full bg-echurch-500 hover:bg-echurch-600"
              disabled={isConfirmingPresence}
            >
              {isConfirmingPresence ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Confirmando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmar Presença
                </>
              )}
            </Button>
          )}
          {escala.userStatus !== UserScheduleStatus.Swap_requested && (
          <Button onClick={onRequestSwap} variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Solicitar Troca
          </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
