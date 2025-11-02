
import {
  Home,
  Calendar,
  Clock,
  MessageCircle,
  Music,
  User,
  Shield,
  Mail,
  MessageSquareWarning,
} from "lucide-react";

export const mainItems = [
  { title: "Início", url: "/home", icon: Home },
  { title: "Escalas", url: "/schedules", icon: Calendar },
  { title: "Convites", url: "/invites", icon: Mail },
  { title: "Disponibilidade", url: "/availability", icon: Clock },
  { title: "Chats", url: "/chats", icon: MessageCircle },
  { title: "Músicas", url: "/musics", icon: Music },
];

export const mobileItems = [
  { title: "Disponibilidade", url: "/availability", icon: Clock },
  { title: "Escalas", url: "/schedules", icon: Calendar },
  { title: "Início", url: "/home", icon: Home },
  { title: "Chats", url: "/chats", icon: MessageCircle },
  { title: "Músicas", url: "/musics", icon: Music },
];


export const configItems = [
  { title: "Perfil", url: "/profile", icon: User },
];

export const adminItems = [
  { title: "Comunicados", url: "/handouts", icon: MessageSquareWarning },
  { title: "Administração", url: "/admin", icon: Shield },
];
