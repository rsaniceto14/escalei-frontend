
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Send, Users, Calendar, Plus } from "lucide-react";

export default function Chats() {
  const [mensagem, setMensagem] = useState("");
  const [chatAtivo, setChatAtivo] = useState<number | null>(null);

  const chatsEscalas = [
    { 
      id: 1, 
      nome: "Culto Domingo Manhã", 
      ultimaMensagem: "Vamos ensaiar sábado às 19h!",
      horario: "09:30",
      naoLidas: 3,
      participantes: 8
    },
    { 
      id: 2, 
      nome: "Louvor Sábado", 
      ultimaMensagem: "Confirmem presença por favor",
      horario: "2h",
      naoLidas: 0,
      participantes: 6
    },
  ];

  const chatsAreas = [
    { 
      id: 3, 
      nome: "Área de Louvor", 
      ultimaMensagem: "Nova música para este domingo",
      horario: "1h",
      naoLidas: 2,
      participantes: 15
    },
    { 
      id: 4, 
      nome: "Diáconos", 
      ultimaMensagem: "Reunião de planejamento amanhã",
      horario: "3h",
      naoLidas: 1,
      participantes: 12
    },
    { 
      id: 5, 
      nome: "Recepção", 
      ultimaMensagem: "Material para o domingo está pronto",
      horario: "5h",
      naoLidas: 0,
      participantes: 8
    },
  ];

  const mensagensChat = [
    { id: 1, autor: "Maria Santos", mensagem: "Pessoal, confirmem presença para o ensaio!", horario: "14:30", isMe: false },
    { id: 2, autor: "Eu", mensagem: "Confirmado! Estarei lá às 19h", horario: "14:35", isMe: true },
    { id: 3, autor: "João Pedro", mensagem: "Também confirmado. Vou levar o violão extra", horario: "14:40", isMe: false },
  ];

  const enviarMensagem = () => {
    if (mensagem.trim()) {
      // Aqui enviaria a mensagem
      setMensagem("");
    }
  };

  const ChatItem = ({ chat, tipo }: { chat: any, tipo: 'escala' | 'area' }) => (
    <Card 
      className={`cursor-pointer transition-colors hover:bg-echurch-50 ${chatAtivo === chat.id ? 'ring-2 ring-echurch-500' : ''}`}
      onClick={() => setChatAtivo(chat.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-echurch-200 text-echurch-700">
                {tipo === 'escala' ? <Calendar size={16} /> : <Users size={16} />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-echurch-700">{chat.nome}</h3>
                {chat.naoLidas > 0 && (
                  <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                    {chat.naoLidas}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-echurch-600 truncate">{chat.ultimaMensagem}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-echurch-500">{chat.horario}</p>
            <p className="text-xs text-echurch-500 flex items-center gap-1">
              <Users size={10} />
              {chat.participantes}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-echurch-700">Chats</h1>
          <p className="text-echurch-600">Converse com sua equipe</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Lista de chats */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="escalas" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="escalas">Escalas</TabsTrigger>
              <TabsTrigger value="areas">Áreas</TabsTrigger>
            </TabsList>

            <TabsContent value="escalas" className="space-y-3 max-h-[500px] overflow-y-auto">
              {chatsEscalas.map(chat => (
                <ChatItem key={chat.id} chat={chat} tipo="escala" />
              ))}
            </TabsContent>

            <TabsContent value="areas" className="space-y-3 max-h-[500px] overflow-y-auto">
              {chatsAreas.map(chat => (
                <ChatItem key={chat.id} chat={chat} tipo="area" />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Área do chat */}
        <div className="lg:col-span-2">
          {chatAtivo ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  {chatsEscalas.find(c => c.id === chatAtivo)?.nome || 
                   chatsAreas.find(c => c.id === chatAtivo)?.nome}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Mensagens */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  {mensagensChat.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.isMe 
                          ? 'bg-echurch-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {!msg.isMe && (
                          <p className="text-xs font-medium mb-1 opacity-75">{msg.autor}</p>
                        )}
                        <p className="text-sm">{msg.mensagem}</p>
                        <p className={`text-xs mt-1 ${
                          msg.isMe ? 'text-echurch-100' : 'text-gray-500'
                        }`}>{msg.horario}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input de mensagem */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                      className="flex-1"
                    />
                    <Button onClick={enviarMensagem} className="bg-echurch-500 hover:bg-echurch-600">
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-echurch-500">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Selecione um chat</p>
                <p className="text-sm">Escolha uma escala ou área para conversar</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
