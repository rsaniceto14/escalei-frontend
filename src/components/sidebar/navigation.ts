
import {
  Home,
  Calendar,
  Clock,
  MessageCircle,
  Music,
  User,
  Settings,
  Shield,
  Mail,
  Map,
} from "lucide-react";

export const mainItems = [
  { title: "Início", url: "/home", icon: Home },
  { title: "Escalas", url: "/schedules", icon: Calendar },
  { title: "Convites", url: "/invites", icon: Mail },
  { title: "Disponibilidade", url: "/availability", icon: Clock },
  { title: "Chats", url: "/chats", icon: MessageCircle },
  { title: "Músicas", url: "/musics", icon: Music },
  { title: "Áreas", url: "/areas", icon: Map },
];


export const configItems = [
  { title: "Perfil", url: "/profile", icon: User },
  { title: "Configurações", url: "/settings", icon: Settings },
];

export const adminItems = [
  { title: "Administração", url: "/admin", icon: Shield },
];
