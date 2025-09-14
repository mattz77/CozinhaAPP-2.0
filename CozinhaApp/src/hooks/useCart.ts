import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface CartItem {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  imagemUrl?: string;
  categoria?: { nome: string };
}

const CART_STORAGE_PREFIX = 'cozinhaapp_cart_';

export const useCart = () => {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Função para obter a chave do localStorage baseada no usuário
  const getStorageKey = useCallback(() => {
    if (!user?.id) return null;
    return `${CART_STORAGE_PREFIX}${user.id}`;
  }, [user?.id]);

  // Carregar carrinho do localStorage quando o usuário muda
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const storageKey = getStorageKey();
      if (storageKey) {
        try {
          const savedCart = localStorage.getItem(storageKey);
          if (savedCart) {
            const cartItems = JSON.parse(savedCart);
            setItems(Array.isArray(cartItems) ? cartItems : []);
          } else {
            setItems([]);
          }
        } catch (error) {
          console.error('Erro ao carregar carrinho:', error);
          setItems([]);
        }
      }
    } else {
      // Se não estiver logado, limpar o carrinho
      setItems([]);
    }
  }, [isAuthenticated, user?.id, getStorageKey]);

  // Salvar carrinho no localStorage sempre que os itens mudarem
  useEffect(() => {
    if (isAuthenticated && user?.id && items.length >= 0) {
      const storageKey = getStorageKey();
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(items));
        } catch (error) {
          console.error('Erro ao salvar carrinho:', error);
        }
      }
    }
  }, [items, isAuthenticated, user?.id, getStorageKey]);

  const addItem = useCallback((item: Omit<CartItem, 'quantidade'>) => {
    if (!isAuthenticated) {
      console.warn('Usuário deve estar logado para adicionar itens ao carrinho');
      return;
    }

    setItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantidade: 1 }];
    });
  }, [isAuthenticated]);

  const removeItem = useCallback((id: number) => {
    if (!isAuthenticated) return;
    
    setItems(prev => prev.filter(item => item.id !== id));
  }, [isAuthenticated]);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (!isAuthenticated) return;
    
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantidade: quantity } : item
      )
    );
  }, [removeItem, isAuthenticated]);

  const clearCart = useCallback(() => {
    if (!isAuthenticated) return;
    
    setItems([]);
  }, [isAuthenticated]);

  const toggleCart = useCallback(() => {
    if (!isAuthenticated) return;
    setIsOpen(prev => !prev);
  }, [isAuthenticated]);

  const openCart = useCallback(() => {
    if (!isAuthenticated) return;
    setIsOpen(true);
  }, [isAuthenticated]);

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
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    isAuthenticated // Expor para componentes verificarem se usuário está logado
  };
};
