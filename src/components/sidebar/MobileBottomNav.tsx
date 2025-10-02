import { NavLink } from "react-router-dom";
import { mobileItems } from "./navigation";

export function MobileBottomNav() {
  return (
    <nav className=" bottom-0 left-0 right-0 bg-white border-t z-50 flex justify-around py-3">
      {mobileItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center text-xs ${
              isActive ? "text-echurch-700" : "text-echurch-400"
            }`
          }
        >
          <item.icon className="w-6 h-6" />
        </NavLink>
      ))}
    </nav>
  );
}
