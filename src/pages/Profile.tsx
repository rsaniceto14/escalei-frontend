import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, Loader2, MessageSquareWarning } from "lucide-react";
import { toast } from "sonner";
import { userService } from "@/api/services/userService";
import { areaService } from "@/api/services/areaService";
import { UserProfile, Area } from "@/api/types";
import { UserInfoCard } from "@/components/profile/UserInfoCard";
import { ChurchInfoCard } from "@/components/profile/ChurchInfoCard";
import { PermissionsCard } from "@/components/profile/PermissionsCard";
import { AdminSection } from "@/components/profile/AdminSection";
import { AccountActionsCard } from "@/components/profile/AccountActionsCard";
import { StatusCard } from "@/components/profile/StatusCard";
import { AdditionalInfoCard } from "@/components/profile/AdditionalInfoCard";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    fetchAreas();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await userService.getProfile();
      setUser(profileData);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Erro ao carregar perfil do usuário');
      toast.error('Erro ao carregar perfil do usuário');
    } finally {
      setLoading(false);
    }
  };

  const fetchAreas = async () => {
    try {
      const areasData = await areaService.getAll();
      setAreas(areasData);
    } catch (err) {
      console.error('Error fetching areas:', err);
      // Don't show error toast for areas, as it's not critical for profile
    }
  };

  const handleUserUpdate = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-echurch-500" />
          <p className="text-echurch-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Erro ao carregar perfil'}</p>
          <Button onClick={fetchUserProfile} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-w-0">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-echurch-700 flex items-center gap-2">
          <User className="w-8 h-8" />
          Perfil do Usuário
        </h1>
        <p className="text-echurch-600 mt-1">Visualize e gerencie suas informações</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 min-w-0">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <UserInfoCard 
            user={user} 
            onUserUpdate={handleUserUpdate}
            onRefreshProfile={fetchUserProfile}
            areas={areas}
          />
          
          <ChurchInfoCard user={user} />
          
          { user.permissions.manage_handouts && (
          <Button
            className="w-full"
            size="lg"
            onClick={() => { navigate("/handouts") }}
          >
            <MessageSquareWarning className="w-5 h-5" />
            Gerenciar comunicados
          </Button>
          )}

          <PermissionsCard 
            user={user} 
            onUserUpdate={handleUserUpdate}
          />
          
          {/* Admin Section - Only visible on mobile or for admin users */}
          <div className="lg:hidden">
            <AdminSection />
          </div>
          
          {/* Account Actions - Mobile only */}
          <div className="lg:hidden">
            <AccountActionsCard />
          </div>
        </div>

        {/* Sidebar - Desktop only */}
        <div className="hidden lg:block space-y-6 min-w-0">
          <StatusCard user={user} />
          <AdditionalInfoCard user={user} />
          <AccountActionsCard />
        </div>
      </div>
    </div>
  );
}