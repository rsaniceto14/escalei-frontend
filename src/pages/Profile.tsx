
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Shield, Mail, Phone, MapPin, Edit } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  // Simulação de dados mockados
  const [usuario, setUsuario] = useState({
    nome: "Maria Oliveira",
    email: "demo@e-church.com",
    telefone: "(11) 99999-9999",
    area: "Louvor",
    instrumento: "Voz",
    isAdmin: false,
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
  });

  const [permissoes, setPermissoes] = useState({
    criarEscala: true,
    editarDisponibilidade: true,
    gerenciarMusicas: false,
    aprovarEscalas: false,
    gerenciarUsuarios: false,
    acessarRelatorios: false
  });

  const handlePermissaoChange = (permissao: keyof typeof permissoes, valor: boolean) => {
    if (!usuario.isAdmin) {
      toast.error("Apenas administradores podem alterar permissões");
      return;
    }
    setPermissoes(prev => ({ ...prev, [permissao]: valor }));
    toast.success("Permissão atualizada");
  };

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
                    <AvatarImage src={usuario.foto} alt={usuario.nome} />
                    <AvatarFallback>{usuario.nome.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Trocar Foto
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-echurch-600">Nome Completo</Label>
                      <div className="p-2 bg-echurch-50 rounded border text-echurch-800">{usuario.nome}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-echurch-600">Área de Atuação</Label>
                      <Badge className="bg-echurch-500 text-white">{usuario.area}</Badge>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-echurch-600 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <div className="p-2 bg-echurch-50 rounded border text-echurch-800">{usuario.email}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-echurch-600 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        Telefone
                      </Label>
                      <div className="p-2 bg-echurch-50 rounded border text-echurch-800">{usuario.telefone}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-echurch-600">Instrumento/Função</Label>
                      <div className="p-2 bg-echurch-50 rounded border text-echurch-800">{usuario.instrumento}</div>
                    </div>
                  </div>
                  
                  <Button className="bg-echurch-500 hover:bg-echurch-600">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Informações
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Permissões do Sistema
              </CardTitle>
              <CardDescription>
                {usuario.isAdmin ? "Você pode alterar as permissões abaixo" : "Permissões controladas pelo administrador"}
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
                    checked={permissoes.criarEscala}
                    onCheckedChange={(checked) => handlePermissaoChange('criarEscala', checked)}
                    disabled={!usuario.isAdmin}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-echurch-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Editar Disponibilidade</Label>
                    <p className="text-sm text-echurch-600">Permite alterar sua disponibilidade</p>
                  </div>
                  <Switch
                    checked={permissoes.editarDisponibilidade}
                    onCheckedChange={(checked) => handlePermissaoChange('editarDisponibilidade', checked)}
                    disabled={!usuario.isAdmin}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-echurch-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Gerenciar Músicas</Label>
                    <p className="text-sm text-echurch-600">Permite adicionar e editar músicas</p>
                  </div>
                  <Switch
                    checked={permissoes.gerenciarMusicas}
                    onCheckedChange={(checked) => handlePermissaoChange('gerenciarMusicas', checked)}
                    disabled={!usuario.isAdmin}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-echurch-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Aprovar Escalas</Label>
                    <p className="text-sm text-echurch-600">Permite aprovar escalas criadas</p>
                  </div>
                  <Switch
                    checked={permissoes.aprovarEscalas}
                    onCheckedChange={(checked) => handlePermissaoChange('aprovarEscalas', checked)}
                    disabled={!usuario.isAdmin}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-echurch-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Gerenciar Usuários</Label>
                    <p className="text-sm text-echurch-600">Permite gerenciar outros usuários</p>
                  </div>
                  <Switch
                    checked={permissoes.gerenciarUsuarios}
                    onCheckedChange={(checked) => handlePermissaoChange('gerenciarUsuarios', checked)}
                    disabled={!usuario.isAdmin}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-echurch-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Acessar Relatórios</Label>
                    <p className="text-sm text-echurch-600">Permite visualizar relatórios do sistema</p>
                  </div>
                  <Switch
                    checked={permissoes.acessarRelatorios}
                    onCheckedChange={(checked) => handlePermissaoChange('acessarRelatorios', checked)}
                    disabled={!usuario.isAdmin}
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
                <Badge variant={usuario.isAdmin ? "default" : "secondary"}>
                  {usuario.isAdmin ? "Administrador" : "Usuário"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status:</span>
                <Badge className="bg-green-500 text-white">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Último acesso:</span>
                <span className="text-sm text-echurch-600">Hoje</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Escalas este mês:</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Faltas:</span>
                <span className="font-medium text-green-600">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Participação:</span>
                <span className="font-medium text-echurch-600">100%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
