
import {
  Home,
  Calendar,
  Clock,
  MessageCircle,
  Music,
  User,
  Settings,
  Shield,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "../common/Logo";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isCollapsed = state === "collapsed";
  const isAdmin = localStorage.getItem("userRole") === "admin";

  const mainItems = [
    { title: "Início", url: "/", icon: Home },
    { title: "Escalas", url: "/scales", icon: Calendar },
    { title: "Disponibilidade", url: "/availability", icon: Clock },
    { title: "Chats", url: "/chats", icon: MessageCircle },
    { title: "Músicas", url: "/musics", icon: Music },
  ];

  const configItems = [
    { title: "Perfil", url: "/profile", icon: User },
    { title: "Configurações", url: "/settings", icon: Settings },
    ...(isAdmin ? [{ title: "Administração", url: "/admin", icon: Shield }] : []),
  ];

  const getNavCls = ({ isActive }: { isActive: boolean }) => {
    return `group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-echurch-100 hover:text-echurch-700 data-[active=true]:bg-echurch-100 data-[active=true]:text-echurch-700 ${
      isActive ? "bg-echurch-100 text-echurch-700" : "text-echurch-500"
    }`;
  };

  return (
    <Sidebar
      className={isCollapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <div className="p-4 bg-gradient-to-br from-echurch-50 to-echurch-100 md:bg-transparent rounded-br-xl">
        {!isCollapsed && <Logo />}
        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-echurch-400 to-echurch-600 rounded-lg flex items-center justify-center" />
        )}
      </div>

      <SidebarContent className="px-2 bg-white/95 md:bg-transparent shadow-2xl md:shadow-none rounded-br-xl">
        {/* Menu Principal */}
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-5 h-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configurações */}
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Configurações</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-5 h-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
