
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyAvailability } from "@/components/availability/WeeklyAvailability";
import { ExceptionDates } from "@/components/availability/ExceptionDates";

export default function Availability() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-echurch-700">Disponibilidade</h1>
        <p className="text-echurch-600 mt-1">Configure sua disponibilidade para escalas</p>
      </div>

      <Tabs defaultValue="weekly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly">Disponibilidade Fixa</TabsTrigger>
          <TabsTrigger value="exceptions">Exceções</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidade Semanal Fixa</CardTitle>
              <p className="text-sm text-echurch-600">
                Marque os períodos em que você <strong>NÃO PODE</strong> participar das escalas.
              </p>
            </CardHeader>
            <CardContent>
              <WeeklyAvailability />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exceptions">
          <Card>
            <CardHeader>
              <CardTitle>Exceções Específicas</CardTitle>
              <p className="text-sm text-echurch-600">
                Adicione datas específicas em que você não estará disponível.
              </p>
            </CardHeader>
            <CardContent>
              <ExceptionDates />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
