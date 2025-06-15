
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type Turno = "manha" | "tarde" | "noite";
type Disponibilidade = {
  [key: string]: {
    [turno in Turno]: boolean;
  };
};

export function WeeklyAvailability() {
  const diasSemana = [
    { key: "domingo", label: "Domingo" },
    { key: "segunda", label: "Segunda-feira" },
    { key: "terca", label: "Terça-feira" },
    { key: "quarta", label: "Quarta-feira" },
    { key: "quinta", label: "Quinta-feira" },
    { key: "sexta", label: "Sexta-feira" },
    { key: "sabado", label: "Sábado" },
  ];

  const turnos: { key: Turno; label: string }[] = [
    { key: "manha", label: "Manhã" },
    { key: "tarde", label: "Tarde" },
    { key: "noite", label: "Noite" },
  ];

  // Estado representa quando o usuário NÃO PODE (true = não pode)
  const [indisponibilidade, setIndisponibilidade] = useState<Disponibilidade>(
    diasSemana.reduce((acc, dia) => ({
      ...acc,
      [dia.key]: {
        manha: false,
        tarde: false,
        noite: false,
      }
    }), {})
  );

  const handleToggle = (dia: string, turno: Turno) => {
    setIndisponibilidade(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [turno]: !prev[dia][turno]
      }
    }));
  };

  const handleSave = () => {
    console.log("Indisponibilidade salva:", indisponibilidade);
    toast.success("Disponibilidade fixa salva com sucesso!");
  };

  const getUnavailableCount = () => {
    let count = 0;
    Object.values(indisponibilidade).forEach(dia => {
      Object.values(dia).forEach(turno => {
        if (turno) count++;
      });
    });
    return count;
  };

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Importante:</strong> Marque apenas os períodos em que você <strong>NÃO PODE</strong> participar das escalas.
          Os períodos não marcados indicam que você está disponível.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-echurch-200">
              <th className="text-left p-3 font-semibold text-echurch-700">Dia da Semana</th>
              {turnos.map(turno => (
                <th key={turno.key} className="text-center p-3 font-semibold text-echurch-700">
                  {turno.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {diasSemana.map(dia => (
              <tr key={dia.key} className="border-b border-echurch-100 hover:bg-echurch-50">
                <td className="p-3 font-medium text-echurch-600">{dia.label}</td>
                {turnos.map(turno => (
                  <td key={turno.key} className="p-3 text-center">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={indisponibilidade[dia.key][turno.key]}
                        onCheckedChange={() => handleToggle(dia.key, turno.key)}
                        className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                      />
                      <span className="ml-2 text-xs text-echurch-500">
                        {indisponibilidade[dia.key][turno.key] ? "Não posso" : "Posso"}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-echurch-50 p-4 rounded-lg">
        <div className="text-sm text-echurch-600">
          Total de períodos indisponíveis: <strong>{getUnavailableCount()}</strong> de {diasSemana.length * turnos.length}
        </div>
        <Button onClick={handleSave} className="bg-echurch-500 hover:bg-echurch-600">
          Salvar Disponibilidade
        </Button>
      </div>
    </div>
  );
}
