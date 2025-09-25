import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { useCartSync } from '@/hooks/useCartSync';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface FloatingCartProps {
  cartButtonRef?: React.RefObject<HTMLButtonElement>;
}

export const FloatingCart: React.FC<FloatingCartProps> = ({ cartButtonRef }) => {
  const { isOpen, toggleCart, totalItems, items, updateQuantity, removeItem } = useCartSync();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Mostrar carrinho flutuante apenas na página do cardápio
  useEffect(() => {
    const isCardapioPage = location.pathname === '/' || location.pathname.includes('cardapio');
    const shouldShow = isCardapioPage && isAuthenticated;
    console.log('🛒 FloatingCart: Verificando visibilidade:', {
      pathname: location.pathname,
      isCardapioPage,
      isAuthenticated,
      shouldShow
    });
    setIsVisible(shouldShow);
  }, [location.pathname, isAuthenticated]);

  // Atualizar referência do botão
  useEffect(() => {
    if (cartButtonRef && buttonRef.current) {
      cartButtonRef.current = buttonRef.current;
    }
  }, [cartButtonRef]);

  if (!isVisible) return null;

  const handleCartClick = () => {
    console.log('🛒 FloatingCart: Botão clicado, totalItems:', totalItems);
    console.log('🛒 FloatingCart: Estado atual do carrinho:', { isOpen, totalItems, items: items.length });
    
    // Sempre fechar o mini carrinho primeiro
    if (showMiniCart) {
      console.log('🛒 FloatingCart: Fechando mini carrinho');
      setShowMiniCart(false);
    }
    
    // Forçar abertura do carrinho principal
    console.log('🛒 FloatingCart: Forçando abertura do carrinho principal');
    if (!isOpen) {
      console.log('🛒 FloatingCart: Carrinho fechado, abrindo...');
      toggleCart();
    } else {
      console.log('🛒 FloatingCart: Carrinho já aberto, alternando...');
      toggleCart();
    }
    console.log('🛒 FloatingCart: toggleCart chamado');
  };

  const getButtonPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
    return { x: window.innerWidth - 100, y: window.innerHeight - 100 };
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: 100 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            ref={buttonRef}
            onClick={handleCartClick}
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl border-2 border-white/20 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, #F5C442, #E6B800)',
              boxShadow: '0 8px 32px rgba(245, 196, 66, 0.4)',
            }}
          >
            <ShoppingCart className="h-6 w-6" />
          </Button>
          
          {/* Badge de quantidade */}
          {totalItems > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2"
            >
              <Badge 
                className="bg-red-500 text-white border-2 border-white shadow-lg min-w-[24px] h-6 flex items-center justify-center text-xs font-bold"
              >
                {totalItems}
              </Badge>
            </motion.div>
          )}
          
          {/* Efeito de pulso quando há itens */}
          {totalItems > 0 && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Mini Carrinho */}
      <AnimatePresence>
        {showMiniCart && totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-80 max-h-96"
          >
            <Card className="bg-white shadow-2xl border-2 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-gray-800">Carrinho</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMiniCart(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {item.imagemUrl && (
                          <img
                            src={item.imagemUrl}
                            alt={item.nome}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium text-sm text-gray-800">{item.nome}</p>
                          <p className="text-xs text-gray-500">R$ {item.preco.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantidade}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-lg text-primary">
                      R$ {items.reduce((sum, item) => sum + (item.preco * item.quantidade), 0).toFixed(2)}
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      setShowMiniCart(false);
                      toggleCart();
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Ver Carrinho Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
