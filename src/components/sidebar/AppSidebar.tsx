
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Logo } from "../common/Logo";
import { mainItems, configItems, adminItems } from "./navigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isCollapsed = state === "collapsed";
  const isAdmin = user.permissions.manage_users;

  // Filter main items based on permissions
  const filteredMainItems = mainItems.filter(item => {
    if (item.url === "/areas") {
      return user.permissions.read_area;
    }
    if (item.url === "/handouts") {
      return user.permissions.manage_handouts;
    }
    return true;
  });

  const getNavCls = ({ isActive }: { isActive: boolean }) => {
    return `group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-echurch-100 hover:text-echurch-700 data-[active=true]:bg-echurch-100 data-[active=true]:text-echurch-700 ${
      isActive ? "bg-echurch-100 text-echurch-700" : "text-echurch-500"
    } ${isCollapsed ? "justify-center px-2" : ""}`;
  };

  const handleLogout = async () => {
    try {
      // Call backend logout if needed
      // await authService.logout();
      
      // Clear local state and storage
      logout();
      
      // Show success message
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      // Navigate to login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if backend fails, clear local state
      logout();
      navigate("/login");
    }
  };

  const renderMenuItems = (items: typeof mainItems) => (
    <SidebarMenu>
      {items.map((item) => (
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
  );

  return (
    <Sidebar
      className={`${isCollapsed ? "w-25" : "w-64"}`}
      collapsible="icon"
    >
      <div className="p-4 bg-gradient-to-br from-echurch-50 to-echurch-100 md:bg-transparent">
        {!isCollapsed && <Logo />}
        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-echurch-400 to-echurch-600 rounded-lg flex items-center justify-center" />
        )}
      </div>

      <SidebarContent className={`${isCollapsed ? "px-1" : "px-2"} bg-white/95 md:bg-transparent shadow-2xl md:shadow-none rounded-br-xl`}>
        {/* Menu Principal */}
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>}
          <SidebarGroupContent>
            {renderMenuItems(filteredMainItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configurações */}
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Configurações</SidebarGroupLabel>}
          <SidebarGroupContent>
            {renderMenuItems([...configItems, ...(isAdmin ? adminItems : [])])}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Info and Logout Button */}
      <SidebarFooter className={`${isCollapsed ? "p-1" : "p-2"} bg-white/95 md:bg-transparent shadow-2xl md:shadow-none rounded-tr-xl`}>
        <div className="space-y-2">
          {/* User Info */}
          {user && (
            <div className={`flex items-center gap-3 py-2 rounded-md bg-echurch-50 ${isCollapsed ? 'justify-center px-2' : 'px-3'}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-echurch-400 to-echurch-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-echurch-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-echurch-500 truncate">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="destructive"
            size={isCollapsed ? "icon" : "default"}
            className={`w-full ${isCollapsed ? 'h-10 w-10' : 'h-10'} bg-red-500 hover:bg-red-600 text-white font-medium transition-colors`}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Sair</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
