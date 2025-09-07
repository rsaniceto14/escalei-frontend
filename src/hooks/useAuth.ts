import { useState, useEffect, createContext, useContext } from 'react';
import { authService, userService, User } from '@/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${response.user.name}!`,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro no login';
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      userService.getProfile()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}