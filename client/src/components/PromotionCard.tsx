import { Link } from "wouter";
import { Clock, Percent, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PromotionCardProps {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  originalPrice: string;
  promotionalPrice: string;
  serviceId: string;
  serviceName: string;
  serviceImageUrl?: string;
  endDate: string;
}

export function PromotionCard({
  id,
  title,
  description,
  discountPercentage,
  originalPrice,
  promotionalPrice,
  serviceId,
  serviceName,
  serviceImageUrl,
  endDate,
}: PromotionCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      serviceId,
      serviceName: `${serviceName} - ${title}`,
      price: promotionalPrice,
      quantity: 1,
      promotionId: id,
      isPromotion: true,
    });
    toast.success(`Promoção adicionada ao carrinho!`);
  };

  return (
    <Card className="group overflow-hidden border-primary/30 hover:border-primary transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 fade-in bg-gradient-to-br from-white to-primary/5">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {serviceImageUrl ? (
          <img
            src={serviceImageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20">
            <span className="text-6xl font-display text-primary/30">{serviceName[0]}</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className="bg-destructive text-destructive-foreground shadow-lg gap-1 text-sm font-bold">
            <Percent className="h-3 w-3" />
            {discountPercentage}% OFF
          </Badge>
        </div>
      </div>

      <CardContent className="p-5 space-y-3">
        <h3 className="font-display text-xl font-bold text-primary line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Válido até {format(new Date(endDate), "dd 'de' MMMM", { locale: ptBR })}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm line-through text-muted-foreground">R$ {originalPrice}</span>
          <span className="text-3xl font-display font-bold text-primary">R$ {promotionalPrice}</span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full gap-2 shadow-lg hover:shadow-xl transition-all"
          size="lg"
        >
          <Plus className="h-4 w-4" />
          Aproveitar Promoção
        </Button>
      </CardFooter>
    </Card>
  );
}
