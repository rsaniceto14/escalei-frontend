import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Settings, Plus, Users, Edit, Trash2, Music, Mic, Shield, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Role {
  id: string;
  name: string;
  description: string;
}

interface Area {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  roles: Role[];
}

export default function Areas() {
  const [areas, setAreas] = useState<Area[]>([
    {
      id: '1',
      name: 'Louvor',
      description: 'Ministério responsável pela música e adoração',
      color: 'bg-purple-500',
      icon: 'Music',
      roles: [
        { id: '1', name: 'Cantor', description: 'Responsável pelos vocais' },
        { id: '2', name: 'Músico', description: 'Instrumentista' },
        { id: '3', name: 'Líder de Louvor', description: 'Coordena o ministério' }
      ]
    },
    {
      id: '2',
      name: 'Mídia',
      description: 'Responsável pela parte técnica e audiovisual',
      color: 'bg-blue-500',
      icon: 'Settings',
      roles: [
        { id: '4', name: 'Operador', description: 'Opera equipamentos' },
        { id: '5', name: 'Técnico', description: 'Manutenção técnica' }
      ]
    }
  ]);

  const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [selectedAreaForRole, setSelectedAreaForRole] = useState<string>('');
  const [newArea, setNewArea] = useState({
    name: '',
    description: '',
    color: 'bg-echurch-500',
    icon: 'Settings'
  });
  const [newRole, setNewRole] = useState({
    name: '',
    description: ''
  });

  const { toast } = useToast();

  const iconOptions = [
    { name: 'Music', icon: Music, label: 'Música' },
    { name: 'Mic', icon: Mic, label: 'Microfone' },
    { name: 'Settings', icon: Settings, label: 'Configurações' },
    { name: 'Shield', icon: Shield, label: 'Segurança' },
    { name: 'Users', icon: Users, label: 'Pessoas' },
    { name: 'Sparkles', icon: Sparkles, label: 'Brilho' }
  ];

  const colorOptions = [
    'bg-echurch-500',
    'bg-purple-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-pink-500',
    'bg-indigo-500'
  ];

  const handleSaveArea = () => {
    if (!newArea.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "O nome da área é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (editingArea) {
      setAreas(prev => prev.map(area => 
        area.id === editingArea.id 
          ? { ...area, ...newArea }
          : area
      ));
      toast({
        title: "Área atualizada!",
        description: `A área ${newArea.name} foi atualizada.`,
      });
    } else {
      const area: Area = {
        id: Date.now().toString(),
        ...newArea,
        roles: []
      };
      setAreas(prev => [...prev, area]);
      toast({
        title: "Área criada!",
        description: `A área ${newArea.name} foi criada.`,
      });
    }

    setNewArea({ name: '', description: '', color: 'bg-echurch-500', icon: 'Settings' });
    setEditingArea(null);
    setIsAreaDialogOpen(false);
  };

  const handleEditArea = (area: Area) => {
    setEditingArea(area);
    setNewArea({
      name: area.name,
      description: area.description,
      color: area.color,
      icon: area.icon
    });
    setIsAreaDialogOpen(true);
  };

  const handleDeleteArea = (areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    setAreas(prev => prev.filter(area => area.id !== areaId));
    toast({
      title: "Área removida",
      description: `A área ${area?.name} foi removida.`,
    });
  };

  const handleSaveRole = () => {
    if (!newRole.name.trim() || !selectedAreaForRole) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome da função e área são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const role: Role = {
      id: Date.now().toString(),
      ...newRole
    };

    setAreas(prev => prev.map(area => 
      area.id === selectedAreaForRole 
        ? { ...area, roles: [...area.roles, role] }
        : area
    ));

    setNewRole({ name: '', description: '' });
    setSelectedAreaForRole('');
    setIsRoleDialogOpen(false);

    toast({
      title: "Função criada!",
      description: `A função ${role.name} foi criada.`,
    });
  };

  const handleDeleteRole = (areaId: string, roleId: string) => {
    setAreas(prev => prev.map(area => 
      area.id === areaId 
        ? { ...area, roles: area.roles.filter(role => role.id !== roleId) }
        : area
    ));

    toast({
      title: "Função removida",
      description: "A função foi removida com sucesso.",
    });
  };

  const getIcon = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.name === iconName);
    return iconOption ? iconOption.icon : Settings;
  };

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Áreas e Funções</h1>
          <p className="text-muted-foreground">Gerencie as áreas de ministério e suas funções</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Nova Função
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Nova Função</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="area-select">Área *</Label>
                  <select
                    id="area-select"
                    value={selectedAreaForRole}
                    onChange={(e) => setSelectedAreaForRole(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md"
                  >
                    <option value="">Selecione uma área</option>
                    {areas.map(area => (
                      <option key={area.id} value={area.id}>{area.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role-name">Nome da Função *</Label>
                  <Input
                    id="role-name"
                    value={newRole.name}
                    onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Cantor, Operador, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role-description">Descrição</Label>
                  <Textarea
                    id="role-description"
                    value={newRole.description}
                    onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva as responsabilidades desta função"
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveRole} className="flex-1 bg-gradient-to-r from-echurch-500 to-echurch-600">
                    Criar Função
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAreaDialogOpen} onOpenChange={setIsAreaDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-echurch-500 to-echurch-600 hover:from-echurch-600 hover:to-echurch-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Área
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingArea ? 'Editar Área' : 'Criar Nova Área'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="area-name">Nome da Área *</Label>
                  <Input
                    id="area-name"
                    value={newArea.name}
                    onChange={(e) => setNewArea(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Louvor, Mídia, Recepção"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="area-description">Descrição</Label>
                  <Textarea
                    id="area-description"
                    value={newArea.description}
                    onChange={(e) => setNewArea(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva o propósito desta área"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Ícone</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {iconOptions.map(option => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => setNewArea(prev => ({ ...prev, icon: option.name }))}
                          className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors ${
                            newArea.icon === option.name
                              ? 'border-echurch-500 bg-echurch-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="text-xs">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Cor</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewArea(prev => ({ ...prev, color }))}
                        className={`w-10 h-10 rounded-lg border-2 ${color} ${
                          newArea.color === color
                            ? 'border-gray-800 scale-110'
                            : 'border-gray-300'
                        } transition-all`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    setIsAreaDialogOpen(false);
                    setEditingArea(null);
                    setNewArea({ name: '', description: '', color: 'bg-echurch-500', icon: 'Settings' });
                  }} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveArea} className="flex-1 bg-gradient-to-r from-echurch-500 to-echurch-600">
                    {editingArea ? 'Atualizar' : 'Criar'} Área
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6">
        {areas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Settings className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma área criada ainda</p>
            </CardContent>
          </Card>
        ) : (
          areas.map(area => {
            const IconComponent = getIcon(area.icon);
            return (
              <Card key={area.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${area.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle>{area.name}</CardTitle>
                        {area.description && (
                          <p className="text-sm text-muted-foreground">{area.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {area.roles.length} {area.roles.length === 1 ? 'função' : 'funções'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditArea(area)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover área</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover a área "{area.name}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteArea(area.id)}>
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                
                {area.roles.length > 0 && (
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">Funções:</h4>
                      <div className="space-y-2">
                        {area.roles.map((role, index) => (
                          <div key={role.id}>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                              <div>
                                <h5 className="font-medium">{role.name}</h5>
                                {role.description && (
                                  <p className="text-sm text-muted-foreground">{role.description}</p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRole(area.id, role.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            {index < area.roles.length - 1 && <Separator className="my-2" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}