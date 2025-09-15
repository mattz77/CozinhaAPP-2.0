import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: () => void;
}

const Toast = ({ id, title, description, type = "info", duration = 5000, onClose }: ToastProps) => {
  const typeConfig = {
    success: {
      icon: CheckCircle,
      className: "border-green-200 bg-green-50 text-green-800",
      iconClassName: "text-green-600"
    },
    error: {
      icon: XCircle,
      className: "border-red-200 bg-red-50 text-red-800",
      iconClassName: "text-red-600"
    },
    warning: {
      icon: AlertTriangle,
      className: "border-yellow-200 bg-yellow-50 text-yellow-800",
      iconClassName: "text-yellow-600"
    },
    info: {
      icon: Info,
      className: "border-blue-200 bg-blue-50 text-blue-800",
      iconClassName: "text-blue-600"
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        "max-w-sm w-full border rounded-lg shadow-lg pointer-events-auto",
        config.className
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={cn("h-5 w-5", config.iconClassName)} />
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className="text-sm font-medium">{title}</p>
            )}
            {description && (
              <p className="mt-1 text-sm opacity-90">{description}</p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Hook para gerenciar toasts
export const useToast = () => {
  const showToast = (toast: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toastElement = document.createElement("div");
    toastElement.id = id;
    toastElement.className = "fixed top-4 right-4 z-50";
    
    document.body.appendChild(toastElement);
    
    // Auto remove after duration
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.remove();
      }
    }, toast.duration || 5000);
    
    return id;
  };

  return { showToast };
};

export default Toast;