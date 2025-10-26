import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TimePicker } from '@/components/ui/time-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Users, Music, AlertCircle, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScheduleType } from '@/api';
import { useAuth } from '@/context/AuthContext';
import { useScheduleForm } from '@/hooks/useScheduleForm';

export default function ScheduleCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formData, errors, isSubmitting, updateField, handleSubmit } = useScheduleForm();

  const [musicas, setMusicas] = useState<string[]>([]);
  const [nomeMusica, setNomeMusica] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  function addMusica(e: React.FormEvent) {
    e.preventDefault();
    if (nomeMusica && !musicas.includes(nomeMusica)) {
      setMusicas([...musicas, nomeMusica]);
      setNomeMusica('');
    }
  }

  function removeMusica(musica: string) {
    setMusicas(musicas.filter(m => m !== musica));
  }

  function handleStartDateChange(date: Date | undefined) {
    setStartDate(date);
    if (date && startTime) {
      const [hours, minutes] = startTime.split(':');
      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(parseInt(hours), parseInt(minutes));
      updateField('start_date', combinedDateTime.toISOString());
    }
  }

  function handleEndDateChange(date: Date | undefined) {
    setEndDate(date);
    if (date && endTime) {
      const [hours, minutes] = endTime.split(':');
      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(parseInt(hours), parseInt(minutes));
      updateField('end_date', combinedDateTime.toISOString());
    }
  }

  function handleStartTimeChange(time: string) {
    setStartTime(time);
    if (startDate && time) {
      const [hours, minutes] = time.split(':');
      const combinedDateTime = new Date(startDate);
      combinedDateTime.setHours(parseInt(hours), parseInt(minutes));
      updateField('start_date', combinedDateTime.toISOString());
    }
  }

  function handleEndTimeChange(time: string) {
    setEndTime(time);
    if (endDate && time) {
      const [hours, minutes] = time.split(':');
      const combinedDateTime = new Date(endDate);
      combinedDateTime.setHours(parseInt(hours), parseInt(minutes));
      updateField('end_date', combinedDateTime.toISOString());
    }
  }

  async function onSubmit() {
    // Verificar se o usuário está autenticado
    if (!user) {
      toast.error('Você precisa estar autenticado para criar uma escala');
      return;
    }

    // Verificar permissão
    if (!user.permissions?.create_scale) {
      toast.error('Você não tem permissão para criar escalas');
      return;
    }

    // Chama o handleSubmit do hook com o callback de sucesso
    await handleSubmit(user.id, () => {
      navigate('/schedules');
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-echurch-700 flex items-center gap-2">
          <CalendarIcon className="w-8 h-8" />
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
                    value={formData.name}
                    onChange={e => updateField('name', e.target.value)}
                    placeholder="Ex: Culto Domingo Manhã"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Escala</Label>
                  <Select value={formData.type} onValueChange={(value: ScheduleType) => updateField('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ScheduleType.Geral}>Geral</SelectItem>
                      <SelectItem value={ScheduleType.Louvor}>Louvor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Input
                    id="descricao"
                    value={formData.description}
                    onChange={e => updateField('description', e.target.value)}
                    placeholder="Descrição da escala"
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="local">Local *</Label>
                  <Input
                    id="local"
                    value={formData.local}
                    onChange={e => updateField('local', e.target.value)}
                    placeholder="Ex: Igreja Central"
                    className={errors.local ? 'border-red-500' : ''}
                  />
                  {errors.local && <p className="text-xs text-red-500">{errors.local}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataInicio">Data e Hora de Início *</Label>
                  <div className="flex gap-3 items-start">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`flex-1 justify-start text-left font-normal ${!startDate ? 'text-muted-foreground' : ''} ${errors.start_date ? 'border-red-500' : ''}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={handleStartDateChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <TimePicker
                      value={startTime}
                      onChange={handleStartTimeChange}
                      className={errors.start_date ? 'border-red-500' : ''}
                    />
                  </div>
                  {errors.start_date && <p className="text-xs text-red-500">{errors.start_date}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataFim">Data e Hora de Término *</Label>
                  <div className="flex gap-3 items-start">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`flex-1 justify-start text-left font-normal ${!endDate ? 'text-muted-foreground' : ''} ${errors.end_date ? 'border-red-500' : ''}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={handleEndDateChange}
                          disabled={(date) => {
                            const today = new Date(new Date().setHours(0, 0, 0, 0));
                            return date < today || (startDate && date < startDate);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <TimePicker
                      value={endTime}
                      onChange={handleEndTimeChange}
                      className={errors.end_date ? 'border-red-500' : ''}
                    />
                  </div>
                  {errors.end_date && <p className="text-xs text-red-500">{errors.end_date}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  value={formData.observation}
                  onChange={e => updateField('observation', e.target.value)}
                  placeholder="Informações adicionais..."
                />
              </div>
            </CardContent>
          </Card>

          {formData.type === ScheduleType.Louvor && (
            <Card className="mt-6">
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
                    onChange={e => setNomeMusica(e.target.value)}
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
            <Button onClick={onSubmit} className="w-full bg-echurch-500 hover:bg-echurch-600" disabled={isSubmitting}>
              <CalendarIcon className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Criando...' : 'Criar Escala'}
            </Button>
            <p className="text-xs text-center text-echurch-500">* Campos obrigatórios</p>
          </div>
        </div>
      </div>
    </div>
  );
}
