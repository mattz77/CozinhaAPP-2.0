import Navigation from "@/components/ui/navigation";
import HeroSection from "@/components/ui/hero-section";
import SectionCard from "@/components/ui/section-card";
import FeatureCard from "@/components/ui/FeatureCard";
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Seletor de usuários de teste - apenas em desenvolvimento */}
      {showTestSelector && (
        <div className="pt-20">
          <TestUserSelector />
        </div>
      )}

      <main className="pt-20">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Por que escolher o CozinhaApp?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Oferecemos uma experiência gastronômica única com pratos cuidadosamente 
                preparados e ingredientes frescos selecionados especialmente para você.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                image={soupImage}
                title="Ingredientes Frescos"
                description="Utilizamos apenas ingredientes frescos e de qualidade premium em todos os nossos pratos."
              />
              <FeatureCard
                image={breadImage}
                title="Culinária Artesanal"
                description="Nossos chefs preparam cada prato com paixão e técnica, garantindo sabores únicos."
              />
              <FeatureCard
                image={pizzaImage}
                title="Variedade de Sabores"
                description="Explore nosso cardápio diversificado com opções para todos os gostos e preferências."
              />
              <FeatureCard
                image={deliveryImage}
                title="Entrega Rápida"
                description="Entregamos seus pedidos rapidamente, mantendo a qualidade e temperatura dos alimentos."
              />
            </div>
          </div>
        </section>

        {/* Cardápio Section */}
        <CardapioSection />

        {/* Info Section */}
        <InfoSection />
      </main>
    </div>
  );
};

export default Index;