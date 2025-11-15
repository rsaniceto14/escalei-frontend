
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, History, RefreshCw, Eye, Loader2, ChevronRight } from "lucide-react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Schedule } from "@/api";

interface ScaleCardProps {
  title: string;
  icon: ReactNode;
  scales: Schedule[];
  variant: "past" | "swap";
  emptyMessage: string;
  emptyDescription: string;
  onRequestSwap?: (escalaId: number) => void;
  isRequestingSwap?: boolean;
  requestingSwapId?: number | null;
  maxItems?: number;
  totalItems?: number;
  showMoreLink?: string;
}

export function ScaleCard({ 
  title, 
  icon, 
  scales, 
  variant, 
  emptyMessage, 
  emptyDescription,
  onRequestSwap,
  isRequestingSwap = false,
  requestingSwapId = null,
  maxItems = 3,
  totalItems,
  showMoreLink
}: ScaleCardProps) {
  const bgColor = variant === "past" ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200";
  
  const displayedScales = scales.slice(0, maxItems);
  const hasMore = totalItems !== undefined ? totalItems > maxItems : scales.length > maxItems;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-echurch-600">
          {icon}
          {title}
        </CardTitle>
        {scales.length > 0 && (
          <p className="text-xs text-echurch-500 mt-1">
            Mostrando as {displayedScales.length} escalas mais recentes
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {displayedScales.length > 0 ? (
          <>
            {displayedScales.map((esc, i) => (
              <div
                key={esc.id || i}
                className={`flex flex-col gap-3 p-4 rounded-lg ${bgColor}`}
              >
                <div className="space-y-1">
                  <div className="font-medium text-echurch-700">{esc.name}</div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-echurch-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {esc.start_date}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {esc.local}
                    </div>
                  </div>
                </div>
                {variant === "past" ? (
                  <Link to={`/schedules/${esc.id}`} state={{ escala: esc }}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-3 h-3 mr-1" />
                      Ver Detalhes
                    </Button>
                  </Link>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    {onRequestSwap && esc.id && (
                      <Button 
                        size="sm" 
                        className="bg-orange-500 hover:bg-orange-600 flex-1 !h-10 sm:!h-9 py-2.5 sm:py-0"
                        onClick={() => onRequestSwap(esc.id!)}
                        disabled={isRequestingSwap && requestingSwapId === esc.id}
                      >
                        {isRequestingSwap && requestingSwapId === esc.id ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Solicitando...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Solicitar Troca
                          </>
                        )}
                      </Button>
                    )}
                    <Link to={`/schedules/${esc.id}`} state={{ escala: esc }}>
                      <Button variant="outline" size="sm" className="flex-1 w-full sm:w-auto">
                        <Eye className="w-3 h-3 mr-1" />
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ))}
            {hasMore && showMoreLink && (
              <Link to={showMoreLink}>
                <Button variant="outline" className="w-full mt-2">
                  Ver mais escalas
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-echurch-500">
            {variant === "past" ? (
              <History className="w-16 h-16 mx-auto mb-3 opacity-50" />
            ) : (
              <Calendar className="w-16 h-16 mx-auto mb-3 opacity-50" />
            )}
            <p className="text-lg font-medium">{emptyMessage}</p>
            <p className="text-sm">{emptyDescription}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
