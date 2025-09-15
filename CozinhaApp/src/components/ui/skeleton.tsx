import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "card" | "text" | "avatar" | "button";
  animate?: boolean;
}

const Skeleton = ({ className, variant = "default", animate = true }: SkeletonProps) => {
  const baseClasses = "bg-muted rounded";
  
  const variantClasses = {
    default: "h-4 w-full",
    card: "h-32 w-full",
    text: "h-4 w-3/4",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24"
  };

  const Component = animate ? motion.div : "div";
  
  const animationProps = animate ? {
    animate: {
      opacity: [0.5, 1, 0.5],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  } : {};

  return (
    <Component
      className={cn(baseClasses, variantClasses[variant], className)}
      {...animationProps}
    />
  );
};

// Componente para skeleton de card
export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("space-y-3", className)}>
    <Skeleton variant="card" />
    <div className="space-y-2">
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  </div>
);

// Componente para skeleton de lista
export const SkeletonList = ({ count = 3, className }: { count?: number; className?: string }) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton variant="avatar" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" />
          <Skeleton variant="text" className="w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

// Componente para skeleton de tabela
export const SkeletonTable = ({ rows = 5, columns = 4, className }: { rows?: number; columns?: number; className?: string }) => (
  <div className={cn("space-y-3", className)}>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" className="flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;