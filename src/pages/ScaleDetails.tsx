
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, Clock, MapPin, Users, ArrowLeft, 
  MessageCircle, UserPlus, RefreshCw, CheckCircle 
} from "lucide-react";

export default function ScaleDetails() {
  const { id } = useParams();
  const [showSwapDialog, setShowSwapDialog] = useState(false);
  
  // Mock data - em produção viria da API
  const escala = {
    id: 1,
    nome: "Culto Domingo Manhã",
    tipo: "Geral",
    data: "2025-06-16",
    horario: "09:00",
    local: "Igreja Central",
    modalidade: "Presencial",
    area: "Geral",
    status: "Confirmada",
    descricao: "Culto dominical da manhã com louvor, pregação e ministração.",
    responsavel: "Pastor João Silva",
    participantes: [
      { id: 1, nome: "Maria Santos", funcao: "Louvor", status: "Confirmado" },
      { id: 2, nome: "João Pedro", funcao: "Som", status: "Confirmado" },
      { id: 3, nome: "Ana Costa", funcao: "Recepção", status: "Pendente" },
      { id: 4, nome: "Carlos Lima", funcao: "Segurança", status: "Confirmado" },
    ]
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado": return "bg-green-100 text-green-800";
      case "Pendente": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/scales">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-echurch-700">{escala.nome}</h1>
          <p className="text-echurch-600">Detalhes da escala</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações principais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Informações Gerais
                <Badge className="bg-green-100 text-green-800">
                  {escala.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-echurch-500" />
                  <div>
                    <p className="font-medium">Data</p>
                    <p className="text-sm text-echurch-600 capitalize">{formatDate(escala.data)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-echurch-500" />
                  <div>
                    <p className="font-medium">Horário</p>
                    <p className="text-sm text-echurch-600">{escala.horario}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-echurch-500" />
                  <div>
                    <p className="font-medium">Local</p>
                    <p className="text-sm text-echurch-600">{escala.local}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-echurch-500" />
                  <div>
                    <p className="font-medium">Modalidade</p>
                    <p className="text-sm text-echurch-600">{escala.modalidade}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="font-medium mb-2">Descrição</p>
                <p className="text-sm text-echurch-600">{escala.descricao}</p>
              </div>
              
              <div>
                <p className="font-medium mb-2">Responsável</p>
                <p className="text-sm text-echurch-600">{escala.responsavel}</p>
              </div>
            </CardContent>
          </Card>

          {/* Participantes */}
          <Card>
            <CardHeader>
              <CardTitle>Participantes ({escala.participantes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {escala.participantes.map((participante) => (
                  <div key={participante.id} className="flex items-center justify-between p-3 rounded-lg bg-echurch-50">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-echurch-200 text-echurch-700">
                          {participante.nome.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{participante.nome}</p>
                        <p className="text-sm text-echurch-600">{participante.funcao}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(participante.status)}>
                      {participante.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações laterais */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => setShowSwapDialog(true)}
                className="w-full bg-echurch-500 hover:bg-echurch-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Solicitar Troca
              </Button>
              
              <Link to={`/chats/escala-${escala.id}`}>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat da Escala
                </Button>
              </Link>
              
              <Button variant="outline" className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar Presença
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-echurch-600">Área:</span>
                <span className="font-medium">{escala.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-echurch-600">Tipo:</span>
                <span className="font-medium">{escala.tipo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-echurch-600">Criado em:</span>
                <span className="font-medium">10/06/2025</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de solicitação de troca */}
      {showSwapDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Solicitar Troca de Escala</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-echurch-600">
                Deseja solicitar a troca desta escala com outro membro disponível?
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowSwapDialog(false)}
                  className="flex-1 bg-echurch-500 hover:bg-echurch-600"
                >
                  Confirmar Solicitação
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSwapDialog(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
