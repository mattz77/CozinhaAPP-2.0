import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChefHat } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Botão de fechar */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute -top-12 right-0 text-white hover:text-gray-300"
          onClick={onClose}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Logo e título */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg">
            <ChefHat className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">CozinhaApp</h1>
          <p className="text-gray-300">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </div>

        {/* Formulário */}
        <Card className="shadow-2xl">
          <CardContent className="p-0">
            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <div className="text-center mt-6 text-sm text-gray-300">
          <p>
            {isLogin 
              ? 'Ao fazer login, você concorda com nossos termos de uso e política de privacidade.'
              : 'Ao criar uma conta, você concorda com nossos termos de uso e política de privacidade.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};
