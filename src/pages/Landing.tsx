import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/common/Logo";
import { Users, Church, LogIn, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { SafeArea } from "capacitor-plugin-safe-area";

export default function Landing() {
  const isMobile = useIsMobile();
  const [safeArea, setSafeArea] = useState({ top: 0, bottom: 0, left: 0, right: 0 });

  useEffect(() => {
    const getSafeAreaInsets = async () => {
      try {
        const insets = await SafeArea.getSafeAreaInsets();
        setSafeArea(insets.insets);
      } catch (error) {
        console.log('SafeArea not available:', error);
      }
    };

    getSafeAreaInsets();
  }, []);

  if (isMobile) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-echurch-500 via-echurch-600 to-echurch-700 flex flex-col items-center justify-center p-4 sm:p-6 text-white relative overflow-hidden"
        style={{
          paddingTop: Math.max(safeArea.top, 16),
          paddingBottom: Math.max(safeArea.bottom, 16),
          paddingLeft: Math.max(safeArea.left, 16),
          paddingRight: Math.max(safeArea.right, 16)
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-white/10 rounded-full blur-lg animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10 text-center mb-8 sm:mb-12">
          <div className="mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 backdrop-blur-sm shadow-2xl">
              <img 
                src="/logo_size_invert.jpg" 
                alt="Escalei Logo" 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover" 
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-white to-echurch-100 bg-clip-text text-transparent">
              Escalei
            </h1>
            <p className="text-echurch-100 text-base sm:text-lg font-medium px-4">
              Escalando um mundo de oportunidades!
            </p>
          </div>
        </div>

       <div className="w-full max-w-sm flex flex-col space-y-4 relative z-10 px-2">
          <Link to="/login">
            <Button className="w-full h-14 sm:h-16 bg-white text-echurch-600 hover:bg-echurch-50 font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-white/20 active:scale-95">
              <LogIn className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              Fazer Login
            </Button>
          </Link>

          <Link to="/register-member">
            <Button variant="outline" className="w-full h-14 sm:h-16 border-2 border-white/50 text-white hover:bg-white/20 font-semibold text-base sm:text-lg backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/10 active:scale-95">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              Cadastrar Membro
            </Button>
          </Link>
          
          <Link to="/register-church">
            <Button variant="outline" className="w-full h-14 sm:h-16 border-2 border-white/50 text-white hover:bg-white/20 font-semibold text-base sm:text-lg backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/10 active:scale-95">
              <Church className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              Cadastrar Igreja
            </Button>
          </Link>
        </div>

        <div className="mt-10 sm:mt-12 flex items-center justify-center text-echurch-200 text-xs sm:text-sm px-4">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
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
            Bem-vindo ao <span className="bg-gradient-to-r from-echurch-500 to-echurch-700 bg-clip-text text-transparent">Escalei</span>
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