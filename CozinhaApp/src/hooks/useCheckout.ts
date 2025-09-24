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
      // Verificar token antes de fazer a requisição
      const token = sessionStorage.getItem('authToken');
      console.log('🔑 useCheckout: Token presente:', !!token);
      console.log('🔑 useCheckout: Token valor:', token ? token.substring(0, 20) + '...' : 'null');
      console.log('👤 useCheckout: Usuário:', user?.nomeCompleto, user?.email);
      console.log('👤 useCheckout: isAuthenticated:', isAuthenticated);
      
      // Verificar se o token está válido
      if (!token) {
        throw new Error('Token de autenticação não encontrado. Faça login novamente.');
      }
      
      // Verificar se o token contém o claim "sub" (userId)
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔍 useCheckout: Token payload:', tokenPayload);
        console.log('🔍 useCheckout: Token sub claim:', tokenPayload.sub);
        
        if (!tokenPayload.sub) {
          throw new Error('Token inválido: claim "sub" não encontrado');
        }
      } catch (error) {
        console.error('❌ useCheckout: Erro ao decodificar token:', error);
        throw new Error('Token de autenticação inválido. Faça login novamente.');
      }

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
