import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Plus, Users, Send, Copy, Trash2, Clock, CheckCircle, XCircle, UserCheck, UserX, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { inviteService, Invite as InviteType } from "@/api/services/inviteService";
import { useEffect } from "react";
import { areaService, AreaWithRoles } from "@/api/services/areaService";
import { userApprovalService, PendingUser } from "@/api/services/userApprovalService";

type InviteStatus = 'pending' | 'accepted' | 'expired';

interface InviteDisplay extends InviteType {
  status: InviteStatus;
}

interface PendingApproval {
  id: string;
  email: string;
  name: string;
  area: string;
  role: string;
  registeredAt: string;
  status: 'awaiting' | 'approved' | 'rejected';
}

export default function Invites() {
  const [invites, setInvites] = useState<InviteDisplay[]>([]);
  const { toast } = useToast();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [areasWithRoles, setAreasWithRoles] = useState<AreaWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPending, setIsLoadingPending] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [resendingId, setResendingId] = useState<number | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);

  const [newInvite, setNewInvite] = useState({
    email: '',
    area_ids: [] as string[],
    role_ids: [] as string[],
    message: ''
  });

  const handleSendInvite = async () => {
    if (!newInvite.email || newInvite.area_ids.length === 0 || newInvite.role_ids.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios (email, áreas e funções).",
        variant: "destructive"
      });
      return;
    }

    const alreadyInvited = invites.some(inv => inv.email === newInvite.email);
    if (alreadyInvited) {
      toast({
        title: "Convite duplicado",
        description: "Este e-mail já recebeu um convite.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    try {
      await inviteService.sendInvite({
        email: newInvite.email,
        area_ids: newInvite.area_ids.map(id => Number(id)),
        role_ids: newInvite.role_ids.map(id => Number(id)),
      });

      toast({
        title: "Convite enviado!",
        description: `Convite enviado para ${newInvite.email}`,
      });

      setNewInvite({
        email: "",
        area_ids: [],
        role_ids: [],
        message: "",
      });

      setIsDialogOpen(false);
      
      // Reload invites after creating new one
      await loadInvites();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao enviar o convite.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyInviteLink = (token: string) => {
    const inviteUrl = `${window.location.origin}/register-member?invite=${token}`;
    navigator.clipboard.writeText(inviteUrl);
    toast({
      title: "Link copiado!",
      description: "O link do convite foi copiado para a área de transferência.",
    });
  };

  const getInviteStatus = (invite: InviteType): InviteStatus => {
    if (invite.used) return 'accepted';
    const expiresAt = new Date(invite.expires_at);
    const now = new Date();
    if (expiresAt < now) return 'expired';
    return 'pending';
  };

  const loadInvites = async () => {
    try {
      setIsLoading(true);
      const response = await inviteService.getAll();
      const invitesWithStatus: InviteDisplay[] = response.data.map(invite => ({
        ...invite,
        status: getInviteStatus(invite)
      }));
      setInvites(invitesWithStatus);
    } catch (error) {
      console.error("Erro ao carregar convites:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os convites.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendInvite = async (inviteId: number) => {
    setResendingId(inviteId);
    try {
      await inviteService.resendInvite(inviteId);
      
      // Reload invites to get updated expiration date
      await loadInvites();
      
      toast({
        title: "Convite reenviado!",
        description: "O convite foi enviado novamente com nova data de validade.",
      });
    } catch (error) {
      console.error("Erro ao reenviar convite:", error);
      toast({
        title: "Erro",
        description: "Não foi possível reenviar o convite.",
        variant: "destructive"
      });
    } finally {
      setResendingId(null);
    }
  };

  const handleDeleteInvite = async (inviteId: number, status: InviteStatus) => {
    // Business rule: Cannot delete accepted invites
    if (status === 'accepted') {
      toast({
        title: "Ação não permitida",
        description: "Não é possível deletar um convite que já foi aceito.",
        variant: "destructive"
      });
      return;
    }

    try {
      await inviteService.deleteInvite(inviteId);
      setInvites(prev => prev.filter(invite => invite.id !== inviteId));
      
      toast({
        title: "Convite removido",
        description: "O convite foi removido com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao deletar convite:", error);
      
      // Show backend error message if available
      const errorMessage = error?.response?.data?.error?.message 
        || error?.message 
        || "Não foi possível deletar o convite.";
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const loadPendingUsers = async () => {
    try {
      setIsLoadingPending(true);
      const response = await userApprovalService.getPendingUsers();
      setPendingUsers(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários pendentes:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar usuários pendentes.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPending(false);
    }
  };

  const handleApproveUser = async (userId: number) => {
    setApprovingId(userId);
    try {
      await userApprovalService.approveUser(userId);
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      toast({
        title: "Usuário aprovado!",
        description: "O usuário foi aprovado e pode fazer login agora."
      });
    } catch (error: any) {
      console.error("Erro ao aprovar usuário:", error);
      const errorMessage = error?.response?.data?.error?.message 
        || error?.message 
        || "Não foi possível aprovar o usuário.";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectUser = async (userId: number) => {
    setRejectingId(userId);
    try {
      await userApprovalService.rejectUser(userId);
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      toast({
        title: "Usuário rejeitado",
        description: "O usuário foi rejeitado e não poderá fazer login."
      });
    } catch (error: any) {
      console.error("Erro ao rejeitar usuário:", error);
      const errorMessage = error?.response?.data?.error?.message 
        || error?.message 
        || "Não foi possível rejeitar o usuário.";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setRejectingId(null);
    }
  };

  const getStatusBadge = (status: InviteStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-300"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="text-green-600 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Aceito</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-red-600 border-red-300"><XCircle className="w-3 h-3 mr-1" />Expirado</Badge>;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Single API call to get areas with their roles
        const data = await areaService.getAreasWithRoles();
        setAreasWithRoles(data);
        
        // Load invites and pending users
        loadInvites();
        loadPendingUsers();
      } catch (error) {
        console.error("Erro ao carregar áreas e funções:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar áreas e funções.",
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, []);


  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Convites</h1>
          <p className="text-muted-foreground">Gerencie os convites para membros da igreja</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-echurch-500 to-echurch-600 hover:from-echurch-600 hover:to-echurch-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Convite
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Enviar Convite</DialogTitle>
              <p className="text-muted-foreground">Ao enviar um convite o membro é automaticamente aprovado</p>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newInvite.email}
                  onChange={(e) => setNewInvite(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="area">Áreas * (pode selecionar múltiplas)</Label>
                <div className="border rounded-md p-2 min-h-[40px]">
                  {newInvite.area_ids.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {newInvite.area_ids.map(areaId => {
                        const area = areasWithRoles.find(a => a.id.toString() === areaId);
                        return (
                          <Badge key={areaId} variant="secondary" className="flex items-center gap-1">
                            {area?.name}
                            <button
                              onClick={() => setNewInvite(prev => ({
                                ...prev,
                                area_ids: prev.area_ids.filter(id => id !== areaId)
                              }))}
                              className="ml-1 hover:text-red-600"
                            >
                              ×
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Nenhuma área selecionada</span>
                  )}
                </div>
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value && !newInvite.area_ids.includes(value)) {
                      setNewInvite((prev) => ({
                        ...prev,
                        area_ids: [...prev.area_ids, value],
                      }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Adicionar área" />
                  </SelectTrigger>
                  <SelectContent>
                    {areasWithRoles.filter(a => !newInvite.area_ids.includes(a.id.toString())).map(area => (
                      <SelectItem key={area.id} value={area.id.toString()}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {newInvite.area_ids.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="roles">Funções * (pode selecionar múltiplas)</Label>
                  <div className="border rounded-md p-2 min-h-[40px]">
                    {newInvite.role_ids.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {newInvite.role_ids.map(roleId => {
                          const role = areasWithRoles
                            .flatMap(a => a.roles)
                            .find(r => r.id.toString() === roleId);
                          return (
                            <Badge key={roleId} variant="secondary" className="flex items-center gap-1">
                              {role?.name}
                              <button
                                onClick={() => setNewInvite(prev => ({
                                  ...prev,
                                  role_ids: prev.role_ids.filter(id => id !== roleId)
                                }))}
                                className="ml-1 hover:text-red-600"
                              >
                                ×
                              </button>
                            </Badge>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Nenhuma função selecionada</span>
                    )}
                  </div>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value && !newInvite.role_ids.includes(value)) {
                        setNewInvite((prev) => ({
                          ...prev,
                          role_ids: [...prev.role_ids, value],
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Adicionar função" />
                    </SelectTrigger>
                    <SelectContent>
                      {areasWithRoles
                        .filter(area => newInvite.area_ids.includes(area.id.toString()))
                        .flatMap(area => area.roles)
                        .filter(role => !newInvite.role_ids.includes(role.id.toString()))
                        .map(role => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}


              
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem (opcional)</Label>
                <Textarea
                  id="message"
                  value={newInvite.message}
                  onChange={(e) => setNewInvite(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Mensagem personalizada para o convite"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1" disabled={isSending}>
                  Cancelar
                </Button>
                <Button onClick={handleSendInvite} className="flex-1 bg-gradient-to-r from-echurch-500 to-echurch-600" disabled={isSending}>
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Convites por Email</TabsTrigger>
          <TabsTrigger value="pendentes">Aprovação de Usuários</TabsTrigger>
        </TabsList>

        {/* Convites por Email */}
        <TabsContent value="email">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Convites Enviados ({invites.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 mx-auto text-echurch-500 mb-4 animate-spin" />
                    <p className="text-muted-foreground">Carregando convites...</p>
                  </div>
                ) : invites.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum convite enviado ainda</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invites.map((invite, index) => (
                      <div key={invite.id}>
                        <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium">{invite.email}</h3>
                              {getStatusBadge(invite.status)}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {invite.areas && invite.areas.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-muted-foreground">Áreas:</span>
                                  {invite.areas.map(area => (
                                    <Badge key={area.id} variant="secondary" className="text-xs">
                                      {area.name}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {invite.roles && invite.roles.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-muted-foreground">Funções:</span>
                                  {invite.roles.map(role => (
                                    <Badge key={role.id} variant="outline" className="text-xs">
                                      {role.name}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Expira em {new Date(invite.expires_at).toLocaleDateString('pt-BR')}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {invite.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResendInvite(invite.id)}
                                disabled={resendingId === invite.id}
                              >
                                {resendingId === invite.id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    Enviando...
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-4 h-4 mr-1" />
                                    Reenviar
                                  </>
                                )}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyInviteLink(invite.token || '')}
                              title="Copiar link do convite"
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Link
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteInvite(invite.id, invite.status)}
                              disabled={invite.status === 'accepted'}
                              className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={invite.status === 'accepted' ? 'Não é possível deletar convites aceitos' : 'Deletar convite'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {index < invites.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Usuários Pendentes */}
        <TabsContent value="pendentes">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Usuários Pendentes ({pendingUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingPending ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 mx-auto text-echurch-500 mb-4 animate-spin" />
                    <p className="text-muted-foreground">Carregando usuários...</p>
                  </div>
                ) : pendingUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <UserCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum usuário pendente de aprovação</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers.map((user, index) => (
                      <div key={user.id}>
                        <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium">{user.name}</h3>
                              {user.status === 'R' ? (
                                <Badge variant="outline" className="text-red-600 border-red-300">
                                  <UserX className="w-3 h-3 mr-1" />
                                  Rejeitado
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-blue-600 border-blue-300">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Aguardando
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                            
                            {/* Display Areas */}
                            {user.areas && user.areas.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                <span className="text-xs text-muted-foreground">Áreas:</span>
                                {user.areas.map(userArea => (
                                  <Badge key={userArea.id} variant="secondary" className="text-xs">
                                    {userArea.area.name}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            {/* Display Roles */}
                            {user.roles && user.roles.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                <span className="text-xs text-muted-foreground">Funções:</span>
                                {user.roles.map(role => (
                                  <Badge key={role.id} variant="outline" className="text-xs">
                                    {role.name}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            <p className="text-xs text-muted-foreground">
                              Solicitado em {new Date(user.created_at).toLocaleDateString("pt-BR")}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveUser(user.id)}
                              disabled={approvingId === user.id || rejectingId === user.id}
                              className="bg-gradient-to-r from-echurch-500 to-echurch-600 hover:from-echurch-600 hover:to-echurch-700 text-white"
                            >
                              {approvingId === user.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  Aprovando...
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-1" />
                                  {user.status === 'I' ? 'Reativar' : 'Aprovar'}
                                </>
                              )}
                            </Button>
                            
                            {user.status === 'WA' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRejectUser(user.id)}
                                disabled={approvingId === user.id || rejectingId === user.id}
                                className="border-red-500 text-red-600 hover:bg-red-50"
                              >
                                {rejectingId === user.id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    Rejeitando...
                                  </>
                                ) : (
                                  <>
                                    <UserX className="w-4 h-4 mr-1" />
                                    Rejeitar
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                        {index < pendingUsers.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>


      {/* <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Convites Enviados ({invites.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invites.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum convite enviado ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {invites.map((invite, index) => (
                  <div key={invite.id}>
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{invite.name}</h3>
                          {getStatusBadge(invite.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{invite.email}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{invite.area} - {invite.role}</span>
                          <span>Enviado em {new Date(invite.sentAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        {invite.message && (
                          <p className="text-sm text-muted-foreground mt-2 italic">"{invite.message}"</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {invite.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResendInvite(invite.id)}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Reenviar
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(`Convite: ${invite.name} - ${invite.email}`)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteInvite(invite.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {index < invites.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}