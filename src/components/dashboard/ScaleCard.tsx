
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { ReactNode } from "react";
import { formatDate } from "@/utils/dateUtils";

interface Scale {
  nome: string;
  data: string;
  horario: string;
  local: string;
  tipo: string;
  status: string;
}

interface ScaleCardProps {
  title: string;
  icon: ReactNode;
  scales: Scale[];
  variant: "confirmed" | "pending";
  emptyMessage: string;
  emptyDescription: string;
}

export function ScaleCard({ title, icon, scales, variant, emptyMessage, emptyDescription }: ScaleCardProps) {
  const bgColor = variant === "confirmed" ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200";
  const badgeColor = variant === "confirmed" ? "bg-green-100 text-green-800" : "";

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-echurch-600">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {scales.length > 0 ? (
          scales.map((esc, i) => (
            <div
              key={i}
              className={`flex flex-col gap-3 p-4 rounded-lg ${bgColor}`}
            >
              <div className="space-y-1">
                <div className="font-medium text-echurch-700">{esc.nome}</div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-echurch-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(esc.data)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {esc.horario}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {esc.local}
                  </div>
                </div>
              </div>
              {variant === "confirmed" ? (
                <Badge variant="secondary" className={badgeColor}>
                  {esc.tipo}
                </Badge>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button size="sm" className="bg-echurch-500 hover:bg-echurch-600 flex-1">
                    Confirmar Participação
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Detalhes
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-echurch-500">
            {variant === "confirmed" ? (
              <CheckCircle className="w-16 h-16 mx-auto mb-3 opacity-50" />
            ) : (
              <AlertCircle className="w-16 h-16 mx-auto mb-3 opacity-50" />
            )}
            <p className="text-lg font-medium">{emptyMessage}</p>
            <p className="text-sm">{emptyDescription}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
