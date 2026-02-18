import { Link, useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Sparkles } from "lucide-react";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [, navigate] = useLocation();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center space-y-6 fade-in max-w-md">
            <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-display font-bold">Carrinho Vazio</h2>
            <p className="text-muted-foreground">
              Adicione serviços ao seu carrinho para continuar
            </p>
            <Button asChild size="lg" className="shadow-lg">
              <Link href="/services">
                <Sparkles className="mr-2 h-5 w-5" />
                Ver Serviços
              </Link>
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 fade-in">
            Seu <span className="gradient-text">Carrinho</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <Card key={`${item.serviceId}-${item.promotionId}`} className="overflow-hidden fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl font-display text-primary/30">
                          {item.serviceName[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-lg mb-1 truncate">
                          {item.serviceName}
                        </h3>
                        {item.isPromotion && (
                          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-destructive/10 text-destructive mb-2">
                            Promoção
                          </span>
                        )}
                        <p className="text-xl font-bold text-primary mb-3">
                          R$ {item.price}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 border border-border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.serviceId, item.quantity - 1, item.promotionId)}
                              className="h-8 w-8"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.serviceId, item.quantity + 1, item.promotionId)}
                              className="h-8 w-8"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.serviceId, item.promotionId)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full"
              >
                Limpar Carrinho
              </Button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 fade-in">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-display font-bold">Resumo</h2>
                  <div className="space-y-2 py-4 border-y border-border">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-3xl font-display font-bold text-primary">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    onClick={() => navigate('/checkout')}
                    size="lg"
                    className="w-full gap-2 shadow-xl hover:shadow-2xl transition-all"
                  >
                    Finalizar Compra
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/services">Continuar Comprando</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
