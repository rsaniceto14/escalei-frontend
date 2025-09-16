import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/common/Logo";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function SchedulesSetup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-echurch-50 via-background to-echurch-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h2 className="text-2xl font-bold text-echurch-700">Configurar Escalas</h2>
          <p className="text-muted-foreground">Configure escalas de trabalho e eventos</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Esta funcionalidade estará disponível em breve.</p>
            <p className="text-sm text-muted-foreground">
              Aqui você poderá criar escalas de trabalho para diferentes ministérios.
            </p>
          </div>

          <div className="flex gap-4">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/setup/invites">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
            </Button>
            
            <Button asChild className="flex-1 bg-gradient-to-r from-echurch-500 to-echurch-600">
              <Link to="/setup/music">
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}