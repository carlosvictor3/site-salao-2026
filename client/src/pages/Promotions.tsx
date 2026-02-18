import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PromotionCard } from "@/components/PromotionCard";
import { useActivePromotions } from "@/hooks/use-promotions";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Percent } from "lucide-react";

export default function Promotions() {
  const { data: promotions, isLoading } = useActivePromotions();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-destructive/10 via-background to-primary/10 py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4 fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                <Percent className="h-4 w-4" />
                <span className="text-sm font-medium">Ofertas Limitadas</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold">
                Promoções <span className="gradient-text">Especiais</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Aproveite descontos exclusivos em nossos serviços
              </p>
            </div>
          </div>
        </section>

        {/* Promotions Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-[4/3] bg-muted animate-pulse" />
                    <CardContent className="p-5 space-y-3">
                      <div className="h-6 bg-muted animate-pulse rounded" />
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      <div className="h-8 bg-muted animate-pulse rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !promotions || promotions.length === 0 ? (
              <div className="text-center py-16 fade-in">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-display font-semibold mb-2">
                  Nenhuma promoção ativa no momento
                </h3>
                <p className="text-muted-foreground">
                  Fique atento! Novas ofertas chegam em breve
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((promo: any, index: number) => (
                  <div key={promo.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <PromotionCard
                      id={promo.id}
                      title={promo.title}
                      description={promo.description}
                      discountPercentage={promo.discountPercentage}
                      originalPrice={promo.originalPrice}
                      promotionalPrice={promo.promotionalPrice}
                      serviceId={promo.serviceId}
                      serviceName={promo.service?.name || 'Serviço'}
                      serviceImageUrl={promo.service?.imageUrl}
                      endDate={promo.endDate}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
