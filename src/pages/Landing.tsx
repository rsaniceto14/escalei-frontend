import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/common/Logo";
import { Users, Church, LogIn, Sparkles, Heart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Landing() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-echurch-500 via-echurch-600 to-echurch-700 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-white/10 rounded-full blur-lg animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10 text-center mb-12">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm shadow-2xl">
              <Heart className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-echurch-100 bg-clip-text text-transparent">
              eChurch
            </h1>
            <p className="text-echurch-100 text-lg font-medium">
              Gestão Inteligente para sua Igreja
            </p>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-6 relative z-10">
          <Link to="/login">
            <Button className="w-full h-16 bg-white text-echurch-600 hover:bg-echurch-50 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-white/20">
              <LogIn className="w-6 h-6 mr-3" />
              Fazer Login
            </Button>
          </Link>
          
          <Link to="/register-member">
            <Button variant="outline" className="w-full h-16 border-2 border-white/50 text-white hover:bg-white/20 font-semibold text-lg backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/10">
              <Users className="w-6 h-6 mr-3" />
              Cadastrar Membro
            </Button>
          </Link>
          
          <Link to="/register-church">
            <Button variant="outline" className="w-full h-16 border-2 border-white/50 text-white hover:bg-white/20 font-semibold text-lg backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/10">
              <Church className="w-6 h-6 mr-3" />
              Cadastrar Igreja
            </Button>
          </Link>
        </div>

        <div className="mt-8 flex items-center text-echurch-200 text-sm">
          <Sparkles className="w-4 h-4 mr-2" />
          <span>Transformando a gestão da sua igreja</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-echurch-50 via-background to-echurch-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3d%22%231e3a5f%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-echurch-200/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-echurch-300/20 rounded-full blur-2xl animate-pulse"></div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl">
            <Logo />
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-echurch-700 mb-6 leading-tight">
            Bem-vindo ao <span className="bg-gradient-to-r from-echurch-500 to-echurch-700 bg-clip-text text-transparent">eChurch</span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Gerencie suas escalas e atividades da igreja de forma simples, inteligente e eficiente
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="group shadow-2xl border-0 bg-gradient-to-br from-white/95 to-echurch-50/50 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-echurch-400 to-echurch-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-echurch-700 font-bold">Fazer Login</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Já possui uma conta? Entre para acessar suas escalas e atividades.
              </p>
              <Link to="/login">
                <Button className="w-full h-12 bg-gradient-to-r from-echurch-500 to-echurch-600 hover:from-echurch-600 hover:to-echurch-700 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
                  Entrar
                  <LogIn className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group shadow-2xl border-0 bg-gradient-to-br from-white/95 to-echurch-50/50 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-echurch-400 to-echurch-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-echurch-700 font-bold">Cadastrar Membro</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Faça parte de uma igreja já cadastrada no sistema.
              </p>
              <Link to="/register-member">
                <Button variant="outline" className="w-full h-12 border-2 border-echurch-300 text-echurch-600 hover:bg-echurch-50 hover:border-echurch-400 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
                  Cadastrar como Membro
                  <Users className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group shadow-2xl border-0 bg-gradient-to-br from-white/95 to-echurch-50/50 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-echurch-400 to-echurch-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Church className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-echurch-700 font-bold">Cadastrar Igreja</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Registre sua igreja no sistema e comece a gerenciar suas atividades.
              </p>
              <Link to="/register-church">
                <Button variant="outline" className="w-full h-12 border-2 border-echurch-300 text-echurch-600 hover:bg-echurch-50 hover:border-echurch-400 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
                  Cadastrar Igreja
                  <Church className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-echurch-600 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Transformando a gestão da sua igreja</span>
          </div>
        </div>
      </div>
    </div>
  );
}