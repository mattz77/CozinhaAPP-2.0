import Navigation from "@/components/ui/navigation";
import HeroSection from "@/components/ui/hero-section";
import SectionCard from "@/components/ui/section-card";
import InfoSection from "@/components/ui/info-section";
import interiorImage from "@/assets/restaurant-interior.jpg";
import wineCellarImage from "@/assets/wine-cellar.jpg";
import barImage from "@/assets/restaurant-bar.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      
      {/* Gastronomia Section */}
      <section id="gastronomia" className="py-20">
        <div className="container mx-auto px-4">
          <SectionCard
            title="GASTRONOMIA"
            description="Nossa culinária combina técnicas clássicas com ingredientes sazonais, criando pratos que despertam todos os sentidos. Cada criação é uma obra de arte gastronômica, elaborada com paixão e precisão pelos nossos chefs experientes."
            image={interiorImage}
          />
        </div>
      </section>

      {/* Ambiente Section */}
      <section id="ambiente" className="py-20 bg-elegant">
        <div className="container mx-auto px-4">
          <SectionCard
            title="AMBIENTE"
            description="Um espaço sofisticado e acolhedor, onde cada detalhe foi pensado para proporcionar momentos únicos. Nossa decoração elegante e iluminação intimista criam a atmosfera perfeita para jantares especiais e celebrações memoráveis."
            image={interiorImage}
            reverse
          />
        </div>
      </section>

      {/* Adega Section */}
      <section id="adega" className="py-20">
        <div className="container mx-auto px-4">
          <SectionCard
            title="ADEGA"
            description="Nossa seleção de vinhos foi cuidadosamente curada para harmonizar perfeitamente com nossos pratos. Contamos com rótulos nacionais e internacionais, desde joias raras até descobertas surpreendentes que complementam sua experiência gastronômica."
            image={wineCellarImage}
          />
        </div>
      </section>

      {/* Bar Section */}
      <section id="bar" className="py-20 bg-elegant">
        <div className="container mx-auto px-4">
          <SectionCard
            title="BAR"
            description="Nosso bar oferece uma carta de coquetéis autorais e clássicos, preparados com ingredientes premium e técnicas refinadas. Um espaço perfeito para um aperitivo antes do jantar ou para prolongar a noite com amigos."
            image={barImage}
            reverse
          />
        </div>
      </section>

      {/* Eventos Section */}
      <section id="eventos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">
              EVENTOS
            </h2>
            <p className="font-elegant text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
              Transformamos ocasiões especiais em experiências inesquecíveis. Nosso espaço e equipe estão preparados para receber seus eventos corporativos, celebrações familiares e momentos únicos com toda a sofisticação que você merece.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <h3 className="font-heading text-2xl font-bold text-primary">Eventos Corporativos</h3>
                <p className="font-elegant text-muted-foreground">Reuniões de negócios e celebrações empresariais</p>
              </div>
              <div className="space-y-4">
                <h3 className="font-heading text-2xl font-bold text-primary">Celebrações Familiares</h3>
                <p className="font-elegant text-muted-foreground">Aniversários, comemorações e encontros especiais</p>
              </div>
              <div className="space-y-4">
                <h3 className="font-heading text-2xl font-bold text-primary">Eventos Privados</h3>
                <p className="font-elegant text-muted-foreground">Jantares exclusivos e ocasiões íntimas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InfoSection />

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-heading text-3xl font-bold text-primary mb-4">loup</h3>
          <p className="font-elegant text-muted-foreground mb-4">
            Experiência gastronômica sofisticada
          </p>
          <p className="font-elegant text-sm text-muted-foreground">
            © 2024 Loup Restaurant. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;