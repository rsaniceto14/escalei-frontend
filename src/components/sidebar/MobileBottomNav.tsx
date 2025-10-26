import { NavLink } from "react-router-dom";
import { mobileItems } from "./navigation";

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex justify-around py-3">
      {mobileItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
          className={({ isActive }) =>
            `flex items-center justify-center p-2 rounded-full ${
              isActive ? "bg-black/15 backdrop-blur-sm" : ""
            }`
          }
        >
          <item.icon className="w-6 h-6 text-black" />
        </NavLink>
      ))}
    </nav>
  );
}
