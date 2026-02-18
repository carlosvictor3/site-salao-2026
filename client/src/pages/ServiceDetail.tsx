import { useParams, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useService } from "@/hooks/use-services";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, ArrowLeft, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function ServiceDetail() {
  const { id } = useParams();
  const { data: service, isLoading } = useService(id!);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!service) return;
    addItem({
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      quantity: 1,
    });
    toast.success(`${service.name} adicionado ao carrinho!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="overflow-hidden max-w-5xl mx-auto">
            <div className="aspect-[16/9] bg-muted animate-pulse" />
            <CardContent className="p-8 space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center fade-in">
            <h2 className="text-3xl font-display font-bold mb-4">Serviço não encontrado</h2>
            <Button asChild>
              <Link href="/services">Voltar para Serviços</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" className="mb-6 fade-in">
            <Link href="/services">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Image */}
            <Card className="overflow-hidden border-border/50 fade-in">
              <div className="relative aspect-square">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
                    <span className="text-9xl font-display text-primary/20">{service.name[0]}</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-foreground backdrop-blur-sm shadow-lg">
                    {service.category}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Details */}
            <div className="space-y-6 fade-in" style={{ animationDelay: '0.1s' }}>
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
                  {service.name}
                </h1>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration} minutos</span>
                  </div>
                </div>
              </div>

              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-display font-bold text-primary">
                      R$ {service.price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Valor por sessão
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <h2 className="text-2xl font-display font-semibold">Descrição</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full gap-2 shadow-xl hover:shadow-2xl transition-all text-lg py-6"
                >
                  <Plus className="h-5 w-5" />
                  Adicionar ao Carrinho
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/services">
                    Ver Mais Serviços
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
