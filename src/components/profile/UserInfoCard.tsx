import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Edit, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { storageService } from "@/api/services/storageService";
import { userService } from "@/api/services/userService";
import { userRoleService } from "@/api/services/userRoleService";
import { areaService } from "@/api/services/areaService";
import { UserProfile, Area, UserRole, AreaWithRoles } from "@/api/types";
import { ImagePicker } from "@/components/common/ImagePicker";

interface UserInfoCardProps {
  user: UserProfile;
  onUserUpdate: (updatedUser: UserProfile) => void;
  onRefreshProfile: () => Promise<void>;
  areas: Area[];
}

export function UserInfoCard({ user, onUserUpdate, onRefreshProfile, areas }: UserInfoCardProps) {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editUserData, setEditUserData] = useState({ name: '', email: '', birthday: '' });
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [userAreas, setUserAreas] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [areasWithRoles, setAreasWithRoles] = useState<AreaWithRoles[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  const handlePhotoUpload = async (file: File) => {
    if (!user?.id) {
      toast.error('ID do usuário não encontrado');
      return;
    }

    try {
      setUploadingPhoto(true);
      
      // Upload image and update user profile in one call
      const result = await storageService.changeUserPhoto(file, user.id);

      if (!result.success || !result.data) {
        throw new Error(result.message || 'Falha no upload da imagem');
      }

      // Update local state with new photo path and signed URL
      onUserUpdate({
        ...user,
        photo_path: result.data!.file_path,
        photo_url: result.data!.photo_url.replace(/\\\//g, '/')
      });

      toast.success('Foto atualizada com sucesso!');
      
      // Refresh profile data from server
      await onRefreshProfile();
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Erro ao fazer upload da foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    const [year, month, day] = dateString.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("pt-BR");
  };

  const handleEditUser = async () => {
    setEditUserData({
      name: user.name,
      email: user.email,
      birthday: user.birthday || ''
    });
    setUserAreas(user.areas || []);
    setUserRoles(user.roles || []);
    
    // Load areas with roles for role assignment
    if (user.permissions?.manage_users) {
      try {
        const areasData = await areaService.getAreasWithRoles();
        setAreasWithRoles(areasData);
      } catch (error) {
        console.error('Error loading areas with roles:', error);
      }
    }
    
    setShowEditDialog(true);
  };

  const handleAddUserToArea = async (areaId: number) => {
    try {
      // Find the area to get its name
      const area = areas.find(a => parseInt(a.id) === areaId);
      if (!area) return;
      
      // Add user to area using backend API
      await userService.addUserToArea(user.id, area.id);
      
      // Update local state
      const newUserArea = {
        id: area.id,
        name: area.name,
        description: area.description
      };
      
      setUserAreas(prev => [...prev, newUserArea]);
      
      toast.success(`Você foi adicionado à área ${area.name}.`);
    } catch (error: any) {
      toast.error(error.message || "Não foi possível adicionar usuário à área");
    }
  };

  const handleRemoveUserFromArea = async (areaId: number) => {
    try {
      // Find the area to get its name
      const area = areas.find(a => parseInt(a.id) === areaId);
      if (!area) return;
      
      // Remove user from area using backend API
      await userService.removeUserFromArea(user.id, area.id);
      
      // Update local state
      setUserAreas(prev => prev.filter(ua => parseInt(ua.id) !== areaId));
      
      toast.success(`Você foi removido da área ${area.name}.`);
    } catch (error: any) {
      toast.error(error.message || "Não foi possível remover usuário da área");
    }
  };

  const handleAttachRole = async (roleId: number) => {
    try {
      setIsLoadingRoles(true);
      await userRoleService.attachRole(user.id, roleId);
      
      // Reload user roles
      const updatedRoles = await userRoleService.getUserRoles(user.id);
      setUserRoles(updatedRoles);
      
      // Update user object
      onUserUpdate({
        ...user,
        roles: updatedRoles,
      });
      
      toast.success('Função atribuída com sucesso!');
    } catch (error: any) {
      toast.error(error.message || "Não foi possível atribuir função");
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const handleDetachRole = async (roleId: number) => {
    try {
      setIsLoadingRoles(true);
      await userRoleService.detachRole(user.id, roleId);
      
      // Reload user roles
      const updatedRoles = await userRoleService.getUserRoles(user.id);
      setUserRoles(updatedRoles);
      
      // Update user object
      onUserUpdate({
        ...user,
        roles: updatedRoles,
      });
      
      toast.success('Função removida com sucesso!');
    } catch (error: any) {
      toast.error(error.message || "Não foi possível remover função");
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editUserData.name.trim() || !editUserData.email.trim()) {
      toast.error("Nome e email são obrigatórios.");
      return;
    }

    setIsUpdatingUser(true);
    try {
      const updatedUser = await userService.updateUserById(user.id, editUserData);
      
      // Update local state with the updated user data
      onUserUpdate({
        ...user,
        name: updatedUser.name,
        email: updatedUser.email,
        birthday: updatedUser.birthday
      });
      
      setShowEditDialog(false);
      toast.success("Suas informações foram atualizadas com sucesso.");
    } catch (error: any) {
      toast.error(error.message || "Não foi possível atualizar o perfil");
    } finally {
      setIsUpdatingUser(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.photo_url || ''} alt={user.name} />
                <AvatarFallback>
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ImagePicker
                onImageSelect={handlePhotoUpload}
                currentImage={user.photo_url}
                disabled={uploadingPhoto}
                trigger={
                  <Button variant="outline" size="sm" disabled={uploadingPhoto}>
                    {uploadingPhoto ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Trocar Foto
                      </>
                    )}
                  </Button>
                }
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-echurch-600">Nome Completo</Label>
                  <div className="p-2 bg-echurch-50 rounded border text-echurch-800">{user.name}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-echurch-600">Data de Nascimento</Label>
                  <div className="p-2 bg-echurch-50 rounded border text-echurch-800">{formatDate(user.birthday)}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-echurch-600">Email</Label>
                <div className="p-2 bg-echurch-50 rounded border text-echurch-800">{user.email}</div>
              </div>
              
              {user.areas.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-echurch-600">Áreas de Atuação</Label>
                  <div className="flex flex-wrap gap-2">
                    {user.areas.map((area) => (
                      <span key={area.id} className="px-2 py-1 bg-echurch-500 text-white text-sm rounded">
                        {area.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {user.roles && user.roles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-echurch-600">Funções</Label>
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                      <span key={role.id} className="px-2 py-1 bg-echurch-600 text-white text-sm rounded flex items-center gap-1">
                        <span>{role.name}</span>
                        <span className="text-xs opacity-75">(Prioridade {role.priority})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <Button className="bg-echurch-500 hover:bg-echurch-600" onClick={handleEditUser}>
                <Edit className="w-4 h-4 mr-2" />
                Editar Informações
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-sm sm:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Editar Perfil
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
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

            {/* User Areas Section - Only show if user has permission to manage users */}
            {user.permissions?.manage_users && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Suas Áreas</Label>
                  <Select onValueChange={(value) => handleAddUserToArea(parseInt(value))}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Adicionar área" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas
                        .filter(area => !userAreas.some(ua => parseInt(ua.id) === parseInt(area.id)))
                        .map(area => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {userAreas.length > 0 ? (
                  <div className="space-y-2">
                    {userAreas.map(userArea => (
                      <div key={userArea.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{userArea.name}</p>
                          {userArea.description && (
                            <p className="text-xs text-gray-600">{userArea.description}</p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveUserFromArea(parseInt(userArea.id))}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Você não está associado a nenhuma área
                  </div>
                )}
              </div>
            )}

            {/* User Roles Section - Only show if user has permission to manage users */}
            {user.permissions?.manage_users && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Suas Funções</Label>
                  <Select 
                    onValueChange={(value) => handleAttachRole(parseInt(value))}
                    disabled={isLoadingRoles}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Adicionar função" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        const availableRoles = areasWithRoles
                          .filter(area => userAreas.some(ua => parseInt(ua.id) === area.id))
                          .flatMap(area => 
                            area.roles
                              .filter(role => !userRoles.some(ur => ur.id === role.id))
                              .map(role => ({ ...role, areaName: area.name }))
                          );
                        
                        if (availableRoles.length === 0) {
                          return (
                            <div className="p-4 text-sm text-gray-500 text-center">
                              {userAreas.length === 0 
                                ? "Adicione-se a uma área primeiro"
                                : "Nenhuma função disponível nas suas áreas"
                              }
                            </div>
                          );
                        }
                        
                        return availableRoles.map(role => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name} ({role.areaName})
                          </SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                </div>
                
                {userRoles.length > 0 ? (
                  <div className="space-y-2">
                    {userRoles.map(userRole => {
                      const area = areasWithRoles.find(a => a.roles.some(r => r.id === userRole.id));
                      return (
                        <div key={userRole.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{userRole.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              {area && <span>{area.name}</span>}
                              <span>•</span>
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
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={isLoadingRoles}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Você não possui funções atribuídas
                  </div>
                )}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={handleUpdateUser}
                className="flex-1 bg-echurch-500 hover:bg-echurch-600"
                disabled={isUpdatingUser}
              >
                {isUpdatingUser && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar Alterações
              </Button>
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
