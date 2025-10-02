import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, ExternalLink, Music, Trash2, Search, Play, AlertCircle, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { musicService, type Song, type CreateSongData } from "@/api/services/musicService";
import { spotifyService, type SpotifyTrack } from "@/api/services/spotifyService";

type Arquivo = {
  nome: string;
  categoria: string;
  url?: string;
};

export default function Musics() {
  const [musicas, setMusicas] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pesquisaMusica, setPesquisaMusica] = useState("");
  const [pesquisaGeral, setPesquisaGeral] = useState("");
  const [novaMusica, setNovaMusica] = useState<Partial<CreateSongData>>({
    name: "",
    artist: "",
    album: "",
    spotify_url: "",
    preview_url: "",
    duration: 0,
    cover_path: "",
    spotify_id: "",
  });
  
  const [resultadosSpotify, setResultadosSpotify] = useState<SpotifyTrack[]>([]);
  const [searchingSpotify, setSearchingSpotify] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Audio player states
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentPreviewTrack, setCurrentPreviewTrack] = useState<SpotifyTrack | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement>(null);

  const categorias = ["Soprano", "Contralto", "Tenor", "Baixo", "Partitura", "Playback", "Click"];

  // Load songs from API
  const loadSongs = async (page: number = 1, search?: string) => {
    try {
      setLoading(true);
      const response = await musicService.getSongs(search, page, 15);
      setMusicas(response.data);
      setTotalPages(response.last_page);
      setCurrentPage(response.current_page);
    } catch (error) {
      console.error('Error loading songs:', error);
      toast.error("Erro ao carregar músicas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs(1, pesquisaGeral);
  }, [pesquisaGeral]);

  // Search on Spotify
  const pesquisarSpotify = async () => {
    if (!pesquisaMusica.trim()) return;
    
    try {
      setSearchingSpotify(true);
      const resultados = await spotifyService.searchTracks(pesquisaMusica, 10);
      setResultadosSpotify(resultados);
      toast.success(`${resultados.length} resultados encontrados`);
    } catch (error) {
      console.error('Error searching Spotify:', error);
      toast.error("Erro ao pesquisar no Spotify. Verifique suas credenciais.");
    } finally {
      setSearchingSpotify(false);
    }
  };

  const selecionarMusicaSpotify = (track: SpotifyTrack) => {
    const songData = spotifyService.convertSpotifyTrackToSong(track);
    setNovaMusica(songData);
    setResultadosSpotify([]);
    setPesquisaMusica("");
    toast.success("Música selecionada do Spotify");
  };

  const handleAddMusic = async () => {
    if (!novaMusica.name || !novaMusica.artist) {
      toast.error("Nome e artista são obrigatórios");
      return;
    }

    try {
      await musicService.createSong(novaMusica as CreateSongData);
      setNovaMusica({
        name: "",
        artist: "",
        album: "",
        spotify_url: "",
        preview_url: "",
        duration: 0,
        cover_path: "",
        spotify_id: "",
      });
      setIsDialogOpen(false);
      loadSongs(currentPage, pesquisaGeral);
      toast.success("Música adicionada com sucesso!");
    } catch (error) {
      console.error('Error adding song:', error);
      toast.error("Erro ao adicionar música");
    }
  };

  const handleDeleteMusic = async (id: number) => {
    try {
      await musicService.deleteSong(id);
      loadSongs(currentPage, pesquisaGeral);
      toast.success("Música removida com sucesso!");
    } catch (error) {
      console.error('Error deleting song:', error);
      toast.error("Erro ao remover música");
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Audio player functions
  const openPlayerModal = (song: Song) => {
    setSelectedSong(song);
    setIsPlayerModalOpen(true);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const togglePreview = (track: SpotifyTrack) => {
    if (!track.preview_url) {
      toast.error("Preview não disponível para esta música");
      return;
    }

    if (currentPreviewTrack?.id === track.id && isPreviewPlaying) {
      // Stop current preview
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      setIsPreviewPlaying(false);
      setCurrentPreviewTrack(null);
    } else {
      // Stop any current preview
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      
      // Start new preview
      setCurrentPreviewTrack(track);
      setIsPreviewPlaying(true);
      
      if (previewAudioRef.current) {
        previewAudioRef.current.src = track.preview_url;
        previewAudioRef.current.play().catch(console.error);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
      } else {
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, []);

  const musicasFiltradas = musicas.filter(musica =>
    musica.name.toLowerCase().includes(pesquisaGeral.toLowerCase()) ||
    musica.artist.toLowerCase().includes(pesquisaGeral.toLowerCase()) ||
    (musica.album && musica.album.toLowerCase().includes(pesquisaGeral.toLowerCase()))
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Música</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Open Source Notice */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Área Open Source:</strong> Qualquer usuário pode adicionar e visualizar músicas. 
                  Use o Spotify para encontrar músicas e adicioná-las ao repertório da igreja.
                </AlertDescription>
              </Alert>

              {/* Pesquisa no Spotify */}
              <div className="space-y-2">
                <Label>Pesquisar no Spotify</Label>
                <div className="flex gap-2">
                  <Input
                    value={pesquisaMusica}
                    onChange={(e) => setPesquisaMusica(e.target.value)}
                    placeholder="Digite o nome da música..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && pesquisarSpotify()}
                  />
                  <Button 
                    onClick={pesquisarSpotify} 
                    variant="outline" 
                    disabled={searchingSpotify}
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Resultados do Spotify */}
              {resultadosSpotify.length > 0 && (
                <div className="space-y-2">
                  <Label>Resultados do Spotify</Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {resultadosSpotify.map((track) => (
                      <Card key={track.id} className="p-3 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          {track.album.images[0] && (
                            <img 
                              src={track.album.images[0].url} 
                              alt={track.album.name}
                              className="w-12 h-12 rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{track.name}</p>
                            <p className="text-sm text-gray-600 truncate">
                              {track.artists.map(a => a.name).join(', ')}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{track.album.name}</p>
                          </div>
                          <div className="flex gap-2">
                            {track.preview_url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePreview(track);
                                }}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                {currentPreviewTrack?.id === track.id && isPreviewPlaying ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                selecionarMusicaSpotify(track);
                              }}
                              className="text-green-500 hover:text-green-700"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulário de música */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Música *</Label>
                  <Input
                    id="name"
                    value={novaMusica.name || ""}
                    onChange={(e) => setNovaMusica({...novaMusica, name: e.target.value})}
                    placeholder="Nome da música"
                  />
                </div>
                <div>
                  <Label htmlFor="artist">Artista *</Label>
                  <Input
                    id="artist"
                    value={novaMusica.artist || ""}
                    onChange={(e) => setNovaMusica({...novaMusica, artist: e.target.value})}
                    placeholder="Nome do artista"
                  />
                </div>
                <div>
                  <Label htmlFor="album">Álbum</Label>
                  <Input
                    id="album"
                    value={novaMusica.album || ""}
                    onChange={(e) => setNovaMusica({...novaMusica, album: e.target.value})}
                    placeholder="Nome do álbum"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duração (segundos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={novaMusica.duration || 0}
                    onChange={(e) => setNovaMusica({...novaMusica, duration: parseInt(e.target.value) || 0})}
                    placeholder="Duração em segundos"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddMusic} className="bg-echurch-500 hover:bg-echurch-600">
                  Adicionar Música
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pesquisa geral */}
      <div className="flex gap-2">
        <Input
          value={pesquisaGeral}
          onChange={(e) => setPesquisaGeral(e.target.value)}
          placeholder="Pesquisar músicas..."
          className="flex-1"
        />
      </div>

      {/* Lista de músicas */}
      {loading ? (
        <div className="text-center py-8">
          <p>Carregando músicas...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {musicasFiltradas.map((musica) => (
            <Card key={musica.id} className="hover:shadow-md transition-shadow cursor-pointer" 
                  onClick={() => openPlayerModal(musica)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{musica.name}</CardTitle>
                    <p className="text-sm text-gray-600 truncate">{musica.artist}</p>
                    {musica.album && (
                      <p className="text-xs text-gray-500 truncate">{musica.album}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMusic(musica.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 mb-3">
                  {musica.cover_path && (
                    <img 
                      src={musica.cover_path} 
                      alt={musica.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{formatDuration(musica.duration)}</Badge>
                      {musica.spotify_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(musica.spotify_url, '_blank');
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* File upload area - keeping styling for future implementation */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload de arquivos</p>
                  <p className="text-xs text-gray-400">Em breve: envio de gravações</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {categorias.slice(0, 4).map((categoria) => (
                      <Badge key={categoria} variant="outline" className="text-xs">
                        {categoria}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {musicasFiltradas.length === 0 && !loading && (
        <div className="text-center py-8">
          <Music className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Nenhuma música encontrada</p>
          <p className="text-sm text-gray-400">Use o botão "Nova Música" para adicionar músicas</p>
        </div>
      )}

      {/* Music Player Modal */}
      <Dialog open={isPlayerModalOpen} onOpenChange={setIsPlayerModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Player de Música</DialogTitle>
          </DialogHeader>
          
          {selectedSong && (
            <div className="space-y-6">
              {/* Song Info */}
              <div className="flex items-center gap-4">
                {selectedSong.cover_path && (
                  <img 
                    src={selectedSong.cover_path} 
                    alt={selectedSong.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedSong.name}</h3>
                  <p className="text-gray-600">{selectedSong.artist}</p>
                  {selectedSong.album && (
                    <p className="text-sm text-gray-500">{selectedSong.album}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{formatDuration(selectedSong.duration)}</Badge>
                    {selectedSong.spotify_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(selectedSong.spotify_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Spotify
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Audio Player */}
              {selectedSong.preview_url && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    
                    <Button
                      onClick={togglePlay}
                      className="bg-echurch-500 hover:bg-echurch-600 rounded-full w-12 h-12"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>

                    <div className="w-20">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{formatDuration(currentTime)}</span>
                      <span>{formatDuration(duration)}</span>
                    </div>
                  </div>

                  {/* Audio Element */}
                  <audio
                    ref={audioRef}
                    src={selectedSong.preview_url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                  />
                </div>
              )}

              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h4 className="font-medium mb-2">Upload de Arquivos</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Em breve você poderá enviar gravações, partituras e outros arquivos relacionados a esta música.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {categorias.map((categoria) => (
                    <Badge key={categoria} variant="outline" className="text-xs justify-center py-1">
                      {categoria}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Song Details */}
              <div className="space-y-2">
                <h4 className="font-medium">Detalhes da Música</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Duração:</span> {formatDuration(selectedSong.duration)}
                  </div>
                  <div>
                    <span className="font-medium">Álbum:</span> {selectedSong.album || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Spotify ID:</span> {selectedSong.spotify_id || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Preview:</span> {selectedSong.preview_url ? 'Disponível' : 'Não disponível'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Hidden Audio Elements */}
      <audio ref={previewAudioRef} onEnded={() => setIsPreviewPlaying(false)} />
    </div>
  );
}