import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/common/Logo";
import { Users, Calendar, Music, ArrowRight, CheckCircle } from "lucide-react";

export default function ChurchSetup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-echurch-50 via-background to-echurch-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csv%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%231e3a5f%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <Card className="w-full max-w-4xl relative z-10 shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h2 className="text-3xl font-bold text-echurch-700">Configuração Inicial</h2>
          <p className="text-muted-foreground">Configure sua igreja no eChurch (todas as etapas são opcionais)</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Areas and Functions */}
            <Card className="border-2 border-dashed border-echurch-200 hover:border-echurch-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-echurch-100 to-echurch-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-echurch-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Áreas e Funções</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure as áreas de ministério e funções da sua igreja
                </p>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full border-echurch-200 hover:bg-echurch-50"
                >
                  <Link to="/setup/areas">
                    Configurar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Invites */}
            <Card className="border-2 border-dashed border-echurch-200 hover:border-echurch-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-echurch-100 to-echurch-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-echurch-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Convites</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Convide membros para participar da sua igreja
                </p>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full border-echurch-200 hover:bg-echurch-50"
                >
                  <Link to="/setup/invites">
                    Configurar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Schedules */}
            <Card className="border-2 border-dashed border-echurch-200 hover:border-echurch-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-echurch-100 to-echurch-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-echurch-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Escalas</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure escalas de trabalho e eventos
                </p>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full border-echurch-200 hover:bg-echurch-50"
                >
                  <Link to="/setup/schedules">
                    Configurar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Music */}
            <Card className="border-2 border-dashed border-echurch-200 hover:border-echurch-300 transition-colors md:col-span-3">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-echurch-100 to-echurch-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-echurch-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Músicas</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Adicione o repertório musical da sua igreja
                </p>
                <Button 
                  asChild 
                  variant="outline" 
                  className="border-echurch-200 hover:bg-echurch-50"
                >
                  <Link to="/setup/music">
                    Configurar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button 
              asChild 
              className="flex-1 h-12 bg-gradient-to-r from-echurch-500 to-echurch-600 hover:from-echurch-600 hover:to-echurch-700"
            >
              <Link to="/login">
                <CheckCircle className="w-5 h-5 mr-2" />
                Finalizar e Fazer Login
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="sm:w-auto border-echurch-200 hover:bg-echurch-50"
            >
              <Link to="/login">
                Pular Configurações
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}