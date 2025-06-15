
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/common/Logo";
import { LoginTransition } from "@/components/common/LoginTransition";
import { Eye, EyeOff, ArrowRight, MapPin } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const navigate = useNavigate();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }
    
    setLoading(true);
    setErro("");
    
    setTimeout(() => {
      if (email === "demo@e-church.com" && senha === "123456") {
        localStorage.setItem("jwt", "demo-jwt");
        setLoading(false);
        setShowTransition(true);
      } else if (email === "admin@e-church.com" && senha === "admin123") {
        localStorage.setItem("jwt", "admin-jwt");
        localStorage.setItem("userRole", "admin");
        setLoading(false);
        setShowTransition(true);
      } else {
        setErro("Usuário ou senha inválidos.");
        setLoading(false);
      }
    }, 1500);
  }

  const handleTransitionComplete = () => {
    navigate("/");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-echurch-50 via-white to-echurch-100 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%231e3a5f%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-6">
              <Logo />
            </div>
            <h2 className="text-2xl font-bold text-echurch-700">Acesse sua conta</h2>
            <p className="text-echurch-600">Entre para gerenciar suas escalas</p>
            
            {/* Informação da Igreja */}
            <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-echurch-50 rounded-lg">
              <MapPin className="w-4 h-4 text-echurch-500" />
              <span className="text-sm font-medium text-echurch-700">Igreja Batista Central</span>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {erro && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm animate-fade-in">
                  {erro}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-echurch-700">E-mail</label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-11"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-echurch-700">Senha</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    className="h-11 pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-echurch-400 hover:text-echurch-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-echurch-500 to-echurch-600 hover:from-echurch-600 hover:to-echurch-700 shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Verificando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Entrar
                    <ArrowRight size={16} />
                  </div>
                )}
              </Button>
              
              <div className="text-center">
                <Link
                  to="/recuperar"
                  className="text-sm text-echurch-500 hover:text-echurch-700 hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </form>
            
            <div className="mt-6 p-4 bg-echurch-50 rounded-lg">
              <p className="text-xs text-echurch-600 text-center mb-2">Contas de teste:</p>
              <div className="text-xs text-echurch-500 space-y-1">
                <div><strong>Usuário:</strong> demo@e-church.com / 123456</div>
                <div><strong>Admin:</strong> admin@e-church.com / admin123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <LoginTransition 
        isVisible={showTransition} 
        onComplete={handleTransitionComplete}
      />
    </>
  );
}
