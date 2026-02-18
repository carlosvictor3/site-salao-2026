import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [, navigate] = useLocation();
  const createOrder = useCreateOrder();
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Carrinho vazio");
      return;
    }

    try {
      await createOrder.mutateAsync({
        ...formData,
        items: items.map(item => ({
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          price: item.price,
          quantity: item.quantity,
          promotionId: item.promotionId,
        })),
      });

      setShowSuccess(true);
      clearCart();
    } catch (error) {
      toast.error("Erro ao criar pedido. Tente novamente.");
    }
  };

  if (items.length === 0 && !showSuccess) {
    navigate('/cart');
    return null;
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-12">
          <Card className="max-w-lg w-full mx-4 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 fade-in">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold">Pedido Confirmado!</h2>
                <p className="text-muted-foreground">
                  Seu pedido foi recebido com sucesso.
                </p>
              </div>
              <Card className="bg-background/50 border-border/50">
                <CardContent className="p-4 text-sm text-left space-y-2">
                  <p className="font-semibold">Próximos passos:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Pagamento será processado posteriormente</li>
                    <li>Entraremos em contato para agendar o atendimento</li>
                    <li>Você receberá um email de confirmação</li>
                  </ul>
                </CardContent>
              </Card>
              <Button onClick={() => navigate('/')} size="lg" className="w-full">
                Voltar para Home
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 fade-in">
            Finalizar <span className="gradient-text">Pedido</span>
          </h1>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="fade-in">
                <CardHeader>
                  <CardTitle className="font-display">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Alguma preferência ou observação?"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 fade-in">
                <CardHeader>
                  <CardTitle className="font-display">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={`${item.serviceId}-${item.promotionId}`} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.quantity}x {item.serviceName}
                        </span>
                        <span className="font-medium">
                          R$ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-3xl font-display font-bold text-primary">
                        R$ {total.toFixed(2)}
                      </span>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gap-2 shadow-xl hover:shadow-2xl transition-all"
                      disabled={createOrder.isPending}
                    >
                      {createOrder.isPending ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        "Confirmar Pedido"
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Pagamento será processado posteriormente
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
