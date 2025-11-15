import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MessageCircle, Image as ImageIcon, X, LoaderCircle, Calendar } from "lucide-react";
import { ChatWithMessages, Message } from "@/api/types";
import { useAuth } from "@/context/AuthContext";
import { chatService } from "@/api/services/chatService";
import { useToast } from "@/hooks/use-toast";
import { Capacitor } from "@capacitor/core";
import { useSafeArea } from "@/hooks/useSafeArea";
import ImageModal from "@/components/ui/imageModal";

export default function ChatDetail() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatWithMessages | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showImage, setShowImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { safeAreaInsets } = useSafeArea();

  // Load on mount
  useEffect(() => {
    const load = async () => { await loadChat(false); };
    load();
    scrollToBottom();
  }, []);

  // Pooling to get real time messages
  useEffect(() => {
    const interval = setInterval(() => {
      loadChat(false);
    }, 5000);

    loadChat(false);
    return () => clearInterval(interval);
  }, [chatId]);


  const scrollToBottom = () => {
    setTimeout(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, 1000)
  };

  const loadChat = async (toShowLoading: boolean) => {
    if (!chatId) return;

    try {
      setLoading(toShowLoading);
      // Get all chats and find the specific one
      const response = await chatService.getChatById(
        Number(chatId),
        Number(user.id)
      );
      console.log(response);
      if (!response) {
        toast({
          title: "Error",
          description: "Chat not found or you don't have access.",
          variant: "destructive",
        });
        navigate("/chats");
        return;
      }

      setChat(response);
    } catch (err) {
      console.error("Error loading chat", err);
      toast({
        title: "Error",
        description: "Could not load chat.",
        variant: "destructive",
      });
      navigate("/chats");
    } finally {
      setLoading(false);
    }
  };

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
    if ((!message?.trim() && !selectedImage) || !chatId || sending) return;

    try {
      setSending(true);

      // Show message optimistically
      const tempImageUrl = imagePreview; // Use preview URL temporarily
      const newMessage: Message = {
        content: message?.trim() || " ",
        image_path: tempImageUrl || undefined,
        sent_at: new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, ''),
        user_name: user.name,
      };
      scrollToBottom();

      setChat(prev =>
        prev
          ? {
            ...prev,
            messages: [...prev.messages, newMessage],
          }
          : prev
      );

      const messageContent = message?.trim();
      const imageFile = selectedImage;

      // Clear input immediately
      setMessage("");
      clearImage();

      // Send to API with file
      const response = await chatService.sendMessage({
        content: messageContent || " ", // Send space if only image
        chat_id: Number(chatId),
        user_id: Number(user.id),
        sent_at: newMessage.sent_at,
        file: imageFile,
      } as any);

      // Update the message with real image_url from server
      if (response.image_url) {
        setChat(prev => {
          if (!prev) return prev;
          const messages = [...prev.messages];
          const lastMessage = messages[messages.length - 1];
          if (lastMessage && lastMessage.sent_at === newMessage.sent_at) {
            lastMessage.image_path = response.image_url;
          }
          return { ...prev, messages };
        });
      }

    } catch (err: any) {
      console.error("Error sending message", err);

      console.log('removing by error')

      // Remove optimistic message on error
      setChat(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages.slice(0, -1)
        };
      });

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading || !chat) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-echurch-600 mx-auto mb-4"></div>
          <p className="text-echurch-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div
        className="bg-white px-4 py-3 flex items-center gap-3 shadow-md flex-shrink-0"
        style={{ paddingTop: `calc(12px + ${safeAreaInsets.top}px)` }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/chats")}
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="font-semibold text-lg">{chat.chat.name}</h1>
          <p className="text-xs text-echurch-500">
            {chat.chat.chatable_type === "S" ? "Escala" : "Área"}
          </p>
        </div>
        {chat.chat.chatable_type === "S" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/schedules/${chat.chat.chatable_id}`)}
            title="Ver escala"
          >
            <Calendar size={20} />
          </Button>
        )}
      </div>

      {/* Messages - scrollable area */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {chat.messages.length === 0 ? (
          <div className="text-center text-echurch-500 mt-8">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Não há mensagens nesse bate papo</p>
            <p className="text-sm">Inicie a conversa!</p>
          </div>
        ) : (
          chat.messages.map((msg, idx) => {
            const isMyMessage = msg.user_name === user.name || msg.user_name === "Eu";
            return (
              <div
                key={idx}
                className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg ${isMyMessage
                      ? "bg-echurch-500 text-white rounded-br-none"
                      : "bg-white text-gray-900 rounded-bl-none shadow-sm"
                    }`}
                >
                  {!isMyMessage && (
                    <p className="text-xs font-semibold mb-1 opacity-75">{msg.user_name}</p>
                  )}
                  {msg.image_path && (
                    <img
                      src={msg.image_path}
                      alt=""
                      className="max-w-full rounded-lg mb-2 cursor-pointer hover:opacity-90"
                      onClick={() => setShowImage(msg.image_path)}
                    />
                  )}

                  {msg.content?.trim() && (
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  )}

                  <p
                    className={`text-xs mt-1 ${isMyMessage ? "text-echurch-100" : "text-gray-500"
                      }`}
                  >
                    {msg.sent_at}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - fixed at bottom with spacing for MobileBottomNav */}
      <div className="bg-white border-t px-4 py-3 shadow-t-xl flex-shrink-0 sticky bottom-0">
        {imagePreview && (
          <div className="mb-2 relative inline-block">
            <img src={imagePreview} className="max-h-24 rounded-lg" />
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

        <div className="flex items-end w-full gap-2">
          <div className="relative flex-1 items-center">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            {/* Textarea */}
            <textarea
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDownCapture={() => handleKeyPress}
              disabled={sending || uploading}
              rows={1}
              className="w-full resize-none overflow-y-auto rounded-md border border-gray-200 bg-white pr-20 pl-3 py-2 text-sm focus-visible:ring-offset-2 disabled:opacity-60"
              style={{
                minHeight: '40px',
                maxHeight: '6em',
              }}
            />
            {/* Image + Send buttons inside the input on the right */}
            <div className="absolute right-3 top-1/3 -translate-y-[25%] flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={sending || uploading}
                className="text-gray-500 hover:text-gray-700"
              >
                <ImageIcon size={22} />
              </button>
              <button
                type="button"
                onClick={sendMessage}
                disabled={sending || uploading || (!message?.trim() && !selectedImage)}
                className="text-echurch-500 hover:text-echurch-700"
              >
                {sending || uploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
                ) : (
                  <Send size={22} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showImage && (
        <ImageModal
          image_url={showImage}
          title="Imagem"
          onClose={() => setShowImage(null)}
        />
      )}
    </div>
  );
}

