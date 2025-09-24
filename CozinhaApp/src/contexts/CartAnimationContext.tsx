import React, { createContext, useContext, useState, useCallback } from 'react';

interface CartAnimationContextType {
  isAnimating: boolean;
  animationData: {
    itemName: string;
    itemImage?: string;
    startPosition: { x: number; y: number };
    endPosition: { x: number; y: number };
  } | null;
  startAnimation: (data: {
    itemName: string;
    itemImage?: string;
    startPosition: { x: number; y: number };
    endPosition: { x: number; y: number };
  }) => void;
  stopAnimation: () => void;
}

const CartAnimationContext = createContext<CartAnimationContextType | undefined>(undefined);

export const CartAnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationData, setAnimationData] = useState<CartAnimationContextType['animationData']>(null);

  const startAnimation = useCallback((data: {
    itemName: string;
    itemImage?: string;
    startPosition: { x: number; y: number };
    endPosition: { x: number; y: number };
  }) => {
    console.log('🎬 CartAnimationContext: Iniciando animação para', data.itemName);
    setAnimationData(data);
    setIsAnimating(true);
  }, []);

  const stopAnimation = useCallback(() => {
    console.log('🎬 CartAnimationContext: Parando animação');
    setIsAnimating(false);
    setAnimationData(null);
  }, []);

  return (
    <CartAnimationContext.Provider value={{
      isAnimating,
      animationData,
      startAnimation,
      stopAnimation
    }}>
      {children}
    </CartAnimationContext.Provider>
  );
};

export const useCartAnimation = () => {
  const context = useContext(CartAnimationContext);
  if (context === undefined) {
    throw new Error('useCartAnimation must be used within a CartAnimationProvider');
  }
  return context;
};
