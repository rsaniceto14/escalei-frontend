
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, Settings, Users, Shield, Eye, Edit, 
  UserPlus, MapPin, Calendar 
} from "lucide-react";

export default function Admin() {
  const [novaArea, setNovaArea] = useState("");
  const [showNovaAreaDialog, setShowNovaAreaDialog] = useState(false);

  const areas = [
    { id: 1, nome: "Louvor", membros: 15, responsavel: "Maria Santos" },
    { id: 2, nome: "Diáconos", membros: 12, responsavel: "João Silva" },
    { id: 3, nome: "Recepção", membros: 8, responsavel: "Ana Costa" },
    { id: 4, nome: "Som", membros: 6, responsavel: "Carlos Lima" },
  ];

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

  const adicionarArea = () => {
    if (novaArea.trim()) {
      // Aqui adicionaria a nova área
      setNovaArea("");
      setShowNovaAreaDialog(false);
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
                    <Button onClick={adicionarArea} className="flex-1 bg-echurch-500 hover:bg-echurch-600">
                      Criar Área
                    </Button>
                    <Button variant="outline" onClick={() => setShowNovaAreaDialog(false)} className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.map(area => (
              <Card key={area.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg text-echurch-700">{area.nome}</span>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-echurch-600">
                    <Users className="w-4 h-4" />
                    <span>{area.membros} membros</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-echurch-600">Responsável: </span>
                    <span className="font-medium">{area.responsavel}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Membros
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <UserPlus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
