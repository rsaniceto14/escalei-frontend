"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, ExternalLink } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { handoutService } from "@/api/services/handoutService";
import { Handout } from "@/api/handout";

// Helper to calculate relative time
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Agora mesmo";
  if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  return `Há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
}

export function Handouts() {
  const [isLoading, setIsLoading] = useState(false);
  const [comunicados, setComunicados] = useState<Handout[]>([]);

  useEffect(() => {
    const handouts = async () => {
      setIsLoading(true); 
      try {
        const data = await handoutService.getActive();
        setComunicados(data);
      } catch (error) {
        console.error("Erro ao carregar comunicados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    handouts();
  }, []);
 
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-echurch-600" />
          Comunicados
        </CardTitle>
      </CardHeader>

      <CardContent>
        {comunicados.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum comunicado no momento
          </p>
        ) : (
          <Carousel className="w-full">
            <CarouselContent>
              {comunicados.map((comunicado) => (
                <CarouselItem key={comunicado.id}>
                  <div
                    className={`flex flex-col md:flex-row items-stretch gap-3 p-4 rounded-lg border shadow-sm transition-all duration-200 ${
                      comunicado.priority === "high"
                        ? "bg-orange-50 border-orange-200"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {/* Optional Image */}
                    {comunicado.image_url && (
                      <div 
                        className="w-full md:w-1/3 md:h-64 cursor-pointer transition-transform hover:scale-[1.02]"
                        onClick={() => window.open(comunicado.image_url, "_blank")}
                      >
                        <img
                          src={comunicado.image_url}
                          alt={comunicado.title}
                          className="rounded-md object-contain w-full h-40 md:h-full bg-gray-100"
                        />
                      </div>
                    )}

                    {/* Text Section */}
                    <div className="flex flex-col justify-between w-full md:w-2/3">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-sm text-foreground">
                              {comunicado.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {timeAgo(comunicado.start_date)}
                            </p>
                          </div>

                          {comunicado.link_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(comunicado.link_url, "_blank");
                              }}
                              title={comunicado.link_name}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {comunicado.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Carousel navigation below content */}
            <div className="flex justify-center gap-2 mt-4">
              <CarouselPrevious className="static translate-y-0 relative left-0" />
              <CarouselNext className="static translate-y-0 relative right-0" />
            </div>
          </Carousel>
        )}
      </CardContent>
    </Card>
  );
}
