import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

// Mock data for comunicados
const comunicados = [
  {
    id: 1,
    title: "Ensaio Geral - Domingo",
    message: "Ensaio geral marcado para domingo às 15h. Presença obrigatória para todos os músicos.",
    date: "Há 2 horas",
    priority: "high",
  },
  {
    id: 2,
    title: "Nova Música Adicionada",
    message: "A música 'Rompendo em Fé' foi adicionada ao repertório deste mês.",
    date: "Ontem",
    priority: "normal",
  },
  {
    id: 3,
    title: "Atualização de Horários",
    message: "Os horários das escalas foram atualizados. Verifique sua disponibilidade.",
    date: "2 dias atrás",
    priority: "normal",
  },
];

export function Comunicados() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-echurch-600" />
          Comunicados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {comunicados.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum comunicado no momento
          </p>
        ) : (
          comunicados.map((comunicado) => (
            <div
              key={comunicado.id}
              className={`p-3 rounded-lg border ${
                comunicado.priority === "high"
                  ? "bg-orange-50 border-orange-200"
                  : "bg-white border-gray-200"
              } hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-semibold text-sm text-foreground">
                  {comunicado.title}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {comunicado.date}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {comunicado.message}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
