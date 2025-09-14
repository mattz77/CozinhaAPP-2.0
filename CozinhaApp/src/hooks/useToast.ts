import { useState, useCallback } from 'react';
import { ToastProps } from '@/components/ui/Toast';

export interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      id,
      ...options,
      onClose: removeToast
    };

    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title: string, description?: string, duration?: number) => {
    addToast({ type: 'success', title, description, duration });
  }, [addToast]);

  const error = useCallback((title: string, description?: string, duration?: number) => {
    addToast({ type: 'error', title, description, duration });
  }, [addToast]);

  const warning = useCallback((title: string, description?: string, duration?: number) => {
    addToast({ type: 'warning', title, description, duration });
  }, [addToast]);

  const info = useCallback((title: string, description?: string, duration?: number) => {
    addToast({ type: 'info', title, description, duration });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
};
