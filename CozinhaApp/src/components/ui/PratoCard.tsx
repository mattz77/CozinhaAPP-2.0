import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Star, Heart, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCartSync } from '@/hooks/useCartSync';

interface PratoCardProps {
  prato: {
    id: number;
    nome: string;
    descricao?: string;
    preco: number;
    tempoPreparo: number;
    categoria?: { nome: string };
    imagemUrl?: string;
    disponivel: boolean;
  };
  index: number;
}

export const PratoCard: React.FC<PratoCardProps> = ({ prato, index }) => {
  const { isAuthenticated } = useAuth();
  const { addItem, openCart } = useCartSync();
  const [isLiked, setIsLiked] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleAddToOrder = () => {
    if (!isAuthenticated) {
      // Mostrar modal de login
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card 
        className="overflow-hidden bg-card border-border hover:shadow-xl transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          <div className="relative h-48 overflow-hidden">
            {prato.imagemUrl ? (
              <motion.img
                src={prato.imagemUrl}
                alt={prato.nome}
                className="w-full h-full object-cover"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  // Fallback para imagem quebrada
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
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground shadow-lg">
                {prato.categoria?.nome || 'Sem categoria'}
              </Badge>
            </motion.div>

            {/* Botão de favorito */}
            <motion.div
              className="absolute top-4 left-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
              >
                <Heart 
                  className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} 
                />
              </Button>
            </motion.div>

            {/* Overlay de hover */}
            <motion.div
              className="absolute inset-0 bg-primary/20 opacity-0 flex items-center justify-center"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Ver Detalhes
                </Button>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="p-6">
            {/* Título com animação */}
            <motion.h3
              className="font-heading text-xl font-bold text-primary mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {prato.nome}
            </motion.h3>
            
            {/* Descrição */}
            <motion.p
              className="font-elegant text-muted-foreground mb-4 line-clamp-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {prato.descricao || 'Descrição não disponível'}
            </motion.p>

            {/* Informações do prato */}
            <motion.div
              className="flex items-center justify-between mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {prato.tempoPreparo} min
              </div>
              <div className="flex items-center text-lg font-bold text-primary">
                <span className="text-sm mr-1">R$</span>
                {prato.preco.toFixed(2)}
              </div>
            </motion.div>

            {/* Botão de adicionar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-elegant transition-all duration-300"
                disabled={!prato.disponivel}
                onClick={handleAddToOrder}
              >
                {prato.disponivel ? (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Adicionar ao Pedido
                  </>
                ) : (
                  'Indisponível'
                )}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
