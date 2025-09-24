import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PratoCard } from '@/components/ui/PratoCard';
import { Clock, Heart, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCartSync } from '@/hooks/useCartSync';

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

interface TopPrato {
  pratoId: number;
  nome: string;
  preco: number;
  imagemUrl?: string;
  categoriaNome: string;
  quantidadeVendida: number;
  valorTotalVendido: number;
  numeroVendas: number;
}

interface CardapioCarouselProps {
  pratos: Prato[];
  categorias: { id: number; nome: string }[];
  categoriaSelecionada: number | null;
  onCategoriaChange: (categoriaId: number | null) => void;
  topPratos?: TopPrato[];
  isAuthenticated?: boolean;
}

export const CardapioCarousel: React.FC<CardapioCarouselProps> = ({
  pratos,
  categorias,
  categoriaSelecionada,
  onCategoriaChange,
  topPratos,
  isAuthenticated
}) => {
  // Usar isAuthenticated do prop ou do contexto
  const authContext = useAuth();
  const userAuthenticated = isAuthenticated ?? authContext.isAuthenticated;
  const { addItem, openCart } = useCartSync();
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
    if (!userAuthenticated) {
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
          {/* Mostrar "Top 3" se houver dados de top pratos, senão mostrar "Todas" */}
          {topPratos && topPratos.length > 0 ? (
            <Badge 
              variant={categoriaSelecionada === -1 ? "default" : "outline"}
              className="px-6 py-3 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer transition-all duration-300 transform hover:scale-105"
              onClick={() => onCategoriaChange(-1)}
            >
              🔥 Top 3
            </Badge>
          ) : (
            <Badge 
              variant={categoriaSelecionada === null ? "default" : "outline"}
              className="px-6 py-3 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer transition-all duration-300 transform hover:scale-105"
              onClick={() => onCategoriaChange(null)}
            >
              Todas
            </Badge>
          )}
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

      {/* Grid de Cards Moderno com Alinhamento Perfeito */}
      <div className="cards-grid">
        {pratos.map((prato, index) => (
          <PratoCard 
            key={prato.id}
            prato={prato}
            index={index}
          />
        ))}
      </div>

      {/* Contador de pratos */}
      <div className="text-center mt-8">
        <p className="text-muted-foreground text-sm">
          {pratos.length} {pratos.length === 1 ? 'prato' : 'pratos'} disponível{pratos.length !== 1 ? 'is' : ''}
        </p>
      </div>
    </div>
  );
};
