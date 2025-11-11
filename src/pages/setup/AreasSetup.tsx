import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Logo } from "@/components/common/Logo";
import { ArrowLeft, ArrowRight, Plus, Edit, Trash2, Settings, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { areaService, Area } from "@/api";
import { useAuth } from "@/context/AuthContext";

export default function AreasSetup() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [newArea, setNewArea] = useState({
    name: '',
    description: '',
  });
  const [roles, setRoles] = useState<Array<{ name: string; description: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { token } = useAuth();

  const handleSaveArea = async () => {
    if (!token) {
      toast({
        title: "Não autenticado",
        description: "Você precisa estar logado para criar áreas.",
        variant: "destructive"
      });
      return;
    }
    if (!newArea.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "O nome da área é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingArea) {
        // Update existing area
        const updatedArea = await areaService.update(parseInt(editingArea.id), newArea);
        setAreas(prev => prev.map(area => 
          area.id === editingArea.id ? updatedArea : area
        ));
        toast({
          title: "Área atualizada!",
          description: `A área ${newArea.name} foi atualizada.`,
        });
      } else {
        // Create new area with roles
        const areaData = {
          ...newArea,
          roles: roles.length > 0 ? roles : undefined,
        };
        const createdArea = await areaService.create(areaData);
        setAreas(prev => [...prev, createdArea]);
        toast({
          title: "Área criada!",
          description: `A área ${newArea.name} foi criada${roles.length > 0 ? ` com ${roles.length} função(ões)` : ''}.`,
        });
      }

      setNewArea({ name: '', description: '' });
      setRoles([]);
      setEditingArea(null);
      setIsAreaDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar a área",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditArea = (area: Area) => {
    setEditingArea(area);
    setNewArea({
      name: area.name,
      description: area.description || '',
    });
    setRoles([]);
    setIsAreaDialogOpen(true);
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

  const handleDeleteArea = async (areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    try {
      await areaService.delete(parseInt(areaId));
      setAreas(prev => prev.filter(area => area.id !== areaId));
      toast({
        title: "Área removida",
        description: `A área ${area?.name} foi removida.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível remover a área",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setNewArea({ name: '', description: '' });
    setRoles([]);
    setEditingArea(null);
    setIsAreaDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-echurch-50 via-background to-echurch-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h2 className="text-2xl font-bold text-echurch-700">Configurar Áreas de Ministério</h2>
          <p className="text-muted-foreground">Configure as áreas de ministério da sua igreja</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-echurch-700">Áreas Configuradas</h3>
            <p className="text-sm text-muted-foreground">
                {areas.length} área{areas.length !== 1 ? 's' : ''} configurada{areas.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <Dialog open={isAreaDialogOpen} onOpenChange={setIsAreaDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-echurch-500 hover:bg-echurch-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Área
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingArea ? 'Editar Área' : 'Nova Área'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Área</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Louvor, Mídia, Recepção..."
                      value={newArea.name}
                      onChange={(e) => setNewArea(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva o propósito desta área..."
                      value={newArea.description}
                      onChange={(e) => setNewArea(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  
                  {!editingArea && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Funções (opcional)</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addRole}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Adicionar Função
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
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleSaveArea} 
                      className="flex-1 bg-echurch-500 hover:bg-echurch-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editingArea ? 'Atualizar' : 'Criar'}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {areas.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Nenhuma área configurada
                </h3>
                <p className="text-gray-500 text-center mb-4">
                  Comece criando suas primeiras áreas de ministério.
                </p>
                <Button 
                  onClick={() => setIsAreaDialogOpen(true)}
                  className="bg-echurch-500 hover:bg-echurch-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Área
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {areas.map((area) => (
                <Card key={area.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-echurch-100 rounded-lg">
                          <Settings className="w-5 h-5 text-echurch-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{area.name}</CardTitle>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditArea(area)}
                          className="h-8 w-8 p-0"
                          title="Editar área"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Excluir área"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a área "{area.name}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteArea(area.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {area.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {area.description}
                      </p>
                    )}
                    {!area.description && (
                      <p className="text-gray-400 text-sm italic">
                        Nenhuma descrição fornecida
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/church-setup">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
            </Button>
            
            <Button asChild className="flex-1 bg-gradient-to-r from-echurch-500 to-echurch-600">
              <Link to="/setup/invites">
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