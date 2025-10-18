import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/common/Logo";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { churchService } from "@/api/services/churchService";
import { authService } from "@/api";
import { useSearchParams } from "react-router-dom";
import { inviteService } from "@/api/services/inviteService";

export default function RegisterMember() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    church_id: "",
    area_ids: [],
    role_ids: [],
    birthday: "",
    token: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [churches, setChurches] = useState([]);
  const [searchParams] = useSearchParams();
  const [hasInvite, setHasInvite] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get("invite");

    const fetchChurches = async () => {
      try {
        const res = await churchService.getChurchesForRegister();
        setChurches(res);
      } catch (error) {
        console.error("Erro ao carregar igrejas:", error);
      }
    };

    const fetchInvite = async () => {
      if (!token) return;

      try {
        const response = await inviteService.getInviteByToken(token);
        const invite = response.data;

        setFormData(prev => ({
          ...prev,
          email: invite.email,
          church_id: invite.church_id.toString(),
          area_ids: invite.areas?.map(a => a.id) || [],
          role_ids: invite.roles?.map(r => r.id) || [],
          token,
        }));
        
        setHasInvite(true); // Mark that user has an invite
      } catch (err) {
        console.error("Erro ao carregar convite:", err);
        toast({
          title: "Convite inválido ou expirado",
          description: "O link que você usou não é mais válido.",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    fetchChurches();
    fetchInvite();
  }, [searchParams]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      console.debug("Registering member:", formData);
      
      // Send registration with token if present
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        birthday: formData.birthday,
        church_id: formData.church_id,
        token: formData.token || undefined,
      });

      toast({
        title: "Sucesso!",
        description: formData.token 
          ? "Cadastro realizado com sucesso! Você foi aprovado automaticamente."
          : "Cadastro realizado com sucesso. Aguarde a aprovação da administração.",
      });
      
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao realizar cadastro.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-echurch-50 via-background to-echurch-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%231e3a5f%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h2 className="text-2xl font-bold text-echurch-700">Cadastrar Membro</h2>
          <p className="text-muted-foreground">Junte-se a uma igreja no eChurch</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

           <Select 
              value={formData.church_id?.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, church_id: value }))}
              disabled={loading || hasInvite}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione sua igreja" />
              </SelectTrigger>
              <SelectContent>
                {churches.map((church) => (
                  <SelectItem key={church.id} value={church.id.toString()}>
                    {church.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasInvite && (
              <p className="text-xs text-muted-foreground">
                Igreja pré-selecionada pelo convite
              </p>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nome completo</label>
              <Input
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="h-11"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Data de nascimento</label>
              <Input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
                className="h-11"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">E-mail</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="h-11"
                required
                disabled={loading || hasInvite}
              />
              {hasInvite && (
                <p className="text-xs text-muted-foreground">
                  E-mail pré-preenchido pelo convite
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Senha</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="h-11 pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirmar senha</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                  className="h-11 pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-echurch-500 to-echurch-600 hover:from-echurch-600 hover:to-echurch-700"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Cadastrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Cadastrar
                  <ArrowRight size={16} />
                </div>
              )}
            </Button>

            <div className="text-center space-y-2">
              <Link
                to="/login"
                className="text-sm text-echurch-500 hover:text-echurch-700 hover:underline block"
              >
                Já possui uma conta? Fazer login
              </Link>
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground hover:underline flex items-center justify-center gap-1"
              >
                <ArrowLeft size={14} />
                Voltar ao início
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}