import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { carrinhoService } from '@/services/api';
import { CarrinhoResponseDto, ItemCarrinhoResponseDto, AddItemCarrinhoDto, UpdateItemCarrinhoDto } from '@/types';

export interface CartItem {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  imagemUrl?: string;
  categoria?: { nome: string };
}

// Sistema de eventos global para o carrinho
class CartEventManager {
  private listeners: Set<() => void> = new Set();

  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    console.log('🛒 CartEventManager: Notificando', this.listeners.size, 'listeners');
    this.listeners.forEach(callback => callback());
    // Também disparar evento customizado para compatibilidade
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }
}

const cartEventManager = new CartEventManager();

export const useCart = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar carrinho da API quando o usuário muda
  const loadCarrinho = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 useCart: Carregando carrinho da API...');
      const carrinho = await carrinhoService.getCarrinho(token);
      const cartItems: CartItem[] = carrinho.itens.map(item => ({
        id: item.pratoId,
        nome: item.pratoNome,
        preco: item.precoUnitario,
        quantidade: item.quantidade,
        imagemUrl: item.pratoImagemUrl,
        categoria: { nome: 'Categoria' } // TODO: Buscar categoria real
      }));
      setItems(cartItems);
      console.log('✅ useCart: Carrinho carregado:', cartItems.length, 'itens');
    } catch (err) {
      console.error('❌ useCart: Erro ao carregar carrinho:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar carrinho');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  // Carregar carrinho quando o usuário muda
  useEffect(() => {
    loadCarrinho();
  }, [loadCarrinho]);

  // Escutar eventos de atualização do carrinho
  useEffect(() => {
    const unsubscribe = cartEventManager.subscribe(() => {
      console.log('🔄 useCart: Evento recebido, recarregando carrinho...');
      loadCarrinho();
    });

    return unsubscribe;
  }, [loadCarrinho]);

  const addItem = useCallback(async (item: Omit<CartItem, 'quantidade'>) => {
    if (!isAuthenticated || !token) {
      console.warn('⚠️ useCart: Usuário deve estar logado para adicionar itens ao carrinho');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('➕ useCart: Adicionando item ao carrinho:', item.nome);
      const addItemDto: AddItemCarrinhoDto = {
        pratoId: item.id,
        quantidade: 1,
        observacoes: undefined
      };

      await carrinhoService.adicionarItem(addItemDto, token);
      console.log('✅ useCart: Item adicionado com sucesso');
      
      // Notificar todos os listeners
      cartEventManager.notify();
    } catch (err) {
      console.error('❌ useCart: Erro ao adicionar item ao carrinho:', err);
      setError(err instanceof Error ? err.message : 'Erro ao adicionar item');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  const removeItem = useCallback(async (id: number) => {
    if (!isAuthenticated || !token) return;
    
    setIsLoading(true);
    setError(null);

    try {
      console.log('➖ useCart: Removendo item do carrinho:', id);
      // Encontrar o item no carrinho para obter o ID do item do carrinho
      const carrinho = await carrinhoService.getCarrinho(token);
      const itemCarrinho = carrinho.itens.find(item => item.pratoId === id);
      
      if (itemCarrinho) {
        await carrinhoService.removerItem(itemCarrinho.id, token);
        console.log('✅ useCart: Item removido com sucesso');
        
        // Notificar todos os listeners
        cartEventManager.notify();
      }
    } catch (err) {
      console.error('❌ useCart: Erro ao remover item do carrinho:', err);
      setError(err instanceof Error ? err.message : 'Erro ao remover item');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  const updateQuantity = useCallback(async (id: number, quantity: number) => {
    if (!isAuthenticated || !token) return;
    
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 useCart: Atualizando quantidade do item:', id, 'para', quantity);
      // Encontrar o item no carrinho para obter o ID do item do carrinho
      const carrinho = await carrinhoService.getCarrinho(token);
      const itemCarrinho = carrinho.itens.find(item => item.pratoId === id);
      
      if (itemCarrinho) {
        const updateDto: UpdateItemCarrinhoDto = {
          quantidade: quantity,
          observacoes: itemCarrinho.observacoes
        };
        
        await carrinhoService.atualizarItem(itemCarrinho.id, updateDto, token);
        console.log('✅ useCart: Quantidade atualizada com sucesso');
        
        // Notificar todos os listeners
        cartEventManager.notify();
      }
    } catch (err) {
      console.error('❌ useCart: Erro ao atualizar quantidade do item:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar quantidade');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  const clearCart = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    
    setIsLoading(true);
    setError(null);

    try {
      console.log('🗑️ useCart: Limpando carrinho');
      await carrinhoService.limparCarrinho(token);
      console.log('✅ useCart: Carrinho limpo com sucesso');
      
      // Notificar todos os listeners
      cartEventManager.notify();
    } catch (err) {
      console.error('❌ useCart: Erro ao limpar carrinho:', err);
      setError(err instanceof Error ? err.message : 'Erro ao limpar carrinho');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  const toggleCart = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantidade, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

  return {
    items,
    isOpen,
    totalItems,
    totalPrice,
    isLoading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    loadCarrinho, // Expor função para recarregar carrinho
    isAuthenticated // Expor para componentes verificarem se usuário está logado
  };
};