import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from './useCart';
import { pedidoService } from '@/services/pedidoService';
import { CriarPedidoRequest, ItemPedidoCriacao, FormaPagamento } from '@/types/pedidos';
import { toast } from 'sonner';

interface CheckoutData {
  enderecoEntrega: string;
  formaPagamento: FormaPagamento;
  observacoes?: string;
}

export const useCheckout = () => {
  const { user, isAuthenticated } = useAuth();
  const { items, clearCart, totalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const processCheckout = useCallback(async (checkoutData: CheckoutData) => {
    if (!isAuthenticated || !user) {
      throw new Error('Usuário deve estar logado para finalizar pedido');
    }

    if (items.length === 0) {
      throw new Error('Carrinho está vazio');
    }

    setIsProcessing(true);

    try {
      // Converter itens do carrinho para formato de pedido
      const itensPedido: ItemPedidoCriacao[] = items.map(item => ({
        pratoId: item.id,
        quantidade: item.quantidade,
        observacoes: undefined
      }));

      const pedidoRequest: CriarPedidoRequest = {
        enderecoEntrega: checkoutData.enderecoEntrega,
        formaPagamento: checkoutData.formaPagamento,
        observacoes: checkoutData.observacoes,
        itens: itensPedido
      };

      console.log('🛒 useCheckout: Criando pedido...', pedidoRequest);
      
      const pedido = await pedidoService.criarPedido(pedidoRequest);
      
      console.log('✅ useCheckout: Pedido criado com sucesso:', pedido.numeroPedido);
      
      // Limpar carrinho após sucesso
      await clearCart();
      console.log('✅ useCheckout: Carrinho limpo após checkout');
      
      return pedido;
      
    } catch (error: any) {
      console.error('❌ useCheckout: Erro ao processar checkout:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [isAuthenticated, user, items, clearCart]);

  const validateCheckoutData = useCallback((data: CheckoutData): string[] => {
    const errors: string[] = [];

    if (!data.enderecoEntrega?.trim()) {
      errors.push('Endereço de entrega é obrigatório');
    }

    if (!data.formaPagamento) {
      errors.push('Forma de pagamento é obrigatória');
    }

    if (items.length === 0) {
      errors.push('Carrinho está vazio');
    }

    return errors;
  }, [items]);

  return {
    isProcessing,
    processCheckout,
    validateCheckoutData,
    canCheckout: isAuthenticated && items.length > 0,
    totalItems: items.length,
    totalPrice
  };
};
