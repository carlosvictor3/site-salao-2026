import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Tag, ShoppingBag, LogOut } from "lucide-react";

export default function Admin() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_authenticated");
    if (!isAuth) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    navigate("/admin/login");
  };

  const sections = [
    {
      title: "Serviços",
      description: "Gerenciar serviços disponíveis",
      icon: Package,
      href: "/admin/services",
      color: "primary",
    },
    {
      title: "Promoções",
      description: "Criar e editar promoções",
      icon: Tag,
      href: "/admin/promotions",
      color: "accent",
    },
    {
      title: "Pedidos",
      description: "Visualizar e gerenciar pedidos",
      icon: ShoppingBag,
      href: "/admin/orders",
      color: "primary",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex justify-between items-center mb-8 fade-in">
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              Painel <span className="gradient-text">Admin</span>
            </h1>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {sections.map((section, index) => (
              <Link key={section.href} href={section.href}>
                <Card
                  className="group cursor-pointer border-border/50 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1 fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 mb-3 rounded-lg bg-${section.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <section.icon className={`h-6 w-6 text-${section.color}`} />
                    </div>
                    <CardTitle className="font-display group-hover:text-primary transition-colors">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
