import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useDropdown } from '@/hooks/useDropdown';
import { cn } from '@/lib/utils';
import { ProfileModal } from './ProfileModal';

interface UserDropdownProps {
  className?: string;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ className }) => {
  const { user, logout, isLoading } = useAuth();
  const { toast } = useToast();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { isOpen, toggle, close, dropdownRef } = useDropdown();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout realizado", "Você foi desconectado com sucesso.");
      close();
    } catch (error) {
      toast.error("Erro no logout", "Erro ao fazer logout");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <div className={cn("relative", className)} ref={dropdownRef}>
        {/* Botão do dropdown */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className="flex items-center space-x-2 hover:bg-primary/10 transition-colors"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl || undefined} alt={user.nomeCompleto} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {getInitials(user.nomeCompleto)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium text-foreground">
              {user.nomeCompleto.split(' ')[0]}
            </div>
            <div className="text-xs text-muted-foreground">
              {user.email}
            </div>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </Button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            {/* Header do dropdown */}
            <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatarUrl || undefined} alt={user.nomeCompleto} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
                    {getInitials(user.nomeCompleto)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">
                    {user.nomeCompleto}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    Membro desde {formatDate(user.dataCriacao)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Informações rápidas */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{user.cidade || 'Não informado'}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span className="truncate">
                    {user.dataNascimento ? formatDate(user.dataNascimento) : 'Não informado'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span className="truncate">Cliente #{user.clienteId || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowProfileModal(true);
                  close();
                }}
                className="w-full justify-start rounded-none hover:bg-primary/10"
              >
                <Settings className="h-4 w-4 mr-3" />
                Gerenciar Perfil
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full justify-start rounded-none hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-3" />
                {isLoading ? 'Saindo...' : 'Sair da Conta'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de perfil completo */}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  );
};
