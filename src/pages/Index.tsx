
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle } from "lucide-react";

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
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-echurch-700 mb-2">
          Bem-vindo ao e-church!
        </h2>
        <p className="text-echurch-600 text-sm lg:text-base">
          Gerencie suas escalas e participe ativamente da igreja.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 rounded-lg bg-echurch-50 border border-echurch-100"
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
              <div className="text-center py-6 text-echurch-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma escala confirmada</p>
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
                  className="flex flex-col gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200"
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
              <div className="text-center py-6 text-echurch-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma pendência!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/scales" className="flex-1">
          <Button className="w-full bg-echurch-500 hover:bg-echurch-600">
            Visualizar Todas as Escalas
          </Button>
        </Link>
        <Link to="/availability" className="flex-1">
          <Button variant="outline" className="w-full border-echurch-200 text-echurch-700 hover:bg-echurch-50">
            Configurar Disponibilidade
          </Button>
        </Link>
      </div>
    </div>
  );
}
