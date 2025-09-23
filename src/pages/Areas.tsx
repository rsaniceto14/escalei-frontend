import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Settings, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { areaService, Area } from "@/api";
import { useAuth } from "@/context/AuthContext";

export default function Areas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [newArea, setNewArea] = useState({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  // Check if user has any area permissions
  const hasAreaPermissions = user?.permissions && (
    user.permissions.create_area ||
    user.permissions.read_area ||
    user.permissions.update_area ||
    user.permissions.delete_area
  );

  // Check if user has permission to create areas
  const canCreateArea = user?.permissions?.create_area || false;
  const canUpdateArea = user?.permissions?.update_area || false;
  const canDeleteArea = user?.permissions?.delete_area || false;

  // Redirect if user doesn't have any area permissions
  if (user && !hasAreaPermissions) {
    return <Navigate to="/home" replace />;
  }

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

  const handleSaveArea = async () => {
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
        // Create new area
        const createdArea = await areaService.create(newArea);
        setAreas(prev => [...prev, createdArea]);
        toast({
          title: "Área criada!",
          description: `A área ${newArea.name} foi criada.`,
        });
      }

      setNewArea({ name: '', description: '' });
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
    setIsAreaDialogOpen(true);
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
    setEditingArea(null);
    setIsAreaDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Carregando áreas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-echurch-700">Áreas de Ministério</h1>
          <p className="text-gray-600 mt-2">
            Gerencie as áreas de ministério da sua igreja
          </p>
        </div>
        
        <div className="flex gap-2">
          {(canCreateArea || !user?.permissions) && (
            <Dialog open={isAreaDialogOpen} onOpenChange={setIsAreaDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-echurch-500 hover:bg-echurch-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Área
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
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
          )}
        </div>
      </div>

      {areas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nenhuma área encontrada
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {(canCreateArea || !user?.permissions)
                ? "Comece criando sua primeira área de ministério."
                : "Você não tem permissão para criar áreas."
              }
            </p>
            {(canCreateArea || !user?.permissions) && (
              <Button 
                onClick={() => setIsAreaDialogOpen(true)}
                className="bg-echurch-500 hover:bg-echurch-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Área
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    {(canUpdateArea || !user?.permissions) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditArea(area)}
                        className="h-8 w-8 p-0"
                        title="Editar área"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {(canDeleteArea || !user?.permissions) && (
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
                    )}
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
    </div>
  );
}