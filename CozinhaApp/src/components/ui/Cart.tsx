import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  Truck,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { useCart } from '@/hooks/useCart';

interface CartItem {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  imagemUrl?: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckoutStateChange?: (isCheckoutOpen: boolean) => void;
}

export const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutStateChange
}) => {
  const { isAuthenticated } = useAuth();
  const { clearCart } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantidade, 0);

  // Debug log para verificar se o componente está sendo renderizado
  console.log('🛒 Cart: Componente renderizado, isOpen:', isOpen, 'items:', items.length);
  console.log('🛒 Cart: Props recebidas:', { isOpen, itemsLength: items.length, totalItems });

  const handleCheckout = () => {
    if (!isAuthenticated) {
      onClose(); // Fecha o carrinho
      // Emitir evento para abrir modal de login
      const event = new CustomEvent('openAuthModal');
      window.dispatchEvent(event);
      return;
    }
    
    if (items.length === 0) {
      return;
    }
    
    // Mostrar formulário de checkout
    setShowCheckout(true);
    onCheckoutStateChange?.(true);
  };

  const handleCheckoutSuccess = async () => {
    // Limpar carrinho após sucesso
    try {
      await clearCart();
      console.log('✅ Cart: Carrinho limpo após checkout');
    } catch (error) {
      console.error('❌ Cart: Erro ao limpar carrinho:', error);
    }
    
    // Fechar checkout e carrinho
    setShowCheckout(false);
    onCheckoutStateChange?.(false);
    onClose();
  };

  const handleCheckoutClose = () => {
    setShowCheckout(false);
    onCheckoutStateChange?.(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

                 {/* Cart Panel */}
                 <motion.div
                   initial={{ x: '100%' }}
                   animate={{ x: 0 }}
                   exit={{ x: '100%' }}
                   transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                   className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-[70] flex flex-col border-l border-border"
                 >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold text-primary">Carrinho</h2>
                {totalItems > 0 && (
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    {totalItems}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    Seu carrinho está vazio
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Adicione alguns pratos deliciosos para começar!
                  </p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              {/* Imagem do prato */}
                              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center flex-shrink-0">
                                {item.imagemUrl ? (
                                  <img
                                    src={item.imagemUrl}
                                    alt={item.nome}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <span className="text-primary/60 text-xs">Sem imagem</span>
                                )}
                              </div>

                              {/* Informações do prato */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-foreground truncate">
                                  {item.nome}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  R$ {item.preco.toFixed(2)}
                                </p>
                              </div>

                              {/* Controles de quantidade */}
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onUpdateQuantity(item.id, item.quantidade - 1)}
                                  disabled={item.quantidade <= 1}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                
                                <span className="w-8 text-center text-sm font-medium">
                                  {item.quantidade}
                                </span>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onUpdateQuantity(item.id, item.quantidade + 1)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Botão de remover */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveItem(item.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 }}
                className="border-t border-border p-6 space-y-4"
              >
                {/* Resumo */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de entrega</span>
                    <span className="font-medium">R$ 5,00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">R$ {(total + 5).toFixed(2)}</span>
                  </div>
                </div>

                {/* Informações de entrega */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>Entrega em 30-45 min</span>
                </div>

                {/* Botão de checkout */}
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg font-medium"
                  disabled={!isAuthenticated}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  {isAuthenticated ? 'Finalizar Pedido' : 'Fazer Login para Continuar'}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
      
      {/* Checkout Form */}
      <AnimatePresence>
        {showCheckout && (
          <CheckoutForm
            items={items}
            totalPrice={total + 5} // Incluindo taxa de entrega
            onSuccess={handleCheckoutSuccess}
            onClose={handleCheckoutClose}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};
