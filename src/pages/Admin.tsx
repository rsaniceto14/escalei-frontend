
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, Settings, Users, Shield, Eye, Edit, 
  UserPlus, MapPin, Calendar, Loader2
} from "lucide-react";
import { areaService, Area } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export default function Admin() {
  const [novaArea, setNovaArea] = useState("");
  const [showNovaAreaDialog, setShowNovaAreaDialog] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  // Check if user has permission to create areas
  const canCreateArea = user?.permissions?.create_area || false;

  // Load areas on component mount
  useEffect(() => {
    loadAreas();
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

  const usuarios = [
    { 
      id: 1, 
      nome: "Maria Santos", 
      email: "maria@email.com", 
      area: "Louvor", 
      role: "Líder",
      status: "Ativo",
      ultimoAcesso: "Hoje"
    },
    { 
      id: 2, 
      nome: "João Silva", 
      email: "joao@email.com", 
      area: "Diáconos", 
      role: "Membro",
      status: "Ativo",
      ultimoAcesso: "Ontem"
    },
    { 
      id: 3, 
      nome: "Ana Costa", 
      email: "ana@email.com", 
      area: "Recepção", 
      role: "Líder",
      status: "Inativo",
      ultimoAcesso: "3 dias"
    },
  ];

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Líder": return "bg-purple-100 text-purple-800";
      case "Admin": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Ativo" 
      ? "bg-green-100 text-green-800" 
      : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-echurch-700">Administração</h1>
          <p className="text-echurch-600">Gerencie áreas e usuários</p>
        </div>
        <Badge className="bg-red-100 text-red-800">
          <Shield className="w-3 h-3 mr-1" />
          Administrador
        </Badge>
      </div>

      <Tabs defaultValue="areas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="areas">Áreas</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="areas" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-echurch-700">Áreas de Ministério</h2>
            {canCreateArea && (
              <Dialog open={showNovaAreaDialog} onOpenChange={setShowNovaAreaDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-echurch-500 hover:bg-echurch-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Área
                  </Button>
                </DialogTrigger>
                <DialogContent>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {areas.map(area => (
                <Card key={area.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg text-echurch-700">{area.name}</span>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {area.description && (
                      <div className="text-sm text-gray-600">
                        {area.description}
                      </div>
                    )}
                    {!area.description && (
                      <div className="text-sm text-gray-400 italic">
                        Nenhuma descrição fornecida
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalhes
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <UserPlus className="w-4 h-4 mr-1" />
                        Gerenciar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-echurch-700">Usuários do Sistema</h2>
            <Button className="bg-echurch-500 hover:bg-echurch-600">
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </div>

          <div className="space-y-4">
            {usuarios.map(usuario => (
              <Card key={usuario.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-echurch-200 text-echurch-700">
                          {usuario.nome.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-echurch-700">{usuario.nome}</h3>
                        <p className="text-sm text-echurch-600">{usuario.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRoleColor(usuario.role)}>
                            {usuario.role}
                          </Badge>
                          <Badge className={getStatusColor(usuario.status)}>
                            {usuario.status}
                          </Badge>
                          <span className="text-xs text-echurch-500">Área: {usuario.area}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-echurch-500">Último acesso: {usuario.ultimoAcesso}</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
