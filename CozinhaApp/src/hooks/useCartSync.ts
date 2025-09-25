import { useState, useEffect, useRef } from 'react';
import { useCart } from './useCart';

/**
 * Hook para sincronizar o carrinho em tempo real
 * Versão otimizada para evitar loops infinitos
 */
export const useCartSync = () => {
  const cart = useCart();
  const [syncKey, setSyncKey] = useState(0);
  const lastUpdateRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debug log para verificar se o hook está sendo chamado
  console.log('🔄 useCartSync: Hook chamado, cart.isOpen:', cart.isOpen);

  // Debounce para evitar atualizações muito frequentes
  const debouncedUpdate = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      const now = Date.now();
      if (now - lastUpdateRef.current > 100) { // Mínimo 100ms entre atualizações
        console.log('🔄 useCartSync: Atualizando estado do carrinho');
        setSyncKey(prev => prev + 1);
        lastUpdateRef.current = now;
      }
    }, 50);
  };

  // Escutar eventos de atualização do carrinho com debounce
  useEffect(() => {
    const handleCartUpdate = () => {
      console.log('🔄 useCartSync: Evento de carrinho recebido');
      debouncedUpdate();
    };

    // Escutar evento customizado
    window.addEventListener('cartUpdated', handleCartUpdate);
    console.log('🔄 useCartSync: Event listener registrado');
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      console.log('🔄 useCartSync: Event listener removido');
    };
  }, []);

  // Atualizar syncKey apenas quando há mudanças significativas
  useEffect(() => {
    const newSyncKey = cart.items.length + cart.totalItems + (cart.isLoading ? 1 : 0);
    if (newSyncKey !== syncKey) {
      console.log('🔄 useCartSync: Estado do carrinho mudou:', {
        isOpen: cart.isOpen,
        totalItems: cart.totalItems,
        items: cart.items.length,
        isLoading: cart.isLoading,
        newSyncKey,
        currentSyncKey: syncKey
      });
      setSyncKey(newSyncKey);
    }
  }, [cart.items.length, cart.totalItems, cart.isLoading, syncKey]);

  // Forçar re-render quando isOpen muda
  useEffect(() => {
    console.log('🔄 useCartSync: isOpen mudou para:', cart.isOpen);
    setSyncKey(prev => prev + 1);
  }, [cart.isOpen]);

  // Debug log para verificar o estado que está sendo retornado
  console.log('🔄 useCartSync: Retornando estado:', {
    isOpen: cart.isOpen,
    totalItems: cart.totalItems,
    items: cart.items.length,
    isLoading: cart.isLoading,
    syncKey
  });

  // Retornar estado diretamente sem spread para evitar problemas de sincronização
  return {
    isOpen: cart.isOpen,
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice,
    items: cart.items,
    isLoading: cart.isLoading,
    error: cart.error,
    addItem: cart.addItem,
    removeItem: cart.removeItem,
    updateQuantity: cart.updateQuantity,
    clearCart: cart.clearCart,
    toggleCart: cart.toggleCart,
    openCart: cart.openCart,
    closeCart: cart.closeCart,
    loadCarrinho: cart.loadCarrinho,
    isAuthenticated: cart.isAuthenticated,
    syncKey: syncKey,
  };
};
