
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Settings } from "lucide-react";

export function ActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Link to="/schedules" className="flex-1">
        <Button className="w-full bg-echurch-500 hover:bg-echurch-600 h-12">
          <Calendar className="w-4 h-4 mr-2" />
          Visualizar Todas as Escalas
        </Button>
      </Link>
      <Link to="/availability" className="flex-1">
        <Button variant="outline" className="w-full border-echurch-200 text-echurch-700 hover:bg-echurch-50 h-12">
          <Settings className="w-4 h-4 mr-2" />
          Configurar Disponibilidade
        </Button>
      </Link>
    </div>
  );
}
