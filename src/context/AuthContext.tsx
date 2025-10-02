import { Area, Permission } from "@/api";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  photo_path?: string;
  church_id: number;
  permissions: Permission;
  areas: Array<Area>
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with localStorage values immediately to prevent race condition
  const [user, setUser] = useState<User | null>(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedUserName = localStorage.getItem("user_name");
    const storedUserEmail = localStorage.getItem("user_email");
    const storedUserPhoto = localStorage.getItem("user_photo");
    const storedChurchId = localStorage.getItem("church_id");

    if (storedUserId && storedUserName && storedUserEmail && storedChurchId) {
      return {
        id: storedUserId,
        name: storedUserName,
        email: storedUserEmail,
        photo_path: storedUserPhoto || undefined,
        church_id: storedChurchId,
        permissions: JSON.parse(localStorage.getItem("user_permissions") || "{}"),
        areas: JSON.parse(localStorage.getItem("user_areas") || "[]"),
      };
    }
    return null;
  });
  
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("jwt"));
  const [isLoading, setIsLoading] = useState(false);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    
    // Store in localStorage
    localStorage.setItem("jwt", newToken);
    localStorage.setItem("user_id", userData.id);
    localStorage.setItem("user_name", userData.name);
    localStorage.setItem("user_email", userData.email);
    if (userData.photo_path) {
      localStorage.setItem("user_photo", userData.photo_path);
    }
    localStorage.setItem("church_id", userData.church_id);
    localStorage.setItem("user_permissions", JSON.stringify(userData.permissions));
    localStorage.setItem("user_areas", JSON.stringify(userData.areas));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    
    // Clear localStorage
    localStorage.removeItem("jwt");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_photo");
    localStorage.removeItem("church_id");
    localStorage.removeItem("user_permissions");
    localStorage.removeItem("user_areas");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
