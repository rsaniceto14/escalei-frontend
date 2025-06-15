
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, ExternalLink, Music, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Arquivo = {
  nome: string;
  categoria: string;
  url?: string;
};

type Musica = {
  id: number;
  nome: string;
  link: string;
  spotify: string;
  arquivos: Arquivo[];
};

export default function Musics() {
  const [musicas, setMusicas] = useState<Musica[]>([
    { 
      id: 1, 
      nome: "A Ele a Glória", 
      link: "https://www.cifras.com.br", 
      spotify: "", 
      arquivos: [
        { nome: "A_Ele_a_Gloria_Soprano.mp3", categoria: "Soprano" },
        { nome: "A_Ele_a_Gloria_Tenor.mp3", categoria: "Tenor" }
      ] 
    },
    { 
      id: 2, 
      nome: "Tu És Soberano", 
      link: "", 
      spotify: "https://open.spotify.com/track/example", 
      arquivos: [] 
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novaMusica, setNovaMusica] = useState({
    nome: "",
    link: "",
    spotify: ""
  });

  const categorias = ["Soprano", "Contralto", "Tenor", "Baixo", "Partitura", "Playback", "Click"];

  const handleAddMusic = () => {
    if (!novaMusica.nome) {
      toast.error("Nome da música é obrigatório");
      return;
    }

    const newId = Math.max(...musicas.map(m => m.id), 0) + 1;
    setMusicas([...musicas, {
      id: newId,
      ...novaMusica,
      arquivos: []
    }]);

    setNovaMusica({ nome: "", link: "", spotify: "" });
    setIsDialogOpen(false);
    toast.success("Música adicionada com sucesso!");
  };

  const handleFileUpload = (musicaId: number, categoria: string, file: File) => {
    // Simulação de upload
    const novoArquivo: Arquivo = {
      nome: file.name,
      categoria: categoria,
      url: URL.createObjectURL(file)
    };

    setMusicas(musicas.map(musica => 
      musica.id === musicaId 
        ? { ...musica, arquivos: [...musica.arquivos, novoArquivo] }
        : musica
    ));

    toast.success(`Arquivo ${file.name} enviado para ${categoria}`);
  };

  const removeArquivo = (musicaId: number, arquivoNome: string) => {
    setMusicas(musicas.map(musica => 
      musica.id === musicaId 
        ? { ...musica, arquivos: musica.arquivos.filter(arq => arq.nome !== arquivoNome) }
        : musica
    ));
    toast.success("Arquivo removido");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-echurch-700">Músicas</h1>
          <p className="text-echurch-600 mt-1">Gerencie o repertório musical</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-echurch-500 hover:bg-echurch-600">
              <Plus className="w-4 h-4 mr-2" />
              Nova Música
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Música</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Música *</Label>
                <Input
                  id="nome"
                  value={novaMusica.nome}
                  onChange={(e) => setNovaMusica({...novaMusica, nome: e.target.value})}
                  placeholder="Digite o nome da música"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Link da Cifra</Label>
                <Input
                  id="link"
                  value={novaMusica.link}
                  onChange={(e) => setNovaMusica({...novaMusica, link: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spotify">Link do Spotify</Label>
                <Input
                  id="spotify"
                  value={novaMusica.spotify}
                  onChange={(e) => setNovaMusica({...novaMusica, spotify: e.target.value})}
                  placeholder="https://open.spotify.com/..."
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddMusic} className="bg-echurch-500 hover:bg-echurch-600 flex-1">
                  Adicionar
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {musicas.map(musica => (
          <Card key={musica.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-echurch-700 flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  {musica.nome}
                </CardTitle>
                <div className="flex gap-2">
                  {musica.link && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={musica.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Cifra
                      </a>
                    </Button>
                  )}
                  {musica.spotify && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={musica.spotify} target="_blank" rel="noopener noreferrer" className="text-green-600">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Spotify
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-echurch-600 mb-2">Arquivos de Áudio</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {categorias.map(categoria => (
                    <div key={categoria} className="space-y-2">
                      <Label className="text-sm text-echurch-600">{categoria}</Label>
                      <div className="relative">
                        <Input
                          type="file"
                          accept="audio/*,.pdf"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(musica.id, categoria, file);
                              e.target.value = '';
                            }
                          }}
                        />
                        <div className="flex items-center justify-center h-10 border-2 border-dashed border-echurch-300 rounded-lg hover:border-echurch-500 transition-colors">
                          <Upload className="w-4 h-4 text-echurch-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {musica.arquivos.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-echurch-600">Arquivos Enviados:</h5>
                    <div className="flex flex-wrap gap-2">
                      {musica.arquivos.map(arquivo => (
                        <Badge key={arquivo.nome} variant="secondary" className="bg-echurch-100 text-echurch-700 hover:bg-echurch-200">
                          <span className="text-xs mr-2">{arquivo.categoria}</span>
                          <span className="text-xs truncate max-w-[100px]">{arquivo.nome}</span>
                          <button
                            onClick={() => removeArquivo(musica.id, arquivo.nome)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
