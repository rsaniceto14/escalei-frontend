import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/common/Logo";
import { Users, Church, LogIn } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-echurch-50 via-background to-echurch-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%231e3a5f%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <Logo />
          <h1 className="text-4xl font-bold text-echurch-700 mt-6 mb-4">
            Bem-vindo ao eChurch
          </h1>
          <p className="text-xl text-muted-foreground">
            Gerencie suas escalas e atividades da igreja de forma simples e eficiente
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <LogIn className="w-12 h-12 mx-auto mb-4 text-echurch-500" />
              <CardTitle className="text-echurch-700">Fazer Login</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 text-center">
                Já possui uma conta? Entre para acessar suas escalas e atividades.
              </p>
              <Link to="/login" className="block">
                <Button className="w-full bg-gradient-to-r from-echurch-500 to-echurch-600 hover:from-echurch-600 hover:to-echurch-700">
                  Entrar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <Users className="w-12 h-12 mx-auto mb-4 text-echurch-500" />
              <CardTitle className="text-echurch-700">Cadastrar Membro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 text-center">
                Faça parte de uma igreja já cadastrada no sistema.
              </p>
              <Link to="/register-member" className="block">
                <Button variant="outline" className="w-full border-echurch-200 text-echurch-600 hover:bg-echurch-50">
                  Cadastrar como Membro
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <Church className="w-12 h-12 mx-auto mb-4 text-echurch-500" />
              <CardTitle className="text-echurch-700">Cadastrar Igreja</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 text-center">
                Registre sua igreja no sistema e comece a gerenciar suas atividades.
              </p>
              <Link to="/register-church" className="block">
                <Button variant="outline" className="w-full border-echurch-200 text-echurch-600 hover:bg-echurch-50">
                  Cadastrar Igreja
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}