import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MessageCircle, Image as ImageIcon, X, LoaderCircle } from "lucide-react";
import { ChatWithMessages, Message } from "@/api/types";
import { useAuth } from "@/context/AuthContext";
import { chatService } from "@/api/services/chatService";
import { useToast } from "@/hooks/use-toast";
import { Capacitor } from "@capacitor/core";

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load on mount
  useEffect(() => {
    if(!Capacitor.isNativePlatform()) navigate("/chats");
    loadChat(false);
  }, []);

  // Pooling to get real time messages
  useEffect(() => {
    const interval = setInterval(() => {
      loadChat(false);
    }, 5000);

    loadChat(false);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    // Auto scroll to bottom when messages change
    scrollToBottom();
  }, [chat?.messages]);

  const scrollToBottom = () => {
    setTimeout(() => {messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });}, 1000)
  };

  const loadChat = async (toShowLoading :boolean) => {
    if (!chatId) return;
    
    try {
      setLoading(toShowLoading);
      // Get all chats and find the specific one
      const response = await chatService.getChatById(
        Number(chatId),
        user.id
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
    if ((!message.trim() && !selectedImage) || !chatId || sending) return;

    try {
      setSending(true);
      
      // Show message optimistically
      const tempImageUrl = imagePreview; // Use preview URL temporarily
      const newMessage: Message = {
        content: message.trim() || " ",
        image_path: tempImageUrl || undefined,
        sent_at: new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, ''),
        user_name: user.name,
      };

      setChat(prev =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, newMessage],
            }
          : prev
      );
      
      const messageContent = message.trim();
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
      console.log('updating')
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
          <LoaderCircle size={48} className="mx-auto mb-4 text-echurch-500 opacity-50" />
          <p className="text-echurch-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
   <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gray-50 px-4 py-3 flex items-center gap-3 shadow-md sticky top-0 ">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/chats")}
          className="hover:bg-echurch-600"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="font-semibold text-lg">{chat.chat.name}</h1>
          <p className="text-xs text-echurch-500">
            {chat.chat.chatable_type === "S" ? "Escala" : "Área"}
          </p>
        </div>
      </div>

      {/* Messages */}
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
                  className={`max-w-[75%] px-4 py-2 rounded-lg ${
                    isMyMessage
                      ? "bg-echurch-500 text-white rounded-br-none"
                      : "bg-white text-gray-900 rounded-bl-none shadow-sm"
                  }`}
                >
                  {!isMyMessage && (
                    <p className="text-xs font-semibold mb-1 opacity-75">
                      {msg.user_name}
                    </p>
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
                     <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                   )}
                   <p
                     className={`text-xs mt-1 ${
                       isMyMessage ? "text-echurch-100" : "text-gray-500"
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

      {/* Input */}
       <div className="bg-white border-t px-4 py-3 shadow-lg sticky bottom-0 z-30">
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
         <div className="flex gap-2 w-full">
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
             className="border-echurch-200 hover:bg-echurch-50 flex-shrink-0"
           >
             <ImageIcon size={18} className="text-echurch-500" />
           </Button>
           <Input
             placeholder="Type your message..."
             value={message}
             onChange={(e) => setMessage(e.target.value)}
             onKeyPress={handleKeyPress}
             disabled={sending || uploading}
             className="flex-1 border-echurch-200 focus:border-echurch-500"
           />
           <Button
             onClick={sendMessage}
             disabled={sending || uploading || (!message.trim() && !selectedImage)}
             className="bg-echurch-500 hover:bg-echurch-600 disabled:opacity-50 flex-shrink-0"
           >
             {sending || uploading ? (
               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
             ) : (
               <Send size={18} />
             )}
           </Button>
         </div>
       </div>
    </div>
  );
}

