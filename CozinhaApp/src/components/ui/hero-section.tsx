import { Button } from "@/components/ui/button";
import heroImage from "@/assets/food-soup.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Content com Glassmorphism */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 animate-fade-in">
        {/* Container com efeito glassmorphism e espaçamento adequado */}
        <div 
          className="hero-container backdrop-blur-md border border-white/20 rounded-3xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-xl)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
          }}
        >
        {/* Título Principal com espaçamento correto */}
        <div>
          <h1 className="hero-title font-modern text-6xl md:text-7xl lg:text-8xl font-black relative animate-glow-pulse">
            <span className="bg-gradient-to-r from-primary via-yellow-400 to-primary bg-clip-text text-transparent glow-mustard tracking-tight">
              CozinhaApp
            </span>
            {/* Efeito de brilho adicional */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-yellow-400/20 to-primary/20 blur-3xl -z-10"></div>
          </h1>
          
          {/* Slogan com espaçamento adequado */}
          <div className="animate-slide-up">
            <p className="hero-slogan font-elegant text-xl md:text-2xl lg:text-3xl text-white font-light tracking-wide">
              Sabores que <span className="text-primary font-semibold">conquistam</span>
            </p>
            <p className="hero-description font-elegant text-base md:text-lg lg:text-xl text-white/90 mx-auto leading-relaxed">
              Delivery de comida gourmet preparada com ingredientes frescos e muito amor
            </p>
          </div>
        </div>

        {/* Botões com espaçamento adequado */}
        <div className="hero-buttons flex flex-col sm:flex-row justify-center items-center">
          <Button
            size="lg"
            className="group relative bg-gradient-to-r from-primary via-yellow-400 to-primary text-primary-foreground font-elegant px-12 py-6 text-lg rounded-2xl shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:scale-105 overflow-hidden"
          >
            {/* Efeito de brilho animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
            
            {/* Conteúdo do botão */}
            <span className="relative z-10 font-semibold tracking-wide">
              VER CARDÁPIO
            </span>
            
            {/* Efeito de borda brilhante */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-yellow-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="group relative border-2 border-primary text-primary hover:text-primary-foreground font-elegant px-12 py-6 text-lg rounded-2xl shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:scale-105 backdrop-blur-sm bg-white/5 hover:bg-gradient-to-r hover:from-primary hover:to-yellow-400 overflow-hidden"
          >
            {/* Efeito de preenchimento animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>
            
            {/* Conteúdo do botão */}
            <span className="relative z-10 font-semibold tracking-wide">
              FAZER PEDIDO
            </span>
            
            {/* Ícone de seta animada */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:translate-x-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Button>
        </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-primary animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center glow-mustard">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;