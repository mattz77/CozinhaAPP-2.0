import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, Shield, User, Mail, Calendar, MapPin, Phone } from 'lucide-react';
import { UserManagement } from '@/types/userManagement';
import { userManagementService } from '@/services/userManagementService';
import { useAuth } from '@/contexts/AuthContext';

export const UserManagementComponent: React.FC = () => {
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await userManagementService.getUsers();
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdatingUsers(prev => new Set(prev).add(userId));
      setError(null);
      setSuccess(null);

      await userManagementService.updateUserRole(userId, { role: newRole });
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      setSuccess(`Role do usuário atualizado para ${newRole}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar role');
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleStatusChange = async (userId: string, newStatus: boolean) => {
    try {
      setUpdatingUsers(prev => new Set(prev).add(userId));
      setError(null);
      setSuccess(null);

      await userManagementService.updateUserStatus(userId, { ativo: newStatus });
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ativo: newStatus } : user
      ));
      
      setSuccess(`Status do usuário atualizado para ${newStatus ? 'Ativo' : 'Inativo'}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === 'Admin' ? 'default' : 'secondary';
  };

  const getStatusBadgeVariant = (ativo: boolean) => {
    return ativo ? 'default' : 'destructive';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando usuários...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center">
            <Users className="h-6 w-6 mr-2" />
            Gerenciamento de Usuários
          </h2>
          <p className="text-muted-foreground">
            Gerencie usuários e suas permissões no sistema
          </p>
        </div>
        <Button onClick={loadUsers} variant="outline">
          Atualizar Lista
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    {user.role === 'Admin' ? (
                      <Shield className="h-5 w-5 text-primary-foreground" />
                    ) : (
                      <User className="h-5 w-5 text-primary-foreground" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.nomeCompleto}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {user.email}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(user.ativo)}>
                    {user.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Criado em: {formatDate(user.dataCriacao)}
                  </div>
                  {user.ultimoLogin && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Último login: {formatDate(user.ultimoLogin)}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  {user.telefone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2" />
                      {user.telefone}
                    </div>
                  )}
                  {user.endereco && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {user.endereco}, {user.cidade} - {user.cep}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Role:</span>
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                      disabled={updatingUsers.has(user.id) || user.id === currentUser?.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Usuario">Usuario</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Status:</span>
                    <Switch
                      checked={user.ativo}
                      onCheckedChange={(checked) => handleStatusChange(user.id, checked)}
                      disabled={updatingUsers.has(user.id) || user.id === currentUser?.id}
                    />
                  </div>
                </div>

                {updatingUsers.has(user.id) && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum usuário encontrado</h3>
              <p className="text-muted-foreground">
                Não há usuários cadastrados no sistema.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
