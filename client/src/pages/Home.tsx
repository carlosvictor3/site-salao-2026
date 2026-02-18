import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { PromotionCard } from "@/components/PromotionCard";
import { useServices } from "@/hooks/use-services";
import { useActivePromotions } from "@/hooks/use-promotions";
import { Sparkles, Star, Calendar, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: promotions, isLoading: promotionsLoading } = useActivePromotions();

  const featuredServices = services?.filter(s => s.isActive).slice(0, 3) || [];
  const activePromotions = promotions?.slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Agendamento Online</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold">
              Sua beleza,
              <span className="gradient-text"> nossa arte</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra os melhores tratamentos de beleza e bem-estar. Profissionais qualificados prontos para transformar seu visual.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="shadow-xl hover:shadow-2xl transition-all">
                <Link href="/services">
                  Ver Serviços
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2">
                <Link href="/promotions">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Promoções
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-border/50 hover:border-primary/50 transition-all fade-in">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Profissionais Qualificados</h3>
                <p className="text-muted-foreground">
                  Equipe experiente e certificada para garantir os melhores resultados
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-border/50 hover:border-primary/50 transition-all fade-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <Star className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Produtos Premium</h3>
                <p className="text-muted-foreground">
                  Trabalhamos apenas com marcas de alta qualidade e reconhecidas
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-border/50 hover:border-primary/50 transition-all fade-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Agendamento Fácil</h3>
                <p className="text-muted-foreground">
                  Reserve seus serviços online com praticidade e comodidade
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Active Promotions */}
      {activePromotions.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3 fade-in">
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                Promoções <span className="gradient-text">Especiais</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Aproveite nossas ofertas exclusivas por tempo limitado
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {activePromotions.map((promo: any, index: number) => (
                <div key={promo.id} style={{ animationDelay: `${index * 0.1}s` }}>
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
            <div className="text-center fade-in">
              <Button asChild size="lg" variant="outline">
                <Link href="/promotions">Ver Todas as Promoções</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Services */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3 fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Nossos <span className="gradient-text">Serviços</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubra a excelência em tratamentos de beleza
            </p>
          </div>
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-[4/3] bg-muted animate-pulse" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-6 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredServices.map((service: any, index: number) => (
                  <div key={service.id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <ServiceCard
                      id={service.id}
                      name={service.name}
                      description={service.description}
                      price={service.price}
                      duration={service.duration}
                      imageUrl={service.imageUrl}
                      category={service.category}
                    />
                  </div>
                ))}
              </div>
              <div className="text-center fade-in">
                <Button asChild size="lg" variant="outline">
                  <Link href="/services">Ver Todos os Serviços</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center fade-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Pronta para se sentir incrível?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Agende seu horário agora e descubra o poder de uma transformação completa
          </p>
          <Button asChild size="lg" variant="secondary" className="shadow-2xl hover:shadow-3xl transition-all">
            <Link href="/services">
              Começar Agora
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
