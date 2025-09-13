import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  photo_path?: string;
  church_id: string;
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize from localStorage
    const storedToken = localStorage.getItem("jwt");
    const storedUserId = localStorage.getItem("user_id");
    const storedUserName = localStorage.getItem("user_name");
    const storedUserEmail = localStorage.getItem("user_email");
    const storedUserPhoto = localStorage.getItem("user_photo");
    const storedChurchId = localStorage.getItem("church_id");

    if (storedToken && storedUserId && storedUserName && storedUserEmail && storedChurchId) {
      setToken(storedToken);
      setUser({
        id: storedUserId,
        name: storedUserName,
        email: storedUserEmail,
        photo_path: storedUserPhoto || undefined,
        church_id: storedChurchId,
      });
    }
    setIsLoading(false);
  }, []);

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
