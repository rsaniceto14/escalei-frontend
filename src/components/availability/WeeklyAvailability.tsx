
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { unavailabilityService } from "@/api";
import { Unavailability } from "@/api/types";

type Turno = "manha" | "tarde" | "noite";

// Mapeamento de dias da semana: string -> número (0=domingo, 6=sábado)
const weekdayMap: Record<string, number> = {
  domingo: 0,
  segunda: 1,
  terca: 2,
  quarta: 3,
  quinta: 4,
  sexta: 5,
  sabado: 6,
};

// Mapeamento reverso: número -> string
const weekdayReverseMap: Record<number, string> = {
  0: "domingo",
  1: "segunda",
  2: "terca",
  3: "quarta",
  4: "quinta",
  5: "sexta",
  6: "sabado",
};

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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carrega as indisponibilidades do backend
  useEffect(() => {
    const loadUnavailabilities = async () => {
      try {
        setLoading(true);
        const unavailabilities = await unavailabilityService.getMyUnavailabilities();
        
        // Converte os dados do backend para o formato do componente
        const initialIndisponibilidade = diasSemana.reduce((acc, dia) => ({
          ...acc,
          [dia.key]: {
            manha: false,
            tarde: false,
            noite: false,
          }
        }), {} as Disponibilidade);
        
        unavailabilities.forEach((unav: Unavailability) => {
          const diaKey = weekdayReverseMap[unav.weekday];
          if (diaKey && unav.shift) {
            initialIndisponibilidade[diaKey] = {
              ...initialIndisponibilidade[diaKey],
              [unav.shift]: true,
            };
          }
        });
        
        setIndisponibilidade(initialIndisponibilidade);
      } catch (error) {
        console.error("Erro ao carregar indisponibilidades:", error);
        toast.error("Erro ao carregar disponibilidade");
      } finally {
        setLoading(false);
      }
    };

    loadUnavailabilities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (dia: string, turno: Turno) => {
    setIndisponibilidade(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [turno]: !prev[dia][turno]
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Converte o estado do componente para o formato da API
      const unavailabilities: Omit<Unavailability, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] = [];
      
      Object.entries(indisponibilidade).forEach(([diaKey, turnos]) => {
        const weekday = weekdayMap[diaKey];
        Object.entries(turnos).forEach(([turnoKey, isUnavailable]) => {
          if (isUnavailable) {
            unavailabilities.push({
              weekday,
              shift: turnoKey as Turno,
            });
          }
        });
      });

      // Sincroniza com o backend
      await unavailabilityService.syncUnavailabilities(unavailabilities);
      
      toast.success("Disponibilidade fixa salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar indisponibilidades:", error);
      toast.error("Erro ao salvar disponibilidade");
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-echurch-600">Carregando disponibilidade...</p>
      </div>
    );
  }

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
                        disabled={saving}
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
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-echurch-500 hover:bg-echurch-600 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar Disponibilidade"}
        </Button>
      </div>
    </div>
  );
}
