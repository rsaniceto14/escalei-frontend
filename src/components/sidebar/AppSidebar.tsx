
import { NavLink } from "react-router-dom";
import { User, CalendarCheck, Music, MessageCircle, Settings, Clock } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel
} from "@/components/ui/sidebar";

const navItems = [
  { label: "Início", to: "/", icon: CalendarCheck },
  { label: "Escalas", to: "/scales", icon: CalendarCheck },
  { label: "Disponibilidade", to: "/availability", icon: Clock },
  { label: "Músicas", to: "/musics", icon: Music },
  { label: "Chats", to: "/chats", icon: MessageCircle },
];

const configItems = [
  { label: "Perfil", to: "/profile", icon: User },
  { label: "Configurações", to: "/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-echurch-200">
      <SidebarHeader className="p-6">
        <div className="text-white flex items-center justify-center font-bold text-2xl tracking-wide bg-echurch-500 rounded-lg py-3">
          <span className="font-bold mr-2">e</span>
          <span className="font-light">church</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-echurch-600 font-semibold">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ label, to, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={to}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer
                        ${isActive ? "bg-echurch-500 text-white" : "text-echurch-700 hover:bg-echurch-100"}`
                      }
                    >
                      <Icon size={20} className="shrink-0" />
                      <span>{label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-echurch-600 font-semibold">
            Conta
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map(({ label, to, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer
                        ${isActive ? "bg-echurch-500 text-white" : "text-echurch-700 hover:bg-echurch-100"}`
                      }
                    >
                      <Icon size={20} className="shrink-0" />
                      <span>{label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-echurch-500 text-center font-light">
          Sistema para igrejas
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
