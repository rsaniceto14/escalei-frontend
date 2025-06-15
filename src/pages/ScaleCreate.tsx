
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, Clock, MapPin, Users, Music, AlertCircle } from "lucide-react";

export default function ScaleCreate() {
  const [escala, setEscala] = useState({
    nome: "",
    tipo: "Geral",
    dataHora: "",
    local: "",
    tipoEvento: "Presencial",
    grupoArea: "",
    observacoes: ""
  });
  
  const [musicas, setMusicas] = useState<string[]>([]);
  const [nomeMusica, setNomeMusica] = useState("");

  function addMusica(e: React.FormEvent) {
    e.preventDefault();
    if (nomeMusica && !musicas.includes(nomeMusica)) {
      setMusicas([...musicas, nomeMusica]);
      setNomeMusica("");
    }
  }

  function removeMusica(musica: string) {
    setMusicas(musicas.filter(m => m !== musica));
  }

  function handleSubmit() {
    if (!escala.nome || !escala.dataHora || !escala.local) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Simulação de criação
    toast.success("Escala criada com sucesso! Aguardando aprovação.");
    console.log("Escala criada:", { ...escala, musicas });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-echurch-700 flex items-center gap-2">
          <Calendar className="w-8 h-8" />
          Criar Nova Escala
        </h1>
        <p className="text-echurch-600 mt-1">Preencha as informações da nova escala</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados principais da escala</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Escala *</Label>
                  <Input
                    id="nome"
                    value={escala.nome}
                    onChange={(e) => setEscala({...escala, nome: e.target.value})}
                    placeholder="Ex: Culto Domingo Manhã"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Escala</Label>
                  <Select value={escala.tipo} onValueChange={(value) => setEscala({...escala, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Geral">Geral</SelectItem>
                      <SelectItem value="Louvor">Louvor</SelectItem>
                      <SelectItem value="Som">Som</SelectItem>
                      <SelectItem value="Multimedia">Multimídia</SelectItem>
                      <SelectItem value="Infantil">Infantil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataHora">Data e Hora *</Label>
                  <Input
                    id="dataHora"
                    type="datetime-local"
                    value={escala.dataHora}
                    onChange={(e) => setEscala({...escala, dataHora: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="local">Local *</Label>
                  <Input
                    id="local"
                    value={escala.local}
                    onChange={(e) => setEscala({...escala, local: e.target.value})}
                    placeholder="Ex: Igreja Central"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoEvento">Tipo de Evento</Label>
                  <Select value={escala.tipoEvento} onValueChange={(value) => setEscala({...escala, tipoEvento: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Presencial">Presencial</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Híbrido">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grupoArea">Grupo/Área Envolvida</Label>
                  <Input
                    id="grupoArea"
                    value={escala.grupoArea}
                    onChange={(e) => setEscala({...escala, grupoArea: e.target.value})}
                    placeholder="Ex: Louvor, Diáconos, Som..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  value={escala.observacoes}
                  onChange={(e) => setEscala({...escala, observacoes: e.target.value})}
                  placeholder="Informações adicionais..."
                />
              </div>
            </CardContent>
          </Card>

          {escala.tipo === "Louvor" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Repertório Musical
                </CardTitle>
                <CardDescription>Adicione as músicas que serão tocadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={addMusica} className="flex gap-2">
                  <Input
                    value={nomeMusica}
                    onChange={(e) => setNomeMusica(e.target.value)}
                    placeholder="Nome da música"
                    className="flex-1"
                  />
                  <Button type="submit" variant="outline">
                    Adicionar
                  </Button>
                </form>
                <div className="flex flex-wrap gap-2">
                  {musicas.map(musica => (
                    <Badge
                      key={musica}
                      variant="secondary"
                      className="bg-echurch-100 text-echurch-700 cursor-pointer hover:bg-echurch-200"
                      onClick={() => removeMusica(musica)}
                    >
                      {musica} ✕
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Status de Aprovação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Atenção:</strong> Escalas recém-criadas precisam de aprovação antes de serem publicadas.
                  </p>
                </div>
                <div className="text-sm text-echurch-600">
                  <p>✓ Será enviada para aprovação</p>
                  <p>✓ Membros serão notificados após aprovação</p>
                  <p>✓ Você pode editar até ser aprovada</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Troca de Escalas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-echurch-600">
                  Após a criação, membros poderão solicitar trocas com outros disponíveis.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  <Users className="w-4 h-4 mr-2" />
                  Gerenciar Trocas
                  <span className="text-xs ml-2">(Após criação)</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button onClick={handleSubmit} className="w-full bg-echurch-500 hover:bg-echurch-600">
              <Calendar className="w-4 h-4 mr-2" />
              Criar Escala
            </Button>
            <p className="text-xs text-center text-echurch-500">
              * Campos obrigatórios
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
