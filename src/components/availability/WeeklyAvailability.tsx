
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { unavailabilityService, Unavailability } from "@/api/services/unavailabilityService";

type Turno = "manha" | "tarde" | "noite";
type Disponibilidade = {
  [key: string]: {
    [turno in Turno]: boolean;
  };
};

// Mapeamento de dias da semana
const WEEKDAY_MAP: { [key: string]: number } = {
  domingo: 0,
  segunda: 1,
  terca: 2,
  quarta: 3,
  quinta: 4,
  sexta: 5,
  sabado: 6,
};

const WEEKDAY_REVERSE_MAP: { [key: number]: string } = {
  0: "domingo",
  1: "segunda",
  2: "terca",
  3: "quarta",
  4: "quinta",
  5: "sexta",
  6: "sabado",
};

export function WeeklyAvailability() {
  const diasSemana = [
    { key: "domingo", label: "Domingo" },
    { key: "segunda", label: "Segunda" },
    { key: "terca", label: "Terça" },
    { key: "quarta", label: "Quarta" },
    { key: "quinta", label: "Quinta" },
    { key: "sexta", label: "Sexta" },
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

  // Carrega indisponibilidades do backend
  useEffect(() => {
    loadUnavailabilities();
  }, []);

  const loadUnavailabilities = async () => {
    try {
      setLoading(true);
      const unavailabilities = await unavailabilityService.getMyUnavailabilities();
      
      // Converte do formato backend para o formato do componente
      const newState: Disponibilidade = diasSemana.reduce((acc, dia) => ({
        ...acc,
        [dia.key]: {
          manha: false,
          tarde: false,
          noite: false,
        }
      }), {});

      unavailabilities.forEach((unav) => {
        const diaKey = WEEKDAY_REVERSE_MAP[unav.weekday];
        if (diaKey && unav.shift in { manha: true, tarde: true, noite: true }) {
          newState[diaKey][unav.shift as Turno] = true;
        }
      });

      setIndisponibilidade(newState);
    } catch (error: any) {
      console.error("Erro ao carregar indisponibilidades:", error);
      toast.error("Erro ao carregar disponibilidade", {
        description: error.message || "Não foi possível carregar suas indisponibilidades"
      });
    } finally {
      setLoading(false);
    }
  };

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
      
      // Converte do formato do componente para o formato do backend
      const unavailabilities: Omit<Unavailability, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] = [];
      
      Object.entries(indisponibilidade).forEach(([diaKey, turnos]) => {
        Object.entries(turnos).forEach(([turnoKey, isUnavailable]) => {
          if (isUnavailable) {
            unavailabilities.push({
              weekday: WEEKDAY_MAP[diaKey],
              shift: turnoKey as Turno,
            });
          }
        });
      });

      await unavailabilityService.syncUnavailabilities(unavailabilities);
      
      toast.success("Disponibilidade salva com sucesso!", {
        description: `${unavailabilities.length} período(s) marcado(s) como indisponível(is)`
      });
    } catch (error: any) {
      console.error("Erro ao salvar indisponibilidade:", error);
      toast.error("Erro ao salvar disponibilidade", {
        description: error.message || "Não foi possível salvar suas indisponibilidades"
      });
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-echurch-500" />
        <span className="ml-2 text-echurch-600">Carregando disponibilidade...</span>
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

      <div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-echurch-200">
              <th className="text-left p-1.5 sm:p-3 font-semibold text-xs sm:text-sm text-echurch-700 min-w-[80px] sm:min-w-[120px]">Dia da Semana</th>
              {turnos.map(turno => (
                <th key={turno.key} className="text-center p-1.5 sm:p-3 font-semibold text-xs sm:text-sm text-echurch-700">
                  {turno.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {diasSemana.map(dia => (
              <tr key={dia.key} className="border-b border-echurch-100 hover:bg-echurch-50">
                <td className="p-1.5 sm:p-3 font-medium text-xs sm:text-sm text-echurch-600">{dia.label}</td>
                {turnos.map(turno => (
                  <td key={turno.key} className="p-2 sm:p-3 text-center">
                    <div className="flex justify-center">
                      <CheckboxPrimitive.Root
                        checked={indisponibilidade[dia.key][turno.key]}
                        onCheckedChange={() => handleToggle(dia.key, turno.key)}
                        className={cn(
                          "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500 data-[state=checked]:text-white"
                        )}
                      >
                        <CheckboxPrimitive.Indicator
                          className={cn("flex items-center justify-center text-current")}
                        >
                          <X className="h-3 w-3" />
                        </CheckboxPrimitive.Indicator>
                      </CheckboxPrimitive.Root>
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
          className="bg-echurch-500 hover:bg-echurch-600"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Disponibilidade"
          )}
        </Button>
      </div>
    </div>
  );
}
