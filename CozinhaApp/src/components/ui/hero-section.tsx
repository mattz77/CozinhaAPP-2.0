import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCartSync } from "@/hooks/useCartSync";
import { usePratos } from "@/hooks/useApi";
import { AgendamentoModal } from "@/components/auth/AgendamentoModal";
import { useState } from "react";
import heroImage from "@/assets/food-soup.jpg";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const { openCart, items, totalItems } = useCartSync();
  const { data: pratos = [] } = usePratos();
  const [isAgendamentoModalOpen, setIsAgendamentoModalOpen] = useState(false);

  // Função para rolar para a seção do cardápio
  const scrollToCardapio = () => {
    const cardapioSection = document.getElementById('cardapio');
    if (cardapioSection) {
      cardapioSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Função para fazer pedido
  const handleFazerPedido = () => {
    if (!isAuthenticated) {
      // Disparar evento para abrir modal de login
      window.dispatchEvent(new CustomEvent('openAuthModal'));
      return;
    }

    // Se estiver logado, verificar se há itens no carrinho
    if (totalItems > 0) {
      // Se há itens no carrinho, abrir o carrinho
      openCart();
    } else {
      // Se não há itens, mostrar opções
      showOrderOptions();
    }
  };

  // Função para mostrar opções quando não há itens no carrinho
  const showOrderOptions = () => {
    // Criar modal com opções
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Como deseja prosseguir?</h3>
          <p class="text-gray-600">Você ainda não tem itens no carrinho.</p>
        </div>
        
        <div class="space-y-4">
          <button 
            id="add-items-btn"
            class="w-full bg-gradient-to-r from-primary to-yellow-400 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            📋 Ver Cardápio e Adicionar Itens
          </button>
          
          <button 
            id="schedule-btn"
            class="w-full border-2 border-primary text-primary font-semibold py-4 px-6 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105"
          >
            📅 Agendar Pedido
          </button>
          
          <button 
            id="close-modal-btn"
            class="w-full text-gray-500 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('#add-items-btn')?.addEventListener('click', () => {
      document.body.removeChild(modal);
      scrollToCardapio();
    });
    
    modal.querySelector('#schedule-btn')?.addEventListener('click', () => {
      document.body.removeChild(modal);
      setIsAgendamentoModalOpen(true);
    });
    
    modal.querySelector('#close-modal-btn')?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  };

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
            onClick={scrollToCardapio}
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
            onClick={handleFazerPedido}
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

      {/* Modal de Agendamento */}
      <AgendamentoModal 
        isOpen={isAgendamentoModalOpen}
        onClose={() => setIsAgendamentoModalOpen(false)}
        pratos={pratos}
      />
    </section>
  );
};

export default HeroSection;