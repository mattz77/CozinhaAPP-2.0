import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { loggingService } from '@/services/loggingService';

const testUsers = [
  {
    email: 'admin@cozinhaapp.com',
    password: 'Admin123!@#',
    role: 'Admin',
    name: 'Administrador'
  },
  {
    email: 'joao@teste.com',
    password: 'Joao123!@#',
    role: 'User',
    name: 'João Silva'
  },
  {
    email: 'maria@teste.com',
    password: 'Maria123!@#',
    role: 'User',
    name: 'Maria Santos'
  },
  {
    email: 'pedro@teste.com',
    password: 'Pedro123!@#',
    role: 'Manager',
    name: 'Pedro Costa'
  }
];

export const TestLoginSelector: React.FC = () => {
  const { login } = useAuth();
  const { toast } = useToast();

  const handleTestLogin = async (user: typeof testUsers[0]) => {
    try {
      loggingService.logAuth('Tentando login de teste', { 
        email: user.email, 
        name: user.name, 
        role: user.role 
      });
      
      await login({
        email: user.email,
        password: user.password
      });
      
      loggingService.logAuth('Login de teste realizado com sucesso', { 
        email: user.email, 
        name: user.name 
      });
      
      toast.success(
        'Login de teste realizado!',
        `Bem-vindo, ${user.name} (${user.role})`,
        3000
      );
    } catch (error) {
      loggingService.logError('Erro no login de teste', error as Error, { 
        email: user.email, 
        name: user.name 
      });
      
      toast.error(
        'Erro no login de teste',
        'Verifique se a API está rodando e tente novamente',
        5000
      );
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm shadow-xl border-2">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-bold text-primary">
          🔑 Login de Teste (Apenas Desenvolvimento)
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 p-6">
        {testUsers.map((user) => (
          <Button
            key={user.email}
            onClick={() => handleTestLogin(user)}
            className="p-6 h-auto flex flex-col gap-2 bg-white hover:bg-gray-50 border-2 shadow-md"
            variant="outline"
          >
            <span className="text-lg font-semibold text-primary">{user.name}</span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
              {user.role}
            </span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
