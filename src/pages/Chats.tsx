import { useState, useEffect, useRef } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Send, Users, Calendar, Search, Image as ImageIcon, X, LoaderCircle, Route } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Area, ChatWithMessages, Message } from "@/api/types";
import { useAuth } from "@/context/AuthContext";
import { chatService } from "@/api/services/chatService";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Chats() {
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatWithMessages[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setLoadingMessages] = useState(true);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("schedules");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadChats = async () => {
    try {
      const response = await chatService.getChatsForUser(Number(user.id));

      // Convert messages object to array if needed
      const normalizedChats = response.map((chat: ChatWithMessages) => ({
        ...chat,
        messages: Array.isArray(chat.messages) 
          ? chat.messages 
          : Object.values(chat.messages || {})
      }));
      
      setChats(normalizedChats);

    } catch (err) {
      console.error("Error loading chats", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chat_id: number) => {
    try {
      setLoadingMessages(true);

      const response = await chatService.getChatById( chat_id, Number(user.id));

      // Convert messages object to array if needed
      const messages = Array.isArray(response.messages) ? response.messages : Object.values(response.messages || {})
      
      setActiveMessages(messages);

    } catch (err) {
      console.error("Error loading chats", err);
    } finally {
      setLoadingMessages(false);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      loadChats();
    }, 5000);

    loadChats();
    return () => clearInterval(interval);
  }, []);

  // Filter chats based on search query
  const filterChats = (chatList: ChatWithMessages[]) => {
    if (!searchQuery.trim()) return chatList;

    return chatList.filter((chat) =>
      chat.chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get filtered chats by type
  const scheduleChats = filterChats(chats.filter((c) => c.chat.chatable_type === "S"));
  const areaChats = filterChats(chats.filter((c) => c.chat.chatable_type === "A"));

  // Auto-switch tab when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      // If search has results in schedules, switch to schedules tab
      if (scheduleChats.length > 0) {
        setActiveTab("schedules");
      }
      // If no results in schedules but has in areas, switch to areas
      else if (areaChats.length > 0) {
        setActiveTab("areas");
      }
    }
  }, [searchQuery, scheduleChats.length, areaChats.length]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async () => {
    if ((!message?.trim() && !selectedImage) || !activeChat || sending) return;

    try {
      setSending(true);

      // Show message optimistically
      const tempImageUrl = imagePreview; // Use preview URL temporarily
      const newMessage = {
        content: message?.trim() || " ",
        image_path: tempImageUrl || undefined,
        sent_at: new Date().toISOString(),
        user_name: user.name,
      };

      // Add to chat optimistically
      setActiveMessages(prev => [...prev, newMessage]);
      scrollToBottom(true);

      const messageContent = message?.trim();
      const imageFile = selectedImage;

      // Clear input immediately
      setMessage("");
      clearImage();

      // Send to API with file
      const response = await chatService.sendMessage({
        content: messageContent || " ", // Send space if only image
        chat_id: Number(activeChat),
        user_id: Number(user.id),
        sent_at: newMessage.sent_at,
        file: imageFile,
      } as any);

      // Update the message with real image_path from server
      if (response.image_path) {
        setActiveMessages(prev =>
          prev.map(msg => {
            if (msg.sent_at === newMessage.sent_at) {
              return { ...msg, image_path: response.image_path };
            }
            return msg;
          })
        );
      }

    } catch (err: any) {
      console.error("Error sending message", err);

      // Remove optimistic message on error
      setChats(prev =>
        prev.map(chat => {
          if (chat.chat.id === activeChat) {
            return {
              ...chat,
              messages: chat.messages.slice(0, -1)
            };
          }
          return chat;
        })
      );

      const errorMessage = err.response?.data?.message || "Could not send message.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = (immediately: boolean) => {
    if (immediately) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      return;
    }
    setTimeout(() => {messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });}, 1500)
  };

  const handleChatClick = (chatId: string) => {
    if (isMobile) {
      // Mobile: Navigate to detail page
      navigate(`/chats/${chatId}`);
    } else {
      // Desktop: Set active chat
      setActiveChat(chatId);  
      loadMessages(Number(chatId));
      // Scroll to bottom after chat is selected
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  // Auto scroll when messages change
  useEffect(() => {
    if (activeChat) {
      scrollToBottom();
    }
  }, [chats, activeChat, activeMessages]);

  const ChatItem = ({ chat }: { chat: ChatWithMessages }) => (
    <Card
      className={`cursor-pointer transition-colors hover:bg-echurch-50 ${activeChat === chat.chat.id ? "ring-2 ring-echurch-500" : ""
        }`}
      onClick={() => handleChatClick(chat.chat.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-echurch-200 text-echurch-700">
                {chat.chat.chatable_type === "S" ? (
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
              <p className="text-sm text-echurch-600 lineClamp2">
                {(chat.messages[chat.messages.length - 1]?.content) ? chat.messages[chat.messages.length - 1]?.content : (chat.messages[chat.messages.length - 1]?.image_path ? "Photo" : "Sem mensagens ainda...")}
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
        <div className="flex items-center gap-2">
          <MessageCircle />
          <h1 className="text-2xl lg:text-3xl font-bold text-echurch-700">Seus Chats</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Chat list */}
        <div className="lg:col-span-1">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="space-y-4">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-echurch-400 w-4 h-4" />
                <Input
                  placeholder="Procurar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-echurch-200 focus:border-echurch-500"
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="schedules">
                    Schedules {scheduleChats.length > 0 && `(${scheduleChats.length})`}
                  </TabsTrigger>
                  <TabsTrigger value="areas">
                    Areas {areaChats.length > 0 && `(${areaChats.length})`}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="schedules" className="space-y-3 max-h-[500px] overflow-y-auto">
                  {scheduleChats.length > 0 ? (
                    scheduleChats.map((chat) => (
                      <ChatItem key={chat.chat.id} chat={chat} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-echurch-500">
                      <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {searchQuery ? "Não encontrado" : "Sem chats de escala"}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="areas" className="space-y-3 max-h-[500px] overflow-y-auto">
                  {areaChats.length > 0 ? (
                    areaChats.map((chat) => (
                      <ChatItem key={chat.chat.id} chat={chat} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-echurch-500">
                      <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {searchQuery ? "Nenhum match" : "Sem chats de áreas"}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {!isMobile ? (
          // --------- DESKTOP ----------
          <div className="lg:col-span-2">
            {activeChat ? (
              <Card className="h-[calc(100vh-200px)] flex flex-col">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    {chats.find((c) => c.chat.id === activeChat)?.chat.name}
                  </CardTitle>
                  {chats.find((c) => c.chat.id === activeChat)?.chat.description}
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                  {loading ? (
                    // <Card className="h-full flex items-center justify-center">
                      <div className="text-center text-echurch-500">
                        <LoaderCircle size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Carregando...</p>
                      </div>
                    // </Card>
                  ) : (
                  /* Messages */
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      {activeMessages?.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.user_name === user.name || msg.user_name === "Eu" ? "justify-end" : "justify-start"
                              }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.user_name === user.name || msg.user_name === "Eu"
                                  ? "bg-echurch-500 text-white"
                                  : "bg-gray-100 text-gray-900"
                                }`}
                            >
                              {msg.user_name !== user.name && msg.user_name !== "Eu" && (
                                <p className="text-xs font-medium mb-1 opacity-75">{msg.user_name}</p>
                              )}
                              {msg.image_path && (
                                <img
                                  src={msg.image_path}
                                  alt="Message attachment"
                                  className="max-w-full rounded-lg mb-2 cursor-pointer hover:opacity-90"
                                  onClick={() => window.open(msg.image_path, '_blank')}
                                />
                              )}
                              {msg.content?.trim() && (
                                <p className="text-sm">{msg.content}</p>
                              )}
                              <p
                                className={`text-xs mt-1 ${msg.user_name === user.name || msg.user_name === "Eu" ? "text-echurch-100" : "text-gray-500"
                                  }`}
                              >
                                {msg.sent_at}
                              </p>
                            </div>
                          </div>
                        ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}

                  {/* Message input */}
                  <div className="p-4 border-t bg-gray-50">
                    {imagePreview && (
                      <div className="mb-2 relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-24 rounded-lg"
                        />
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={clearImage}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={sending || uploading}
                        className="border-echurch-200 hover:bg-echurch-50"
                      >
                        <ImageIcon size={18} className="text-echurch-500" />
                      </Button>
                      <Input
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        disabled={sending || uploading}
                        className="flex-1"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={sending || uploading || (!message.trim() && !selectedImage)}
                        className="bg-echurch-500 hover:bg-echurch-600 disabled:opacity-50"
                      >
                        {sending || uploading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                          <Send size={16} />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center text-echurch-500">
                  <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Selecione um chat!</p>
                  <p className="text-sm">Você verá as mensagens aqui</p>
                </div>
              </Card>
            )}
          </div>
        ) : ""}
      </div>
    </div>
  );
}
