import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { LogOut, Trash2 } from "lucide-react";
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Ações da Conta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
