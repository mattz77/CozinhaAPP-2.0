import { useState } from 'react';
import { useCart } from './useCart';

/**
 * Hook para sincronizar o carrinho em tempo real
 * Agora o useCart já gerencia os eventos internamente
 */
export const useCartSync = () => {
  const cart = useCart();
  const [syncKey, setSyncKey] = useState(0);

  // Incrementar syncKey quando o carrinho muda para forçar re-render
  const syncKeyValue = cart.items.length + cart.totalItems + (cart.isLoading ? 1 : 0);

  return {
    ...cart,
    syncKey: syncKeyValue, // Chave baseada no estado do carrinho
  };
};
