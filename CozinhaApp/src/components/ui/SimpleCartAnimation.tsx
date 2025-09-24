import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface SimpleCartAnimationProps {
  isVisible: boolean;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  itemName: string;
  itemImage?: string;
  onComplete: () => void;
}

export const SimpleCartAnimation: React.FC<SimpleCartAnimationProps> = ({
  isVisible,
  startPosition,
  endPosition,
  itemName,
  itemImage,
  onComplete
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-[9999] pointer-events-none"
          initial={{
            x: startPosition.x - 20,
            y: startPosition.y - 20,
            scale: 1,
            opacity: 1
          }}
          animate={{
            x: endPosition.x - 20,
            y: endPosition.y - 20,
            scale: 0.5,
            opacity: 0.8
          }}
          exit={{
            scale: 0,
            opacity: 0
          }}
          transition={{
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          onAnimationComplete={onComplete}
        >
          <motion.div
            className="bg-primary text-primary-foreground rounded-full p-4 shadow-2xl border-4 border-white"
            animate={{
              rotate: [0, 180, 360],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 1.2,
              ease: "easeInOut"
            }}
            style={{
              background: 'linear-gradient(135deg, #F5C442, #E6B800)',
              boxShadow: '0 10px 40px rgba(245, 196, 66, 0.6)'
            }}
          >
            {itemImage ? (
              <img
                src={itemImage}
                alt={itemName}
                className="w-8 h-8 object-cover rounded-full"
              />
            ) : (
              <ShoppingCart className="w-8 h-8" />
            )}
          </motion.div>
          
          {/* Efeito de rastro */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary/40"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 2, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 1.2,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
