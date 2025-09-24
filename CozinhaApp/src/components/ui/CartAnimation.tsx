import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface CartAnimationProps {
  isAnimating: boolean;
  onAnimationComplete: () => void;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  itemName: string;
  itemImage?: string;
}

export const CartAnimation: React.FC<CartAnimationProps> = ({
  isAnimating,
  onAnimationComplete,
  startPosition,
  endPosition,
  itemName,
  itemImage
}) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (isAnimating) {
      console.log('🎬 CartAnimation: Iniciando animação para', itemName);
      setAnimationKey(prev => prev + 1);
    }
  }, [isAnimating, itemName]);

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          key={animationKey}
          className="fixed z-[9999] pointer-events-none"
          initial={{
            x: startPosition.x,
            y: startPosition.y,
            scale: 1,
            opacity: 1
          }}
          animate={{
            x: endPosition.x,
            y: endPosition.y,
            scale: 0.3,
            opacity: 0.8
          }}
          exit={{
            scale: 0,
            opacity: 0
          }}
          transition={{
            duration: 1.5,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          onAnimationComplete={() => {
            console.log('🎬 CartAnimation: Animação completada para', itemName);
            onAnimationComplete();
          }}
          style={{
            transformOrigin: 'center'
          }}
        >
          <motion.div
            className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg border-2 border-white"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut"
            }}
          >
            {itemImage ? (
              <img
                src={itemImage}
                alt={itemName}
                className="w-8 h-8 object-cover rounded-full"
              />
            ) : (
              <ShoppingCart className="w-6 h-6" />
            )}
          </motion.div>
          
          {/* Trajetória visual */}
          <motion.div
            className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.5, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
