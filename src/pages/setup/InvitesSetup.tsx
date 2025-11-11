import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/common/Logo";
import { ArrowLeft, ArrowRight, Plus, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { inviteService, areaService } from "@/api";
import { AreaWithRoles } from "@/api/services/areaService";
import { useAuth } from "@/context/AuthContext";

export default function InvitesSetup() {
  const { toast } = useToast();
  const { token } = useAuth();
  const [areasWithRoles, setAreasWithRoles] = useState<AreaWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const [newInvite, setNewInvite] = useState({
    email: '',
    area_ids: [] as number[],
    role_ids: [] as number[],
    message: ''
  });

  useEffect(() => {
    if (token) {
      loadAreasWithRoles();
    }
  }, [token]);

  const loadAreasWithRoles = async () => {
    if (!token) {
      toast({
        title: "Não autenticado",
        description: "Você precisa estar logado para carregar áreas.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await areaService.getAreasWithRoles();
      setAreasWithRoles(data);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar áreas e funções.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvite = async () => {
    if (!token) {
      toast({
        title: "Não autenticado",
        description: "Você precisa estar logado para enviar convites.",
        variant: "destructive"
      });
      return;
    }

    if (!newInvite.email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, informe o email do convidado.",
        variant: "destructive"
      });
      return;
    }

    if (newInvite.area_ids.length === 0) {
      toast({
        title: "Áreas obrigatórias",
        description: "Selecione pelo menos uma área.",
        variant: "destructive"
      });
      return;
    }

    if (newInvite.role_ids.length === 0) {
      toast({
        title: "Funções obrigatórias",
        description: "Selecione pelo menos uma função.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    try {
      await inviteService.sendInvite({
        email: newInvite.email,
        area_ids: newInvite.area_ids,
        role_ids: newInvite.role_ids,
      });

      toast({
        title: "Convite enviado!",
        description: `Convite enviado para ${newInvite.email}`,
      });

      // Clear form for next invite
      setNewInvite({
        email: "",
        area_ids: [],
        role_ids: [],
        message: "",
      });
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

  const toggleArea = (areaId: number) => {
    setNewInvite(prev => {
      const areaIds = prev.area_ids.includes(areaId)
        ? prev.area_ids.filter(id => id !== areaId)
        : [...prev.area_ids, areaId];
      
      // Remove roles from areas that were deselected
      const selectedAreas = areasWithRoles.filter(a => areaIds.includes(a.id));
      const availableRoleIds = selectedAreas.flatMap(a => a.roles.map(r => r.id));
      const roleIds = prev.role_ids.filter(id => availableRoleIds.includes(id));
      
      return {
        ...prev,
        area_ids: areaIds,
        role_ids: roleIds
      };
    });
  };

  const toggleRole = (roleId: number) => {
    setNewInvite(prev => {
      const roleIds = prev.role_ids.includes(roleId)
        ? prev.role_ids.filter(id => id !== roleId)
        : [...prev.role_ids, roleId];
      
      return {
        ...prev,
        role_ids: roleIds
      };
    });
  };

  const getSelectedAreas = () => {
    return areasWithRoles.filter(a => newInvite.area_ids.includes(a.id));
  };

  const getAvailableRoles = () => {
    const selectedAreas = getSelectedAreas();
    return selectedAreas.flatMap(area => 
      area.roles.map(role => ({ ...role, areaName: area.name }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-echurch-50 via-background to-echurch-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h2 className="text-2xl font-bold text-echurch-700">Enviar Convites</h2>
          <p className="text-muted-foreground">Convide membros para sua igreja</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Carregando áreas e funções...</span>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Você pode visualizar e gerenciar todos os seus convites na página de Convites após finalizar a configuração.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email do Convidado *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newInvite.email}
                    onChange={(e) => setNewInvite(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                    disabled={isSending}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Áreas * (selecione uma ou mais)</Label>
                  <div className="border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
                    {areasWithRoles.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma área disponível. Configure áreas primeiro.
                      </p>
                    ) : (
                      areasWithRoles.map((area) => (
                        <div key={area.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`area-${area.id}`}
                            checked={newInvite.area_ids.includes(area.id)}
                            onChange={() => toggleArea(area.id)}
                            disabled={isSending}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={`area-${area.id}`} className="text-sm font-medium cursor-pointer">
                            {area.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Funções * (selecione uma ou mais)</Label>
                  <div className="border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
                    {getSelectedAreas().length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Selecione áreas primeiro para ver as funções disponíveis.
                      </p>
                    ) : getAvailableRoles().length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        As áreas selecionadas não possuem funções configuradas.
                      </p>
                    ) : (
                      getAvailableRoles().map((role) => (
                        <div key={role.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`role-${role.id}`}
                            checked={newInvite.role_ids.includes(role.id)}
                            onChange={() => toggleRole(role.id)}
                            disabled={isSending}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={`role-${role.id}`} className="text-sm cursor-pointer">
                            <span className="font-medium">{role.name}</span>
                            <span className="text-muted-foreground ml-1">({role.areaName})</span>
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem (opcional)</Label>
                  <Textarea
                    id="message"
                    value={newInvite.message}
                    onChange={(e) => setNewInvite(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Mensagem personalizada para o convite..."
                    rows={3}
                    disabled={isSending}
                  />
                </div>

                <Button
                  onClick={handleSendInvite}
                  className="w-full bg-gradient-to-r from-echurch-500 to-echurch-600 hover:from-echurch-600 hover:to-echurch-700"
                  disabled={isSending || !newInvite.email.trim() || newInvite.area_ids.length === 0 || newInvite.role_ids.length === 0}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Enviar Convite
                    </>
                  )}
                </Button>

                {newInvite.email && (newInvite.area_ids.length > 0 || newInvite.role_ids.length > 0) && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Após enviar, você pode enviar outro convite preenchendo o formulário novamente.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex gap-4 pt-6 border-t">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/setup/areas">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
            </Button>
            
            <Button asChild className="flex-1 bg-gradient-to-r from-echurch-500 to-echurch-600">
              <Link to="/church-setup">
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
