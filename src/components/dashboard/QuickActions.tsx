
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Plus, Settings } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Nova Escala",
      icon: Plus,
      path: "/scales/create"
    },
    {
      title: "Disponibilidade", 
      icon: Calendar,
      path: "/availability"
    },
    {
      title: "Músicas",
      icon: "🎵",
      path: "/musics"
    },
    {
      title: "Configurações",
      icon: Settings,
      path: "/settings"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Link key={action.title} to={action.path}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 text-center">
              {typeof action.icon === "string" ? (
                <div className="w-8 h-8 mx-auto mb-2 text-echurch-500 flex items-center justify-center text-lg">
                  {action.icon}
                </div>
              ) : (
                <action.icon className="w-8 h-8 mx-auto mb-2 text-echurch-500" />
              )}
              <p className="font-medium text-sm">{action.title}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
