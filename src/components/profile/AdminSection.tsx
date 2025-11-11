import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { areaService, Area, userService, User, userRoleService } from "@/api";
import { AreaWithRoles } from "@/api/services/areaService";
import { Role, UserRole } from "@/api/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { AreaDetailsDialog } from "@/components/admin/AreaDetailsDialog";
import { UserEditDialog } from "@/components/admin/UserEditDialog";
import { AreaManagementDialog } from "@/components/admin/AreaManagementDialog";

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
  const [areas, setAreas] = useState<AreaWithRoles[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<AreaWithRoles[]>([]);
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
  const [selectedArea, setSelectedArea] = useState<AreaWithRoles | null>(null);
  const [showAreaManagementDialog, setShowAreaManagementDialog] = useState(false);
  
  // Area details states
  const [showAreaDetailsDialog, setShowAreaDetailsDialog] = useState(false);
  const [editingArea, setEditingArea] = useState<AreaWithRoles | null>(null);

  // User management states
  const [showUserEditDialog, setShowUserEditDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);

  // Area roles state (for creation)
  const [roles, setRoles] = useState<Array<{ name: string; description: string }>>([]);

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
      const areasData = await areaService.getAreasWithRoles();
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
      return usersData;
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message || "Não foi possível carregar os usuários",
        variant: "destructive"
      });
      return [];
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
      const areaData = {
        name: novaArea.trim(),
        description: novaAreaDescription.trim(),
        roles: roles.length > 0 ? roles : undefined,
      };
      await areaService.create(areaData);
      // Reload areas to get the new area with roles
      await loadAreas();
      setNovaArea("");
      setNovaAreaDescription("");
      setRoles([]);
      setShowNovaAreaDialog(false);
      toast({
        title: "Área criada!",
        description: `A área ${novaArea} foi criada${roles.length > 0 ? ` com ${roles.length} função(ões)` : ''} com sucesso.`,
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

  const addRole = () => {
    setRoles([...roles, { name: '', description: '' }]);
  };

  const removeRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const updateRole = (index: number, field: 'name' | 'description', value: string) => {
    const updatedRoles = [...roles];
    updatedRoles[index] = { ...updatedRoles[index], [field]: value };
    setRoles(updatedRoles);
  };

  const handleManageArea = (area: AreaWithRoles) => {
    setSelectedArea(area);
    setShowAreaManagementDialog(true);
  };

  const handleDeleteArea = async (area: AreaWithRoles) => {
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

  const handleViewAreaDetails = (area: AreaWithRoles) => {
    setEditingArea(area);
    setShowAreaDetailsDialog(true);
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
    setShowUserEditDialog(true);
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

  // Helper function to get initials (only TWO)
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

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
                      <DialogContent className="max-w-sm sm:max-w-md mx-auto max-h-[90vh] overflow-y-auto">
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
                          
                          {/* Roles Section */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium">Funções (opcional)</label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addRole}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Adicionar
                              </Button>
                            </div>
                            {roles.length > 0 && (
                              <div className="space-y-2 border rounded-md p-3">
                                {roles.map((role, index) => (
                                  <div key={index} className="space-y-2 p-2 bg-gray-50 rounded">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-sm">Função {index + 1}</Label>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeRole(index)}
                                        className="h-6 w-6 p-0 text-red-600"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    <Input
                                      placeholder="Nome da função"
                                      value={role.name}
                                      onChange={(e) => updateRole(index, 'name', e.target.value)}
                                    />
                                    <Textarea
                                      placeholder="Descrição (opcional)"
                                      value={role.description}
                                      onChange={(e) => updateRole(index, 'description', e.target.value)}
                                      rows={2}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
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
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setShowNovaAreaDialog(false);
                                setNovaArea("");
                                setNovaAreaDescription("");
                                setRoles([]);
                              }} 
                              className="flex-1"
                            >
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
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-echurch-700 truncate">{area.name}</h4>
                              {area.description && (
                                <p className="text-sm text-gray-600 truncate">{area.description}</p>
                              )}
                            </div>
                            {canDeleteArea && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 flex-shrink-0">
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
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 min-w-[100px] text-xs sm:text-sm"
                              onClick={() => handleViewAreaDetails(area)}
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden sm:inline">Ver Detalhes</span>
                              <span className="sm:hidden">Ver</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 min-w-[100px] text-xs sm:text-sm"
                              onClick={() => handleManageArea(area)}
                            >
                              <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden sm:inline">Gerenciar</span>
                              <span className="sm:hidden">Ger.</span>
                            </Button>
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
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Avatar className="flex-shrink-0">
                              {usuario.photo_url ? (
                                <AvatarImage src={usuario.photo_url} alt={usuario.name} />
                              ) : null}
                              <AvatarFallback className="bg-echurch-200 text-echurch-700 text-sm">
                                {getInitials(usuario.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-echurch-700 text-sm truncate">{usuario.name}</h4>
                              <p className="text-xs text-echurch-600 truncate">{usuario.email}</p>
                              {usuario.areas && usuario.areas.length > 0 && (
                                <div className="mt-1">
                                  <span className="text-xs text-gray-500">Áreas: </span>
                                  <span className="text-xs text-echurch-600">
                                    {usuario.areas.map(area => area.name).join(', ')}
                                  </span>
                                </div>
                              )}
                              {usuario.roles && usuario.roles.length > 0 && (
                                <div className="mt-1">
                                  <span className="text-xs text-gray-500">Funções: </span>
                                  <span className="text-xs text-echurch-600">
                                    {usuario.roles.map(role => role.name).join(', ')}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            {/* Status badge in top right */}
                            <Badge className={`text-xs ${getStatusColor(usuario.status)}`}>
                              {getStatusText(usuario.status)}
                            </Badge>
                            {/* Buttons */}
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
      <AreaManagementDialog
        area={selectedArea}
        open={showAreaManagementDialog}
        onOpenChange={setShowAreaManagementDialog}
        areas={areas}
        onUserMoved={loadAreas}
      />

      {/* Area Details Dialog */}
      <AreaDetailsDialog
        area={editingArea}
        open={showAreaDetailsDialog}
        onOpenChange={setShowAreaDetailsDialog}
        onAreaUpdated={loadAreas}
        canUpdateArea={canUpdateArea}
      />

      {/* User Edit Dialog */}
      <UserEditDialog
        user={editingUser}
        open={showUserEditDialog}
        onOpenChange={setShowUserEditDialog}
        onUserUpdated={loadUsers}
        areas={areas}
        canManageUsers={user?.permissions?.manage_users || false}
      />
    </Card>
  );
}