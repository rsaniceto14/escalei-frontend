import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Settings, Plus, X } from "lucide-react";
import { AreaWithRoles } from "@/api/services/areaService";
import { areaService } from "@/api";
import { useToast } from "@/hooks/use-toast";

interface AreaDetailsDialogProps {
  area: AreaWithRoles | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAreaUpdated: () => void;
  canUpdateArea: boolean;
}

export function AreaDetailsDialog({
  area,
  open,
  onOpenChange,
  onAreaUpdated,
  canUpdateArea,
}: AreaDetailsDialogProps) {
  const { toast } = useToast();
  const [editAreaData, setEditAreaData] = useState({ name: '', description: '' });
  const [areaRolesList, setAreaRolesList] = useState<Array<{ id?: number; name: string; description: string }>>([]);
  const [isUpdatingArea, setIsUpdatingArea] = useState(false);
  const [isSavingRoles, setIsSavingRoles] = useState(false);

  // Initialize data when area changes
  useEffect(() => {
    if (area) {
      setEditAreaData({
        name: area.name,
        description: area.description || ''
      });
      setAreaRolesList(area.roles.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description || ''
      })));
    }
  }, [area]);

  const handleUpdateArea = async () => {
    if (!area || !editAreaData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "O nome da área é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdatingArea(true);
    try {
      await areaService.update(area.id, editAreaData);
      toast({
        title: "Área atualizada!",
        description: `A área ${editAreaData.name} foi atualizada com sucesso.`,
      });
      onAreaUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar a área",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingArea(false);
    }
  };

  const handleSaveRoles = async () => {
    if (!area) return;
    
    setIsSavingRoles(true);
    try {
      await areaService.updateRoles(area.id, areaRolesList);
      toast({
        title: "Funções atualizadas!",
        description: "As funções da área foram atualizadas com sucesso.",
      });
      onAreaUpdated();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar as funções",
        variant: "destructive"
      });
    } finally {
      setIsSavingRoles(false);
    }
  };

  const addAreaRole = () => {
    setAreaRolesList([...areaRolesList, { name: '', description: '' }]);
  };

  const removeAreaRole = (index: number) => {
    setAreaRolesList(areaRolesList.filter((_, i) => i !== index));
  };

  const updateAreaRole = (index: number, field: 'name' | 'description', value: string) => {
    const updated = [...areaRolesList];
    updated[index] = { ...updated[index], [field]: value };
    setAreaRolesList(updated);
  };

  if (!area) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Detalhes da Área: {area.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="area-name">Nome da Área</Label>
            <Input
              id="area-name"
              value={editAreaData.name}
              onChange={(e) => setEditAreaData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome da área"
              disabled={isUpdatingArea || !canUpdateArea}
            />
          </div>
          
          <div>
            <Label htmlFor="area-description">Descrição</Label>
            <Textarea
              id="area-description"
              value={editAreaData.description}
              onChange={(e) => setEditAreaData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição da área (opcional)"
              rows={4}
              disabled={isUpdatingArea || !canUpdateArea}
            />
          </div>
          
          {/* Roles Section - Editable */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Funções da Área</Label>
              {canUpdateArea && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAreaRole}
                  disabled={isSavingRoles}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              )}
            </div>
            
            {areaRolesList.length > 0 ? (
              <div className="space-y-2 border rounded-md p-3">
                {areaRolesList.map((role, index) => (
                  <div key={index} className="space-y-2 p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Função {index + 1}</Label>
                      {canUpdateArea && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAreaRole(index)}
                          className="h-6 w-6 p-0 text-red-600"
                          disabled={isSavingRoles}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="Nome da função"
                      value={role.name}
                      onChange={(e) => updateAreaRole(index, 'name', e.target.value)}
                      disabled={!canUpdateArea || isSavingRoles}
                    />
                    <Textarea
                      placeholder="Descrição (opcional)"
                      value={role.description}
                      onChange={(e) => updateAreaRole(index, 'description', e.target.value)}
                      rows={2}
                      disabled={!canUpdateArea || isSavingRoles}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                Nenhuma função configurada
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button 
                onClick={handleUpdateArea}
                className="flex-1 bg-echurch-500 hover:bg-echurch-600"
                disabled={isUpdatingArea || !canUpdateArea}
              >
                {isUpdatingArea && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar Área
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isUpdatingArea || isSavingRoles}
              >
                Cancelar
              </Button>
            </div>
            {canUpdateArea && (
              <Button 
                onClick={handleSaveRoles}
                variant="outline"
                className="w-full"
                disabled={isSavingRoles}
              >
                {isSavingRoles && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar Funções
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

