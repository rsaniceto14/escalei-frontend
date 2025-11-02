import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LogOut, Trash2, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface AccountActionsCardProps {
  className?: string;
}

export function AccountActionsCard({ className }: AccountActionsCardProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call backend logout if needed
      // await authService.logout();
      
      // Clear local state and storage
      logout();
      
      // Show success message
      toast.success("Logout realizado com sucesso");
      
      // Navigate to login
      navigate("/login");
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error("Erro ao fazer logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = () => {
    // TODO: Implement delete account functionality
    toast.info("Funcionalidade de exclusão de conta será implementada em breve");
  };

  const handlePasswordChange = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement actual password change API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast.success("Senha alterada com sucesso!");
      setIsOpen(false);
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error("Erro ao alterar senha");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Ações da Conta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Password change */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Lock className="w-4 h-4 mr-2" />
              Alterar Senha
            </Button>
          </DialogTrigger>
          <DialogContent className="mx-4 max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Alterar Senha</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Digite sua senha atual"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Digite sua nova senha"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirme sua nova senha"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handlePasswordChange}
                  className="flex-1 bg-echurch-500 hover:bg-echurch-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Alterar Senha
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Logout Button */}
        <Button 
          onClick={handleLogout}
          variant="outline" 
          className="w-full"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              Fazendo logout...
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4 mr-2" />
              Fazer Logout
            </>
          )}
        </Button>

        {/* Delete Account Link */}
        <div className="pt-3 border-t border-gray-200">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium w-full text-left py-2 px-1 flex items-center hover:bg-red-50 rounded transition-colors">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Conta
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="mx-4 max-w-sm sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Conta</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão permanentemente removidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Excluir Conta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
