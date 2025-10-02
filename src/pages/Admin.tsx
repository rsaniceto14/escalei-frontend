
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Plus, Settings, Users, Shield, Eye, Edit, 
  UserPlus, MapPin, Calendar, Loader2, Trash2, ArrowRightLeft,
  UserCheck, UserX, Save, X
} from "lucide-react";
import { areaService, Area, userService, User } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export default function Admin() {
  const [novaArea, setNovaArea] = useState("");
  const [showNovaAreaDialog, setShowNovaAreaDialog] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Area management states
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [areaUsers, setAreaUsers] = useState<any[]>([]);
  const [showAreaManagementDialog, setShowAreaManagementDialog] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSwitchingUser, setIsSwitchingUser] = useState<number | null>(null);
  
  // Area details states
  const [showAreaDetailsDialog, setShowAreaDetailsDialog] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [editAreaData, setEditAreaData] = useState({ name: '', description: '' });
  const [isUpdatingArea, setIsUpdatingArea] = useState(false);

  // User management states
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [showUserEditDialog, setShowUserEditDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserData, setEditUserData] = useState({ name: '', email: '', birthday: '' });
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);

  const { toast } = useToast();
  const { user } = useAuth();

  // Check if user has permission to create areas
  const canCreateArea = user?.permissions?.create_area || false;
  const canDeleteArea = user?.permissions?.delete_area || false;
  const canUpdateArea = user?.permissions?.update_area || false;

  // Load areas and users on component mount
  useEffect(() => {
    loadAreas();
    loadUsers();
  }, []);

  const loadAreas = async () => {
    setIsLoading(true);
    try {
      const areasData = await areaService.getAll();
      setAreas(areasData);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar áreas",
        description: error.message || "Não foi possível carregar as áreas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const usersData = await userService.getUsersByChurch();
      setUsuarios(usersData);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message || "Não foi possível carregar os usuários",
        variant: "destructive"
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const adicionarArea = async () => {
    if (!novaArea.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "O nome da área é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newArea = await areaService.create({
        name: novaArea.trim(),
        description: ""
      });
      setAreas(prev => [...prev, newArea]);
      setNovaArea("");
      setShowNovaAreaDialog(false);
      toast({
        title: "Área criada!",
        description: `A área ${novaArea} foi criada com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a área",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManageArea = async (area: Area) => {
    setSelectedArea(area);
    setShowAreaManagementDialog(true);
    setIsLoadingUsers(true);
    
    try {
      const users = await areaService.getUsers(area.id);
      setAreaUsers(users);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar os usuários da área",
        variant: "destructive"
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSwitchUserArea = async (userId: number, newAreaId: number) => {
    if (!selectedArea) return;
    
    setIsSwitchingUser(userId);
    try {
      await areaService.switchUserArea(selectedArea.id, userId, newAreaId);
      
      // Refresh the users list
      const users = await areaService.getUsers(selectedArea.id);
      setAreaUsers(users);
      
      toast({
        title: "Usuário movido!",
        description: "Usuário foi movido para a nova área com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível mover o usuário",
        variant: "destructive"
      });
    } finally {
      setIsSwitchingUser(null);
    }
  };

  const handleDeleteArea = async (area: Area) => {
    try {
      await areaService.delete(area.id);
      setAreas(prev => prev.filter(a => a.id !== area.id));
      toast({
        title: "Área excluída!",
        description: `A área ${area.name} foi excluída com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível excluir a área",
        variant: "destructive"
      });
    }
  };

  const handleViewAreaDetails = (area: Area) => {
    setEditingArea(area);
    setEditAreaData({
      name: area.name,
      description: area.description || ''
    });
    setShowAreaDetailsDialog(true);
  };

  const handleUpdateArea = async () => {
    if (!editingArea || !editAreaData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "O nome da área é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdatingArea(true);
    try {
      const updatedArea = await areaService.update(editingArea.id, editAreaData);
      
      // Update the areas list
      setAreas(prev => prev.map(area => 
        area.id === editingArea.id ? updatedArea : area
      ));
      
      setShowAreaDetailsDialog(false);
      toast({
        title: "Área atualizada!",
        description: `A área ${updatedArea.name} foi atualizada com sucesso.`,
      });
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Líder": return "bg-purple-100 text-purple-800";
      case "Admin": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "A": return "bg-green-100 text-green-800";
      case "I": return "bg-red-100 text-red-800";
      case "WA": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "A": return "Ativo";
      case "I": return "Inativo";
      case "WA": return "Aguardando Aprovação";
      default: return "Desconhecido";
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditUserData({
      name: user.name,
      email: user.email,
      birthday: user.birthday || ''
    });
    setShowUserEditDialog(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !editUserData.name.trim() || !editUserData.email.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e email são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdatingUser(true);
    try {
      const updatedUser = await userService.updateUserById(editingUser.id, editUserData);
      
      // Update the users list
      setUsuarios(prev => prev.map(user => 
        user.id === editingUser.id ? updatedUser : user
      ));
      
      setShowUserEditDialog(false);
      toast({
        title: "Usuário atualizado!",
        description: `O usuário ${updatedUser.name} foi atualizado com sucesso.`,
      });
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

  const handleToggleUserStatus = async (userId: string) => {
    setIsTogglingStatus(userId);
    try {
      const result = await userService.toggleUserStatus(userId);
      
      // Update the users list
      setUsuarios(prev => prev.map(user => 
        user.id === userId ? { ...user, status: result.status } : user
      ));
      
      toast({
        title: "Status atualizado!",
        description: "O status do usuário foi alterado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível alterar o status do usuário",
        variant: "destructive"
      });
    } finally {
      setIsTogglingStatus(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-echurch-700">Administração</h1>
          <p className="text-sm sm:text-base text-echurch-600">Gerencie áreas e usuários</p>
        </div>
        <Badge className="bg-red-100 text-red-800 self-start">
          <Shield className="w-3 h-3 mr-1" />
          Administrador
        </Badge>
      </div>

      <Tabs defaultValue="areas" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="areas">Áreas</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="areas" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-echurch-700">Áreas de Ministério</h2>
            {canCreateArea && (
              <Dialog open={showNovaAreaDialog} onOpenChange={setShowNovaAreaDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-echurch-500 hover:bg-echurch-600 w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Área
                  </Button>
                </DialogTrigger>
                <DialogContent className="mx-4 max-w-sm sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Área</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Nome da Área</label>
                      <Input
                        placeholder="Ex: Infantil, Jovens, etc."
                        value={novaArea}
                        onChange={(e) => setNovaArea(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={adicionarArea} 
                        className="flex-1 bg-echurch-500 hover:bg-echurch-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Criar Área
                      </Button>
                      <Button variant="outline" onClick={() => setShowNovaAreaDialog(false)} className="flex-1">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Carregando áreas...</span>
            </div>
          ) : areas.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Settings className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-500 text-center">
                  {canCreateArea 
                    ? "Nenhuma área encontrada. Crie sua primeira área de ministério."
                    : "Nenhuma área encontrada."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {areas.map(area => (
                <Card key={area.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-base sm:text-lg text-echurch-700 truncate">{area.name}</span>
                      {canDeleteArea && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 flex-shrink-0 h-8 w-8 p-0">
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="mx-4 max-w-sm sm:max-w-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Área</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a área "{area.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteArea(area)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    {area.description && (
                      <div className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        {area.description}
                      </div>
                    )}
                    {!area.description && (
                      <div className="text-xs sm:text-sm text-gray-400 italic">
                        Nenhuma descrição fornecida
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                        onClick={() => handleViewAreaDetails(area)}
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden sm:inline">Ver Detalhes</span>
                        <span className="sm:hidden">Ver</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                        onClick={() => handleManageArea(area)}
                      >
                        <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden sm:inline">Gerenciar</span>
                        <span className="sm:hidden">Ger.</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-echurch-700">Usuários da Igreja</h2>
          </div>

          {isLoadingUsers ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Carregando usuários...</span>
            </div>
          ) : usuarios.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Users className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-500 text-center">
                  Nenhum usuário encontrado na igreja.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {usuarios.map(usuario => (
                <Card key={usuario.id} className="w-full">
                  <CardContent className="p-3">
                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="flex-shrink-0">
                          <AvatarFallback className="bg-echurch-200 text-echurch-700 text-sm">
                            {usuario.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-echurch-700 text-sm sm:text-base truncate">{usuario.name}</h3>
                          <p className="text-xs sm:text-sm text-echurch-600 truncate">{usuario.email}</p>
                          <div className="flex flex-wrap items-center gap-1 mt-1">
                            <Badge className={`text-xs ${getStatusColor(usuario.status)}`}>
                              {getStatusText(usuario.status)}
                            </Badge>
                            {usuario.areas && usuario.areas.length > 0 && (
                              <span className="text-xs text-echurch-500 truncate">
                                {usuario.areas.map(area => area.name).join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end sm:justify-start">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditUser(usuario)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleUserStatus(usuario.id)}
                          disabled={isTogglingStatus === usuario.id || usuario.status === 'WA'}
                          className={`h-8 w-8 p-0 ${usuario.status === 'A' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                        >
                          {isTogglingStatus === usuario.id ? (
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                          ) : usuario.status === 'A' ? (
                            <UserX className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Area Management Dialog */}
      <Dialog open={showAreaManagementDialog} onOpenChange={setShowAreaManagementDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Gerenciar Área: {selectedArea?.name}
            </DialogTitle>
          </DialogHeader>
          
          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Carregando usuários...</span>
            </div>
          ) : areaUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Users className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center">
                Nenhum usuário encontrado nesta área.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4">
                {areaUsers.map((areaUser) => (
                  <Card key={areaUser.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-echurch-200 text-echurch-700">
                              {areaUser.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-echurch-700">{areaUser.name}</h3>
                            <p className="text-sm text-echurch-600">{areaUser.email}</p>
                            <Badge className={getStatusColor(areaUser.status)}>
                              {areaUser.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select 
                            onValueChange={(newAreaId) => handleSwitchUserArea(areaUser.id, parseInt(newAreaId))}
                            disabled={isSwitchingUser === areaUser.id}
                          >
                            <SelectTrigger className="w-32 sm:w-48">
                              <SelectValue placeholder="Mover..." />
                            </SelectTrigger>
                            <SelectContent>
                              {areas
                                .filter(area => area.id !== selectedArea?.id)
                                .map((area) => (
                                  <SelectItem key={area.id} value={area.id.toString()}>
                                    {area.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          {isSwitchingUser === areaUser.id && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Area Details Dialog */}
      <Dialog open={showAreaDetailsDialog} onOpenChange={setShowAreaDetailsDialog}>
        <DialogContent className="mx-4 max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Detalhes da Área: {editingArea?.name}
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
                disabled={isUpdatingArea}
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
                disabled={isUpdatingArea}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleUpdateArea}
                className="flex-1 bg-echurch-500 hover:bg-echurch-600"
                disabled={isUpdatingArea || !canUpdateArea}
              >
                {isUpdatingArea && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar Alterações
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAreaDetailsDialog(false)}
                className="flex-1"
                disabled={isUpdatingArea}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Edit Dialog */}
      <Dialog open={showUserEditDialog} onOpenChange={setShowUserEditDialog}>
        <DialogContent className="mx-4 max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Editar Usuário: {editingUser?.name}
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
            
            <div className="flex gap-2">
              <Button 
                onClick={handleUpdateUser}
                className="flex-1 bg-echurch-500 hover:bg-echurch-600"
                disabled={isUpdatingUser}
              >
                {isUpdatingUser && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowUserEditDialog(false)}
                className="flex-1"
                disabled={isUpdatingUser}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
