
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Plus, Eye } from "lucide-react";

type Escala = {
  id: number;
  nome: string;
  tipo: "Geral" | "Louvor";
  data: string;
  horario: string;
  local: string;
  modalidade: "Presencial" | "Online";
  area: string;
  participantes: number;
  status: "Confirmada" | "Pendente" | "Rascunho";
  minhasEscalas: boolean;
};

export default function Scales() {
  const escalas: Escala[] = [
    { 
      id: 1, 
      nome: "Culto Domingo Manhã", 
      tipo: "Geral", 
      data: "2025-06-16", 
      horario: "09:00",
      local: "Igreja Central", 
      modalidade: "Presencial",
      area: "Geral",
      participantes: 12,
      status: "Confirmada",
      minhasEscalas: true
    },
    { 
      id: 2, 
      nome: "Louvor Sábado", 
      tipo: "Louvor", 
      data: "2025-06-22", 
      horario: "19:30",
      local: "Igreja Central", 
      modalidade: "Presencial",
      area: "Louvor",
      participantes: 6,
      status: "Pendente",
      minhasEscalas: true
    },
    { 
      id: 3, 
      nome: "Reunião de Oração", 
      tipo: "Geral", 
      data: "2025-06-25", 
      horario: "20:00",
      local: "Online", 
      modalidade: "Online",
      area: "Diáconos",
      participantes: 8,
      status: "Confirmada",
      minhasEscalas: false
    },
  ];

  const [filtroAtivo, setFiltroAtivo] = useState("todas");

  const escalasFiltradas = escalas.filter(escala => {
    if (filtroAtivo === "minhas") return escala.minhasEscalas;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmada": return "bg-green-100 text-green-800 border-green-200";
      case "Pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Rascunho": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "Louvor": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Geral": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-echurch-700">Escalas</h1>
          <p className="text-echurch-600 mt-1">Gerencie e visualize as escalas de serviço</p>
        </div>
        <Link to="/scales/create">
          <Button className="bg-echurch-500 hover:bg-echurch-600">
            <Plus className="w-4 h-4 mr-2" />
            Nova Escala
          </Button>
        </Link>
      </div>

      <Tabs value={filtroAtivo} onValueChange={setFiltroAtivo} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="todas">Todas as Escalas</TabsTrigger>
          <TabsTrigger value="minhas">Minhas Escalas</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="space-y-4">
          <div className="grid gap-4">
            {escalasFiltradas.map(escala => (
              <Card key={escala.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-echurch-700">
                      {escala.nome}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getTipoColor(escala.tipo)}>
                        {escala.tipo}
                      </Badge>
                      <Badge className={getStatusColor(escala.status)}>
                        {escala.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-echurch-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(escala.data)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-echurch-600">
                      <Clock className="w-4 h-4" />
                      <span>{escala.horario}</span>
                    </div>
                    <div className="flex items-center gap-2 text-echurch-600">
                      <MapPin className="w-4 h-4" />
                      <span>{escala.local}</span>
                      <Badge variant="outline" className="ml-1">
                        {escala.modalidade}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-echurch-600">
                      <Users className="w-4 h-4" />
                      <span>{escala.participantes} pessoas</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-echurch-100">
                    <div className="text-sm text-echurch-500">
                      Área: <span className="font-medium">{escala.area}</span>
                    </div>
                    <div className="flex gap-2">
                      {escala.status === "Pendente" && escala.minhasEscalas && (
                        <Button size="sm" className="bg-echurch-500 hover:bg-echurch-600">
                          Confirmar Participação
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="minhas" className="space-y-4">
          <div className="grid gap-4">
            {escalasFiltradas.filter(e => e.minhasEscalas).map(escala => (
              <Card key={escala.id} className="hover:shadow-md transition-shadow border-l-4 border-l-echurch-500">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-echurch-700">
                      {escala.nome}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getTipoColor(escala.tipo)}>
                        {escala.tipo}
                      </Badge>
                      <Badge className={getStatusColor(escala.status)}>
                        {escala.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-echurch-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(escala.data)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-echurch-600">
                      <Clock className="w-4 h-4" />
                      <span>{escala.horario}</span>
                    </div>
                    <div className="flex items-center gap-2 text-echurch-600">
                      <MapPin className="w-4 h-4" />
                      <span>{escala.local}</span>
                      <Badge variant="outline" className="ml-1">
                        {escala.modalidade}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-echurch-600">
                      <Users className="w-4 h-4" />
                      <span>{escala.participantes} pessoas</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-echurch-100">
                    <div className="text-sm text-echurch-500">
                      Área: <span className="font-medium">{escala.area}</span>
                    </div>
                    <div className="flex gap-2">
                      {escala.status === "Pendente" && (
                        <Button size="sm" className="bg-echurch-500 hover:bg-echurch-600">
                          Confirmar Participação
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {escalasFiltradas.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-echurch-300" />
          <h3 className="text-lg font-semibold text-echurch-600 mb-2">
            {filtroAtivo === "minhas" ? "Você não está em nenhuma escala" : "Nenhuma escala encontrada"}
          </h3>
          <p className="text-echurch-500 mb-4">
            {filtroAtivo === "minhas" 
              ? "Entre em contato com a liderança para ser incluído nas escalas." 
              : "Não há escalas cadastradas no momento."
            }
          </p>
        </div>
      )}
    </div>
  );
}
