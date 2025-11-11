import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Loader2, X, Save, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userService, userRoleService, areaService } from "@/api";
import { User, UserRole } from "@/api/types";
import { AreaWithRoles } from "@/api/services/areaService";

interface UserEditDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
  areas: AreaWithRoles[];
  canManageUsers: boolean;
}

export function UserEditDialog({
  user,
  open,
  onOpenChange,
  onUserUpdated,
  areas,
  canManageUsers,
}: UserEditDialogProps) {
  const { toast } = useToast();
  
  // User basic info state
  const [editUserData, setEditUserData] = useState({ name: '', email: '', birthday: '' });
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  
  // Areas state
  const [userAreas, setUserAreas] = useState<Array<{ id: string; name: string; description?: string }>>([]);
  const [selectedAreaValue, setSelectedAreaValue] = useState("");
  
  // Roles state
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [areasWithRoles, setAreasWithRoles] = useState<AreaWithRoles[]>([]);
  const [isLoadingUserRoles, setIsLoadingUserRoles] = useState(false);
  const [selectedRoleValue, setSelectedRoleValue] = useState("");
  
  // Reorder mode state
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [reorderPriorities, setReorderPriorities] = useState<Record<number, number>>({});
  const [isSavingReorder, setIsSavingReorder] = useState(false);

  // Initialize data when user changes
  useEffect(() => {
    if (user) {
      setEditUserData({
        name: user.name,
        email: user.email,
        birthday: user.birthday || ''
      });
      setUserAreas(user.areas || []);
      setUserRoles(user.roles || []);
      setSelectedAreaValue("");
      setSelectedRoleValue("");
      setIsReorderMode(false);
      setReorderPriorities({});
      
      // Load areas with roles for role selection
      if (canManageUsers) {
        loadAreasWithRoles();
      }
    }
  }, [user, canManageUsers]);

  const loadAreasWithRoles = async () => {
    setIsLoadingUserRoles(true);
    try {
      const areasData = await areaService.getAreasWithRoles();
      setAreasWithRoles(areasData);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar as áreas",
        variant: "destructive"
      });
    } finally {
      setIsLoadingUserRoles(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!user || !editUserData.name.trim() || !editUserData.email.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e email são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdatingUser(true);
    try {
      await userService.updateUserById(user.id, editUserData);
      toast({
        title: "Usuário atualizado!",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });
      onUserUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o usuário",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handleAddUserToArea = async (areaId: number) => {
    if (!user) return;
    
    try {
      const area = areas.find(a => a.id === areaId);
      if (!area) return;
      
      await userService.addUserToArea(user.id, area.id.toString());
      
      const newUserArea = {
        id: area.id.toString(),
        name: area.name,
        description: area.description
      };
      
      setUserAreas(prev => [...prev, newUserArea]);
      setSelectedAreaValue(""); // Reset select
      
      toast({
        title: "Usuário adicionado!",
        description: `${user.name} foi adicionado à área ${area.name}.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar usuário à área",
        variant: "destructive"
      });
    }
  };

  const handleRemoveUserFromArea = async (areaId: number) => {
    if (!user) return;
    
    try {
      const area = areas.find(a => a.id === areaId);
      if (!area) return;
      
      await userService.removeUserFromArea(user.id, area.id.toString());
      setUserAreas(prev => prev.filter(ua => parseInt(ua.id) !== areaId));
      
      toast({
        title: "Usuário removido!",
        description: `${user.name} foi removido da área ${area.name}.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível remover usuário da área",
        variant: "destructive"
      });
    }
  };

  const handleAttachRole = async (roleId: number) => {
    if (!user) return;
    
    try {
      setIsLoadingUserRoles(true);
      await userRoleService.attachRole(user.id, roleId);
      
      // Reload user data
      await onUserUpdated();
      
      // Update local state from reloaded data
      const updatedUsers = await userService.getUsersByChurch();
      const updatedUser = updatedUsers.find(u => u.id === user.id);
      if (updatedUser) {
        setUserRoles(updatedUser.roles || []);
      }
      
      setSelectedRoleValue(""); // Reset select
      
      toast({
        title: "Função atribuída!",
        description: "Função foi atribuída ao usuário com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atribuir função",
        variant: "destructive"
      });
    } finally {
      setIsLoadingUserRoles(false);
    }
  };

  const handleDetachRole = async (roleId: number) => {
    if (!user) return;
    
    try {
      setIsLoadingUserRoles(true);
      await userRoleService.detachRole(user.id, roleId);
      
      // Reload user data
      await onUserUpdated();
      
      // Update local state from reloaded data
      const updatedUsers = await userService.getUsersByChurch();
      const updatedUser = updatedUsers.find(u => u.id === user.id);
      if (updatedUser) {
        setUserRoles(updatedUser.roles || []);
      }
      
      toast({
        title: "Função removida!",
        description: "Função foi removida do usuário com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível remover função",
        variant: "destructive"
      });
    } finally {
      setIsLoadingUserRoles(false);
    }
  };

  const handleEnterReorderMode = () => {
    const priorities: Record<number, number> = {};
    userRoles.forEach(role => {
      priorities[role.id] = role.priority;
    });
    setReorderPriorities(priorities);
    setIsReorderMode(true);
  };

  const handleCancelReorder = () => {
    setIsReorderMode(false);
    setReorderPriorities({});
  };

  const handleSaveReorder = async () => {
    if (!user) return;
    
    // Validate all priorities are within range
    const totalRoles = userRoles.length;
    const invalidPriorities = Object.entries(reorderPriorities).filter(
      ([_, priority]) => priority < 1 || priority > totalRoles
    );
    
    if (invalidPriorities.length > 0) {
      toast({
        title: "Prioridades inválidas",
        description: `As prioridades devem estar entre 1 e ${totalRoles}`,
        variant: "destructive"
      });
      return;
    }
    
    // Check for duplicate priorities
    const priorityValues = Object.values(reorderPriorities);
    const uniquePriorities = new Set(priorityValues);
    if (uniquePriorities.size !== priorityValues.length) {
      toast({
        title: "Prioridades duplicadas",
        description: "Cada função deve ter uma prioridade única",
        variant: "destructive"
      });
      return;
    }
    
    setIsSavingReorder(true);
    try {
      // Update priorities for changed roles
      const updatePromises = Object.entries(reorderPriorities)
        .filter(([roleId, priority]) => {
          const role = userRoles.find(r => r.id === parseInt(roleId));
          return role && role.priority !== priority;
        })
        .map(([roleId, priority]) => 
          userRoleService.updatePriority(user.id, parseInt(roleId), priority)
        );
      
      await Promise.all(updatePromises);
      
      // Reload user data
      await onUserUpdated();
      
      // Update local state
      const updatedUsers = await userService.getUsersByChurch();
      const updatedUser = updatedUsers.find(u => u.id === user.id);
      if (updatedUser) {
        setUserRoles(updatedUser.roles || []);
      }
      
      setIsReorderMode(false);
      setReorderPriorities({});
      
      toast({
        title: "Ordem atualizada!",
        description: "As prioridades das funções foram atualizadas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar a ordem",
        variant: "destructive"
      });
    } finally {
      setIsSavingReorder(false);
    }
  };

  const updateReorderPriority = (roleId: number, newPriority: number) => {
    const totalRoles = userRoles.length;
    const clampedPriority = Math.max(1, Math.min(totalRoles, newPriority));
    setReorderPriorities(prev => ({
      ...prev,
      [roleId]: clampedPriority
    }));
  };

  if (!user) return null;

  // Get available roles filtered by user's areas
  const availableRoles = areasWithRoles
    .filter(area => userAreas.some(ua => parseInt(ua.id) === area.id))
    .flatMap(area => 
      area.roles
        .filter(role => !userRoles.some(ur => ur.id === role.id))
        .map(role => ({ ...role, areaName: area.name }))
    );

  // Sort roles by priority for display
  const sortedRoles = [...userRoles].sort((a, b) => a.priority - b.priority);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Editar Usuário: {user.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Basic User Info */}
          <div>
            <Label htmlFor="user-name">Nome Completo</Label>
            <Input
              id="user-name"
              value={editUserData.name}
              onChange={(e) => setEditUserData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome completo do usuário"
              disabled={isUpdatingUser}
            />
          </div>
          
          <div>
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              value={editUserData.email}
              onChange={(e) => setEditUserData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@exemplo.com"
              disabled={isUpdatingUser}
            />
          </div>

          <div>
            <Label htmlFor="user-birthday">Data de Nascimento</Label>
            <Input
              id="user-birthday"
              type="date"
              value={editUserData.birthday}
              onChange={(e) => setEditUserData(prev => ({ ...prev, birthday: e.target.value }))}
              disabled={isUpdatingUser}
            />
          </div>

          {/* User Areas Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Áreas do Usuário</Label>
              <Select 
                value={selectedAreaValue}
                onValueChange={(value) => {
                  handleAddUserToArea(parseInt(value));
                }}
                disabled={isUpdatingUser}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Adicionar área" />
                </SelectTrigger>
                <SelectContent>
                  {areas
                    .filter(area => !userAreas.some(ua => parseInt(ua.id) === area.id))
                    .map(area => (
                      <SelectItem key={area.id} value={area.id.toString()}>
                        {area.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            {userAreas.length > 0 ? (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {userAreas.map(userArea => (
                  <div key={userArea.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{userArea.name}</p>
                      {userArea.description && (
                        <p className="text-xs text-gray-600 mt-1">{userArea.description}</p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveUserFromArea(parseInt(userArea.id))}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-2"
                      disabled={isUpdatingUser}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                Usuário não está associado a nenhuma área
              </div>
            )}
          </div>

          {/* User Roles Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Funções do Usuário</Label>
              <div className="flex gap-2">
                {!isReorderMode && userRoles.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEnterReorderMode}
                    disabled={isLoadingUserRoles || isSavingReorder}
                    className="text-xs"
                  >
                    <ArrowUpDown className="w-3 h-3 mr-1" />
                    Reordenar
                  </Button>
                )}
                <Select 
                  value={selectedRoleValue}
                  onValueChange={(value) => {
                    handleAttachRole(parseInt(value));
                  }}
                  disabled={isLoadingUserRoles || isReorderMode}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Adicionar função" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500 text-center">
                        {userAreas.length === 0 
                          ? "Adicione o usuário a uma área primeiro"
                          : "Nenhuma função disponível nas áreas do usuário"
                        }
                      </div>
                    ) : (
                      availableRoles.map(role => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name} ({role.areaName})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoadingUserRoles ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : isReorderMode ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {sortedRoles.map((role) => {
                  const area = areasWithRoles.find(a => a.roles.some(r => r.id === role.id));
                  return (
                    <div key={role.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Label className="w-20 text-sm text-gray-600">Prioridade:</Label>
                      <Input
                        type="number"
                        min={1}
                        max={userRoles.length}
                        value={reorderPriorities[role.id] ?? role.priority}
                        onChange={(e) => {
                          const newPriority = parseInt(e.target.value) || 1;
                          updateReorderPriority(role.id, newPriority);
                        }}
                        className="w-20"
                        disabled={isSavingReorder}
                      />
                      <span className="text-xs text-gray-500">(1-{userRoles.length})</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{role.name}</p>
                        {area && (
                          <p className="text-xs text-gray-600">{area.name}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleSaveReorder}
                    disabled={isSavingReorder}
                    size="sm"
                    className="flex-1"
                  >
                    {isSavingReorder && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Salvar Ordem
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancelReorder}
                    disabled={isSavingReorder}
                    size="sm"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : sortedRoles.length > 0 ? (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {sortedRoles.map(userRole => {
                  const area = areasWithRoles.find(a => a.roles.some(r => r.id === userRole.id));
                  return (
                    <div key={userRole.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{userRole.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                          {area && <span>{area.name}</span>}
                          {area && <span>•</span>}
                          <span>Prioridade {userRole.priority}</span>
                        </div>
                        {userRole.description && (
                          <p className="text-xs text-gray-600 mt-1">{userRole.description}</p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDetachRole(userRole.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-2"
                        disabled={isLoadingUserRoles}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                Usuário não possui funções atribuídas
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleUpdateUser}
              className="flex-1 bg-echurch-500 hover:bg-echurch-600"
              disabled={isUpdatingUser || isReorderMode}
            >
              {isUpdatingUser && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isUpdatingUser || isSavingReorder}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

