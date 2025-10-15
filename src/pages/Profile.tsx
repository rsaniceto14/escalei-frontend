import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Shield, Mail, Phone, MapPin, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { userService } from "@/api/services/userService";
import { permissionService } from "@/api/services/permissionService";
import { storageService } from "@/api/services/storageService";
import { UserProfile } from "@/api/types";
import { useAuth } from "@/context/AuthContext";
import { ImagePicker } from "@/components/common/ImagePicker";

export default function Profile() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await userService.getProfile();
      setUser(profileData);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Erro ao carregar perfil do usuário');
      toast.error('Erro ao carregar perfil do usuário');
    } finally {
      setLoading(false);
    }
  };

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
      setUser(prev => prev ? {
        ...prev,
        photo_path: result.data!.file_path,
        photo_url: result.data!.photo_url.replace(/\\\//g, '/')
      } : null);

      toast.success('Foto atualizada com sucesso!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Erro ao fazer upload da foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePermissaoChange = async (permissao: string, valor: boolean) => {
    if (!user?.permissions.manage_users) {
      toast.error("Apenas usuários com permissão de gerenciar usuários podem alterar permissões");
      return;
    }

    try {
      // Update the permission via API
      await permissionService.updateUserPermissions(parseInt(user.id), {
        [permissao]: valor
      });

      // Update local state
      setUser(prev => prev ? {
        ...prev,
        permissions: {
          ...prev.permissions,
          [permissao]: valor
        }
      } : null);

      toast.success("Permissão atualizada com sucesso");
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error("Erro ao atualizar permissão");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    const [year, month, day] = dateString.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("pt-BR");
  };

  const formatAddress = (church: UserProfile['church']) => {
    if (!church) return 'Não informado';
    
    const addressParts = [];
    
    if (church.street) {
      addressParts.push(church.street);
    }
    if (church.number) {
      addressParts.push(`Nº ${church.number}`);
    }
    if (church.complement) {
      addressParts.push(church.complement);
    }
    if (church.quarter) {
      addressParts.push(church.quarter);
    }
    if (church.city) {
      addressParts.push(church.city);
    }
    if (church.state) {
      addressParts.push(church.state);
    }
    if (church.cep) {
      addressParts.push(`CEP: ${church.cep}`);
    }
    
    return addressParts.length > 0 ? addressParts.join(', ') : 'Não informado';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'A':
        return <Badge className="bg-green-500 text-white">Ativo</Badge>;
      case 'I':
        return <Badge className="bg-red-500 text-white">Inativo</Badge>;
      case 'WA':
        return <Badge className="bg-red-500 text-white">Aguardando aprovação</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Desconhecido</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-echurch-500" />
          <p className="text-echurch-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Erro ao carregar perfil'}</p>
          <Button onClick={fetchUserProfile} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-echurch-700 flex items-center gap-2">
          <User className="w-8 h-8" />
          Perfil do Usuário
        </h1>
        <p className="text-echurch-600 mt-1">Visualize e gerencie suas informações</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informações Básicas */}
        <div className="lg:col-span-2 space-y-6">
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
                    <Label className="text-sm font-medium text-echurch-600 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <div className="p-2 bg-echurch-50 rounded border text-echurch-800">{user.email}</div>
                  </div>
                  
                  {user.areas.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-echurch-600">Áreas de Atuação</Label>
                      <div className="flex flex-wrap gap-2">
                        {user.areas.map((area) => (
                          <Badge key={area.id} className="bg-echurch-500 text-white">
                            {area.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button className="bg-echurch-500 hover:bg-echurch-600">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Informações
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Igreja */}
          {user.church && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Igreja
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-echurch-600">Nome da Igreja</Label>
                    <div className="p-3 bg-gradient-to-r from-echurch-50 to-echurch-100 rounded border flex items-center gap-2">
                      <span className="text-echurch-800 font-medium">{user.church.name}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-echurch-600">Endereço Completo</Label>
                    <div className="p-3 bg-echurch-50 rounded border text-echurch-800">
                      <div className="space-y-1">
                        {user.church.street && user.church.number && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">📍</span>
                            <span>{user.church.street}, Nº {user.church.number}</span>
                            {user.church.complement && <span>- {user.church.complement}</span>}
                          </div>
                        )}
                        {user.church.quarter && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">🏘️</span>
                            <span>{user.church.quarter}</span>
                          </div>
                        )}
                        {user.church.city && user.church.state && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">🏙️</span>
                            <span>{user.church.city} - {user.church.state}</span>
                          </div>
                        )}
                        {user.church.cep && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">📮</span>
                            <span>CEP: {user.church.cep}</span>
                          </div>
                        )}
                        {!user.church.street && !user.church.quarter && !user.church.city && !user.church.cep && (
                          <span className="text-echurch-500 italic">Endereço não informado</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Permissões do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Permissões do Sistema
              </CardTitle>
              <CardDescription>
                {user.permissions.manage_users 
                  ? "Você pode alterar as permissões abaixo" 
                  : "Permissões controladas pelo administrador"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-3 bg-echurch-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Criar Escalas</Label>
                    <p className="text-sm text-echurch-600">Permite criar novas escalas</p>
                  </div>
                  <Switch
                    checked={user.permissions.create_scale}
                    onCheckedChange={(checked) => handlePermissaoChange('create_scale', checked)}
                    disabled={!user.permissions.manage_users}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-echurch-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Gerenciar Músicas</Label>
                    <p className="text-sm text-echurch-600">Permite adicionar e editar músicas</p>
                  </div>
                  <Switch
                    checked={user.permissions.create_music || user.permissions.update_music}
                    onCheckedChange={(checked) => handlePermissaoChange('manage_music', checked)}
                    disabled={!user.permissions.manage_users}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-echurch-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Gerenciar Áreas</Label>
                    <p className="text-sm text-echurch-600">Permite criar e editar áreas</p>
                  </div>
                  <Switch
                    checked={user.permissions.create_area || user.permissions.update_area}
                    onCheckedChange={(checked) => handlePermissaoChange('manage_area', checked)}
                    disabled={!user.permissions.manage_users}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-echurch-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Gerenciar Usuários</Label>
                    <p className="text-sm text-echurch-600">Permite gerenciar outros usuários</p>
                  </div>
                  <Switch
                    checked={user.permissions.manage_users}
                    onCheckedChange={(checked) => handlePermissaoChange('manage_users', checked)}
                    disabled={!user.permissions.manage_users}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-echurch-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Configurações da Igreja</Label>
                    <p className="text-sm text-echurch-600">Permite alterar configurações da igreja</p>
                  </div>
                  <Switch
                    checked={user.permissions.manage_church_settings}
                    onCheckedChange={(checked) => handlePermissaoChange('manage_church_settings', checked)}
                    disabled={!user.permissions.manage_users}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-echurch-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Configurações do Sistema</Label>
                    <p className="text-sm text-echurch-600">Permite alterar configurações gerais</p>
                  </div>
                  <Switch
                    checked={user.permissions.manage_app_settings}
                    onCheckedChange={(checked) => handlePermissaoChange('manage_app_settings', checked)}
                    disabled={!user.permissions.manage_users}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status da Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Tipo de usuário:</span>
                <Badge variant={user.permissions.manage_users ? "default" : "secondary"}>
                  {user.permissions.manage_users ? "Administrador" : "Membro"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status:</span>
                {getStatusBadge(user.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">ID do usuário:</span>
                <span className="text-sm text-echurch-600 font-mono">{user.id}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Áreas vinculadas:</span>
                <span className="font-medium">{user.areas.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Igreja:</span>
                <span className="font-medium text-echurch-600">{user.church?.name || 'Não vinculada'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Permissões:</span>
                <span className="font-medium text-echurch-600">
                  {Object.values(user.permissions).filter(Boolean).length} ativas
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}