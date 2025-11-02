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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { set } from "date-fns";
import { areaService } from "@/api";
import { Area } from "recharts";

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
            await handoutService.create(formData);
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
                            <div>
                                <Label htmlFor="start_date">Data de Início</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, start_date: e.target.value })
                                    }
                                    disabled={formData.activate}
                                />
                            </div>
                            <div>
                                <Label htmlFor="end_date">Data de Término</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, end_date: e.target.value })
                                    }
                                />
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
