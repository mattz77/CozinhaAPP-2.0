import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Heart, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';

interface Prato {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  tempoPreparo: number;
  categoria?: { nome: string };
  imagemUrl?: string;
  disponivel: boolean;
}

interface CardapioCarouselProps {
  pratos: Prato[];
  categorias: { id: number; nome: string }[];
  categoriaSelecionada: number | null;
  onCategoriaChange: (categoriaId: number | null) => void;
}

export const CardapioCarousel: React.FC<CardapioCarouselProps> = ({
  pratos,
  categorias,
  categoriaSelecionada,
  onCategoriaChange
}) => {
  const { isAuthenticated } = useAuth();
  const { addItem, openCart } = useCart();
  const [isLiked, setIsLiked] = useState<{ [key: number]: boolean }>({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const [cardsPerView, setCardsPerView] = useState(3);

  // Calcular quantos cards mostrar baseado no tamanho da tela
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCardsPerView(1);
      } else if (width < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const handleAddToOrder = (prato: Prato) => {
    if (!isAuthenticated) {
      // Mostrar modal de login ou toast
      console.warn('Usuário deve estar logado para adicionar itens ao carrinho');
      return;
    }
    
    addItem({
      id: prato.id,
      nome: prato.nome,
      preco: prato.preco,
      imagemUrl: prato.imagemUrl,
      categoria: prato.categoria
    });
    
    openCart();
  };

  const toggleLike = (pratoId: number) => {
    setIsLiked(prev => ({
      ...prev,
      [pratoId]: !prev[pratoId]
    }));
  };

  return (
    <div className="w-full">
      {/* Categorias */}
      <div className="mb-8">
        <h3 className="font-heading text-2xl font-bold text-primary mb-6 text-center">
          Categorias
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Badge 
            variant={categoriaSelecionada === null ? "default" : "outline"}
            className="px-6 py-3 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer transition-all duration-300 transform hover:scale-105"
            onClick={() => onCategoriaChange(null)}
          >
            Todas
          </Badge>
          {categorias?.map((categoria) => (
            <Badge 
              key={categoria.id} 
              variant={categoriaSelecionada === categoria.id ? "default" : "outline"}
              className="px-6 py-3 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer transition-all duration-300 transform hover:scale-105"
              onClick={() => onCategoriaChange(categoria.id)}
            >
              {categoria.nome}
            </Badge>
          ))}
        </div>
      </div>

      {/* Carrossel */}
      <div className="relative">
        {/* Container do carrossel */}
        <div 
          ref={carouselRef}
          className="overflow-hidden rounded-lg"
        >
          <div className="flex">
            {pratos.map((prato, index) => (
              <motion.div
                key={prato.id}
                className="flex-shrink-0 px-4"
                style={{ width: `${100 / cardsPerView}%` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                  {/* Imagem */}
                  <div className="relative h-48 overflow-hidden">
                    {prato.imagemUrl ? (
                      <motion.img
                        src={prato.imagemUrl}
                        alt={prato.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center"
                      style={{ display: prato.imagemUrl ? 'none' : 'flex' }}
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <span className="text-primary text-2xl">🍽️</span>
                        </div>
                        <span className="text-primary/60 text-sm">Sem imagem</span>
                      </div>
                    </div>
                    
                    {/* Overlay com gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    
                    {/* Badge da categoria */}
                    <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground shadow-lg">
                      {prato.categoria?.nome || 'Sem categoria'}
                    </Badge>

                    {/* Botão de favorito */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-4 left-4 w-8 h-8 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(prato.id);
                      }}
                    >
                      <Heart 
                        className={`h-4 w-4 ${isLiked[prato.id] ? 'text-red-500 fill-red-500' : 'text-white'}`} 
                      />
                    </Button>
                  </div>
                  
                  {/* Conteúdo do card */}
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold text-primary mb-3 line-clamp-2">
                      {prato.nome}
                    </h3>
                    
                    <p className="font-elegant text-muted-foreground mb-4 line-clamp-3">
                      {prato.descricao || 'Descrição não disponível'}
                    </p>

                    {/* Informações do prato */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {prato.tempoPreparo} min
                      </div>
                      <div className="flex items-center text-lg font-bold text-primary">
                        <span className="text-sm mr-1">R$</span>
                        {prato.preco.toFixed(2)}
                      </div>
                    </div>

                    {/* Botão de adicionar */}
                    <Button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-elegant transition-all duration-300"
                      disabled={!prato.disponivel}
                      onClick={() => handleAddToOrder(prato)}
                    >
                      {!isAuthenticated ? (
                        <>
                          <User className="h-4 w-4 mr-2" />
                          Faça login para pedir
                        </>
                      ) : prato.disponivel ? (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Adicionar ao Pedido
                        </>
                      ) : (
                        'Indisponível'
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contador de pratos */}
      <div className="text-center mt-6">
        <p className="text-muted-foreground text-sm">
          {Math.min(pratos.length, 3)} {Math.min(pratos.length, 3) === 1 ? 'prato' : 'pratos'} disponível{Math.min(pratos.length, 3) !== 1 ? 'is' : ''}
          {pratos.length > 3 && (
            <span className="text-primary/60 ml-1">
              (mostrando os melhores)
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
