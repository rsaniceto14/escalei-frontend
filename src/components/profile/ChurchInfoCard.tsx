import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { UserProfile } from "@/api/types";

interface ChurchInfoCardProps {
  user: UserProfile;
}

export function ChurchInfoCard({ user }: ChurchInfoCardProps) {
  if (!user.church) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Igreja
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-echurch-600">Nome da Igreja</Label>
            <div className="p-3 bg-gradient-to-r from-echurch-50 to-echurch-100 rounded border flex items-center gap-2">
              <span className="text-echurch-800 font-medium">{user.church.name}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-echurch-600">Endereço Completo</Label>
            <div className="p-3 bg-echurch-50 rounded border text-echurch-800">
              <div className="space-y-1">
                {user.church.street && user.church.number && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">📍</span>
                    <span>{user.church.street}, Nº {user.church.number}</span>
                    {user.church.complement && <span>- {user.church.complement}</span>}
                  </div>
                )}
                {user.church.quarter && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">🏘️</span>
                    <span>{user.church.quarter}</span>
                  </div>
                )}
                {user.church.city && user.church.state && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">🏙️</span>
                    <span>{user.church.city} - {user.church.state}</span>
                  </div>
                )}
                {user.church.cep && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">📮</span>
                    <span>CEP: {user.church.cep}</span>
                  </div>
                )}
                {!user.church.street && !user.church.quarter && !user.church.city && !user.church.cep && (
                  <span className="text-echurch-500 italic">Endereço não informado</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

