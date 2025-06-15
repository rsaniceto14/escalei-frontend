
import { NavLink, useLocation } from "react-router-dom";
import { User, CalendarCheck, Music, MessageCircle, Settings } from "lucide-react";

const navItems = [
  { label: "Início", to: "/", icon: CalendarCheck },
  { label: "Perfil", to: "/profile", icon: User },
  { label: "Escalas", to: "/scales", icon: CalendarCheck },
  { label: "Chats", to: "/chats", icon: MessageCircle },
  { label: "Músicas", to: "/musics", icon: Music },
  { label: "Configurações", to: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="h-screen sticky top-0 left-0 w-64 bg-echurch-500 shadow-lg flex flex-col gap-2">
      <div className="mt-6 mb-8 text-white flex items-center justify-center font-bold text-2xl tracking-wide">
        <span className="font-bold mr-2">e</span>
        <span className="font-light">church</span>
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            to={to}
            key={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer
              ${isActive ? "bg-echurch-700 text-white" : "text-echurch-100 hover:bg-echurch-600 hover:text-white"}`
            }
          >
            <Icon size={22} className="shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mb-4 text-xs text-echurch-200 text-center font-light">Sistema para igrejas</div>
    </aside>
  );
}
