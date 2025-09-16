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
import { Mail, Plus, Users, Send, Copy, Trash2, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({
    email: '',
    name: '',
    area: '',
    role: '',
    message: ''
  });

  const { toast } = useToast();

  const handleSendInvite = () => {
    if (!newInvite.email || !newInvite.name || !newInvite.area || !newInvite.role) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const invite: Invite = {
      id: Date.now().toString(),
      ...newInvite,
      status: 'pending',
      sentAt: new Date().toISOString().split('T')[0]
    };

    setInvites(prev => [invite, ...prev]);
    setNewInvite({ email: '', name: '', area: '', role: '', message: '' });
    setIsDialogOpen(false);

    toast({
      title: "Convite enviado!",
      description: `Convite enviado para ${newInvite.name}`,
    });
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

  const areas = ['Louvor', 'Mídia', 'Recepção', 'Segurança', 'Limpeza', 'Ensino'];
  const roles = {
    'Louvor': ['Cantor', 'Músico', 'Líder'],
    'Mídia': ['Operador', 'Técnico', 'Coordenador'],
    'Recepção': ['Recepcionista', 'Coordenador'],
    'Segurança': ['Segurança', 'Coordenador'],
    'Limpeza': ['Auxiliar', 'Coordenador'],
    'Ensino': ['Professor', 'Coordenador']
  };

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
                <Select value={newInvite.area} onValueChange={(value) => setNewInvite(prev => ({ ...prev, area: value, role: '' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a área" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {newInvite.area && (
                <div className="space-y-2">
                  <Label htmlFor="role">Função *</Label>
                  <Select value={newInvite.role} onValueChange={(value) => setNewInvite(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles[newInvite.area as keyof typeof roles]?.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
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
    </div>
  );
}