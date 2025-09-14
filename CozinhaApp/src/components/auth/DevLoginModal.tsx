import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TestLoginSelector } from './TestLoginSelector';

interface DevLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevLoginModal: React.FC<DevLoginModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary">
            🛠️ Ambiente de Desenvolvimento
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <TestLoginSelector />
        </div>
      </DialogContent>
    </Dialog>
  );
};
