
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, ExternalLink, Music, Trash2, Search, Play } from "lucide-react";
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
  artista?: string;
  link: string;
  spotifyId: string;
  spotifyUrl: string;
  arquivos: Arquivo[];
};

export default function Musics() {
  const [musicas, setMusicas] = useState<Musica[]>([
    { 
      id: 1, 
      nome: "A Ele a Glória", 
      artista: "Diante do Trono",
      link: "https://www.cifras.com.br", 
      spotifyId: "4iV5W9uYEdYUVa79Axb7Rh",
      spotifyUrl: "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh", 
      arquivos: [
        { nome: "A_Ele_a_Gloria_Soprano.mp3", categoria: "Soprano" },
        { nome: "A_Ele_a_Gloria_Tenor.mp3", categoria: "Tenor" }
      ] 
    },
    { 
      id: 2, 
      nome: "Tu És Soberano", 
      artista: "Isaías Saad",
      link: "", 
      spotifyId: "1A2B3C4D5E6F7G8H9I0J",
      spotifyUrl: "https://open.spotify.com/track/1A2B3C4D5E6F7G8H9I0J", 
      arquivos: [] 
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pesquisaMusica, setPesquisaMusica] = useState("");
  const [pesquisaGeral, setPesquisaGeral] = useState("");
  const [novaMusica, setNovaMusica] = useState({
    nome: "",
    artista: "",
    link: "",
    spotifyUrl: ""
  });
  
  const [resultadosSpotify, setResultadosSpotify] = useState<any[]>([]);

  const categorias = ["Soprano", "Contralto", "Tenor", "Baixo", "Partitura", "Playback", "Click"];

  // Simulação de pesquisa no Spotify
  const pesquisarSpotify = async () => {
    if (!pesquisaMusica.trim()) return;
    
    // Simulação de resultados do Spotify
    const resultadosSimulados = [
      {
        id: "4iV5W9uYEdYUVa79Axb7Rh",
        name: pesquisaMusica,
        artists: [{ name: "Diante do Trono" }],
        external_urls: { spotify: "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh" },
        preview_url: "https://p.scdn.co/mp3-preview/..."
      },
      {
        id: "5jV6X0zFEdYUVa79Axb7Ri",
        name: `${pesquisaMusica} (Ao Vivo)`,
        artists: [{ name: "Ministério Zoe" }],
        external_urls: { spotify: "https://open.spotify.com/track/5jV6X0zFEdYUVa79Axb7Ri" },
        preview_url: "https://p.scdn.co/mp3-preview/..."
      }
    ];
    
    setResultadosSpotify(resultadosSimulados);
    toast.success(`${resultadosSimulados.length} resultados encontrados`);
  };

  const selecionarMusicaSpotify = (musica: any) => {
    setNovaMusica({
      ...novaMusica,
      nome: musica.name,
      artista: musica.artists[0]?.name || "",
      spotifyUrl: musica.external_urls.spotify
    });
    setResultadosSpotify([]);
    setPesquisaMusica("");
    toast.success("Música selecionada do Spotify");
  };

  const handleAddMusic = () => {
    if (!novaMusica.nome) {
      toast.error("Nome da música é obrigatório");
      return;
    }

    const newId = Math.max(...musicas.map(m => m.id), 0) + 1;
    const spotifyId = novaMusica.spotifyUrl.split('/').pop()?.split('?')[0] || "";
    
    setMusicas([...musicas, {
      id: newId,
      ...novaMusica,
      spotifyId,
      arquivos: []
    }]);

    setNovaMusica({ nome: "", artista: "", link: "", spotifyUrl: "" });
    setIsDialogOpen(false);
    toast.success("Música adicionada com sucesso!");
  };

  const handleFileUpload = (musicaId: number, categoria: string, file: File) => {
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

  const musicasFiltradas = musicas.filter(musica =>
    musica.nome.toLowerCase().includes(pesquisaGeral.toLowerCase()) ||
    musica.artista?.toLowerCase().includes(pesquisaGeral.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-echurch-700 flex items-center gap-2">
            <Music className="w-8 h-8" />
            Músicas
          </h1>
          <p className="text-echurch-600 mt-1">Gerencie o repertório musical</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-echurch-500 hover:bg-echurch-600">
              <Plus className="w-4 h-4 mr-2" />
              Nova Música
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Música</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Pesquisa no Spotify */}
              <div className="space-y-2">
                <Label>Pesquisar no Spotify</Label>
                <div className="flex gap-2">
                  <Input
                    value={pesquisaMusica}
                    onChange={(e) => setPesquisaMusica(e.target.value)}
                    placeholder="Digite o nome da música..."
                    className="flex-1"
                  />
                  <Button onClick={pesquisarSpotify} variant="outline">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Resultados do Spotify */}
              {resultadosSpotify.length > 0 && (
                <div className="space-y-2">
                  <Label>Resultados do Spotify</Label>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {resultadosSpotify.map((resultado) => (
                      <div
                        key={resultado.id}
                        className="p-2 border rounded-lg cursor-pointer hover:bg-echurch-50 flex items-center justify-between"
                        onClick={() => selecionarMusicaSpotify(resultado)}
                      >
                        <div>
                          <div className="font-medium">{resultado.name}</div>
                          <div className="text-sm text-echurch-600">{resultado.artists[0]?.name}</div>
                        </div>
                        <Button size="sm" variant="outline">
                          Selecionar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulário manual */}
              <div className="grid gap-4 md:grid-cols-2">
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
                  <Label htmlFor="artista">Artista</Label>
                  <Input
                    id="artista"
                    value={novaMusica.artista}
                    onChange={(e) => setNovaMusica({...novaMusica, artista: e.target.value})}
                    placeholder="Nome do artista"
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
                    value={novaMusica.spotifyUrl}
                    onChange={(e) => setNovaMusica({...novaMusica, spotifyUrl: e.target.value})}
                    placeholder="https://open.spotify.com/..."
                  />
                </div>
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

      {/* Barra de pesquisa */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-echurch-400" />
          <Input
            value={pesquisaGeral}
            onChange={(e) => setPesquisaGeral(e.target.value)}
            placeholder="Pesquisar músicas..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {musicasFiltradas.map(musica => (
          <Card key={musica.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg text-echurch-700 flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    {musica.nome}
                  </CardTitle>
                  {musica.artista && (
                    <p className="text-sm text-echurch-600">por {musica.artista}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {musica.link && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={musica.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Cifra
                      </a>
                    </Button>
                  )}
                  {musica.spotifyUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={musica.spotifyUrl} target="_blank" rel="noopener noreferrer" className="text-green-600">
                        <Play className="w-4 h-4 mr-1" />
                        Spotify
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Player do Spotify */}
              {musica.spotifyId && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-800">Player do Spotify</span>
                  </div>
                  <iframe
                    src={`https://open.spotify.com/embed/track/${musica.spotifyId}?utm_source=generator&theme=0`}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-lg"
                  ></iframe>
                </div>
              )}

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
