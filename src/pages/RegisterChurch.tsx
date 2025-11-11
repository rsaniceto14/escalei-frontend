import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/common/Logo";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/api/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function RegisterChurch() {
  const [formData, setFormData] = useState({
    // Church fields
    church_name: "",
    church_phone: "",
    // Address fields
    church_cep: "",
    church_street: "",
    church_number: "",
    church_complement: "",
    church_quarter: "",
    church_city: "",
    church_state: "",
    // Admin fields
    user_name: "",
    user_email: "",
    user_birthday: "",
    user_password: "",
    user_password_confirmation: "",
  });
  const [loadingCep, setLoadingCep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const fetchAddressByCep = async (cep: string) => {
    if (cep.length !== 8) return;
    
    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          church_street: data.logradouro || "",
          church_quarter: data.bairro || "",
          church_city: data.localidade || "",
          church_state: data.uf || "",
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    setFormData(prev => ({ ...prev, church_cep: cep }));
    
    if (cep.length === 8) {
      fetchAddressByCep(cep);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.user_password !== formData.user_password_confirmation) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await authService.registerChurch(formData);
      
      // Store user data and church_id in AuthContext
      login(response.data.access_token, {
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        photo_path: response.data.user.photo_path,
        church_id: response.data.church_id,
        permissions: response.data.permissions,
        areas: response.data.areas,
      });
      
      toast({
        title: "Sucesso!",
        description: "Igreja cadastrada com sucesso!",
      });
      
      navigate("/home");
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

      <Card className="w-full max-w-2xl relative z-10 shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h2 className="text-2xl font-bold text-echurch-700">Cadastrar Igreja</h2>
          <p className="text-muted-foreground">Registre sua igreja no Escalei</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Church Information */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">Informações da Igreja</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nome da Igreja *</label>
                  <Input
                    type="text"
                    placeholder="Nome da sua igreja"
                    value={formData.church_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, church_name: e.target.value }))}
                    className="h-11"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Telefone da Igreja</label>
                  <Input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.church_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, church_phone: e.target.value }))}
                    className="h-11"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">Endereço da Igreja</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">CEP</label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="00000-000"
                      value={formData.church_cep}
                      onChange={handleCepChange}
                      className="h-11"
                      maxLength={8}
                      disabled={loading || loadingCep}
                    />
                    {loadingCep && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Rua</label>
                    <Input
                      type="text"
                      placeholder="Nome da rua"
                      value={formData.church_street}
                      onChange={(e) => setFormData(prev => ({ ...prev, church_street: e.target.value }))}
                      className="h-11"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Bairro</label>
                    <Input
                      type="text"
                      placeholder="Bairro"
                      value={formData.church_quarter}
                      onChange={(e) => setFormData(prev => ({ ...prev, church_quarter: e.target.value }))}
                      className="h-11"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Número *</label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={formData.church_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, church_number: e.target.value }))}
                      className="h-11"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Complemento</label>
                    <Input
                      type="text"
                      placeholder="Apto 101"
                      value={formData.church_complement}
                      onChange={(e) => setFormData(prev => ({ ...prev, church_complement: e.target.value }))}
                      className="h-11"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Estado</label>
                    <Input
                      type="text"
                      placeholder="SP"
                      value={formData.church_state}
                      onChange={(e) => setFormData(prev => ({ ...prev, church_state: e.target.value }))}
                      className="h-11"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Cidade</label>
                  <Input
                    type="text"
                    placeholder="Sua cidade"
                    value={formData.church_city}
                    onChange={(e) => setFormData(prev => ({ ...prev, church_city: e.target.value }))}
                    className="h-11"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Administrator Information */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Dados do Administrador</h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Nome Completo *</label>
                    <Input
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.user_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, user_name: e.target.value }))}
                      className="h-11"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Data de Nascimento *</label>
                    <Input
                      type="date"
                      value={formData.user_birthday}
                      onChange={(e) => setFormData(prev => ({ ...prev, user_birthday: e.target.value }))}
                      className="h-11"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">E-mail *</label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.user_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, user_email: e.target.value }))}
                    className="h-11"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Senha *</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.user_password}
                        onChange={(e) => setFormData(prev => ({ ...prev, user_password: e.target.value }))}
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
                    <label className="text-sm font-medium text-foreground">Confirmar Senha *</label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.user_password_confirmation}
                        onChange={(e) => setFormData(prev => ({ ...prev, user_password_confirmation: e.target.value }))}
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
                </div>
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
                  Cadastrar Igreja
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