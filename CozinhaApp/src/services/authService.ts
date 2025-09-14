import { API_CONFIG } from '../constants/api';
import { 
  LoginDto, 
  RegisterDto, 
  AuthResponseDto, 
  UserDto, 
  RefreshTokenDto, 
  ChangePasswordDto 
} from '../types/auth';

// Em desenvolvimento, use o proxy do Vite
const API_BASE_URL = import.meta.env.DEV ? '/api' : API_CONFIG.BASE_URL;

// Serviço de autenticação
export const authService = {
  async login(credentials: LoginDto): Promise<AuthResponseDto> {
    try {
      console.log('🌐 AuthService: Fazendo requisição para:', `${API_BASE_URL}/auth/login`);
      console.log('📤 AuthService: Dados enviados:', credentials);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials),
      });

      console.log('📥 AuthService: Resposta recebida:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ AuthService: Erro na resposta:', errorData);
        
        // Tratamento específico de erros
        if (response.status === 401) {
          throw new Error('Credenciais inválidas. Verifique seu email e senha.');
        } else if (response.status === 400) {
          throw new Error(errorData.message || 'Dados de login inválidos.');
        } else if (response.status === 500) {
          console.error('Erro interno do servidor:', errorData);
          throw new Error('Erro interno do servidor. Por favor, tente novamente.');
        }
        
        throw new Error(errorData.message || 'Erro ao fazer login');
      }

      const data = await response.json();
      console.log('✅ AuthService: Dados de login recebidos:', data);
      return data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },

  async register(userData: RegisterDto): Promise<AuthResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao registrar usuário');
      }

      return response.json();
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao renovar token');
      }

      return response.json();
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      throw error;
    }
  },

  async getCurrentUser(token: string): Promise<UserDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar usuário');
      }

      return response.json();
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      throw error;
    }
  },

  async changePassword(token: string, passwords: ChangePasswordDto): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwords),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao alterar senha');
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    }
  },

  async logout(token: string, refreshToken: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        console.warn('Erro ao fazer logout no servidor');
      }
    } catch (error) {
      console.warn('Erro ao fazer logout:', error);
    }
  }
};
