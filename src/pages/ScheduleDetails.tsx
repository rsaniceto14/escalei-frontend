import { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useScaleDetails } from '@/hooks/useScheduleDetails';
import { ScaleInfo, ParticipantsList, ScaleActions, SwapDialog, AddParticipantsDialog } from '@/components/shcedule';

export default function ScheduleDetails() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  // Estados locais para UI
  const [showSwapDialog, setShowSwapDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Hook customizado para gerenciar dados da escala
  const {
    escala,
    participantes,
    availableUsers,
    handleConfirmPresence,
    handleSwap,
    handleAddParticipants,
    handleRemoveParticipants,
  } = useScaleDetails(id, location.state?.escala);

  // Handlers para dialogs
  const handleSwapConfirm = async () => {
    await handleSwap();
    setShowSwapDialog(false);
  };

  const handleAddConfirm = async (selectedUsers: string[], selectedArea: string) => {
    await handleAddParticipants(selectedUsers, selectedArea);
    setShowAddDialog(false);
  };

  const handleRemoveConfirm = async () => {
    await handleRemoveParticipants(selectedParticipants);
    setSelectedParticipants([]);
    setIsSelectionMode(false);
  };

  if (!escala) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/schedules">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-echurch-700">{escala.name}</h1>
          <p className="text-echurch-600">Detalhes da escala</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações principais */}
        <div className="lg:col-span-2 space-y-6">
          <ScaleInfo escala={escala} />

          <ParticipantsList
            participantes={participantes}
            isSelectionMode={isSelectionMode}
            selectedParticipants={selectedParticipants}
            onSelectionModeChange={setIsSelectionMode}
            onSelectedParticipantsChange={setSelectedParticipants}
            onAddParticipants={() => setShowAddDialog(true)}
            onRemoveParticipants={handleRemoveConfirm}
          />
        </div>

        {/* Ações laterais */}
        <ScaleActions
          escala={escala}
          onConfirmPresence={handleConfirmPresence}
          onRequestSwap={() => setShowSwapDialog(true)}
        />
      </div>

      {/* Modais */}
      <SwapDialog isOpen={showSwapDialog} onConfirm={handleSwapConfirm} onCancel={() => setShowSwapDialog(false)} />

      <AddParticipantsDialog
        isOpen={showAddDialog}
        availableUsers={availableUsers}
        onAdd={handleAddConfirm}
        onCancel={() => setShowAddDialog(false)}
      />
    </div>
  );
}
