import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastVariants = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-100 border-2 border-green-300 text-green-900 shadow-lg shadow-green-100/50',
    iconClassName: 'text-green-600'
  },
  error: {
    icon: XCircle,
    className: 'bg-red-100 border-2 border-red-300 text-red-900 shadow-lg shadow-red-100/50',
    iconClassName: 'text-red-600'
  },
  warning: {
    icon: AlertCircle,
    className: 'bg-yellow-100 border-2 border-yellow-300 text-yellow-900 shadow-lg shadow-yellow-100/50',
    iconClassName: 'text-yellow-600'
  },
  info: {
    icon: Info,
    className: 'bg-blue-100 border-2 border-blue-300 text-blue-900 shadow-lg shadow-blue-100/50',
    iconClassName: 'text-blue-600'
  }
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  description,
  duration = 5000,
  onClose
}) => {
  const config = toastVariants[type];
  const Icon = config.icon;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`relative flex items-start p-4 rounded-lg max-w-sm w-full backdrop-blur-sm ${config.className}`}
      role="alert"
      aria-live="assertive"
    >
      <Icon className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${config.iconClassName}`} />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="mt-1 text-sm opacity-90">{description}</p>
        )}
      </div>

      <button
        onClick={() => onClose(id)}
        className="ml-3 flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 min-w-[320px]">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};