import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  LogOut, 
  Edit, 
  Save, 
  X,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export const UserProfile: React.FC = () => {
  const { user, logout, changePassword, isLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    return null;
  }

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Nova senha deve ter pelo menos 6 caracteres';
    }

    if (!passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Confirmação de senha é obrigatória';
    } else if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    try {
      await changePassword(passwordData);
      toast.success("Senha alterada com sucesso!", "Sua senha foi atualizada.");
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setErrors({});
    } catch (error) {
      toast.error("Erro ao alterar senha", error instanceof Error ? error.message : "Erro interno");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout realizado", "Você foi desconectado com sucesso.");
    } catch (error) {
      toast.error("Erro no logout", "Erro ao fazer logout");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header do perfil */}
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.nomeCompleto}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-primary-foreground" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            {user.nomeCompleto}
          </CardTitle>
          <CardDescription className="text-lg">
            {user.email}
          </CardDescription>
          <Badge variant="outline" className="mx-auto mt-2">
            Membro desde {formatDate(user.dataCriacao)}
          </Badge>
        </CardHeader>
      </Card>

      {/* Informações pessoais */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informações Pessoais
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              disabled={isLoading}
            >
              {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Label>
              <Input
                value={user.email}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Data de Nascimento
              </Label>
              <Input
                value={user.dataNascimento ? formatDate(user.dataNascimento) : 'Não informado'}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Endereço
              </Label>
              <Input
                value={user.endereco || 'Não informado'}
                disabled={!isEditing}
                className={isEditing ? '' : 'bg-gray-50'}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Cidade
              </Label>
              <Input
                value={user.cidade || 'Não informado'}
                disabled={!isEditing}
                className={isEditing ? '' : 'bg-gray-50'}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alterar senha */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showChangePassword ? (
            <Button
              variant="outline"
              onClick={() => setShowChangePassword(true)}
              disabled={isLoading}
            >
              <Lock className="h-4 w-4 mr-2" />
              Alterar Senha
            </Button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="currentPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha atual"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className={`pl-10 pr-10 ${errors.currentPassword ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.currentPassword && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription className="text-sm">{errors.currentPassword}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Nova senha"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className={errors.newPassword ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                  {errors.newPassword && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription className="text-sm">{errors.newPassword}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={passwordData.confirmNewPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                    className={errors.confirmNewPassword ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                  {errors.confirmNewPassword && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription className="text-sm">{errors.confirmNewPassword}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmNewPassword: '',
                    });
                    setErrors({});
                  }}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Alterando...
                    </>
                  ) : (
                    'Alterar Senha'
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Botão de logout */}
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair da Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
