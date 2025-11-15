import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useScaleDetails } from '@/hooks/useScheduleDetails';
import { ScaleInfo, ParticipantsList, ScaleActions, SwapDialog, AddParticipantsDialog, GenerateScheduleDialog } from '@/components/shcedule';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ScheduleDetails() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  // Estados locais para UI
  const [showSwapDialog, setShowSwapDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showConfirmRegenerate, setShowConfirmRegenerate] = useState(false);
  const [pendingGenerateData, setPendingGenerateData] = useState<{ areas: number[]; roles: Array<{ role_id: number; area_id: number; count: number }> } | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Hook customizado para gerenciar dados da escala
  const {
    escala,
    participantes,
    availableUsers,
    updateAllDetails,
    handleConfirmPresence,
    handleSwap,
    handleAddParticipants,
    handleRemoveParticipants,
    handleGenerateSchedule,
    handlePublishSchedule,
    // Permissions
    canGenerateSchedule,
    canPublishSchedule,
    isActive,
    // Loading states
    isConfirmingPresence,
    isRequestingSwap,
    isAddingParticipants,
    isRemovingParticipants,
    isPublishing,
  } = useScaleDetails(id, location.state?.escala);

  // Polling para atualizar dados a cada 20 segundos (sem loading)
  useEffect(() => {
    if (!id) return;

    const interval = setInterval(() => {
      updateAllDetails();
    }, 20000); // 20 segundos

    return () => clearInterval(interval);
  }, [id, updateAllDetails]);

  // Handlers para dialogs com fechamento automático após sucesso
  const handleSwapConfirm = async () => {
    const result = await handleSwap();
    if (result?.success) {
      setShowSwapDialog(false);
    }
  };

  const handleAddConfirm = async (selectedUsers: string[], selectedArea: string, selectedRole: string) => {
    const result = await handleAddParticipants(selectedUsers, selectedArea, selectedRole);
    if (result?.success) {
      setShowAddDialog(false);
    }
  };

  const handleRemoveConfirm = async () => {
    const result = await handleRemoveParticipants(selectedParticipants);
    if (result?.success) {
      setSelectedParticipants([]);
    }
  };

  const handleGenerateClick = () => {
    setShowGenerateDialog(true);
  };

  const handleGenerateConfirm = async (areas: number[], roles: Array<{ role_id: number; area_id: number; count: number }>) => {
    // Se há participantes existentes, pedir confirmação
    if (participantes.length > 0) {
      setPendingGenerateData({ areas, roles });
      setShowConfirmRegenerate(true);
      setShowGenerateDialog(false);
      return;
    }

    // Se não há participantes, gerar diretamente
    await executeGenerate(areas, roles);
  };

  const executeGenerate = async (areas: number[], roles: Array<{ role_id: number; area_id: number; count: number }>) => {
    setIsGenerating(true);
    try {
      await handleGenerateSchedule(areas, roles);
      setShowGenerateDialog(false);
      setShowConfirmRegenerate(false);
      setPendingGenerateData(null);
    } catch (error) {
      // Error is handled by handleGenerateSchedule
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmRegenerate = async () => {
    if (pendingGenerateData) {
      await executeGenerate(pendingGenerateData.areas, pendingGenerateData.roles);
    }
  };

  if (!escala) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/schedules">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-echurch-700">{escala.name}</h1>
          <p className="text-echurch-600">Detalhes da escala</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações principais */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <ScaleInfo escala={escala} />
        </div>

        {/* Ações laterais - aparece primeiro no mobile */}
        <div className="order-1 lg:order-2">
          <ScaleActions
            escala={escala}
            onConfirmPresence={handleConfirmPresence}
            onRequestSwap={() => setShowSwapDialog(true)}
            onGenerateSchedule={handleGenerateClick}
            onPublishSchedule={handlePublishSchedule}
            isGenerating={isGenerating}
            canGenerateSchedule={canGenerateSchedule}
            canPublishSchedule={canPublishSchedule}
            isConfirmingPresence={isConfirmingPresence}
            isPublishing={isPublishing}
          />
        </div>
      </div>

      {/* Lista de participantes - ocupa 100% no desktop */}
      <div className="mt-6">
        <ParticipantsList
          participantes={participantes}
          selectedParticipants={selectedParticipants}
          onSelectedParticipantsChange={setSelectedParticipants}
          onAddParticipants={() => setShowAddDialog(true)}
          onRemoveParticipants={handleRemoveConfirm}
        />
      </div>

      {/* Modais */}
      <SwapDialog 
        isOpen={showSwapDialog} 
        onConfirm={handleSwapConfirm} 
        onCancel={() => setShowSwapDialog(false)}
        isLoading={isRequestingSwap}
      />

      <AddParticipantsDialog
        isOpen={showAddDialog}
        availableUsers={availableUsers}
        onAdd={handleAddConfirm}
        onCancel={() => setShowAddDialog(false)}
        isLoading={isAddingParticipants}
      />

      <GenerateScheduleDialog
        isOpen={showGenerateDialog}
        onGenerate={handleGenerateConfirm}
        onCancel={() => setShowGenerateDialog(false)}
      />

      <AlertDialog open={showConfirmRegenerate} onOpenChange={setShowConfirmRegenerate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerar Escala?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta escala já possui {participantes.length} {participantes.length === 1 ? 'participante' : 'participantes'}.
              Ao regenerar, todos os participantes atuais serão removidos e substituídos pelos novos selecionados automaticamente.
              <br /><br />
              A escala atual não será considerada no histórico para cálculo de limites mensais e janela mínima.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRegenerate} className="bg-echurch-500 hover:bg-echurch-600">
              Regenerar Escala
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
