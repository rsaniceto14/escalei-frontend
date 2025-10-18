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
import { Mail, Plus, Users, Send, Copy, Trash2, Clock, CheckCircle, XCircle, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { inviteService } from "@/api/services/inviteService";
import { useEffect } from "react";
import { areaService } from "@/api/services/areaService";
import { roleService } from "@/api/services/roleService";
import { useRef } from "react";

interface Invite {
  id: string;
  email: string;
  name: string;
  area: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired';
  sentAt: string;
  message?: string;
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
  const [invites, setInvites] = useState<Invite[]>([
    {
      id: '1',
      email: 'joao@email.com',
      name: 'João Silva',
      area: 'Louvor',
      role: 'Músico',
      status: 'pending',
      sentAt: '2024-01-15',
      message: 'Bem-vindo ao ministério de louvor!'
    },
    {
      id: '2',
      email: 'maria@email.com',
      name: 'Maria Santos',
      area: 'Mídia',
      role: 'Operador',
      status: 'accepted',
      sentAt: '2024-01-10'
    }
  ]);

  interface PendingUser {
    id: string;
    name: string;
    email: string;
    area: string;
    role: string;
    requestedAt: string;
  }

  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([
    {
      id: '101',
      name: 'Carlos Pereira',
      email: 'carlos@email.com',
      area: 'Recepção',
      role: 'Recepcionista',
      requestedAt: '2024-01-20'
    }
  ]);

  const rolesDropdownRef = useRef<HTMLDivElement | null>(null);
  const [showRolesDropdown, setShowRolesDropdown] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({
    email: '',
    name: '',
    area: '',
    role_ids: [] as string[],
    message: ''
  });


  const { toast } = useToast();

  const handleSendInvite = async () => {
    if (!newInvite.email || !newInvite.name || !newInvite.area || newInvite.role_ids.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
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

    try {
      await inviteService.sendInvite({
        email: newInvite.email,
        name: newInvite.name,
        area_id: Number(newInvite.area),
        role_ids: newInvite.role_ids.map(id => Number(id)),
        message: newInvite.message,
      });



      toast({
        title: "Convite enviado!",
        description: `Convite enviado para ${newInvite.name}`,
      });

      setNewInvite({
        email: "",
        name: "",
        area: "",
        role_ids: [],
        message: "",
      });

      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao enviar o convite.",
        variant: "destructive"
      });
    }
  };


  const handleResendInvite = (inviteId: string) => {
    setInvites(prev => prev.map(invite => 
      invite.id === inviteId 
        ? { ...invite, sentAt: new Date().toISOString().split('T')[0] }
        : invite
    ));

    toast({
      title: "Convite reenviado!",
      description: "O convite foi enviado novamente.",
    });
  };

  const handleDeleteInvite = (inviteId: string) => {
    setInvites(prev => prev.filter(invite => invite.id !== inviteId));
    
    toast({
      title: "Convite removido",
      description: "O convite foi removido com sucesso.",
    });
  };

  const handleApproveUser = (userId: string) => {
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
    toast({
      title: "Usuário aprovado!",
      description: "O usuário foi aprovado para participar da área."
    });
  };

  const handleRejectUser = (userId: string) => {
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
    toast({
      title: "Usuário rejeitado",
      description: "O usuário foi rejeitado e não fará parte da área."
    });
  };

  const getStatusBadge = (status: Invite['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-300"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="text-green-600 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Aceito</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-red-600 border-red-300"><XCircle className="w-3 h-3 mr-1" />Expirado</Badge>;
    }
  };

  const getApprovalStatusBadge = (status: PendingApproval['status']) => {
    switch (status) {
      case 'awaiting':
        return <Badge variant="outline" className="text-blue-600 border-blue-300"><Clock className="w-3 h-3 mr-1" />Aguardando</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-300"><UserCheck className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-300"><UserX className="w-3 h-3 mr-1" />Rejeitado</Badge>;
    }
  };

  const [areas, setAreas] = useState<{ id: number; name: string }[]>([]);
  const [roles, setRoles] = useState<{ id: number; name: string; area_id?: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areasData, rolesData] = await Promise.all([
          areaService.getAll(),
          roleService.getAll(),
        ]);

        // converte id de string → number
        const formattedAreas = areasData.map(area => ({
          ...area,
          id: Number(area.id),
        }));

        const formattedRoles = rolesData.map(role => ({
          ...role,
          id: Number(role.id),
          area_id: role.area_id ? Number(role.area_id) : undefined,
        }));

        setAreas(formattedAreas);
        setRoles(formattedRoles);
      } catch (error) {
        console.error("Erro ao carregar áreas e funções:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        rolesDropdownRef.current &&
        !rolesDropdownRef.current.contains(event.target as Node)
      ) {
        setShowRolesDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={newInvite.name}
                  onChange={(e) => setNewInvite(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do membro"
                />
              </div>
              
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
                <Label htmlFor="area">Área *</Label>
                <Select
                  value={newInvite.area}
                  onValueChange={(value) => {
                    setNewInvite((prev) => ({
                      ...prev,
                      area: value,
                      role_ids: [],
                    }));
                    setShowRolesDropdown(false);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a área" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map(area => (
                      <SelectItem key={area.id} value={area.id.toString()}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {newInvite.area && (
                <div className="space-y-2" ref={rolesDropdownRef}>
                  <Label htmlFor="roles">Funções *</Label>
                  <div className="relative">
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                      onMouseDown={(e) => {
                        e.preventDefault(); // evita perder foco
                        e.stopPropagation();
                        setShowRolesDropdown((prev) => !prev);
                      }}
                    >
                      {newInvite.role_ids?.length
                        ? roles
                            .filter((r) => newInvite.role_ids.includes(r.id.toString()))
                            .map((r) => r.name)
                            .join(", ")
                        : "Selecione uma ou mais funções"}

                      <span className="ml-2 text-muted-foreground">▾</span>
                    </Button>


                    {showRolesDropdown && (
                      <div
                        className="absolute z-10 mt-2 w-full rounded-md border bg-popover shadow-lg p-2 max-h-60 overflow-y-auto"
                      >
                        {roles
                          .filter((role) => role.area_id?.toString() === newInvite.area)
                          .map((role) => {
                            const isSelected = newInvite.role_ids?.includes(role.id.toString());
                            return (
                              <div
                                key={role.id}
                                onClick={() => {
                                  setNewInvite((prev) => {
                                    const selected = prev.role_ids || [];
                                    if (selected.includes(role.id.toString())) {
                                      return {
                                        ...prev,
                                        role_ids: selected.filter((id) => id !== role.id.toString()),
                                      };
                                    } else {
                                      return {
                                        ...prev,
                                        role_ids: [...selected, role.id.toString()],
                                      };
                                    }
                                  });
                                }}
                                className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-echurch-50 ${
                                  isSelected ? "bg-echurch-50" : ""
                                }`}
                              >
                                <span>{role.name}</span>
                                {isSelected && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4 text-echurch-600"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
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
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleSendInvite} className="flex-1 bg-gradient-to-r from-echurch-500 to-echurch-600">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar
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
                {pendingUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum usuário pendente de aprovação</p>
                  </div>
                ) : (
                  pendingUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border bg-card mb-3">
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">{user.area} - {user.role}</p>
                        <p className="text-xs text-muted-foreground">
                          Solicitado em {new Date(user.requestedAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {/* Approve User */}
                        <Button size="sm" onClick={() => handleApproveUser(user.id)} className="bg-gradient-to-r from-echurch-500 to-echurch-600 hover:from-echurch-600 hover:to-echurch-700 text-white"> Aprovar</Button>
                        {/* Repprove User */}
                        <Button size="sm" variant="outline" onClick={() => handleRejectUser(user.id)} className="border-echurch-500 text-echurch-600 hover:bg-echurch-50"> Rejeitar</Button>
                      </div>

                    </div>
                  ))
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