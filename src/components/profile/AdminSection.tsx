import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Settings, Users, Shield, Eye, Edit, 
  UserPlus, Loader2, Trash2, ArrowRightLeft,
  UserCheck, UserX, Save, X, ChevronDown, ChevronUp,
  Search, ChevronLeft, ChevronRight
} from "lucide-react";
import { areaService, Area, userService, User } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface AdminSectionProps {
  className?: string;
}

export function AdminSection({ className }: AdminSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Check if user has admin permissions
  const isAdmin = user?.permissions?.manage_users || false;
  
  // Mobile-specific state
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState("areas");
  
  // Areas state
  const [areas, setAreas] = useState<Area[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);
  const [areasSearchQuery, setAreasSearchQuery] = useState("");
  const [areasCurrentPage, setAreasCurrentPage] = useState(1);
  const [areasPerPage] = useState(6);
  
  // Users state
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<User[]>([]);
  const [usersSearchQuery, setUsersSearchQuery] = useState("");
  const [usersCurrentPage, setUsersCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  
  // Loading states
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  
  // Area management states
  const [novaArea, setNovaArea] = useState("");
  const [novaAreaDescription, setNovaAreaDescription] = useState("");
  const [showNovaAreaDialog, setShowNovaAreaDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [areaUsers, setAreaUsers] = useState<any[]>([]);
  const [showAreaManagementDialog, setShowAreaManagementDialog] = useState(false);
  const [isLoadingAreaUsers, setIsLoadingAreaUsers] = useState(false);
  const [isSwitchingUser, setIsSwitchingUser] = useState<number | null>(null);
  
  // Area details states
  const [showAreaDetailsDialog, setShowAreaDetailsDialog] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [editAreaData, setEditAreaData] = useState({ name: '', description: '' });
  const [isUpdatingArea, setIsUpdatingArea] = useState(false);

  // User management states
  const [showUserEditDialog, setShowUserEditDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserData, setEditUserData] = useState({ name: '', email: '', birthday: '' });
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);
  const [userAreas, setUserAreas] = useState<any[]>([]);
  const [isLoadingUserAreas, setIsLoadingUserAreas] = useState(false);

  // Check permissions
  const canCreateArea = user?.permissions?.create_area || false;
  const canDeleteArea = user?.permissions?.delete_area || false;
  const canUpdateArea = user?.permissions?.update_area || false;

  // Load data on component mount
  useEffect(() => {
    if (isAdmin) {
      loadAreas();
      loadUsers();
    }
  }, [isAdmin]);

  // Filter areas based on search query
  useEffect(() => {
    if (!areasSearchQuery.trim()) {
      setFilteredAreas(areas);
    } else {
      const filtered = areas.filter(area =>
        area.name.toLowerCase().includes(areasSearchQuery.toLowerCase()) ||
        (area.description && area.description.toLowerCase().includes(areasSearchQuery.toLowerCase()))
      );
      setFilteredAreas(filtered);
    }
    setAreasCurrentPage(1); // Reset to first page when searching
  }, [areasSearchQuery, areas]);

  // Filter users based on search query
  useEffect(() => {
    if (!usersSearchQuery.trim()) {
      setFilteredUsuarios(usuarios);
    } else {
      const filtered = usuarios.filter(user =>
        user.name.toLowerCase().includes(usersSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(usersSearchQuery.toLowerCase())
      );
      setFilteredUsuarios(filtered);
    }
    setUsersCurrentPage(1); // Reset to first page when searching
  }, [usersSearchQuery, usuarios]);

  const loadAreas = async () => {
    setIsLoadingAreas(true);
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
      setIsLoadingAreas(false);
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

    if (!novaAreaDescription.trim()) {
      toast({
        title: "Descrição obrigatória",
        description: "A descrição da área é obrigatória.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newArea = await areaService.create({
        name: novaArea.trim(),
        description: novaAreaDescription.trim()
      });
      setAreas(prev => [...prev, newArea]);
      setNovaArea("");
      setNovaAreaDescription("");
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
    setIsLoadingAreaUsers(true);
    
    try {
      const users = await areaService.getUsers(Number(area.id));
      setAreaUsers(users);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar os usuários da área",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAreaUsers(false);
    }
  };

  const handleSwitchUserArea = async (userId: number, newAreaId: number) => {
    if (!selectedArea) return;
    
    setIsSwitchingUser(userId);
    try {
      await areaService.switchUserArea(Number(selectedArea.id), userId, newAreaId);
      
      // Refresh the users list
      const users = await areaService.getUsers(Number(selectedArea.id));
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
      await areaService.delete(Number(area.id));
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
      const updatedArea = await areaService.update(Number(editingArea.id), editAreaData);
      
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
    setUserAreas(user.areas || []);
    setShowUserEditDialog(true);
  };

  const handleAddUserToArea = async (areaId: number) => {
    if (!editingUser) return;
    
    try {
      // Find the area to get its name
      const area = areas.find(a => parseInt(a.id) === areaId);
      if (!area) return;
      
      // Add user to area using backend API
      await userService.addUserToArea(editingUser.id, area.id);
      
      // Update local state
      const newUserArea = {
        id: area.id,
        name: area.name,
        description: area.description
      };
      
      setUserAreas(prev => [...prev, newUserArea]);
      
      toast({
        title: "Usuário adicionado!",
        description: `${editingUser.name} foi adicionado à área ${area.name}.`,
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
    if (!editingUser) return;
    
    try {
      // Find the area to get its name
      const area = areas.find(a => parseInt(a.id) === areaId);
      if (!area) return;
      
      // Remove user from area using backend API
      await userService.removeUserFromArea(editingUser.id, area.id);
      
      // Update local state
      setUserAreas(prev => prev.filter(ua => parseInt(ua.id) !== areaId));
      
      toast({
        title: "Usuário removido!",
        description: `${editingUser.name} foi removido da área ${area.name}.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível remover usuário da área",
        variant: "destructive"
      });
    }
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

  // Pagination calculations
  const areasTotalPages = Math.ceil(filteredAreas.length / areasPerPage);
  const areasStartIndex = (areasCurrentPage - 1) * areasPerPage;
  const areasEndIndex = areasStartIndex + areasPerPage;
  const areasCurrentData = filteredAreas.slice(areasStartIndex, areasEndIndex);

  const usersTotalPages = Math.ceil(filteredUsuarios.length / usersPerPage);
  const usersStartIndex = (usersCurrentPage - 1) * usersPerPage;
  const usersEndIndex = usersStartIndex + usersPerPage;
  const usersCurrentData = filteredUsuarios.slice(usersStartIndex, usersEndIndex);

  // Don't render if user is not admin
  if (!isAdmin) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>Administração</span>
            <Badge className="bg-red-100 text-red-800 text-xs">
              Admin
            </Badge>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="areas">Áreas</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
            </TabsList>

            <TabsContent value="areas" className="space-y-4">
              {/* Areas Header with Search and Add Button */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar áreas..."
                      value={areasSearchQuery}
                      onChange={(e) => setAreasSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {canCreateArea && (
                    <Dialog open={showNovaAreaDialog} onOpenChange={(open) => {
                      setShowNovaAreaDialog(open);
                      if (!open) {
                        setNovaArea("");
                        setNovaAreaDescription("");
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-echurch-500 hover:bg-echurch-600">
                          <Plus className="w-4 h-4 mr-1" />
                          Nova
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm sm:max-w-md mx-auto">
                        <DialogHeader>
                          <DialogTitle>Criar Nova Área</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Nome da Área *</label>
                            <Input
                              placeholder="Ex: Infantil, Jovens, etc."
                              value={novaArea}
                              onChange={(e) => setNovaArea(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Descrição *</label>
                            <Textarea
                              placeholder="Descreva o propósito e responsabilidades desta área..."
                              value={novaAreaDescription}
                              onChange={(e) => setNovaAreaDescription(e.target.value)}
                              rows={3}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={adicionarArea} 
                              className="flex-1 bg-echurch-500 hover:bg-echurch-600"
                              disabled={isSubmitting || !novaArea.trim() || !novaAreaDescription.trim()}
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
                
                {/* Areas Count */}
                <div className="text-sm text-gray-600">
                  {filteredAreas.length} área{filteredAreas.length !== 1 ? 's' : ''} encontrada{filteredAreas.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Areas Grid */}
              {isLoadingAreas ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Carregando áreas...</span>
                </div>
              ) : areasCurrentData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="w-8 h-8 text-gray-400 mb-2 mx-auto" />
                  <p>
                    {areasSearchQuery ? "Nenhuma área encontrada para a busca." : 
                     canCreateArea ? "Nenhuma área encontrada. Crie sua primeira área de ministério." :
                     "Nenhuma área encontrada."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {areasCurrentData.map(area => (
                    <Card key={area.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-echurch-700 truncate">{area.name}</h4>
                            {area.description && (
                              <p className="text-sm text-gray-600 truncate">{area.description}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewAreaDetails(area)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleManageArea(area)}
                            >
                              <UserPlus className="w-4 h-4" />
                            </Button>
                            {canDeleteArea && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-sm sm:max-w-md mx-auto">
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Areas Pagination */}
              {areasTotalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Página {areasCurrentPage} de {areasTotalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAreasCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={areasCurrentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAreasCurrentPage(prev => Math.min(prev + 1, areasTotalPages))}
                      disabled={areasCurrentPage === areasTotalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              {/* Users Header with Search */}
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar usuários..."
                    value={usersSearchQuery}
                    onChange={(e) => setUsersSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Users Count */}
                <div className="text-sm text-gray-600">
                  {filteredUsuarios.length} usuário{filteredUsuarios.length !== 1 ? 's' : ''} encontrado{filteredUsuarios.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Users List */}
              {isLoadingUsers ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Carregando usuários...</span>
                </div>
              ) : usersCurrentData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-8 h-8 text-gray-400 mb-2 mx-auto" />
                  <p>
                    {usersSearchQuery ? "Nenhum usuário encontrado para a busca." : 
                     "Nenhum usuário encontrado na igreja."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {usersCurrentData.map(usuario => (
                    <Card key={usuario.id} className="w-full">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Avatar className="flex-shrink-0">
                              <AvatarFallback className="bg-echurch-200 text-echurch-700 text-sm">
                                {usuario.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-echurch-700 text-sm truncate">{usuario.name}</h4>
                              <p className="text-xs text-echurch-600 truncate">{usuario.email}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Badge className={`text-xs ${getStatusColor(usuario.status)}`}>
                                  {getStatusText(usuario.status)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditUser(usuario)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleToggleUserStatus(usuario.id)}
                              disabled={isTogglingStatus === usuario.id || usuario.status === 'WA'}
                              className={`h-8 w-8 p-0 ${usuario.status === 'A' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                            >
                              {isTogglingStatus === usuario.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : usuario.status === 'A' ? (
                                <UserX className="w-3 h-3" />
                              ) : (
                                <UserCheck className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Users Pagination */}
              {usersTotalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Página {usersCurrentPage} de {usersTotalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUsersCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={usersCurrentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUsersCurrentPage(prev => Math.min(prev + 1, usersTotalPages))}
                      disabled={usersCurrentPage === usersTotalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      )}

      {/* Area Management Dialog */}
      <Dialog open={showAreaManagementDialog} onOpenChange={setShowAreaManagementDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Gerenciar Área: {selectedArea?.name}
            </DialogTitle>
          </DialogHeader>
          
          {isLoadingAreaUsers ? (
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
        <DialogContent className="max-w-sm sm:max-w-md mx-auto">
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
        <DialogContent className="max-w-sm sm:max-w-md mx-auto">
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

            {/* User Areas Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Áreas do Usuário</Label>
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
                  Usuário não está associado a nenhuma área
                </div>
              )}
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
    </Card>
  );
}