import React, { useEffect, useState } from "react";
import { handoutService } from "@/api/services/handoutService";
import { Handout } from "@/api/handout";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimePicker } from "@/components/ui/time-picker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { areaService } from "@/api";

export const HandoutManager: React.FC = () => {
    const { user } = useAuth();
    const [handouts, setHandouts] = useState<Handout[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [userAreas, setUserAreas] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [formData, setFormData] = useState<any>({
        title: "",
        description: "",
        priority: "normal",
        status: "P",
        start_date: "",
        end_date: "",
        link_name: "",
        link_url: "",
        activate: false,
        image: undefined,
    });

    const fetchHandouts = async () => {
        try {
            setLoading(true);
            const data = await handoutService.getActive();
            setHandouts(data);
        } catch {
            setError("Erro ao carregar comunicados.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Prepare data - exclude area_id if it's 0 (all areas)
            const submitData = { ...formData };
            if (submitData.area_id === 0) {
                delete submitData.area_id;
            }
            
            await handoutService.create(submitData);
            
            // Reset form data
            setFormData({
                title: "",
                description: "",
                priority: "normal",
                status: "P",
                start_date: "",
                end_date: "",
                link_name: "",
                link_url: "",
                activate: false,
            });
            
            // Reset date/time state
            setStartDate(undefined);
            setEndDate(undefined);
            setStartTime('');
            setEndTime('');
            
            fetchHandouts();
        } catch (err: any) {
            alert("Erro ao criar comunicado.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Deseja realmente excluir este comunicado?")) return;
        try {
            await handoutService.delete(id);
            fetchHandouts();
        } catch {
            alert("Erro ao excluir comunicado.");
        }
    };

    const fetchData = async () => {
        // Single API call to get areas with their roles
        const data = await areaService.getAll();
        setUserAreas(data);
    };

    const handleStartDateChange = (date: Date | undefined) => {
        setStartDate(date);
        if (date && startTime) {
            const [hours, minutes] = startTime.split(':');
            const combinedDateTime = new Date(date);
            combinedDateTime.setHours(parseInt(hours), parseInt(minutes));
            setFormData({ ...formData, start_date: combinedDateTime.toISOString() });
        } else if (date) {
            const combinedDateTime = new Date(date);
            combinedDateTime.setHours(0, 0, 0);
            setFormData({ ...formData, start_date: combinedDateTime.toISOString() });
        }
    };

    const handleEndDateChange = (date: Date | undefined) => {
        setEndDate(date);
        if (date && endTime) {
            const [hours, minutes] = endTime.split(':');
            const combinedDateTime = new Date(date);
            combinedDateTime.setHours(parseInt(hours), parseInt(minutes));
            setFormData({ ...formData, end_date: combinedDateTime.toISOString() });
        } else if (date) {
            const combinedDateTime = new Date(date);
            combinedDateTime.setHours(23, 59, 59);
            setFormData({ ...formData, end_date: combinedDateTime.toISOString() });
        }
    };

    const handleStartTimeChange = (time: string) => {
        setStartTime(time);
        if (startDate && time) {
            const [hours, minutes] = time.split(':');
            const combinedDateTime = new Date(startDate);
            combinedDateTime.setHours(parseInt(hours), parseInt(minutes));
            setFormData({ ...formData, start_date: combinedDateTime.toISOString() });
        }
    };

    const handleEndTimeChange = (time: string) => {
        setEndTime(time);
        if (endDate && time) {
            const [hours, minutes] = time.split(':');
            const combinedDateTime = new Date(endDate);
            combinedDateTime.setHours(parseInt(hours), parseInt(minutes));
            setFormData({ ...formData, end_date: combinedDateTime.toISOString() });
        }
    };

    useEffect(() => {
        fetchData();
        fetchHandouts();
    }, []);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-6 space-y-8">
            <div>
                <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                        if (window.history.length > 1) navigate(-1);
                        else navigate("/home")
                    }}
                    className="pl-0"
                >
                    <ArrowLeft size={80} />
                    <CardTitle>Gerenciar Comunicados</CardTitle>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Novo</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title">Título *</Label>
                                <Input
                                    id="title"
                                    required
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <Label htmlFor="priority">Prioridade</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(v) => setFormData({ ...formData, priority: v as any })}
                                >
                                    <SelectTrigger id="priority">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="normal">Normal</SelectItem>
                                        <SelectItem value="high">Alta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description">Descrição *</Label>
                            <Textarea
                                id="description"
                                required
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Area *</Label>
                            <Select
                                required
                                value={formData.area_id?.toString()}
                                onValueChange={(id) => setFormData({ ...formData, area_id: parseInt(id) })}
                            >
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Selecione uma área" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key={0} value={"0"}>
                                        Todas as áreas
                                    </SelectItem>
                                    {userAreas.map((area) => (
                                        <SelectItem key={area.id} value={area.id.toString()}>
                                            {area.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="activate"
                                checked={formData.activate ?? false}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, activate: checked })
                                }
                            />
                            <Label htmlFor="activate">Ativar comunicado imediatamente</Label>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Data e Hora de Início</Label>
                                <div className="flex gap-3 items-start">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={`flex-1 justify-start text-left font-normal ${!startDate ? 'text-muted-foreground' : ''}`}
                                                disabled={formData.activate}
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
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || formData.activate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <TimePicker
                                        value={startTime}
                                        onChange={handleStartTimeChange}
                                        disabled={formData.activate}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end_date">Data e Hora de Término</Label>
                                <div className="flex gap-3 items-start">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={`flex-1 justify-start text-left font-normal ${!endDate ? 'text-muted-foreground' : ''}`}
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
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="link_name">Nome do Link</Label>
                                <Input
                                    id="link_name"
                                    value={formData.link_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, link_name: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="link_url">URL do Link</Label>
                                <Input
                                    id="link_url"
                                    value={formData.link_url}
                                    onChange={(e) =>
                                        setFormData({ ...formData, link_url: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="image">Imagem</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    console.log(e.target.files);
                                    setFormData({ ...formData, image: e.target.files?.[0] })
                                }
                                }
                            />
                        </div>

                        

                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Criando..." : "Criar Comunicado"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <h3 className="text-lg font-semibold">Comunicados Criados</h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {handouts
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((h) => (
                            <Card key={h.id} className="overflow-hidden">
                                {h.image_url && (
                                    <div className="h-40 bg-muted">
                                        <img
                                            src={h.image_url}
                                            alt={h.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-base line-clamp-2">{h.title}</CardTitle>
                                        {h.priority === "high" && (
                                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full whitespace-nowrap">
                                                Alta
                                            </span>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {h.description}
                                    </p>
                                    
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className="px-2 py-1 bg-muted rounded">
                                            {h.status === "A" ? "Ativo" : h.status === "P" ? "Pendente" : "Inativo"}
                                        </span>
                                        {h.start_date && (
                                            <span>Início: {new Date(h.start_date).toLocaleDateString()}</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        {h.link_url && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(h.link_url, "_blank")}
                                                className="flex-1"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-1" />
                                                {h.link_name || "Link"}
                                            </Button>
                                        )}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(h.id)}
                                            className={h.link_url ? "" : "flex-1"}
                                        >
                                            Deletar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </div>

                {handouts.length > itemsPerPage && (
                    <div className="flex justify-center gap-2 pt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        <span className="px-4 py-2 text-sm">
                            Página {currentPage} de {Math.ceil(handouts.length / itemsPerPage)}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(Math.ceil(handouts.length / itemsPerPage), p + 1))}
                            disabled={currentPage >= Math.ceil(handouts.length / itemsPerPage)}
                        >
                            Próxima
                        </Button>
                    </div>
                )}

                {handouts.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                        Nenhum comunicado criado ainda.
                    </p>
                )}
            </div>
        </div>
    );
};
