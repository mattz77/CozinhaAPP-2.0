import Navigation from "@/components/ui/navigation";
import HeroSection from "@/components/ui/hero-section";
import SectionCard from "@/components/ui/section-card";
import InfoSection from "@/components/ui/info-section";
import CardapioSection from "@/components/CardapioSection";
import { TestUserSelector } from "@/components/TestUserSelector";
import { useAuth } from "@/contexts/AuthContext";
import soupImage from "@/assets/food-soup.jpg";
import breadImage from "@/assets/food-bread.jpg";
import pizzaImage from "@/assets/food-pizza.jpg";
import deliveryImage from "@/assets/food-delivery.jpg";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar seletor de usuários de teste apenas em desenvolvimento e quando não logado
  const isDev = import.meta.env.DEV;
  const showTestSelector = isDev && !isAuthenticated && !isLoading;

  // Debug: Log do estado
  console.log('🔍 Index: Estado atual:', {
    isAuthenticated,
    isLoading,
    showTestSelector,
    isDev
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {showTestSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <TestUserSelector />
        </div>
      )}
      <HeroSection />
      
      {/* Como Funciona Section */}
      <section id="inicio" className="py-20">
        <div className="container mx-auto px-4">
          <SectionCard
            title="COMO FUNCIONA"
            description="Peça sua comida favorita de forma rápida e prática através do nosso app. Escolha entre centenas de pratos deliciosos, acompanhe o preparo em tempo real e receba tudo quentinho na sua casa."
            image={deliveryImage}
          />
        </div>
      </section>

      {/* Cardápio Section */}
      <CardapioSection />

      {/* Delivery Section */}
      <section id="agendamentos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">
              DELIVERY RÁPIDO
            </h2>
            <p className="font-elegant text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
              Entregamos em toda São Paulo com agilidade e segurança. Acompanhe seu pedido em tempo real e receba sua refeição sempre no prazo combinado.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <h3 className="font-heading text-2xl font-bold text-primary">Entrega Rápida</h3>
                <p className="font-elegant text-muted-foreground">Até 45 minutos na sua porta</p>
              </div>
              <div className="space-y-4">
                <h3 className="font-heading text-2xl font-bold text-primary">Acompanhamento</h3>
                <p className="font-elegant text-muted-foreground">Monitore seu pedido em tempo real</p>
              </div>
              <div className="space-y-4">
                <h3 className="font-heading text-2xl font-bold text-primary">Cobertura Total</h3>
                <p className="font-elegant text-muted-foreground">Atendemos toda a Grande São Paulo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InfoSection />

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-heading text-3xl font-bold text-primary mb-4">CozinhaApp</h3>
          <p className="font-elegant text-muted-foreground mb-4">
            Delivery de comida gourmet
          </p>
          <p className="font-elegant text-sm text-muted-foreground">
            © 2025 CozinhaApp. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;