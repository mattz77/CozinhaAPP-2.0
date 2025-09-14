import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { User, Crown, Shield, ChefHat } from 'lucide-react';

interface TestUser {
  email: string;
  nome: string;
  senha: string;
  role: string;
  endereco: string;
  cidade: string;
  telefone: string;
  avatar: string;
  cor: string;
}

const testUsers: TestUser[] = [
  {
    email: 'admin@cozinhaapp.com',
    nome: 'Administrador',
    senha: 'Admin123!@#',
    role: 'Admin',
    endereco: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    telefone: '(11) 99999-0001',
    avatar: '👑',
    cor: 'bg-gradient-to-br from-yellow-400 to-orange-500'
  },
  {
    email: 'joao@teste.com',
    nome: 'João Silva',
    senha: 'Joao123!@#',
    role: 'User',
    endereco: 'Av. Paulista, 1000',
    cidade: 'São Paulo',
    telefone: '(11) 99999-0002',
    avatar: '👨‍💼',
    cor: 'bg-gradient-to-br from-blue-400 to-blue-600'
  },
  {
    email: 'maria@teste.com',
    nome: 'Maria Santos',
    senha: 'Maria123!@#',
    role: 'User',
    endereco: 'Rua Augusta, 456',
    cidade: 'São Paulo',
    telefone: '(11) 99999-0003',
    avatar: '👩‍💼',
    cor: 'bg-gradient-to-br from-pink-400 to-pink-600'
  },
  {
    email: 'pedro@teste.com',
    nome: 'Pedro Costa',
    senha: 'Pedro123!@#',
    role: 'Manager',
    endereco: 'Rua Oscar Freire, 789',
    cidade: 'São Paulo',
    telefone: '(11) 99999-0004',
    avatar: '👨‍🍳',
    cor: 'bg-gradient-to-br from-green-400 to-green-600'
  }
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'Admin':
      return <Crown className="h-4 w-4 text-yellow-500" />;
    case 'Manager':
      return <ChefHat className="h-4 w-4 text-green-500" />;
    default:
      return <User className="h-4 w-4 text-blue-500" />;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Admin':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Manager':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

export const TestUserSelector: React.FC = () => {
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<TestUser | null>(null);

  // Log para debug
  console.log('🔍 TestUserSelector: Estado:', {
    isAuthenticated,
    isLoading,
    user: user?.nomeCompleto
  });

  const handleLogin = async (user: TestUser) => {
    try {
      console.log('🔄 TestUserSelector: Iniciando login...', {
        email: user.email,
        role: user.role
      });

      await login({
        email: user.email,
        password: user.senha
      });

      console.log('✅ TestUserSelector: Login realizado com sucesso!');
      
      // O AuthContext já vai atualizar a UI

    } catch (error) {
      console.error('❌ TestUserSelector: Erro ao fazer login:', error);
      // Re-throw para propagar o erro
      throw error;
    }
  };

  // Se o usuário já está autenticado, não mostrar o seletor
  if (isAuthenticated) {
    console.log('✅ Usuário autenticado, escondendo TestUserSelector');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        <Card className="overflow-hidden border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center"
            >
              <Shield className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-primary mb-2">
              🚀 Modo Desenvolvimento
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              Selecione um usuário de teste para acelerar o desenvolvimento
            </p>
            <Badge variant="outline" className="mt-2 bg-orange-100 text-orange-800 border-orange-200">
              ⚠️ Apenas para desenvolvimento - Remover em produção
            </Badge>
          </CardHeader>

          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testUsers.map((user, index) => (
                <motion.div
                  key={user.email}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                      selectedUser?.email === user.email 
                        ? 'border-primary shadow-lg' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <CardContent className="p-6 text-center">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-16 h-16 rounded-full ${user.cor} flex items-center justify-center text-2xl mx-auto mb-4`}
                      >
                        {user.avatar}
                      </motion.div>
                      
                      <h3 className="font-semibold text-lg mb-2">{user.nome}</h3>
                      
                      <div className="flex items-center justify-center mb-3">
                        <Badge className={`${getRoleColor(user.role)} flex items-center gap-1`}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                      <p className="text-xs text-muted-foreground mb-2">{user.telefone}</p>
                      <p className="text-xs text-muted-foreground mb-4">
                        {user.endereco}<br />
                        {user.cidade}
                      </p>
                      
                      <Button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            console.log('🔄 Iniciando login para:', user.email);
                            await handleLogin(user);
                            console.log('✅ Login bem-sucedido!');
                          } catch (error) {
                            console.error('❌ Erro no botão de login:', error);
                            alert('Erro ao fazer login. Por favor, tente novamente.');
                          }
                        }}
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          'Entrar como ' + user.nome.split(' ')[0]
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {selectedUser && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20"
              >
                <h4 className="font-semibold text-primary mb-2">
                  📋 Informações do Usuário Selecionado
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Nome:</strong> {selectedUser.nome}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedUser.email}
                  </div>
                  <div>
                    <strong>Telefone:</strong> {selectedUser.telefone}
                  </div>
                  <div>
                    <strong>Senha:</strong> {selectedUser.senha}
                  </div>
                  <div>
                    <strong>Função:</strong> {selectedUser.role}
                  </div>
                  <div className="md:col-span-2">
                    <strong>Endereço:</strong> {selectedUser.endereco}, {selectedUser.cidade}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Dica:</strong> Estes usuários são criados automaticamente no banco de dados
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Para desenvolvimento apenas - Remover este componente em produção
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
