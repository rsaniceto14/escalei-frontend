import { TrendingUp, Users, Calendar, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Mock data for statistics
const stats = [
  {
    title: "Escalas Ativas",
    value: "12",
    icon: Calendar,
    change: "+3 esta semana",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Participantes",
    value: "48",
    icon: Users,
    change: "+5 novos membros",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Taxa de Confirmação",
    value: "92%",
    icon: CheckCircle,
    change: "+8% este mês",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Crescimento",
    value: "+15%",
    icon: TrendingUp,
    change: "comparado ao mês anterior",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

export function StatementSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
