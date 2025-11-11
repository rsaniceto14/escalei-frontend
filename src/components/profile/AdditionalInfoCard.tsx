import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/api/types";

interface AdditionalInfoCardProps {
  user: UserProfile;
  className?: string;
}

export function AdditionalInfoCard({ user, className }: AdditionalInfoCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Informações Adicionais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm">Áreas vinculadas:</span>
          <span className="font-medium">{user.areas.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Igreja:</span>
          <span className="font-medium text-echurch-600">{user.church?.name || 'Não vinculada'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Permissões:</span>
          <span className="font-medium text-echurch-600">
            {Object.values(user.permissions).filter(Boolean).length} ativas
          </span>
        </div>
      </CardContent>
    </Card>
  );
}



