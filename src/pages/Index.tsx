
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, Plus, Settings } from "lucide-react";

export default function Index() {
  // Simulação de dados mockados do usuário
  const escalasParticipa = [
    { 
      nome: "Culto Domingo Manhã", 
      data: "2025-06-16", 
      horario: "09:00",
      local: "Igreja Central",
      tipo: "Geral",
      status: "Confirmada"
    },
    { 
      nome: "Reunião de Oração", 
      data: "2025-06-20", 
      horario: "20:00",
      local: "On-line",
      tipo: "Geral", 
      status: "Confirmada"
    },
  ];
  
  const escalasPendentes = [
    { 
      nome: "Louvor Sábado", 
      data: "2025-06-22", 
      horario: "19:30",
      local: "Igreja Central",
      tipo: "Louvor",
      status: "Pendente"
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-echurch-500 to-echurch-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🎉</span>
          <div>
            <h2 className="text-2xl font-bold">Bem-vindo ao e-Church!</h2>
            <p className="text-echurch-100">Gerencie suas escalas e participe ativamente da igreja.</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/scales/create">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 text-center">
              <Plus className="w-8 h-8 mx-auto mb-2 text-echurch-500" />
              <p className="font-medium text-sm">Nova Escala</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/availability">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-echurch-500" />
              <p className="font-medium text-sm">Disponibilidade</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/musics">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 text-echurch-500 flex items-center justify-center text-lg">🎵</div>
              <p className="font-medium text-sm">Músicas</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/settings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 text-center">
              <Settings className="w-8 h-8 mx-auto mb-2 text-echurch-500" />
              <p className="font-medium text-sm">Configurações</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Scales Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-echurch-600">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Suas Escalas Confirmadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {escalasParticipa.length > 0 ? (
              escalasParticipa.map((esc, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 rounded-lg bg-green-50 border border-green-200"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-echurch-700">{esc.nome}</div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-echurch-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(esc.data)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {esc.horario}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {esc.local}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 self-start sm:self-center">
                    {esc.tipo}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-echurch-500">
                <CheckCircle className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">Nenhuma escala confirmada</p>
                <p className="text-sm">Suas próximas escalas aparecerão aqui</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-echurch-600">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              Pendências de Confirmação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {escalasPendentes.length > 0 ? (
              escalasPendentes.map((esc, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-echurch-700">{esc.nome}</div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-echurch-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(esc.data)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {esc.horario}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {esc.local}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="sm" className="bg-echurch-500 hover:bg-echurch-600 flex-1">
                      Confirmar Participação
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-echurch-500">
                <AlertCircle className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">Nenhuma pendência!</p>
                <p className="text-sm">Você está em dia com suas escalas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/scales" className="flex-1">
          <Button className="w-full bg-echurch-500 hover:bg-echurch-600 h-12">
            <Calendar className="w-4 h-4 mr-2" />
            Visualizar Todas as Escalas
          </Button>
        </Link>
        <Link to="/availability" className="flex-1">
          <Button variant="outline" className="w-full border-echurch-200 text-echurch-700 hover:bg-echurch-50 h-12">
            <Settings className="w-4 h-4 mr-2" />
            Configurar Disponibilidade
          </Button>
        </Link>
      </div>
    </div>
  );
}
