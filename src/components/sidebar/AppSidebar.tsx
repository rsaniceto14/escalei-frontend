
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
import { mainItems, configItems, adminItems } from "./navigation";
import { useAuth } from "@/context/AuthContext";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();

  const isCollapsed = state === "collapsed";
  const isAdmin = localStorage.getItem("userRole") === "admin";

  // Check if user has any area permissions
  const hasAreaPermissions = user?.permissions && (
    user.permissions.create_area ||
    user.permissions.read_area ||
    user.permissions.update_area ||
    user.permissions.delete_area
  );

  // Filter main items based on permissions
  const filteredMainItems = mainItems.filter(item => {
    if (item.url === "/areas") {
      return hasAreaPermissions;
    }
    return true;
  });

  const getNavCls = ({ isActive }: { isActive: boolean }) => {
    return `group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-echurch-100 hover:text-echurch-700 data-[active=true]:bg-echurch-100 data-[active=true]:text-echurch-700 ${
      isActive ? "bg-echurch-100 text-echurch-700" : "text-echurch-500"
    }`;
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
    </Sidebar>
  );
}
