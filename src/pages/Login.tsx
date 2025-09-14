
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/common/Logo";
import { LoginTransition } from "@/components/common/LoginTransition";
import { Eye, EyeOff, ArrowRight, MapPin } from "lucide-react";
import { authService } from "../api/services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginStep, setLoginStep] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    setErro("");
    setLoading(true);
    setLoginStep('pending'); // inicia a animação

    try {
      const res = await authService.login({ email, password: senha });

      // Use context login method
      login(res.access_token, {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        photo_path: res.user.photo_path,
        church_id: res.user.church_id,
      });

      setLoginStep('success'); // animação de sucesso

      navigate("/home");

    } catch (error: any) {
      setErro(error.message || "Erro ao autenticar.");
      setLoginStep('idle');
    } finally {
      setLoading(false);
    }
  }
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

              <div className="text-center space-y-2">
                <Link
                  to="/request-reset"
                  className="text-sm text-echurch-500 hover:text-echurch-700 hover:underline block"
                >
                  Esqueceu a senha?
                </Link>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Voltar ao início
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <LoginTransition
        isVisible={loginStep !== 'idle'}
        loginStatus={loginStep}
      />

    </>
  );
}
