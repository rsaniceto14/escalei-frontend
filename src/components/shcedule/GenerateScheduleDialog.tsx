import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { areaService, AreaWithRoles } from '@/api/services/areaService';
import { Loader2, Info } from 'lucide-react';
import { SortableRoleList } from './SortableRoleList';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RoleRequirement {
  role_id: number;
  area_id: number;
  count: number;
}

interface GenerateScheduleDialogProps {
  isOpen: boolean;
  onGenerate: (areas: number[], roles: RoleRequirement[]) => Promise<void>;
  onCancel: () => void;
}

export const GenerateScheduleDialog: React.FC<GenerateScheduleDialogProps> = ({
  isOpen,
  onGenerate,
  onCancel,
}) => {
  const [areasWithRoles, setAreasWithRoles] = useState<AreaWithRoles[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
  const [roleRequirements, setRoleRequirements] = useState<RoleRequirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchAreasWithRoles();
    }
  }, [isOpen]);

  const fetchAreasWithRoles = async () => {
    try {
      setFetching(true);
      const areas = await areaService.getAreasWithRoles();
      setAreasWithRoles(areas);
    } catch (error) {
      console.error('Error fetching areas with roles:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleAreaToggle = (areaId: number) => {
    if (selectedAreas.includes(areaId)) {
      setSelectedAreas(selectedAreas.filter(id => id !== areaId));
      // Remove role requirements for this area
      setRoleRequirements(roleRequirements.filter(req => req.area_id !== areaId));
    } else {
      setSelectedAreas([...selectedAreas, areaId]);
    }
  };

  const handleRoleToggle = (roleId: number, areaId: number) => {
    const existingIndex = roleRequirements.findIndex(
      req => req.role_id === roleId && req.area_id === areaId
    );
    
    if (existingIndex >= 0) {
      // Remove from array
      setRoleRequirements(roleRequirements.filter((_, index) => index !== existingIndex));
    } else {
      // Add to end of array (maintains order)
      setRoleRequirements([
        ...roleRequirements,
        {
          role_id: roleId,
          area_id: areaId,
          count: 1,
        },
      ]);
    }
  };

  const handleCountChange = (roleId: number, areaId: number, count: number) => {
    if (count < 1) return;
    setRoleRequirements(
      roleRequirements.map(req =>
        req.role_id === roleId && req.area_id === areaId
          ? { ...req, count }
          : req
      )
    );
  };

  const handleReorderRoles = (newOrder: RoleRequirement[]) => {
    setRoleRequirements(newOrder);
  };

  const handleRemoveRole = (index: number) => {
    setRoleRequirements(roleRequirements.filter((_, i) => i !== index));
  };

  const getRoleName = (roleId: number, areaId: number): string => {
    const area = areasWithRoles.find(a => a.id === areaId);
    const role = area?.roles.find(r => r.id === roleId);
    return role?.name || `Função ${roleId}`;
  };

  const getAreaName = (areaId: number): string => {
    const area = areasWithRoles.find(a => a.id === areaId);
    return area?.name || `Área ${areaId}`;
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Send roles in the order they appear in the array (priority order)
      await onGenerate(selectedAreas, roleRequirements);
      // Reset state
      setSelectedAreas([]);
      setRoleRequirements([]);
    } catch (error) {
      // Error is handled by parent
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedAreas([]);
    setRoleRequirements([]);
    onCancel();
  };

  const isRoleSelected = (roleId: number, areaId: number) => {
    return roleRequirements.some(req => req.role_id === roleId && req.area_id === areaId);
  };

  const getRoleCount = (roleId: number, areaId: number) => {
    const req = roleRequirements.find(r => r.role_id === roleId && r.area_id === areaId);
    return req?.count || 1;
  };

  const canGenerate = selectedAreas.length > 0 && roleRequirements.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader>
          <CardTitle>Gerar Escala Automática</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto flex-1">
          {fetching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-echurch-500" />
            </div>
          ) : areasWithRoles.length === 0 ? (
            <p className="text-sm text-echurch-600">Nenhuma área disponível.</p>
          ) : (
            <>
              <div>
                <Label className="text-sm font-medium text-echurch-700 mb-2 block">
                  Selecione as Áreas
                </Label>
                <div className="space-y-2">
                  {areasWithRoles.map(area => (
                    <div
                      key={area.id}
                      className="flex items-center space-x-2 p-2 rounded border border-gray-200 hover:bg-gray-50"
                    >
                      <Checkbox
                        id={`area-${area.id}`}
                        checked={selectedAreas.includes(area.id)}
                        onCheckedChange={() => handleAreaToggle(area.id)}
                      />
                      <label
                        htmlFor={`area-${area.id}`}
                        className="text-sm font-medium cursor-pointer flex-1"
                      >
                        {area.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {selectedAreas.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-echurch-700">
                    Selecione as Funções e Quantidade de Participantes
                  </Label>
                  {areasWithRoles
                    .filter(area => selectedAreas.includes(area.id))
                    .map(area => (
                      <div key={area.id} className="border rounded-lg p-4 space-y-3">
                        <h4 className="font-medium text-echurch-700">{area.name}</h4>
                        {area.roles.length === 0 ? (
                          <p className="text-sm text-echurch-600">Nenhuma função disponível nesta área.</p>
                        ) : (
                          <div className="space-y-2">
                            {area.roles.map(role => (
                              <div
                                key={role.id}
                                className="flex items-center gap-3 p-2 rounded border border-gray-200 hover:bg-gray-50"
                              >
                                <Checkbox
                                  id={`role-${area.id}-${role.id}`}
                                  checked={isRoleSelected(role.id, area.id)}
                                  onCheckedChange={() => handleRoleToggle(role.id, area.id)}
                                />
                                <label
                                  htmlFor={`role-${area.id}-${role.id}`}
                                  className="text-sm flex-1 cursor-pointer"
                                >
                                  {role.name}
                                </label>
                                {isRoleSelected(role.id, area.id) && (
                                  <div className="flex items-center gap-2">
                                    <Label htmlFor={`count-${area.id}-${role.id}`} className="text-xs">
                                      Qtd:
                                    </Label>
                                    <Input
                                      id={`count-${area.id}-${role.id}`}
                                      type="number"
                                      min="1"
                                      value={getRoleCount(role.id, area.id)}
                                      onChange={e =>
                                        handleCountChange(role.id, area.id, parseInt(e.target.value) || 1)
                                      }
                                      className="w-20 h-8"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {roleRequirements.length > 0 && (
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-echurch-700">
                      Ordem de Prioridade
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-echurch-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            As funções são processadas nesta ordem. Arraste para alterar a prioridade.
                            Funções no topo têm prioridade na seleção de participantes.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <SortableRoleList
                    roles={roleRequirements}
                    onReorder={handleReorderRoles}
                    onRemove={handleRemoveRole}
                    getRoleName={getRoleName}
                    getAreaName={getAreaName}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
        <div className="p-4 border-t flex gap-2">
          <Button
            onClick={handleGenerate}
            className="flex-1 bg-echurch-500 hover:bg-echurch-600"
            disabled={!canGenerate || loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              'Gerar Escala'
            )}
          </Button>
          <Button variant="outline" onClick={handleCancel} className="flex-1" disabled={loading}>
            Cancelar
          </Button>
        </div>
      </Card>
    </div>
  );
};

