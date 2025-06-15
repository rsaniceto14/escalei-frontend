
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function Settings() {
  const [usuario, setUsuario] = useState({
    nome: "Maria Oliveira",
    email: "demo@e-church.com",
    telefone: "(11) 99999-9999",
    area: "Louvor",
    instrumento: "Voz",
    notificacoes: true,
    emailNotificacoes: true
  });

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  const handlePasswordChange = () => {
    toast.success("Senha alterada com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-echurch-700">Configurações</h1>
        <p className="text-echurch-600 mt-1">Gerencie suas informações e preferências</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize suas informações básicas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={usuario.nome}
                    onChange={(e) => setUsuario({...usuario, nome: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={usuario.email}
                    onChange={(e) => setUsuario({...usuario, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={usuario.telefone}
                    onChange={(e) => setUsuario({...usuario, telefone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Área de Atuação</Label>
                  <Select value={usuario.area} onValueChange={(value) => setUsuario({...usuario, area: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Louvor">Louvor</SelectItem>
                      <SelectItem value="Diácono">Diácono</SelectItem>
                      <SelectItem value="Som">Som</SelectItem>
                      <SelectItem value="Multimedia">Multimídia</SelectItem>
                      <SelectItem value="Infantil">Infantil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instrumento">Instrumento/Função</Label>
                  <Input
                    id="instrumento"
                    value={usuario.instrumento}
                    onChange={(e) => setUsuario({...usuario, instrumento: e.target.value})}
                    placeholder="Ex: Voz, Guitarra, Bateria..."
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="bg-echurch-500 hover:bg-echurch-600">
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>Mantenha sua conta segura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button onClick={handlePasswordChange} className="bg-echurch-500 hover:bg-echurch-600">
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>Configure como deseja receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações no navegador
                  </p>
                </div>
                <Switch
                  checked={usuario.notificacoes}
                  onCheckedChange={(checked) => setUsuario({...usuario, notificacoes: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba lembretes e atualizações por email
                  </p>
                </div>
                <Switch
                  checked={usuario.emailNotificacoes}
                  onCheckedChange={(checked) => setUsuario({...usuario, emailNotificacoes: checked})}
                />
              </div>
              <Button onClick={handleSave} className="bg-echurch-500 hover:bg-echurch-600">
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
