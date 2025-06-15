
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

type Excecao = {
  id: number;
  data: string;
  turno: string;
  motivo: string;
};

export function ExceptionDates() {
  const [excecoes, setExcecoes] = useState<Excecao[]>([
    {
      id: 1,
      data: "2025-06-20",
      turno: "noite",
      motivo: "Viagem pessoal"
    }
  ]);

  const [novaExcecao, setNovaExcecao] = useState({
    data: "",
    turno: "",
    motivo: ""
  });

  const turnos = [
    { value: "manha", label: "Manhã" },
    { value: "tarde", label: "Tarde" },
    { value: "noite", label: "Noite" },
    { value: "dia_todo", label: "Dia todo" }
  ];

  const handleAddException = () => {
    if (!novaExcecao.data || !novaExcecao.turno) {
      toast.error("Data e turno são obrigatórios");
      return;
    }

    const newId = Math.max(...excecoes.map(e => e.id), 0) + 1;
    setExcecoes([...excecoes, {
      id: newId,
      ...novaExcecao
    }]);

    setNovaExcecao({ data: "", turno: "", motivo: "" });
    toast.success("Exceção adicionada com sucesso!");
  };

  const removeException = (id: number) => {
    setExcecoes(excecoes.filter(e => e.id !== id));
    toast.success("Exceção removida");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={novaExcecao.data}
                onChange={(e) => setNovaExcecao({...novaExcecao, data: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="turno">Turno</Label>
              <Select value={novaExcecao.turno} onValueChange={(value) => setNovaExcecao({...novaExcecao, turno: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno" />
                </SelectTrigger>
                <SelectContent>
                  {turnos.map(turno => (
                    <SelectItem key={turno.value} value={turno.value}>
                      {turno.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo (opcional)</Label>
              <Input
                id="motivo"
                value={novaExcecao.motivo}
                onChange={(e) => setNovaExcecao({...novaExcecao, motivo: e.target.value})}
                placeholder="Ex: Viagem, compromisso..."
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddException} className="bg-echurch-500 hover:bg-echurch-600 w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-semibold text-echurch-700">Exceções Cadastradas</h3>
        
        {excecoes.length === 0 ? (
          <div className="text-center py-8 text-echurch-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma exceção cadastrada</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {excecoes
              .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
              .map(excecao => (
                <Card key={excecao.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="font-medium text-echurch-700 capitalize">
                          {formatDate(excecao.data)}
                        </div>
                        <div className="text-sm text-echurch-600">
                          Turno: <span className="font-medium">
                            {turnos.find(t => t.value === excecao.turno)?.label}
                          </span>
                        </div>
                        {excecao.motivo && (
                          <div className="text-sm text-echurch-500">
                            Motivo: {excecao.motivo}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeException(excecao.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
