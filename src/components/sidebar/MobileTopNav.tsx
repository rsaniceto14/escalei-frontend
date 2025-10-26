import { NavLink } from "react-router-dom";
import { User } from "lucide-react";

export function MobileTopNav() {
  return (
    <nav className="bottom-0 w-full left-0 right-0 bg-white z-50 flex items-center justify-between px-4 py-2">
      {/* Imagem retangular no canto esquerdo */}
      <img 
        src="image.png" 
        alt="Escalei Logo" 
        className="object-cover rounded-md w-65 h-14" 
      />

      {/* Botão de perfil no lado direito */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex items-center justify-center p-2 rounded-full ${
            isActive ? "bg-black/15 backdrop-blur-sm" : ""
          }`
        }
      >
        <User className="w-6 h-6 text-black" />
      </NavLink>
    </nav>
  );
}
