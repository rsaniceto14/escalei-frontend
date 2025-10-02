import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Send, Users, Calendar } from "lucide-react";

import { Area, ChatWithMessages } from "@/api/types";
import { useAuth } from "@/context/AuthContext";
import { chatService } from "@/api/services/chatService";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Chats() {
  const [mensagem, setMensagem] = useState("");
  const [chatAtivo, setChatAtivo] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatWithMessages[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isMobile  = useIsMobile();

  useEffect(() => {
    async function carregarChats() {
      try {
        const response = await chatService.getChatsForUser(Number(user.id), user.areas.map((area: Area) => {return area.id}));
        setChats(response);
      } catch (err) {
        console.error("Erro ao carregar chats", err);
      } finally {
        setLoading(false);
      }
    }
    carregarChats();
  }, []);

  const enviarMensagem = () => {
    if (mensagem.trim() && chatAtivo) {
      console.log("Enviar para", chatAtivo, mensagem);
      // chamar API de envio
      setMensagem("");
    }
  };

  const ChatItem = ({ chat }: { chat: ChatWithMessages }) => (
    <Card
      className={`cursor-pointer transition-colors hover:bg-echurch-50 ${
        chatAtivo === chat.chat.id ? "ring-2 ring-echurch-500" : ""
      }`}
      onClick={() => setChatAtivo(chat.chat.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-echurch-200 text-echurch-700">
                {chat.chat.chatable_type === "escala" ? (
                  <Calendar size={16} />
                ) : (
                  <Users size={16} />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-echurch-700">{chat.chat.name}</h3>
              </div>
              <p className="text-sm text-echurch-600 truncate">
                {chat.messages[chat.messages.length - 1]?.content || "Sem mensagens"}
              </p>
            </div>
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
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <Tabs defaultValue="escalas" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="escalas">Escalas</TabsTrigger>
                <TabsTrigger value="areas">Áreas</TabsTrigger>
              </TabsList>

              <TabsContent value="escalas" className="space-y-3 max-h-[500px] overflow-y-auto">
                {chats
                  .filter((c) => c.chat.chatable_type === "S")
                  .map((chat) => (
                    <ChatItem key={chat.chat.id} chat={chat} />
                  ))}
              </TabsContent>

              <TabsContent value="areas" className="space-y-3 max-h-[500px] overflow-y-auto">
                {chats
                  .filter((c) => c.chat.chatable_type === "A")
                  .map((chat) => (
                    <ChatItem key={chat.chat.id} chat={chat} />
                  ))}
              </TabsContent>
            </Tabs>
          )}
        </div>

        { !isMobile ? (
          // --------- DESKTOP ----------
          <div className="lg:col-span-2">
            {chatAtivo ? (
              <Card className="h-full flex flex-col">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    {chats.find((c) => c.chat.id === chatAtivo)?.chat.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Mensagens */}
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {chats
                      .find((c) => c.chat.id === chatAtivo)
                      ?.messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${
                            msg.user_name === "Eu" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.user_name === "Eu"
                                ? "bg-echurch-500 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            {msg.user_name !== "Eu" && (
                              <p className="text-xs font-medium mb-1 opacity-75">{msg.user_name}</p>
                            )}
                            <p className="text-sm">{msg.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.user_name === "Eu" ? "text-echurch-100" : "text-gray-500"
                              }`}
                            >
                              {msg.sent_at}
                            </p>
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
                        onKeyPress={(e) => e.key === "Enter" && enviarMensagem()}
                        className="flex-1"
                      />
                      <Button
                        onClick={enviarMensagem}
                        className="bg-echurch-500 hover:bg-echurch-600"
                      >
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
        ) : ""}
      </div>
    </div>
  );
}
