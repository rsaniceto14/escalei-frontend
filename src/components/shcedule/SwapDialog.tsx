import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SwapDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SwapDialog: React.FC<SwapDialogProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Solicitar Troca de Escala</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-echurch-600">Deseja solicitar a troca desta escala com outro membro disponível?</p>
          <div className="flex gap-2">
            <Button onClick={onConfirm} className="flex-1 bg-echurch-500 hover:bg-echurch-600">
              Confirmar Solicitação
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
