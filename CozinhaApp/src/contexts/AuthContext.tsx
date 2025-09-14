import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextType, UserDto, LoginDto, RegisterDto, ChangePasswordDto } from '../types/auth';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há dados salvos no sessionStorage (mais seguro que localStorage)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = sessionStorage.getItem('authToken');
        const savedRefreshToken = sessionStorage.getItem('refreshToken');
        const savedUser = sessionStorage.getItem('user');

        if (savedToken && savedRefreshToken && savedUser) {
          setToken(savedToken);
          setRefreshToken(savedRefreshToken);
          setUser(JSON.parse(savedUser));

          // Verificar se o token ainda é válido
          try {
            const currentUser = await authService.getCurrentUser(savedToken);
            setUser(currentUser);
          } catch (error) {
            // Token inválido, tentar renovar
            try {
              const authResponse = await authService.refreshToken(savedRefreshToken);
              setToken(authResponse.token);
              setRefreshToken(authResponse.refreshToken);
              setUser(authResponse.user);
              
              // Salvar novos tokens
              sessionStorage.setItem('authToken', authResponse.token);
              sessionStorage.setItem('refreshToken', authResponse.refreshToken);
              sessionStorage.setItem('user', JSON.stringify(authResponse.user));
            } catch (refreshError) {
              // Refresh falhou, limpar dados
              clearAuthData();
            }
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
    
    // Limpar todos os carrinhos salvos (opcional - manter para persistência entre sessões)
    // const keys = Object.keys(sessionStorage);
    // keys.forEach(key => {
    //   if (key.startsWith('cozinhaapp_cart_')) {
    //     sessionStorage.removeItem(key);
    //   }
    // });
  };

  const login = async (credentials: LoginDto): Promise<void> => {
    try {
      setIsLoading(true);
      const authResponse = await authService.login(credentials);
      
      setToken(authResponse.token);
      setRefreshToken(authResponse.refreshToken);
      setUser(authResponse.user);
      
      // Salvar no sessionStorage (mais seguro)
      sessionStorage.setItem('authToken', authResponse.token);
      sessionStorage.setItem('refreshToken', authResponse.refreshToken);
      sessionStorage.setItem('user', JSON.stringify(authResponse.user));
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterDto): Promise<void> => {
    try {
      setIsLoading(true);
      const authResponse = await authService.register(userData);
      
      setToken(authResponse.token);
      setRefreshToken(authResponse.refreshToken);
      setUser(authResponse.user);
      
      // Salvar no sessionStorage (mais seguro)
      sessionStorage.setItem('authToken', authResponse.token);
      sessionStorage.setItem('refreshToken', authResponse.refreshToken);
      sessionStorage.setItem('user', JSON.stringify(authResponse.user));
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (token && refreshToken) {
        await authService.logout(token, refreshToken);
      }
    } catch (error) {
      console.warn('Erro ao fazer logout:', error);
    } finally {
      clearAuthData();
    }
  };

  const refreshAuthToken = async (): Promise<void> => {
    if (!refreshToken) {
      throw new Error('Nenhum refresh token disponível');
    }

    try {
      const authResponse = await authService.refreshToken(refreshToken);
      
      setToken(authResponse.token);
      setRefreshToken(authResponse.refreshToken);
      setUser(authResponse.user);
      
      // Salvar novos tokens
      localStorage.setItem('authToken', authResponse.token);
      localStorage.setItem('refreshToken', authResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      clearAuthData();
      throw error;
    }
  };

  const changePassword = async (passwords: ChangePasswordDto): Promise<void> => {
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await authService.changePassword(token, passwords);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    refreshToken,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    refreshAuthToken,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
