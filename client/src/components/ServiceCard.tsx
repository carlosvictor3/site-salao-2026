import { Link } from "wouter";
import { Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import toast from "react-hot-toast";

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: number;
  imageUrl?: string;
  category: string;
}

export function ServiceCard({ id, name, description, price, duration, imageUrl, category }: ServiceCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      serviceId: id,
      serviceName: name,
      price,
      quantity: 1,
    });
    toast.success(`${name} adicionado ao carrinho!`);
  };

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 fade-in">
      <Link href={`/services/${id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
              <span className="text-6xl font-display text-primary/20">{name[0]}</span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 text-foreground backdrop-blur-sm shadow-lg">
              {category}
            </Badge>
          </div>
        </div>
      </Link>

      <CardContent className="p-4 space-y-2">
        <Link href={`/services/${id}`}>
          <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{duration} min</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
        <div>
          <p className="text-2xl font-display font-bold text-primary">
            R$ {price}
          </p>
        </div>
        <Button
          onClick={handleAddToCart}
          size="sm"
          className="gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
}
