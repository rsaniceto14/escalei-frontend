import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/api/types";

interface StatusCardProps {
  user: UserProfile;
  className?: string;
}

export function StatusCard({ user, className }: StatusCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'A':
        return <Badge className="bg-green-500 text-white">Ativo</Badge>;
      case 'I':
        return <Badge className="bg-red-500 text-white">Inativo</Badge>;
      case 'WA':
        return <Badge className="bg-red-500 text-white">Aguardando aprovação</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Desconhecido</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Status da Conta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Tipo de usuário:</span>
          <Badge variant={user.permissions.manage_users ? "default" : "secondary"}>
            {user.permissions.manage_users ? "Administrador" : "Membro"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Status:</span>
          {getStatusBadge(user.status)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">ID do usuário:</span>
          <span className="text-sm text-echurch-600 font-mono">{user.id}</span>
        </div>
      </CardContent>
    </Card>
  );
}

