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

// 🧱 Mock data
const comunicados = [
  {
    id: 1,
    title: "Ensaio Geral - Domingo",
    desc: "Ensaio geral marcado para domingo às 15h. Presença obrigatória para todos os músicos.",
    publish_date: "2025-10-29T15:00:00Z",
    priority: "high",
    link_name: "Ver detalhes",
    link_url: "/ensaio",
    image_url:
      "https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=",
  },
  {
    id: 2,
    title: "Nova Música Adicionada",
    desc: "A música 'Rompendo em Fé' foi adicionada ao repertório deste mês.",
    publish_date: "2025-10-30T10:00:00Z",
    priority: "normal",
    link_name: "Ouvir música",
    link_url: "/repertorio",
  },
  {
    id: 3,
    title: "Atualização de Horários",
    desc: "Os horários das escalas foram atualizados. Verifique sua disponibilidade.",
    publish_date: "2025-10-27T09:00:00Z",
    priority: "normal",
    link_name: "Ver escalas",
    link_url: "/escalas",
  },
  {
    id: 4,
    title: "Culto Especial - Sábado",
    desc: "Culto especial no sábado às 19h. Chegar 30 minutos antes.",
    publish_date: "2025-10-31T10:00:00Z",
    priority: "high",
    link_name: "Mais informações",
    link_url: "/eventos",
    image_url:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
  },
];

// 🕓 Helper to calculate relative time
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
                    {/* 🖼️ Optional Image */}
                    {comunicado.image_url && (
                      <div className="w-full md:w-1/3">
                        <img
                          src={comunicado.image_url}
                          alt={comunicado.title}
                          className="rounded-md object-cover w-full h-40 md:h-full"
                        />
                      </div>
                    )}

                    {/* 🧾 Text Section */}
                    <div className="flex flex-col justify-between w-full md:w-2/3">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-sm text-foreground">
                              {comunicado.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {timeAgo(comunicado.publish_date)}
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
                          {comunicado.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* ✅ Carousel navigation below content */}
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
