import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Shield, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { permissionService } from "@/api/services/permissionService";
import { UserProfile } from "@/api/types";

interface PermissionsCardProps {
  user: UserProfile;
  onUserUpdate: (updatedUser: UserProfile) => void;
}

export function PermissionsCard({ user, onUserUpdate }: PermissionsCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Mapeamento completo de todas as permissões do sistema
  const permissionGroups = [
    {
      title: "Escalas",
      permissions: [
        { key: "create_scale", label: "Criar Escalas" },
        { key: "read_scale", label: "Visualizar Escalas" },
        { key: "update_scale", label: "Editar Escalas" },
        { key: "delete_scale", label: "Excluir Escalas" }
      ]
    },
    {
      title: "Músicas",
      permissions: [
        { key: "create_music", label: "Criar Músicas" },
        { key: "read_music", label: "Visualizar Músicas" },
        { key: "update_music", label: "Editar Músicas" },
        { key: "delete_music", label: "Excluir Músicas" }
      ]
    },
    {
      title: "Funções",
      permissions: [
        { key: "create_role", label: "Criar Funções" },
        { key: "read_role", label: "Visualizar Funções" },
        { key: "update_role", label: "Editar Funções" },
        { key: "delete_role", label: "Excluir Funções" }
      ]
    },
    {
      title: "Áreas",
      permissions: [
        { key: "create_area", label: "Criar Áreas" },
        { key: "read_area", label: "Visualizar Áreas" },
        { key: "update_area", label: "Editar Áreas" },
        { key: "delete_area", label: "Excluir Áreas" }
      ]
    },
    {
      title: "Chats",
      permissions: [
        { key: "create_chat", label: "Criar Chats" },
        { key: "read_chat", label: "Visualizar Chats" },
        { key: "update_chat", label: "Editar Chats" },
        { key: "delete_chat", label: "Excluir Chats" }
      ]
    },
    {
      title: "Administração",
      permissions: [
        { key: "manage_users", label: "Gerenciar Usuários" },
        { key: "manage_church_settings", label: "Configurações da Igreja" },
        { key: "manage_app_settings", label: "Configurações do Sistema" }
      ]
    }
  ];

  const handlePermissaoChange = async (permissao: string, valor: boolean) => {
    if (!user?.permissions.manage_users) {
      toast.error("Apenas usuários com permissão de gerenciar usuários podem alterar permissões");
      return;
    }

    try {
      // Update the permission via API
      await permissionService.updateUserPermissions(parseInt(user.id), {
        [permissao]: valor
      });

      // Update local state
      onUserUpdate({
        ...user,
        permissions: {
          ...user.permissions,
          [permissao]: valor
        }
      });

      toast.success("Permissão atualizada com sucesso");
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error("Erro ao atualizar permissão");
    }
  };

  // Contar permissões ativas
  const activePermissions = Object.values(user.permissions).filter(Boolean).length;
  const totalPermissions = Object.keys(user.permissions).length;

  return (
    <Card>
      <CardHeader>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Shield className="w-5 h-5 flex-shrink-0" />
                <div className="min-w-0">
                  <CardTitle className="text-base">Permissões do Sistema</CardTitle>
                  <div className="text-sm font-normal text-echurch-600">
                    {activePermissions}/{totalPermissions} ativas
                  </div>
                </div>
              </div>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {permissionGroups.map((group) => (
                  <div key={group.title} className="space-y-2">
                    <h4 className="text-sm font-semibold text-echurch-700 border-b border-echurch-200 pb-1">
                      {group.title}
                    </h4>
                    <div className="grid gap-2">
                      {group.permissions.map((permission) => (
                        <div 
                          key={permission.key} 
                          className="flex items-center justify-between p-2 bg-echurch-50 rounded-md hover:bg-echurch-100 transition-colors"
                        >
                          <Label className="text-sm font-medium cursor-pointer flex-1 min-w-0">
                            {permission.label}
                          </Label>
                          <Switch
                            checked={user.permissions[permission.key as keyof typeof user.permissions] || false}
                            onCheckedChange={(checked) => handlePermissaoChange(permission.key, checked)}
                            disabled={!user.permissions.manage_users}
                            className="scale-90 flex-shrink-0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {!user.permissions.manage_users && (
                  <div className="text-center py-4 text-sm text-echurch-600 bg-echurch-50 rounded-md">
                    Permissões controladas pelo administrador
                  </div>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
    </Card>
  );
}
