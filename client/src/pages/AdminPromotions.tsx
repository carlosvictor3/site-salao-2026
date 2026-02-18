import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { usePromotions, useCreatePromotion, useUpdatePromotion, useDeletePromotion } from "@/hooks/use-promotions";
import { useServices } from "@/hooks/use-services";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function AdminPromotions() {
  const [, navigate] = useLocation();
  const { data: promotions, isLoading } = usePromotions();
  const { data: services } = useServices();
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const deletePromotion = useDeletePromotion();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<any>(null);
  const [formData, setFormData] = useState({
    serviceId: "",
    title: "",
    description: "",
    discountPercentage: "",
    originalPrice: "",
    promotionalPrice: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_authenticated");
    if (!isAuth) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const calculatePromotionalPrice = (original: string, discount: string) => {
    const originalNum = parseFloat(original);
    const discountNum = parseInt(discount);
    if (!isNaN(originalNum) && !isNaN(discountNum)) {
      const promotional = originalNum * (1 - discountNum / 100);
      return promotional.toFixed(2);
    }
    return "";
  };

  useEffect(() => {
    if (formData.originalPrice && formData.discountPercentage) {
      const promotional = calculatePromotionalPrice(formData.originalPrice, formData.discountPercentage);
      setFormData(prev => ({ ...prev, promotionalPrice: promotional }));
    }
  }, [formData.originalPrice, formData.discountPercentage]);

  const handleOpenDialog = (promotion?: any) => {
    if (promotion) {
      setEditingPromotion(promotion);
      setFormData({
        serviceId: promotion.serviceId,
        title: promotion.title,
        description: promotion.description,
        discountPercentage: promotion.discountPercentage.toString(),
        originalPrice: promotion.originalPrice,
        promotionalPrice: promotion.promotionalPrice,
        startDate: format(new Date(promotion.startDate), "yyyy-MM-dd"),
        endDate: format(new Date(promotion.endDate), "yyyy-MM-dd"),
        isActive: promotion.isActive,
      });
    } else {
      setEditingPromotion(null);
      setFormData({
        serviceId: "",
        title: "",
        description: "",
        discountPercentage: "",
        originalPrice: "",
        promotionalPrice: "",
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        discountPercentage: parseInt(formData.discountPercentage),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      if (editingPromotion) {
        await updatePromotion.mutateAsync({ id: editingPromotion.id, ...data });
        toast.success("Promoção atualizada!");
      } else {
        await createPromotion.mutateAsync(data);
        toast.success("Promoção criada!");
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error("Erro ao salvar promoção");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta promoção?")) {
      try {
        await deletePromotion.mutateAsync(id);
        toast.success("Promoção excluída!");
      } catch (error) {
        toast.error("Erro ao excluir promoção");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center gap-4 mb-8 fade-in">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-4xl font-display font-bold flex-1">
              Gerenciar <span className="gradient-text">Promoções</span>
            </h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Promoção
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display">
                    {editingPromotion ? "Editar Promoção" : "Nova Promoção"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceId">Serviço *</Label>
                    <Select value={formData.serviceId} onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {services?.filter((s: any) => s.isActive).map((service: any) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - R$ {service.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea
                      id="description"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Preço Original *</Label>
                      <Input
                        id="originalPrice"
                        required
                        value={formData.originalPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                        placeholder="99.90"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountPercentage">Desconto (%) *</Label>
                      <Input
                        id="discountPercentage"
                        type="number"
                        required
                        min="1"
                        max="100"
                        value={formData.discountPercentage}
                        onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="promotionalPrice">Preço Promocional *</Label>
                    <Input
                      id="promotionalPrice"
                      required
                      value={formData.promotionalPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, promotionalPrice: e.target.value }))}
                      placeholder="Calculado automaticamente"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Data Início *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Data Fim *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="isActive">Promoção ativa</Label>
                  </div>
                  <Button type="submit" className="w-full" disabled={createPromotion.isPending || updatePromotion.isPending}>
                    {editingPromotion ? "Salvar Alterações" : "Criar Promoção"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted animate-pulse rounded w-1/3 mb-2" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {promotions?.map((promo: any, index: number) => (
                <Card key={promo.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-display font-semibold mb-1">{promo.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{promo.service?.name}</p>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{promo.description}</p>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="px-2 py-1 rounded-full bg-destructive/10 text-destructive font-bold">
                            {promo.discountPercentage}% OFF
                          </span>
                          <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground line-through">
                            R$ {promo.originalPrice}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            R$ {promo.promotionalPrice}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            {format(new Date(promo.startDate), "dd/MM")} - {format(new Date(promo.endDate), "dd/MM")}
                          </span>
                          <span className={`px-2 py-1 rounded-full ${promo.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {promo.isActive ? 'Ativa' : 'Inativa'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenDialog(promo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(promo.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
