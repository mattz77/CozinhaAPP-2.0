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
      whileHover={{ y: -12, scale: 1.02 }}
      className="group"
    >
      <Card 
        className="product-card overflow-hidden bg-gradient-to-br from-surface to-surface-variant border-border hover:border-border-hover transition-all duration-500 cursor-pointer shadow-lg hover:shadow-glow-hover"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          background: 'linear-gradient(145deg, var(--color-surface), var(--color-surface-variant))',
          transition: 'var(--transition-elegant)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <CardContent className="p-0">
          <div className="product-image relative h-48 overflow-hidden" style={{ borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
            {prato.imagemUrl ? (
              <motion.img
                src={prato.imagemUrl}
                alt={prato.nome}
                className="w-full h-full object-cover transition-transform duration-600 ease-out"
                animate={{ 
                  scale: isHovered ? 1.1 : 1,
                  filter: isHovered ? 'brightness(1)' : 'brightness(0.9)'
                }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-2 mx-auto backdrop-blur-sm">
                  <span className="text-primary text-2xl">🍽️</span>
                </div>
                <span className="text-primary/60 text-sm">Sem imagem</span>
              </div>
            </div>
            
            {/* Overlay com gradiente dinâmico */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Efeito de brilho no hover */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500"
              style={{ opacity: isHovered ? 1 : 0 }}
            />
            
            {/* Badge da categoria com glassmorphism */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge 
                className="absolute top-4 right-4 backdrop-blur-md border border-primary/20 shadow-lg"
                style={{
                  background: 'rgba(245, 196, 66, 0.9)',
                  color: '#000',
                  borderRadius: 'var(--radius-full)',
                  padding: '8px 16px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                {prato.categoria?.nome || 'Sem categoria'}
              </Badge>
            </motion.div>

            {/* Botão de favorito com glassmorphism */}
            <motion.div
              className="absolute top-4 left-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 backdrop-blur-md border border-white/20 hover:border-white/40"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'var(--transition-base)'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
              >
                <Heart 
                  className={`h-4 w-4 transition-colors duration-300 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white hover:text-red-400'}`} 
                />
              </Button>
            </motion.div>

            {/* Overlay de hover com efeito moderno */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
              animate={{ 
                opacity: isHovered ? 1 : 0,
                background: isHovered ? 'rgba(245, 196, 66, 0.15)' : 'rgba(0, 0, 0, 0)'
              }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHovered ? 1 : 0,
                  opacity: isHovered ? 1 : 0
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/95 text-primary hover:bg-white backdrop-blur-sm border border-primary/20 shadow-lg"
                  style={{
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '600',
                    transition: 'var(--transition-base)'
                  }}
                >
                  Ver Detalhes
                </Button>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="product-card-content px-6 py-5" style={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}>
            {/* Título com alinhamento perfeito */}
            <motion.h3
              className="font-modern font-bold"
              style={{ 
                color: 'var(--color-primary)',
                fontSize: '1.25rem',
                fontWeight: '700',
                lineHeight: '1.3'
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {prato.nome}
            </motion.h3>
            
            {/* Descrição com alinhamento consistente */}
            <motion.p
              className="font-elegant"
              style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              {prato.descricao || 'Descrição não disponível'}
            </motion.p>

            {/* Informações do prato com layout alinhado */}
            <motion.div
              className="product-card-info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div 
                className="flex items-center text-sm"
                style={{ 
                  color: 'var(--color-text-muted)',
                  fontSize: '0.875rem'
                }}
              >
                <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{prato.tempoPreparo} min</span>
              </div>
              <div 
                className="flex items-center text-lg font-bold"
                style={{ 
                  color: 'var(--color-primary)',
                  fontSize: '1.125rem',
                  fontWeight: '700'
                }}
              >
                <span className="text-sm mr-1">R$</span>
                <span>{prato.preco.toFixed(2)}</span>
              </div>
            </motion.div>

            {/* Botão de adicionar com alinhamento perfeito */}
            <motion.div
              className="product-card-button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                className="w-full font-elegant transition-all duration-300 relative overflow-hidden group"
                style={{
                  background: prato.disponivel 
                    ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))'
                    : 'var(--color-surface-variant)',
                  color: prato.disponivel ? '#000' : 'var(--color-text-muted)',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: '600',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  border: prato.disponivel ? 'none' : '1px solid var(--color-border)',
                  boxShadow: prato.disponivel ? 'var(--shadow-glow)' : 'none',
                  transition: 'var(--transition-elegant)',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                disabled={!prato.disponivel}
                onClick={handleAddToOrder}
              >
                {/* Efeito de brilho animado */}
                {prato.disponivel && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                )}
                
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {prato.disponivel ? (
                    <>
                      <ShoppingCart className="h-4 w-4 flex-shrink-0" />
                      <span>Adicionar ao Pedido</span>
                    </>
                  ) : (
                    <span>Indisponível</span>
                  )}
                </span>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
