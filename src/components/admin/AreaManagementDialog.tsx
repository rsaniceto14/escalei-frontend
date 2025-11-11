import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { areaService } from "@/api";
import { AreaWithRoles } from "@/api/services/areaService";

interface AreaManagementDialogProps {
  area: AreaWithRoles | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  areas: AreaWithRoles[];
  onUserMoved?: () => void;
}

export function AreaManagementDialog({
  area,
  open,
  onOpenChange,
  areas,
  onUserMoved,
}: AreaManagementDialogProps) {
  const { toast } = useToast();
  const [areaUsers, setAreaUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSwitchingUser, setIsSwitchingUser] = useState<number | null>(null);

  const loadUsers = useCallback(async () => {
    if (!area) return;
    
    setIsLoadingUsers(true);
    try {
      const users = await areaService.getUsers(area.id);
      setAreaUsers(users);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar os usuários da área",
        variant: "destructive"
      });
    } finally {
      setIsLoadingUsers(false);
    }
  }, [area, toast]);

  useEffect(() => {
    if (open && area) {
      loadUsers();
    } else {
      setAreaUsers([]);
    }
  }, [open, area, loadUsers]);

  const handleSwitchUserArea = async (userId: number, newAreaId: number) => {
    if (!area) return;
    
    setIsSwitchingUser(userId);
    try {
      await areaService.switchUserArea(area.id, userId, newAreaId);
      
      // Refresh the users list
      await loadUsers();
      
      // Notify parent if callback provided
      if (onUserMoved) {
        onUserMoved();
      }
      
      toast({
        title: "Usuário movido!",
        description: "Usuário foi movido para a nova área com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível mover o usuário",
        variant: "destructive"
      });
    } finally {
      setIsSwitchingUser(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "A": return "bg-green-100 text-green-800";
      case "I": return "bg-red-100 text-red-800";
      case "WA": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!area) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Gerenciar Área: {area.name}
          </DialogTitle>
        </DialogHeader>
        
        {isLoadingUsers ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Carregando usuários...</span>
          </div>
        ) : areaUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Users className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-500 text-center">
              Nenhum usuário encontrado nesta área.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4">
              {areaUsers.map((areaUser) => (
                <Card key={areaUser.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-echurch-200 text-echurch-700">
                            {areaUser.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-echurch-700">{areaUser.name}</h3>
                          <p className="text-sm text-echurch-600">{areaUser.email}</p>
                          <Badge className={getStatusColor(areaUser.status)}>
                            {areaUser.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select 
                          onValueChange={(newAreaId) => handleSwitchUserArea(areaUser.id, parseInt(newAreaId))}
                          disabled={isSwitchingUser === areaUser.id}
                        >
                          <SelectTrigger className="w-32 sm:w-48">
                            <SelectValue placeholder="Mover..." />
                          </SelectTrigger>
                          <SelectContent>
                            {areas
                              .filter(a => a.id !== area.id)
                              .map((a) => (
                                <SelectItem key={a.id} value={a.id.toString()}>
                                  {a.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {isSwitchingUser === areaUser.id && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

