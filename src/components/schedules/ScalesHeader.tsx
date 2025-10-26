import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const ScalesHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-echurch-700">Escalas</h1>
        <p className="text-echurch-600 mt-1">Gerencie e visualize as escalas de serviço</p>
      </div>
      <Link to="/schedules/create">
        <Button className="bg-echurch-500 hover:bg-echurch-600">
          <Plus className="w-4 h-4 mr-2" />
          Nova Escala
        </Button>
      </Link>
    </div>
  );
};
